import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMic, FiMicOff, FiStopCircle, FiActivity, FiCpu, FiClock, FiUsers, FiVideo } from 'react-icons/fi';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import API_BASE from '../api';

export default function GDRoom() {
    const { id: sessionId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    // Retrieve the secret topic and host ID passed from the dashboard
    const { topic: secretTopic, hostId } = location.state || { topic: "Unknown Topic", hostId: null };
    const isHost = user.id === hostId;

    const [phase, setPhase] = useState("waiting"); // waiting, prep, live, report
    const [topic, setTopic] = useState("Hidden");
    const [timeLeft, setTimeLeft] = useState(0);
    const [messages, setMessages] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const [evaluations, setEvaluations] = useState(null);
    const [loadingEval, setLoadingEval] = useState(false);
    
    const ws = useRef(null);
    const recognitionRef = useRef(null);
    const videoRef = useRef(null); // Reference for the webcam

    // 1. Camera Setup
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(stream => {
                if (videoRef.current) videoRef.current.srcObject = stream;
            })
            .catch(err => console.error("Camera access denied:", err));
    }, []);

    // 2. WebSocket Setup
    useEffect(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const wsHost = API_BASE.replace(/^https?:\/\//, '');
        // Added user.id to the URL to prevent overwriting same names
        const wsUrl = `${protocol}://${wsHost}/api/gd/ws/${sessionId}/${user.id}/${user.fname}`;
        
        ws.current = new WebSocket(wsUrl);
        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            if (data.type === "system_command") {
                if (data.cmd === "START_PREP") {
                    setTopic(secretTopic); // Reveal the topic to everyone
                    setPhase("prep");
                    setTimeLeft(120); // 2 minutes
                } else if (data.cmd === "START_LIVE") {
                    setPhase("live");
                    setTimeLeft(900); // 15 minutes
                } else if (data.cmd === "END_SESSION") {
                    handleEndSession();
                }
            } else {
                setMessages((prev) => [...prev, data]);
            }
        };

        return () => {
            if (ws.current) ws.current.close();
            if (recognitionRef.current) recognitionRef.current.stop();
            // Stop camera when leaving
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, [sessionId, user.id, user.fname, secretTopic]);

    // 3. Timer Logic
    useEffect(() => {
        if (phase === "waiting" || phase === "report") return;
        if (timeLeft <= 0) {
            if (phase === "prep" && isHost && ws.current) ws.current.send("SYS_CMD:START_LIVE");
            if (phase === "live" && isHost && ws.current) ws.current.send("SYS_CMD:END_SESSION");
            return;
        }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, phase, isHost]);

    // 4. End Session & Get Report
    const handleEndSession = async () => {
        if (recognitionRef.current) recognitionRef.current.stop();
        setIsListening(false);
        setPhase("report");
        setLoadingEval(true);
        try {
            const res = await axios.post(`${API_BASE}/api/gd/evaluate`, { session_id: sessionId, topic: secretTopic });
            setEvaluations(res.data);
        } catch (err) {
            alert("Evaluation failed.");
        } finally {
            setLoadingEval(false);
        }
    };

    // 5. Mic Logic
    const toggleMic = () => {
        if (phase !== "live") return alert("Microphones are locked. Wait for the live discussion phase.");
        
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) return alert("Browser does not support Speech API. Please use Chrome/Edge.");
            
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = false;
            
            recognition.onresult = (e) => {
                const transcript = e.results[e.results.length - 1][0].transcript;
                if (transcript.trim() && ws.current) {
                    ws.current.send(transcript);
                }
            };
            recognition.onend = () => { if (isListening) recognition.start(); };

            recognitionRef.current = recognition;
            recognition.start();
            setIsListening(true);
        }
    };

    const formatTime = (secs) => `${Math.floor(secs / 60).toString().padStart(2, '0')}:${(secs % 60).toString().padStart(2, '0')}`;

    // --- VIEW: WAITING ROOM ---
    if (phase === "waiting") {
        return (
            <div className="min-h-screen bg-game-bg flex items-center justify-center p-8 text-white">
                <div className="glass-panel p-12 rounded-3xl text-center max-w-lg border border-white/10 bg-black/40">
                    <FiUsers className="text-6xl text-neon-blue mx-auto mb-6" />
                    <h2 className="text-3xl font-bold mb-4">Waiting Room</h2>
                    {isHost ? (
                        <>
                            <p className="text-gray-400 mb-8">You are the Host. Wait for everyone to join, then click Start to reveal the AI topic.</p>
                            <button onClick={() => ws.current.send("SYS_CMD:START_PREP")} className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-[0_0_15px_rgba(45,212,191,0.3)]">
                                Reveal Topic & Start Session
                            </button>
                        </>
                    ) : (
                        <div className="animate-pulse">
                            <p className="text-gray-400 mb-4">Waiting for the Host to start the session...</p>
                            <div className="w-8 h-8 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- VIEW: AI REPORT ---
    if (phase === "report") {
        if (loadingEval) return <div className="min-h-screen bg-game-bg flex items-center justify-center text-white"><h2 className="text-2xl animate-pulse flex items-center gap-2"><FiCpu/> AI Generating Final Report...</h2></div>;
        
        return (
            <div className="min-h-screen bg-game-bg p-8 text-white">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-display font-bold text-center mb-10"><span className="text-neon-blue">AI</span> Moderator Report</h1>
                    <div className="grid md:grid-cols-2 gap-8">
                        {evaluations?.map((ev, i) => {
                            const radarData = [
                                { subject: 'Clarity', A: ev.clarity, fullMark: 10 },
                                { subject: 'Confidence', A: ev.confidence, fullMark: 10 },
                                { subject: 'Logic', A: ev.logic, fullMark: 10 },
                                { subject: 'Comm.', A: ev.communication, fullMark: 10 },
                                { subject: 'Leadership', A: ev.leadership, fullMark: 10 },
                            ];
                            return (
                            <div key={i} className="glass-panel p-6 rounded-3xl border border-white/10 bg-black/40">
                                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                                    <h3 className="text-2xl font-bold">{ev.user_name}</h3>
                                    <div className="text-right">
                                        <span className="text-xs text-gray-400 block uppercase">Total Score</span>
                                        <span className="text-3xl font-black text-neon-green">{ev.total}<span className="text-lg text-gray-500">/50</span></span>
                                    </div>
                                </div>
                                <div className="flex flex-col xl:flex-row gap-6">
                                    <div className="w-full xl:w-1/2 h-48">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                                <PolarGrid stroke="#ffffff33" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                                                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                                                <Radar name={ev.user_name} dataKey="A" stroke="#2DD4BF" fill="#2DD4BF" fillOpacity={0.4} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="w-full xl:w-1/2 space-y-4">
                                        <div className="bg-green-500/10 p-3 rounded-xl border border-green-500/20">
                                            <h4 className="text-green-400 font-bold text-xs mb-1 uppercase tracking-widest">Strengths</h4>
                                            <ul className="list-disc pl-4 text-xs text-gray-300 space-y-1">
                                                {ev.strengths?.map((s, idx) => <li key={idx}>{s}</li>)}
                                            </ul>
                                        </div>
                                        <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                                            <h4 className="text-red-400 font-bold text-xs mb-1 uppercase tracking-widest">Weaknesses</h4>
                                            <ul className="list-disc pl-4 text-xs text-gray-300 space-y-1">
                                                {ev.weaknesses?.map((w, idx) => <li key={idx}>{w}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )})}
                    </div>
                    <button onClick={() => navigate('/dashboard')} className="mt-10 px-8 py-3 bg-neon-blue text-black font-bold rounded-xl mx-auto block hover:bg-white transition-colors">Return to Dashboard</button>
                </div>
            </div>
        );
    }

    // --- VIEW: PREP OR LIVE DISCUSSION ---
    return (
        <div className="min-h-screen bg-game-bg flex flex-col p-4 md:p-8">
            <div className="max-w-5xl w-full mx-auto flex-1 flex flex-col">
                <div className="glass-panel bg-black/60 p-5 rounded-2xl mb-6 flex justify-between items-center border border-white/10">
                    <div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest ${phase === 'prep' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400 animate-pulse'}`}>
                            {phase === 'prep' ? 'Preparation Phase' : 'Live Discussion'}
                        </span>
                        <h2 className="text-2xl font-bold text-white mt-2">{topic}</h2>
                    </div>
                    <div className="text-right flex items-center gap-4">
                        <div className={`text-4xl font-mono font-bold ${phase === 'prep' ? 'text-blue-400' : 'text-red-500'}`}>
                            <FiClock className="inline mr-2 mb-1" />{formatTime(timeLeft)}
                        </div>
                        {phase === 'live' && isHost && (
                            <button onClick={() => ws.current.send("SYS_CMD:END_SESSION")} className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all">
                                Force End
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-[500px]">
                    <div className="w-full md:w-1/3 grid grid-cols-2 grid-rows-3 gap-3">
                        {/* Video Grid */}
                        {[1,2,3,4,5,6].map(i => (
                            <div key={i} className="bg-black/40 rounded-xl border border-white/5 flex items-center justify-center relative overflow-hidden bg-gray-900">
                                {i === 1 ? (
                                    <>
                                        <div className={`absolute inset-0 border-2 rounded-xl transition-all z-10 pointer-events-none ${isListening ? 'border-neon-green shadow-[inset_0_0_20px_rgba(34,197,94,0.3)]' : 'border-transparent'}`}></div>
                                        <span className="text-white font-bold text-xs absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded z-10 backdrop-blur-md">You</span>
                                        {/* Local Webcam Feed */}
                                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]"></video>
                                    </>
                                ) : (
                                    <>
                                        <FiVideo className="text-4xl text-gray-800"/>
                                        <span className="text-gray-500 text-xs absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded">Peer {i}</span>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="w-full md:w-2/3 glass-panel bg-black/40 rounded-3xl p-6 border border-white/10 flex flex-col relative">
                        {phase === "prep" && (
                            <div className="absolute inset-0 bg-black/80 rounded-3xl z-10 flex flex-col items-center justify-center border border-blue-500/50">
                                <FiMicOff className="text-6xl text-blue-400 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Microphones Locked</h3>
                                <p className="text-gray-400">Organize your thoughts. Discussion starts in {formatTime(timeLeft)}</p>
                            </div>
                        )}

                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Live AI Transcript</h3>
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-700">
                            {messages.map((msg, i) => (
                                <div key={i} className={`p-4 rounded-2xl text-sm ${msg.type === 'system' || msg.type === 'system_command' ? 'mx-auto w-fit bg-white/5 text-gray-500 italic' : msg.user === user.fname ? 'ml-auto max-w-[80%] bg-neon-blue/20 border border-neon-blue/30 text-white rounded-br-none' : 'mr-auto max-w-[80%] bg-white/5 border border-white/10 text-gray-300 rounded-bl-none'}`}>
                                    {msg.type !== 'system' && msg.type !== 'system_command' && <span className="block text-[10px] uppercase font-bold text-gray-400 mb-1">{msg.user}</span>}
                                    {msg.text}
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                            <p className="text-gray-400 text-sm">{isListening ? "Listening..." : "Mic is off."}</p>
                            <button 
                                onClick={toggleMic}
                                disabled={phase === 'prep'}
                                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all shadow-xl ${phase === 'prep' ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : isListening ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse' : 'bg-neon-blue text-black hover:scale-105 shadow-[0_0_15px_rgba(45,212,191,0.4)]'}`}
                            >
                                {isListening ? <FiStopCircle /> : <FiMic />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
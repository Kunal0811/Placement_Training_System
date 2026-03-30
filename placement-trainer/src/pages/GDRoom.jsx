import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMic, FiMicOff, FiStopCircle, FiCpu, FiClock, FiUsers, FiVideo, FiSend } from 'react-icons/fi';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import Peer from 'peerjs';
import API_BASE from '../api';

// Helper component to render WebRTC streams correctly in React
const VideoPlayer = ({ stream, isLocal }) => {
    const videoRef = useRef(null);
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);
    return (
        <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted={isLocal} // Always mute local video to prevent audio feedback loop
            className={`w-full h-full object-cover ${isLocal ? 'transform scale-x-[-1]' : ''}`} 
        />
    );
};

export default function GDRoom() {
    const { id: sessionId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const { topic: secretTopic, hostId } = location.state || { topic: "Unknown Topic", hostId: null };
    const isHost = user.id === hostId;

    const [phase, setPhase] = useState("waiting"); 
    const [topic, setTopic] = useState("Hidden");
    const [timeLeft, setTimeLeft] = useState(0);
    const [messages, setMessages] = useState([]);
    
    // WebRTC & Audio State
    const [isListening, setIsListening] = useState(false);
    const [localStream, setLocalStream] = useState(null);
    const [remotePeers, setRemotePeers] = useState([]); // Array of { peerId, stream }
    
    // AI Evaluation State
    const [evaluations, setEvaluations] = useState(null);
    const [loadingEval, setLoadingEval] = useState(false);
    const [manualInput, setManualInput] = useState("");
    const [isWsConnected, setIsWsConnected] = useState(false);
    
    // Refs
    const ws = useRef(null);
    const peerInstance = useRef(null);
    const recognitionRef = useRef(null);
    const messagesEndRef = useRef(null); 

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 1. Initialize WebRTC (PeerJS) & Camera/Mic
    useEffect(() => {
        const myPeerId = `${sessionId}-${user.id}-${Math.floor(Math.random() * 1000)}`;
        const peer = new Peer(myPeerId);
        peerInstance.current = peer;
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                stream.getAudioTracks()[0].enabled = false; 
                setLocalStream(stream);
                peer.on('call', (call) => {
                    call.answer(stream); 
                    call.on('stream', (userVideoStream) => {
                        addRemotePeer(call.peer, userVideoStream);
                    });
                });
                setupWebSocket(myPeerId, stream, peer);
            })
            .catch(err => {
                console.error("Camera/Mic access denied:", err);
                alert("Please allow Camera and Microphone access to join the WebRTC room.");
            });
        return () => {
            if (ws.current) ws.current.close();
            if (peerInstance.current) peerInstance.current.destroy();
            if (recognitionRef.current) recognitionRef.current.stop();
            if (localStream) localStream.getTracks().forEach(track => track.stop());
        };
    }, [sessionId, user.id]);

    const addRemotePeer = (peerId, stream) => {
        setRemotePeers(prev => {
            if (prev.find(p => p.peerId === peerId)) return prev;
            return [...prev, { peerId, stream }];
        });
    };

    // 2. Setup WebSocket for Timers, Chat, and AI Transcript
    const setupWebSocket = (myPeerId, myStream, peerObj) => {
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const wsHost = API_BASE.replace(/^https?:\/\//, '');
        const wsUrl = `${protocol}://${wsHost}/api/gd/ws/${sessionId}/${user.id}/${user.fname}`;
        
        ws.current = new WebSocket(wsUrl);
        
        ws.current.onopen = () => {
            // Tell everyone else in the room our WebRTC Peer ID so they can call us
            ws.current.send(`SYS_CMD:PEER_JOINED:${myPeerId}`);
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            if (data.type === "system_command") {
                if (data.cmd.startsWith("PEER_JOINED:")) {
                    const incomingPeerId = data.cmd.split(":")[1];
                    // If someone else joined, call them via WebRTC
                    if (incomingPeerId !== myPeerId) {
                        const call = peerObj.call(incomingPeerId, myStream);
                        call.on('stream', (remoteStream) => {
                            addRemotePeer(incomingPeerId, remoteStream);
                        });
                    }
                } else if (data.cmd === "START_PREP") {
                    setTopic(secretTopic); 
                    setPhase("prep");
                    setTimeLeft(120); 
                } else if (data.cmd === "START_LIVE") {
                    setPhase("live");
                    setTimeLeft(900); 
                } else if (data.cmd === "END_SESSION") {
                    handleEndSession();
                } else if (data.cmd.startsWith("REPORT_READY:")) {
                    const reportJson = data.cmd.substring("REPORT_READY:".length);
                    setEvaluations(JSON.parse(reportJson));
                    setLoadingEval(false);
                    setPhase("report");
                }
            } else {
                setMessages((prev) => [...prev, data]);
            }
        };
    };

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

    // 4. End Session & Trigger AI Report
    const handleEndSession = async () => {
        if (recognitionRef.current) recognitionRef.current.stop();
        if (localStream) localStream.getAudioTracks()[0].enabled = false;
        setIsListening(false);
        setPhase("report");
        setLoadingEval(true); 

        if (isHost) {
            try {
                const res = await axios.post(`${API_BASE}/api/gd/evaluate`, { session_id: sessionId, topic: secretTopic });
                ws.current.send(`SYS_CMD:REPORT_READY:${JSON.stringify(res.data)}`);
                setEvaluations(res.data);
                setLoadingEval(false);
            } catch (err) {
                alert("Evaluation failed.");
            }
        }
    };

    // 5. Mic & Speech-to-Text Logic (Combines WebRTC Audio + AI Transcript)
    const toggleMic = () => {
        if (phase !== "live") return alert("Microphones are locked. Wait for the live discussion phase.");
        
        if (isListening) {
            // Turn off Mic
            if (localStream) localStream.getAudioTracks()[0].enabled = false;
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            // Turn on Mic for peers to hear
            if (localStream) localStream.getAudioTracks()[0].enabled = true;
            
            // Turn on Speech Recognition for AI to read
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = false;
                
                recognition.onresult = (event) => {
                    let finalTranscript = "";
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
                    }
                    if (finalTranscript.trim() && ws.current) {
                        ws.current.send(finalTranscript.trim());
                    }
                };
                
                recognition.onend = () => { if (isListening) recognition.start(); };
                recognitionRef.current = recognition;
                recognition.start();
            }
            setIsListening(true);
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (phase !== "live") return alert("Wait for live phase.");
        if (manualInput.trim() && ws.current) {
            ws.current.send(manualInput.trim());
            setManualInput("");
        }
    };

    const formatTime = (secs) => `${Math.floor(secs / 60).toString().padStart(2, '0')}:${(secs % 60).toString().padStart(2, '0')}`;

    // Calculate dynamic grid squares (Max 6)
    const renderGridSquares = () => {
        const totalSlots = 6;
        const slots = [];
        
        // Slot 1: Local User
        slots.push(
            <div key="local" className="bg-black/40 rounded-xl border border-white/5 relative overflow-hidden bg-gray-900">
                <div className={`absolute inset-0 border-2 rounded-xl transition-all z-10 pointer-events-none ${isListening ? 'border-neon-green shadow-[inset_0_0_20px_rgba(34,197,94,0.3)]' : 'border-transparent'}`}></div>
                <span className="text-white font-bold text-xs absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded z-10 backdrop-blur-md flex items-center gap-2">
                    You {isListening ? <FiMic className="text-neon-green"/> : <FiMicOff className="text-red-500"/>}
                </span>
                {localStream ? <VideoPlayer stream={localStream} isLocal={true} /> : <div className="flex items-center justify-center h-full"><FiVideo className="text-4xl text-gray-800"/></div>}
            </div>
        );

        // Slots 2+: Remote Peers
        remotePeers.forEach((peer, idx) => {
            slots.push(
                <div key={peer.peerId} className="bg-black/40 rounded-xl border border-white/5 relative overflow-hidden bg-gray-900">
                    <span className="text-white font-bold text-xs absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded z-10 backdrop-blur-md">
                        Peer {idx + 1}
                    </span>
                    <VideoPlayer stream={peer.stream} isLocal={false} />
                </div>
            );
        });

        // Fill remaining slots
        while (slots.length < totalSlots) {
            slots.push(
                <div key={`empty-${slots.length}`} className="bg-black/40 rounded-xl border border-white/5 flex items-center justify-center relative overflow-hidden">
                    <FiUsers className="text-4xl text-gray-800/50"/>
                    <span className="text-gray-600 text-xs absolute bottom-2 left-2 px-2 py-1">Waiting...</span>
                </div>
            );
        }

        return slots;
    };

    if (phase === "waiting") {
        return (
            <div className="min-h-screen bg-game-bg flex items-center justify-center p-8 text-white">
                <div className="glass-panel p-12 rounded-3xl text-center max-w-lg border border-white/10 bg-black/40">
                    <FiUsers className="text-6xl text-neon-blue mx-auto mb-6" />
                    <h2 className="text-3xl font-bold mb-4">Waiting Room</h2>
                    {isHost ? (
                        <>
                            <p className="text-gray-400 mb-8">You are the Host. Wait for everyone to join, then click Start.</p>
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
                        {renderGridSquares()}
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
                        
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-700 pb-4">
                            {messages.map((msg, i) => (
                                <div key={i} className={`p-4 rounded-2xl text-sm ${msg.type === 'system' || msg.type === 'system_command' ? 'mx-auto w-fit bg-white/5 text-gray-500 italic' : msg.user === user.fname ? 'ml-auto max-w-[80%] bg-neon-blue/20 border border-neon-blue/30 text-white rounded-br-none' : 'mr-auto max-w-[80%] bg-white/5 border border-white/10 text-gray-300 rounded-bl-none'}`}>
                                    {msg.type !== 'system' && msg.type !== 'system_command' && <span className="block text-[10px] uppercase font-bold text-gray-400 mb-1">{msg.user}</span>}
                                    {msg.text}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-4">
                            <button 
                                onClick={toggleMic}
                                disabled={phase === 'prep'}
                                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all shadow-xl ${phase === 'prep' ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : isListening ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse' : 'bg-neon-blue text-black hover:scale-105 shadow-[0_0_15px_rgba(45,212,191,0.4)]'}`}
                            >
                                {isListening ? <FiStopCircle /> : <FiMic />}
                            </button>
                            
                            <form onSubmit={handleManualSubmit} className="flex-1 flex gap-2">
                                <input 
                                    type="text" 
                                    value={manualInput}
                                    onChange={(e) => setManualInput(e.target.value)}
                                    placeholder={phase === "prep" ? "Chat locked during prep..." : "Or type your argument here if mic fails..."}
                                    disabled={phase === "prep"}
                                    className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors disabled:opacity-50"
                                />
                                <button type="submit" disabled={phase === "prep" || !manualInput.trim()} className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-xl disabled:opacity-50 flex items-center justify-center transition-colors">
                                    <FiSend />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
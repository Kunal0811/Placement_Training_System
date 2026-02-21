import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMic, FiMicOff, FiStopCircle, FiCheckCircle, FiActivity } from 'react-icons/fi';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import API_BASE from '../api';

export default function GDRoom() {
    const { id: sessionId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const topic = new URLSearchParams(location.search).get('topic') || "General Discussion";

    const [messages, setMessages] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const [evaluations, setEvaluations] = useState(null);
    const [loadingEval, setLoadingEval] = useState(false);
    
    const ws = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Connect to WebSocket
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const wsHost = API_BASE.replace(/^https?:\/\//, '');
        const wsUrl = `${protocol}://${wsHost}/api/gd/ws/${sessionId}/${user.fname}`;
        
        ws.current = new WebSocket(wsUrl);
        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prev) => [...prev, data]);
        };

        return () => {
            if (ws.current) ws.current.close();
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, [sessionId, user.fname]);

    const toggleMic = () => {
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

    const endDiscussion = async () => {
        if (recognitionRef.current) recognitionRef.current.stop();
        setIsListening(false);
        setLoadingEval(true);
        try {
            const res = await axios.post(`${API_BASE}/api/gd/evaluate`, { session_id: sessionId, topic: topic });
            setEvaluations(res.data);
        } catch (err) {
            alert("Evaluation failed.");
        } finally {
            setLoadingEval(false);
        }
    };

    // --- EVALUATION SCREEN (RADAR CHARTS) ---
    if (evaluations) {
        return (
            <div className="min-h-screen bg-game-bg p-8 text-white">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-display font-bold text-center mb-10"><span className="text-neon-blue">AI</span> Moderator Report</h1>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        {evaluations.map((ev, i) => {
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
                                    {/* Radar Chart */}
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
                                    
                                    {/* Written Feedback */}
                                    <div className="w-full xl:w-1/2 space-y-4">
                                        <div className="bg-green-500/10 p-3 rounded-xl border border-green-500/20">
                                            <h4 className="text-green-400 font-bold text-xs mb-1 uppercase tracking-widest">Strengths</h4>
                                            <ul className="list-disc pl-4 text-xs text-gray-300 space-y-1">
                                                {ev.strengths.map((s, idx) => <li key={idx}>{s}</li>)}
                                            </ul>
                                        </div>
                                        <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                                            <h4 className="text-red-400 font-bold text-xs mb-1 uppercase tracking-widest">Weaknesses</h4>
                                            <ul className="list-disc pl-4 text-xs text-gray-300 space-y-1">
                                                {ev.weaknesses.map((w, idx) => <li key={idx}>{w}</li>)}
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

    // --- LIVE ROOM SCREEN ---
    return (
        <div className="min-h-screen bg-game-bg flex flex-col p-4 md:p-8">
            <div className="max-w-5xl w-full mx-auto flex-1 flex flex-col">
                {/* Header */}
                <div className="glass-panel bg-black/60 p-5 rounded-2xl mb-6 flex justify-between items-center border border-white/10">
                    <div>
                        <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Live Room</span>
                        <h2 className="text-2xl font-bold text-white mt-2">{topic}</h2>
                    </div>
                    <button onClick={endDiscussion} disabled={loadingEval} className="px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                        {loadingEval ? "AI Processing..." : "End & Evaluate"}
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-[500px]">
                    
                    {/* Fake Video Grid Area (For Visuals) */}
                    <div className="w-full md:w-1/3 grid grid-cols-2 grid-rows-3 gap-3">
                        {[1,2,3,4,5,6].map(i => (
                            <div key={i} className="bg-black/40 rounded-xl border border-white/5 flex items-center justify-center relative overflow-hidden">
                                {i === 1 ? (
                                    <>
                                    <div className={`absolute inset-0 border-2 rounded-xl transition-all ${isListening ? 'border-neon-green shadow-[inset_0_0_20px_rgba(34,197,94,0.3)]' : 'border-transparent'}`}></div>
                                    <span className="text-gray-500 text-xs absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded">You</span>
                                    <FiActivity className={`text-4xl ${isListening ? 'text-neon-green animate-pulse' : 'text-gray-700'}`}/>
                                    </>
                                ) : (
                                    <FiActivity className="text-4xl text-gray-800"/>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Live Transcript / AI Chat Box */}
                    <div className="w-full md:w-2/3 glass-panel bg-black/40 rounded-3xl p-6 border border-white/10 flex flex-col">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Live AI Transcript</h3>
                        
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-700">
                            {messages.map((msg, i) => (
                                <div key={i} className={`p-4 rounded-2xl text-sm ${msg.type === 'system' ? 'mx-auto w-fit bg-white/5 text-gray-500 italic' : msg.user === user.fname ? 'ml-auto max-w-[80%] bg-neon-blue/20 border border-neon-blue/30 text-white rounded-br-none' : 'mr-auto max-w-[80%] bg-white/5 border border-white/10 text-gray-300 rounded-bl-none'}`}>
                                    {msg.type !== 'system' && <span className="block text-[10px] uppercase font-bold text-gray-400 mb-1">{msg.user}</span>}
                                    {msg.text}
                                </div>
                            ))}
                        </div>

                        {/* Mic Controls */}
                        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                            <p className="text-gray-400 text-sm">{isListening ? "Listening..." : "Mic is off."}</p>
                            <button 
                                onClick={toggleMic}
                                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all shadow-xl ${isListening ? 'bg-red-500 text-white shadow-red-500/50 animate-pulse' : 'bg-neon-blue text-black hover:scale-105 shadow-neon-blue/40'}`}
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
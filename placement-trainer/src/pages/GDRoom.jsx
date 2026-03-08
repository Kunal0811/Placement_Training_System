import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiPhoneOff, FiCpu, FiClock, FiMessageSquare } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import API_BASE from '../api';

export default function GDRoom() {
    const { id: sessionId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const topic = new URLSearchParams(location.search).get('topic') || "The Ethics of AI in Healthcare";

    // Media & Room State
    const [localStream, setLocalStream] = useState(null);
    const [peers, setPeers] = useState([1, 2, 3]); // Mocking 3 other peers for the 4-grid
    const [isMicOn, setIsMicOn] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(true);
    
    // Discussion State
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const [isActive, setIsActive] = useState(false);
    const [transcript, setTranscript] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const videoRef = useRef(null);
    const recognitionRef = useRef(null);
    const ws = useRef(null);

    // 1. Initialize Video/Audio
    useEffect(() => {
        const startMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);
                if (videoRef.current) videoRef.current.srcObject = stream;
            } catch (err) {
                console.error("Failed to get media devices", err);
            }
        };
        startMedia();

        return () => {
            if (localStream) localStream.getTracks().forEach(track => track.stop());
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, []);

    // 2. Timer Logic
    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0 && isActive) {
            endDiscussion();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    // 3. Speech to Text Engine (Simulated WebSocket transmission)
    const startSpeechRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        
        recognition.onresult = (e) => {
            const text = e.results[e.results.length - 1][0].transcript;
            if (text.trim()) {
                const newMsg = { user: user?.fname || "You", text, time: new Date().toLocaleTimeString() };
                setTranscript(prev => [...prev, newMsg]);
                // In production: ws.current.send(JSON.stringify(newMsg));
            }
        };
        
        recognition.onend = () => { if (isActive && isMicOn) recognition.start(); };
        recognitionRef.current = recognition;
        recognition.start();
    };

    const toggleMic = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsMicOn(audioTrack.enabled);
            
            if (audioTrack.enabled && isActive) startSpeechRecognition();
            else if (recognitionRef.current) recognitionRef.current.stop();
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            setIsVideoOn(videoTrack.enabled);
        }
    };

    const startDiscussion = () => {
        setIsActive(true);
        startSpeechRecognition();
    };

    const endDiscussion = async () => {
        setIsActive(false);
        setIsAnalyzing(true);
        if (recognitionRef.current) recognitionRef.current.stop();
        if (localStream) localStream.getTracks().forEach(t => t.stop());

        try {
            // Send full transcript to backend for LLM evaluation
            const payload = { session_id: sessionId, transcript: transcript };
            // const res = await axios.post(`${API_BASE}/api/gd/evaluate`, payload);
            
            // Simulate AI processing time
            setTimeout(() => {
                navigate(`/gd/report/${sessionId}`);
            }, 3000);
        } catch (err) {
            alert("Failed to generate AI report.");
            setIsAnalyzing(false);
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    if (isAnalyzing) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
                <FiCpu size={80} className="text-blue-500 animate-pulse mb-6" />
                <h2 className="text-3xl font-black uppercase tracking-widest mb-2">AI Moderator Processing</h2>
                <p className="text-slate-400">Analyzing speech clarity, logic, and participation...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col font-sans h-screen overflow-hidden">
            
            {/* TOP BAR */}
            <header className="h-20 bg-slate-900/50 border-b border-white/10 px-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                    <div className="px-3 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-bold uppercase flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> Live Room
                    </div>
                    <h1 className="text-white font-bold text-lg hidden md:block">{topic}</h1>
                </div>

                <div className="flex items-center gap-6">
                    <div className={`text-2xl font-mono font-black ${timeLeft < 60 ? 'text-rose-500 animate-pulse' : 'text-blue-400'} flex items-center gap-2`}>
                        <FiClock /> {formatTime(timeLeft)}
                    </div>
                    {!isActive ? (
                        <button onClick={startDiscussion} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all">
                            Start Discussion
                        </button>
                    ) : (
                        <button onClick={endDiscussion} className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all">
                            End & Evaluate
                        </button>
                    )}
                </div>
            </header>

            <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
                
                {/* VIDEO GRID (Google Meet Style) */}
                <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4 h-full">
                    {/* Local User */}
                    <div className="relative bg-slate-800 rounded-3xl overflow-hidden border border-white/10 shadow-xl group">
                        <video ref={videoRef} autoPlay muted playsInline className={`w-full h-full object-cover ${!isVideoOn ? 'hidden' : ''}`} />
                        {!isVideoOn && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                                <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center text-3xl text-white font-bold">You</div>
                            </div>
                        )}
                        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs font-bold flex items-center gap-2">
                            {user?.fname || "You"} {!isMicOn && <FiMicOff className="text-rose-500" />}
                        </div>
                        {isMicOn && isActive && (
                            <div className="absolute top-4 right-4 flex gap-1">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                        )}
                    </div>

                    {/* Remote Peers (Mocked for UI) */}
                    {peers.map(peer => (
                        <div key={peer} className="relative bg-slate-800 rounded-3xl overflow-hidden border border-white/10 shadow-xl flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center text-3xl text-slate-400 font-bold">P{peer}</div>
                            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs font-bold">
                                Peer 0{peer}
                            </div>
                        </div>
                    ))}
                </div>

                {/* SIDEBAR: Transcript & AI Chat */}
                <div className="w-full lg:w-80 bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 flex flex-col h-full overflow-hidden">
                    <div className="p-4 border-b border-white/10 flex items-center gap-2 text-white font-bold">
                        <FiMessageSquare className="text-blue-500" /> Live AI Transcript
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                        {transcript.length === 0 && (
                            <div className="text-center text-slate-500 text-sm mt-10">
                                <FiCpu size={32} className="mx-auto mb-2 opacity-50" />
                                Moderator is listening...<br/>Start speaking once the timer begins.
                            </div>
                        )}
                        <AnimatePresence>
                            {transcript.map((msg, i) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={i} 
                                    className={`flex flex-col ${msg.user === (user?.fname || "You") ? 'items-end' : 'items-start'}`}
                                >
                                    <span className="text-[10px] text-slate-500 mb-1 font-bold px-1">{msg.user} • {msg.time}</span>
                                    <div className={`px-4 py-2 rounded-2xl text-sm max-w-[90%] ${
                                        msg.user === (user?.fname || "You") 
                                        ? 'bg-blue-600 text-white rounded-tr-none' 
                                        : 'bg-slate-800 text-slate-200 rounded-tl-none border border-white/5'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* BOTTOM CONTROLS (Google Meet Style) */}
            <div className="h-24 bg-slate-900/80 border-t border-white/10 flex items-center justify-center gap-4 z-10">
                <button 
                    onClick={toggleMic}
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all shadow-lg ${isMicOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-rose-500 text-white shadow-rose-500/30'}`}
                >
                    {isMicOn ? <FiMic /> : <FiMicOff />}
                </button>
                <button 
                    onClick={toggleVideo}
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all shadow-lg ${isVideoOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-rose-500 text-white shadow-rose-500/30'}`}
                >
                    {isVideoOn ? <FiVideo /> : <FiVideoOff />}
                </button>
                <button 
                    onClick={() => navigate('/gd')}
                    className="w-16 h-12 rounded-2xl flex items-center justify-center text-xl bg-rose-600 text-white hover:bg-rose-700 transition-all shadow-lg shadow-rose-900/50 px-8 ml-4"
                >
                    <FiPhoneOff />
                </button>
            </div>

        </div>
    );
}
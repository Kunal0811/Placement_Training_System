import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FiMic, FiStopCircle, FiVideo, FiActivity, FiStar, FiAward, FiMessageSquare, FiClock } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../api";

export default function Interview() {
  const { user } = useAuth();
  
  // States
  const [stage, setStage] = useState("setup"); // 'setup', 'interview', 'evaluating', 'report'
  const [config, setConfig] = useState({ type: "Technical", role: "", skill: "Beginner" });
  const [sessionId, setSessionId] = useState(null);
  
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  
  // Timer (15 Minutes)
  const [timeLeft, setTimeLeft] = useState(15 * 60); 

  // Media
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  // Mock Body Language Metrics
  const [metrics, setMetrics] = useState({ eyeContact: 85, posture: 90, nerves: 10 });

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 15-Minute Timer Logic
  useEffect(() => {
    if (stage === "interview" && timeLeft > 0) {
      const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timerId);
    } else if (stage === "interview" && timeLeft === 0) {
      triggerEvaluation(); // Time's up!
    }
  }, [stage, timeLeft]);

  // Simulated AI Body Language Analysis (Updates visually every 2 seconds)
  useEffect(() => {
    if (stage === "interview") {
      const metricTimer = setInterval(() => {
        setMetrics({
          eyeContact: Math.floor(Math.random() * (98 - 70) + 70), // Randomize slightly for live effect
          posture: Math.floor(Math.random() * (95 - 80) + 80),
          nerves: isSpeaking ? Math.floor(Math.random() * 20) : Math.floor(Math.random() * (40 - 10) + 10) // Nerves go up if user stutters
        });
      }, 2500);
      return () => clearInterval(metricTimer);
    }
  }, [stage, isSpeaking]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // --- 🎙️ AI VOICE (TTS) ---
  const speakAI = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); 
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    const goodVoice = voices.find(v => v.name.includes("Google US English")) || voices[0];
    if (goodVoice) utterance.voice = goodVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // --- 📷 CAMERA ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) { console.error("Camera error:", err); }
  };

  // --- 🚀 START ---
  const startInterview = async () => {
    if (!config.role) return alert("Please enter a target role");
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/interview/start`, {
        user_id: user?.id || 1, 
        job_role: config.role,
        interview_type: config.type,
        skill_level: config.skill
      });
      
      setSessionId(res.data.session_id);
      setMessages([{ role: "ai", content: res.data.message }]);
      setStage("interview");
      startCamera();
      setTimeLeft(15 * 60); // Reset timer to 15 mins
      
      setTimeout(() => speakAI(res.data.message), 500); 
    } catch (err) {
      console.error(err);
      alert("Failed to start.");
    } finally {
      setLoading(false);
    }
  };

  // --- 💬 CHAT SUBMISSION ---
  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    window.speechSynthesis.cancel(); 
    if (isListening) toggleListening(); 

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/interview/chat`, {
        session_id: sessionId,
        user_input: userMsg.content,
        history: messages
      });
      
      setMessages(prev => [...prev, { role: "ai", content: res.data.next_question }]);
      speakAI(res.data.next_question);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  // --- 📊 EVALUATION ---
  const triggerEvaluation = async () => {
    setStage("evaluating");
    window.speechSynthesis.cancel();
    if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }

    try {
      const res = await axios.post(`${API_BASE}/api/interview/evaluate`, { session_id: sessionId });
      setReport(res.data);
      setStage("report");
    } catch (err) {
      console.error(err);
      alert("Failed to generate report.");
      setStage("setup");
    }
  };

  // --- 🎙️ SPEECH TO TEXT ---
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return alert("Browser does not support speech recognition");
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (e) => {
        let currentTranscript = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          currentTranscript += e.results[i][0].transcript;
        }
        setInput(currentTranscript); 
      };
      recognition.onend = () => setIsListening(false);
      
      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  // ===================== RENDER SETUP =====================
  if (stage === "setup") {
    return (
      <div className="min-h-screen bg-game-bg text-white p-8 flex items-center justify-center">
        <div className="glass-panel p-8 rounded-3xl border border-white/10 max-w-md w-full">
            <h1 className="text-3xl font-bold mb-2">Smart <span className="text-neon-blue">Interview</span></h1>
            <p className="text-gray-400 text-sm mb-6">15-Minute Video Mock Session</p>
            
            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Target Role</label>
                    <input type="text" value={config.role} onChange={(e)=>setConfig({...config, role: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 focus:border-neon-blue outline-none" placeholder="e.g., Data Analyst"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Type</label>
                        <select value={config.type} onChange={(e)=>setConfig({...config, type: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 outline-none">
                            <option>HR</option><option>Technical</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Your Skill</label>
                        <select value={config.skill} onChange={(e)=>setConfig({...config, skill: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 outline-none">
                            <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                        </select>
                    </div>
                </div>
                <button onClick={startInterview} disabled={loading} className="w-full mt-4 py-4 bg-neon-blue text-black font-bold rounded-xl hover:bg-neon-purple hover:text-white transition-all">
                    {loading ? "Initializing AI..." : "Start Interview"}
                </button>
            </div>
        </div>
      </div>
    );
  }

  // ===================== RENDER LOADING =====================
  if (stage === "evaluating") {
    return (
        <div className="min-h-screen bg-game-bg flex flex-col items-center justify-center text-white text-center p-6">
            <div className="w-24 h-24 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mb-8"></div>
            <h2 className="text-3xl font-bold text-neon-blue mb-2">Generating Deep Evaluation</h2>
            <p className="text-gray-400 max-w-md">Analyzing Clarity, Technical Accuracy, and Body Language patterns...</p>
        </div>
    )
  }

  // ===================== RENDER REPORT =====================
  if (stage === "report" && report) {
    return (
        <div className="min-h-screen bg-game-bg text-white p-6 md:p-12 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-8">
                
                {/* Header Summary */}
                <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center relative">
                    <h1 className="text-4xl font-bold mb-2">Interview Result</h1>
                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple my-4">
                        {report.overall.score}%
                    </div>
                    <p className="text-gray-300 italic max-w-2xl mx-auto">"{report.overall.suggestions}"</p>
                </div>

                {/* Score Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { title: "Communication", val: report.overall.communication, icon: <FiMessageSquare /> },
                        { title: "Technical", val: report.overall.technical, icon: <FiActivity /> },
                        { title: "Confidence", val: report.overall.confidence, icon: <FiStar /> },
                        { title: "Problem Solving", val: report.overall.problem_solving, icon: <FiAward /> }
                    ].map((stat, i) => (
                        <div key={i} className="bg-black/40 border border-white/5 p-6 rounded-2xl text-center">
                            <div className="text-neon-blue text-2xl flex justify-center mb-2">{stat.icon}</div>
                            <div className="text-3xl font-bold text-white">{stat.val}<span className="text-lg text-gray-500">/10</span></div>
                            <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{stat.title}</div>
                        </div>
                    ))}
                </div>

                {/* Question Breakdown */}
                <div>
                    <h3 className="text-2xl font-bold mb-6">Detailed Analysis</h3>
                    <div className="space-y-6">
                        {report.per_question_analysis.map((q, i) => (
                            <div key={i} className="glass-panel p-6 rounded-2xl border border-white/10">
                                <h4 className="text-lg font-bold text-gray-200 mb-4">Q: {q.question}</h4>
                                <div className="bg-black/30 p-4 rounded-xl text-gray-400 text-sm mb-4 border border-white/5 italic">
                                    "{q.candidate_answer}"
                                </div>
                                <div className="grid md:grid-cols-2 gap-6 mb-4">
                                    <div><h5 className="text-neon-yellow font-bold text-sm mb-1">Feedback</h5><p className="text-sm text-gray-300">{q.feedback}</p></div>
                                    <div><h5 className="text-neon-green font-bold text-sm mb-1">Suggested Answer</h5><p className="text-sm text-gray-300">{q.suggested_answer}</p></div>
                                </div>
                                {/* Metrics Bar */}
                                <div className="flex flex-wrap gap-3 mt-4">
                                    {Object.entries(q.metrics).map(([key, val]) => (
                                        <div key={key} className="bg-black/50 px-3 py-1 rounded-lg border border-white/5 text-xs flex items-center gap-2">
                                            <span className="text-gray-400 capitalize">{key.replace('_', ' ')}:</span> 
                                            <span className={`font-bold ${val >= 7 ? 'text-green-400' : 'text-yellow-400'}`}>{val}/10</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center pt-8 pb-12">
                    <button onClick={() => window.location.href='/dashboard'} className="bg-neon-blue text-black font-bold px-8 py-3 rounded-xl hover:bg-white transition-colors">Return to Dashboard</button>
                </div>
            </div>
        </div>
    )
  }

  // ===================== RENDER ACTIVE INTERVIEW =====================
  return (
    <div className="min-h-screen bg-game-bg flex flex-col h-screen">
        {isSpeaking && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue to-neon-purple animate-pulse z-50"></div>}

        <div className="flex-1 flex overflow-hidden">
            
            {/* CHAT PANEL */}
            <div className="flex-1 flex flex-col p-4 relative">
                
                {/* Header with Timer */}
                <div className="flex justify-between items-center mb-4 py-3 border-b border-white/10 px-4 bg-black/20 rounded-2xl">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-neon-blue animate-pulse' : 'bg-green-500'}`}></div>
                        <span className="font-bold text-gray-200">AI Interviewer</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 font-mono text-lg font-bold ${timeLeft < 300 ? 'text-red-400 animate-pulse' : 'text-neon-blue'}`}>
                            <FiClock /> {formatTime(timeLeft)}
                        </div>
                        <button onClick={triggerEvaluation} className="text-xs bg-red-500/20 text-red-400 px-4 py-1.5 rounded-lg border border-red-500/30 hover:bg-red-500 hover:text-white">
                            End Early
                        </button>
                    </div>
                </div>

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto space-y-6 pb-24 px-4 scrollbar-hide">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl text-lg font-medium ${msg.role === "user" ? "bg-white/10 text-gray-200 rounded-br-none" : "text-white"}`}>
                                {msg.role === "ai" && <div className="text-xs font-bold text-neon-blue mb-1">Interviewer</div>}
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && <div className="text-neon-blue animate-pulse font-mono text-sm pl-2">Analyzing response...</div>}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="absolute bottom-6 left-4 right-4 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-3 flex gap-2">
                    <button onClick={toggleListening} className={`p-4 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-gray-400'}`}>
                        {isListening ? <FiStopCircle size={24} /> : <FiMic size={24} />}
                    </button>
                    <textarea
                        value={input} onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                        placeholder={isListening ? "Listening..." : "Type or speak..."}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-gray-500 resize-none h-12 py-3" disabled={loading}
                    />
                    <button onClick={handleSend} disabled={!input.trim() || loading} className="px-6 bg-neon-blue text-black font-bold rounded-xl hover:bg-neon-purple hover:text-white transition-all disabled:opacity-50">
                        Send
                    </button>
                </div>
            </div>

            {/* AI BODY LANGUAGE SCANNER PANEL */}
            <div className="w-[350px] border-l border-white/10 bg-black/40 p-6 flex flex-col lg:flex">
                <div className="text-xs font-bold text-gray-500 mb-3 flex items-center gap-2 uppercase">
                    <FiVideo /> Live Analysis
                </div>
                
                {/* Camera */}
                <div className="aspect-[4/3] bg-black rounded-2xl border border-white/10 overflow-hidden relative mb-6 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    <video ref={videoRef} autoPlay muted className="w-full h-full object-cover transform scale-x-[-1]" />
                    
                    {/* Scanner Overlay UI */}
                    <div className="absolute inset-0 border-2 border-neon-blue/30 m-4 rounded-lg flex flex-col justify-between p-2 pointer-events-none">
                        <div className="flex justify-between">
                            <div className="w-4 h-4 border-t-2 border-l-2 border-neon-blue"></div>
                            <div className="w-4 h-4 border-t-2 border-r-2 border-neon-blue"></div>
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-neon-green/20 rounded-full animate-pulse"></div>
                        <div className="flex justify-between">
                            <div className="w-4 h-4 border-b-2 border-l-2 border-neon-blue"></div>
                            <div className="w-4 h-4 border-b-2 border-r-2 border-neon-blue"></div>
                        </div>
                    </div>
                </div>

                {/* Metrics */}
                <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-white mb-4">Body Language</h3>
                    <div className="space-y-5">
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-400">Eye Contact</span>
                                <span className="text-green-400 font-mono">{metrics.eyeContact}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 transition-all duration-500" style={{width: `${metrics.eyeContact}%`}}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-400">Posture & Confidence</span>
                                <span className="text-neon-blue font-mono">{metrics.posture}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-neon-blue transition-all duration-500" style={{width: `${metrics.posture}%`}}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-400">Nervousness</span>
                                <span className={`${metrics.nerves > 30 ? 'text-red-400' : 'text-yellow-400'} font-mono`}>{metrics.nerves}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                <div className={`h-full transition-all duration-500 ${metrics.nerves > 30 ? 'bg-red-500' : 'bg-yellow-500'}`} style={{width: `${metrics.nerves}%`}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
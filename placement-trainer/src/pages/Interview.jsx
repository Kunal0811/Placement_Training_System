// src/pages/Interview.jsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FiMic, FiStopCircle, FiSend, FiBookOpen, FiX, FiCheckCircle, FiAlertTriangle, FiCode } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_BASE, { saveInterviewResult } from "../api";

// ... (Keep your PREP_CONTENT constant as is) ...
const PREP_CONTENT = {
  tips: [
    "Research the company and role beforehand.",
    "Use the STAR method (Situation, Task, Action, Result) for behavioral questions.",
    "Speak clearly and maintain a steady pace.",
    "It's okay to take a moment to think before answering.",
    "Ask clarifying questions if you don't understand the problem."
  ],
  "do'sDont's": {
    dos: ["Dress professionally", "Maintain eye contact (look at camera)", "Be honest about what you don't know", "Test your mic/camera first"],
    donts: ["Don't interrupt the interviewer", "Don't read from a script", "Don't fidget excessively", "Don't use slang or informal language"]
  },
  commonQA: [
    { q: "Tell me about yourself.", a: "Focus on your professional journey, key skills, and why you're a fit for this role. Keep it under 2 minutes." },
    { q: "What are your greatest strengths?", a: "Choose strengths relevant to the job (e.g., problem-solving, adaptability) and provide specific examples." },
    { q: "Why do you want to work here?", a: "Mention the company's values, products, or reputation and align them with your career goals." }
  ],
  codeSnippets: [
    { title: "Reverse String (Python)", code: "def reverse_string(s):\n    return s[::-1]" },
    { title: "Factorial (Recursive)", code: "def factorial(n):\n    return 1 if n == 0 else n * factorial(n-1)" },
    { title: "Check Prime", code: "def is_prime(n):\n    if n < 2: return False\n    for i in range(2, int(n**0.5)+1):\n        if n % i == 0: return False\n    return True" }
  ]
};

export default function Interview() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [started, setStarted] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [config, setConfig] = useState({ type: "Technical", role: "", topic: "General" });
  
  const [messages, setMessages] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [scoreHistory, setScoreHistory] = useState([]); 
  const [feedbackHistory, setFeedbackHistory] = useState([]); 
  const [feedback, setFeedback] = useState({ score: null, ideal: "", text: "" });
  
  const [isCodingMode, setIsCodingMode] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState("");
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [showPrep, setShowPrep] = useState(false);

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, feedback]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const startInterview = async () => {
    if (!config.role) return alert("Please enter a target role (e.g., SDE, Data Analyst)");
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/interview/start`, {
        user_id: user?.id || 1, 
        job_role: config.role,
        interview_type: config.type,
        topic: config.topic
      });
      setSessionId(res.data.session_id);
      setMessages([{ role: "ai", content: res.data.message }]);
      setStarted(true);
      startCamera();
    } catch (err) {
      console.error(err);
      alert("Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/interview/chat`, {
        session_id: sessionId,
        user_input: userMsg.content,
        history: messages,
        is_code: isCodingMode
      });

      const { feedback: aiFeedback, ideal_answer, score, next_question, is_final } = res.data;

      setFeedback({ score, ideal: ideal_answer, text: aiFeedback });
      
      // Save turn history
      const turnData = {
        question: messages[messages.length - 1]?.content || "Intro",
        answer: userMsg.content,
        score: score,
        ideal_answer: ideal_answer,
        feedback: aiFeedback
      };
      
      setScoreHistory(prev => [...prev, score]);
      setFeedbackHistory(prev => [...prev, turnData]);

      if (is_final) {
        alert(`Interview Complete! Final Score: ${score}/10`);
        
        // Calculate average score
        const totalScore = [...scoreHistory, score].reduce((a, b) => a + b, 0);
        const avgScore = Math.round(totalScore / (scoreHistory.length + 1));
        
        await saveInterviewResult({
            user_id: user.id,
            interview_type: config.type,
            job_role: config.role,
            overall_score: avgScore,
            feedback: [...feedbackHistory, turnData]
        });

        stopCamera();
        navigate("/dashboard");
      } else {
        setMessages(prev => [...prev, { role: "ai", content: next_question }]);
        
        // Check if next question is a coding task
        if (next_question.includes("CODE_TASK:")) {
            setIsCodingMode(true);
            setCodeSnippet("# Write your solution here...");
        } else {
            setIsCodingMode(false);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return alert("Browser does not support speech recognition");
      
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";
      
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInput(prev => prev + " " + transcript);
      };
      recognition.onend = () => setIsListening(false);
      
      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  // --- RENDER SETUP SCREEN ---
  if (!started) {
    return (
      <div className="min-h-screen bg-game-bg text-white p-6 md:p-12 font-sans flex items-center justify-center">
        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
            
            {/* Left: Config Form */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue to-neon-purple"></div>
                <h1 className="text-4xl font-display font-bold text-white mb-2">AI <span className="text-neon-purple">Interview</span></h1>
                <p className="text-gray-400 text-sm mb-8">Configure your simulation parameters.</p>
                
                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Interview Type</label>
                        <div className="flex gap-4">
                            {['Technical', 'HR', 'Behavioral'].map(t => (
                                <button 
                                    key={t}
                                    onClick={() => setConfig({...config, type: t})}
                                    className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${config.type === t ? 'bg-neon-blue text-black border-neon-blue shadow-[0_0_15px_rgba(45,212,191,0.4)]' : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/30'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Target Role</label>
                        <input 
                            type="text" 
                            className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all placeholder:text-gray-700"
                            placeholder="e.g. Frontend Developer"
                            value={config.role}
                            onChange={(e) => setConfig({...config, role: e.target.value})}
                        />
                    </div>

                    <button 
                        onClick={startInterview}
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Initializing AI..." : "Start Simulation"}
                    </button>
                </div>
            </div>

            {/* Right: Prep Guide */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-white/5 flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><FiBookOpen className="text-neon-yellow"/> Quick Prep</h3>
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                            <h4 className="font-bold text-neon-blue text-sm mb-1">Common Questions</h4>
                            <ul className="text-xs text-gray-400 list-disc pl-4 space-y-1">
                                {PREP_CONTENT.commonQA.slice(0,2).map((qa,i) => <li key={i}>{qa.q}</li>)}
                            </ul>
                        </div>
                        <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                            <h4 className="font-bold text-green-400 text-sm mb-1">Do's</h4>
                            <ul className="text-xs text-gray-400 list-disc pl-4 space-y-1">
                                {PREP_CONTENT["do'sDont's"].dos.slice(0,2).map((d,i) => <li key={i}>{d}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
                <button onClick={() => setShowPrep(true)} className="mt-6 w-full py-3 border border-white/20 rounded-xl text-sm font-bold text-gray-300 hover:bg-white/10 transition-colors">
                    View Full Guide
                </button>
            </div>
        </div>

        {/* Full Prep Modal */}
        {showPrep && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
                <div className="glass-panel max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-3xl p-8 border border-white/10 relative">
                    <button onClick={() => setShowPrep(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><FiX size={24}/></button>
                    <h2 className="text-3xl font-display font-bold text-white mb-6">Interview <span className="text-neon-blue">Guide</span></h2>
                    
                    <div className="space-y-8">
                        <section>
                            <h3 className="text-lg font-bold text-neon-yellow mb-3">💡 Pro Tips</h3>
                            <ul className="list-disc pl-5 space-y-2 text-gray-300 text-sm">
                                {PREP_CONTENT.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                            </ul>
                        </section>
                        <section className="grid grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-bold text-green-400 mb-3">✅ Do's</h3>
                                <ul className="list-disc pl-5 space-y-2 text-gray-300 text-sm">
                                    {PREP_CONTENT["do'sDont's"].dos.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-red-400 mb-3">❌ Don'ts</h3>
                                <ul className="list-disc pl-5 space-y-2 text-gray-300 text-sm">
                                    {PREP_CONTENT["do'sDont's"].donts.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        )}
      </div>
    );
  }

  // --- RENDER ACTIVE SESSION ---
  return (
    <div className="min-h-screen bg-game-bg flex flex-col h-screen">
        {/* Top Bar */}
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/20 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                <span className="font-mono text-neon-blue font-bold">LIVE SESSION</span>
                <span className="text-gray-500 text-sm">| {config.role}</span>
            </div>
            <button onClick={() => navigate('/dashboard')} className="text-xs font-bold text-red-400 hover:text-red-300 border border-red-500/30 px-4 py-2 rounded-lg hover:bg-red-500/10 transition-colors">End Session</button>
        </div>

        <div className="flex-1 flex overflow-hidden">
            {/* Left: Chat & Interactions */}
            <div className="flex-1 flex flex-col p-4 md:p-6 max-w-4xl mx-auto w-full">
                
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-4 scrollbar-thin scrollbar-thumb-gray-700">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                                msg.role === "user" 
                                ? "bg-neon-blue/20 border border-neon-blue/30 text-white rounded-br-none" 
                                : "bg-white/5 border border-white/10 text-gray-300 rounded-bl-none"
                            }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-none flex gap-2 items-center">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Feedback Toast */}
                {feedback.text && (
                    <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-white/10 animate-fade-in-up">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-neon-purple uppercase tracking-widest">AI Feedback</span>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${feedback.score >= 7 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>Score: {feedback.score}/10</span>
                        </div>
                        <p className="text-sm text-gray-300 mb-2">{feedback.text}</p>
                        {feedback.ideal && (
                            <div className="mt-2 p-3 bg-black/40 rounded-lg border border-white/5 text-xs font-mono text-gray-400">
                                <span className="text-gray-500 block mb-1">Ideal Answer:</span>
                                {feedback.ideal}
                            </div>
                        )}
                    </div>
                )}

                {/* Input Area */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple opacity-20 blur-xl group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl p-2 flex items-center gap-2">
                        <button 
                            onClick={toggleListening}
                            className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                        >
                            {isListening ? <FiStopCircle size={20} /> : <FiMic size={20} />}
                        </button>
                        
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={isListening ? "Listening..." : "Type your answer..."}
                            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-gray-600 h-10"
                            disabled={loading}
                        />
                        
                        <button 
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            className="p-3 bg-neon-blue text-black rounded-xl hover:bg-neon-purple hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FiSend size={18} className={loading ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Right: Camera Feed (Desktop) */}
            <div className="hidden lg:block w-80 p-6 border-l border-white/10 bg-black/20">
                <div className="sticky top-6">
                    <div className="aspect-video bg-black rounded-2xl border border-white/10 overflow-hidden relative shadow-2xl mb-6">
                        <video ref={videoRef} autoPlay muted className="w-full h-full object-cover transform scale-x-[-1]" />
                        <div className="absolute bottom-3 left-3 flex gap-2">
                            <div className="px-2 py-1 bg-red-500/80 rounded text-[10px] font-bold text-white flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div> REC
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <h4 className="text-sm font-bold text-white mb-3">Live Stats</h4>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>Confidence</span>
                                    <span>{scoreHistory.length > 0 ? Math.round(scoreHistory.reduce((a,b)=>a+b,0)/scoreHistory.length * 10) : 0}%</span>
                                </div>
                                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-neon-green" style={{ width: `${scoreHistory.length > 0 ? Math.round(scoreHistory.reduce((a,b)=>a+b,0)/scoreHistory.length * 10) : 0}%` }}></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <FiCheckCircle className="text-neon-blue"/> {scoreHistory.length} Questions Answered
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
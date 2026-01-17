// src/pages/Interview.jsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FiMic, FiStopCircle, FiSend, FiBookOpen, FiX, FiCheckCircle, FiAlertTriangle, FiCode } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_BASE, { saveInterviewResult } from "../api"; // Import the helper

// --- PREPARATION CONTENT DATA ---
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
  const { user } = useAuth(); // Get logged in user
  
  const [started, setStarted] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [config, setConfig] = useState({ type: "Technical", role: "", topic: "General" });
  
  const [messages, setMessages] = useState([]); 
  const [loading, setLoading] = useState(false);
  
  // Track history for saving
  const [scoreHistory, setScoreHistory] = useState([]); // Stores scores [8, 7, 9...]
  const [feedbackHistory, setFeedbackHistory] = useState([]); // Stores full turn objects
  
  const [feedback, setFeedback] = useState({ score: null, ideal: "", text: "" });
  const [isCodingMode, setIsCodingMode] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  
  // Prep Modal State
  const [showPrep, setShowPrep] = useState(false);
  const [activeTab, setActiveTab] = useState("tips");

  const recognitionRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (e) => {
        let text = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          text += e.results[i][0].transcript;
        }
        setTranscript(text);
      };
    }
  }, []);

  const startInterview = async () => {
    if (!config.role) return alert("Please enter a Job Role");
    if (!user) return alert("Please login first");

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/interview/start`, {
        user_id: user.id, 
        job_role: config.role,
        interview_type: config.type,
        topic: config.topic
      });

      setSessionId(res.data.session_id);
      setMessages([{ role: "ai", content: res.data.message }]);
      setStarted(true);
      startCamera();
      speak(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  // --- FINISH & SAVE LOGIC ---
  const finishInterview = async () => {
    if (!window.confirm("Are you sure you want to finish?")) return;
    
    setLoading(true);
    try {
      // Calculate overall score from current scoreHistory state
      const avgScore = scoreHistory.length > 0 
        ? Math.round(scoreHistory.reduce((a, b) => a + b, 0) / scoreHistory.length) 
        : 0;

      // Ensure the endpoint matches your interview_routes.py prefix
      await axios.post(`${API_BASE}/api/interview/save-attempt`, {
        user_id: user.id,
        interview_type: config.type,
        job_role: config.role,
        overall_score: avgScore,
        feedback: feedbackHistory // This stores the array of Q&A objects
      });

      alert(`Interview Saved! Your Final Score: ${avgScore}/10`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Manual save failed:", error);
      alert("Failed to save results.");
    } finally {
      setLoading(false);
    }
};

  const handleAnswerSubmit = async () => {
    let finalAnswer = transcript;
    if (isCodingMode && codeSnippet) {
      finalAnswer += `\n[CODE_SUBMISSION]:\n${codeSnippet}`;
    }

    if (!finalAnswer.trim()) return;

    if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
    }

    const newHistory = [...messages, { role: "user", content: finalAnswer }];
    setMessages(newHistory);
    setTranscript(""); 
    setCodeSnippet("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/interview/chat`, {
        session_id: sessionId,
        user_input: finalAnswer,
        history: newHistory.map(m => ({ role: m.role, content: m.content })),
        is_code: isCodingMode
      });

      const data = res.data;
      
      // Update Scores & History for Dashboard
      if (data.score !== undefined) {
        setScoreHistory(prev => [...prev, data.score]);
        setFeedbackHistory(prev => [...prev, {
          question: messages[messages.length - 1]?.content || "Initial Question", // Previous AI question
          answer: finalAnswer,
          score: data.score,
          feedback: data.feedback,
          ideal_answer: data.ideal_answer
        }]);
      }

      setFeedback({
        score: data.score,
        ideal: data.ideal_answer,
        text: data.feedback
      });

      if (data.is_final) {
        finishInterview(); // Auto-finish if AI says so
      } else {
        if (data.next_question.includes("CODE_TASK:")) {
            setIsCodingMode(true);
            data.next_question = data.next_question.replace("CODE_TASK:", "").trim();
        } else {
            setIsCodingMode(false);
        }

        setMessages(prev => [...prev, { role: "ai", content: data.next_question }]);
        speak(data.next_question);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch(e) { console.error("Camera error", e); }
  };

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  // --- SETUP SCREEN ---
  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white font-sans p-4 relative">
        
        {/* PREP MODAL */}
        {showPrep && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-gray-800 w-full max-w-4xl h-[80vh] rounded-2xl border border-blue-500/30 flex flex-col overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-900">
                <h2 className="text-2xl font-bold text-blue-400 flex items-center gap-2"><FiBookOpen/> Interview Preparation Guide</h2>
                <button onClick={() => setShowPrep(false)} className="text-gray-400 hover:text-white"><FiX size={28}/></button>
              </div>
              
              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-1/4 bg-gray-900 border-r border-gray-700 p-4 space-y-2">
                   {['tips', "do'sDont's", 'commonQA', 'codeSnippets'].map(tab => (
                     <button 
                       key={tab} 
                       onClick={() => setActiveTab(tab)}
                       className={`w-full text-left p-3 rounded-lg capitalize font-medium transition ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800'}`}
                     >
                       {tab.replace(/([A-Z])/g, ' $1').trim()}
                     </button>
                   ))}
                </div>

                {/* Content */}
                <div className="flex-1 p-8 overflow-y-auto bg-gray-800">
                  {activeTab === 'tips' && (
                    <ul className="space-y-4">
                      {PREP_CONTENT.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-3 p-4 bg-gray-700/50 rounded-xl">
                          <span className="text-green-400 text-xl">💡</span>
                          <span className="text-lg">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {activeTab === "do'sDont's" && (
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-green-400 font-bold text-xl flex items-center gap-2"><FiCheckCircle/> Do's</h3>
                        {PREP_CONTENT["do'sDont's"].dos.map((item, i) => <div key={i} className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg text-green-100">{item}</div>)}
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-red-400 font-bold text-xl flex items-center gap-2"><FiAlertTriangle/> Don'ts</h3>
                        {PREP_CONTENT["do'sDont's"].donts.map((item, i) => <div key={i} className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-100">{item}</div>)}
                      </div>
                    </div>
                  )}

                  {activeTab === 'commonQA' && (
                    <div className="space-y-6">
                      {PREP_CONTENT.commonQA.map((item, i) => (
                        <div key={i} className="bg-gray-700/30 p-6 rounded-xl border border-gray-600">
                          <h4 className="text-blue-300 font-bold text-lg mb-2">Q: {item.q}</h4>
                          <p className="text-gray-300 italic border-l-4 border-green-500 pl-4">" {item.a} "</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'codeSnippets' && (
                    <div className="space-y-6">
                      {PREP_CONTENT.codeSnippets.map((item, i) => (
                        <div key={i} className="bg-black p-4 rounded-xl border border-gray-700">
                          <h4 className="text-yellow-400 font-mono mb-2 flex items-center gap-2"><FiCode/> {item.title}</h4>
                          <pre className="text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap">{item.code}</pre>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Setup Card */}
        <div className="bg-gray-800 p-10 rounded-3xl shadow-2xl border border-blue-500/50 w-[450px] relative z-10">
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-blue-600 p-4 rounded-full shadow-lg shadow-blue-600/50">
            <FiMic size={32} className="text-white"/>
          </div>
          <h1 className="text-4xl font-bold mb-2 text-center text-white mt-4">AI Interviewer</h1>
          <p className="text-gray-400 text-center mb-8">Master your technical & behavioral skills</p>
          
          <div className="space-y-4 mb-8">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Role</label>
              <input 
                type="text" placeholder="e.g. Full Stack Developer"
                className="w-full p-4 bg-gray-900 text-white rounded-xl border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                onChange={(e) => setConfig({...config, role: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                  onClick={() => setConfig({...config, type: "Technical"})}
                  className={`py-3 rounded-xl font-medium transition-all ${config.type === "Technical" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "bg-gray-700 text-gray-400 hover:bg-gray-600"}`}
              >Technical</button>
              <button 
                  onClick={() => setConfig({...config, type: "HR"})}
                  className={`py-3 rounded-xl font-medium transition-all ${config.type === "HR" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30" : "bg-gray-700 text-gray-400 hover:bg-gray-600"}`}
              >HR Round</button>
            </div>
          </div>

          <button 
            onClick={startInterview}
            disabled={!config.role || loading}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-green-900/50 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {loading ? "Starting..." : "Start Interview"}
          </button>
          
          <button 
            onClick={() => setShowPrep(true)}
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <FiBookOpen/> Preparation Guide
          </button>
        </div>
      </div>
    );
  }

  // --- ACTIVE INTERVIEW SCREEN ---
  return (
    <div className="h-screen bg-gray-900 text-white p-4 flex gap-4 overflow-hidden">
      
      {/* LEFT PANE: Chat & Inputs */}
      <div className="flex-1 flex flex-col bg-gray-800 rounded-2xl border border-gray-700 relative overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gray-900/50 p-4 border-b border-gray-700 flex justify-between items-center backdrop-blur-md">
          <div>
            <span className="text-xs text-blue-400 font-bold uppercase tracking-widest">{config.type} Interview</span>
            <h2 className="text-lg font-bold text-white">{config.role}</h2>
          </div>
          <button 
            onClick={finishInterview}
            className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-200 border border-red-600/50 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
          >
            <FiStopCircle/> Finish & Save
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}>
              <div className={`max-w-[80%] p-5 rounded-2xl shadow-lg text-lg leading-relaxed ${
                msg.role === "user" 
                ? "bg-blue-600 text-white rounded-br-none" 
                : "bg-gray-700 text-gray-100 rounded-bl-none border border-gray-600"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && <div className="text-blue-400 italic ml-4 animate-pulse">AI is thinking...</div>}
        </div>

        {/* Inputs Area */}
        <div className="p-4 bg-gray-850 border-t border-gray-700">
            {isCodingMode && (
                <div className="mb-4 animate-slide-up">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-xs text-green-400 font-mono flex items-center gap-2"><FiCode/> CODE EDITOR ACTIVE</div>
                      <span className="text-xs text-gray-500">Python Mode</span>
                    </div>
                    <textarea 
                        value={codeSnippet}
                        onChange={(e) => setCodeSnippet(e.target.value)}
                        placeholder="# Type your solution here..."
                        className="w-full h-48 bg-black text-green-400 font-mono p-4 rounded-xl border border-gray-700 focus:border-green-500 outline-none resize-none shadow-inner"
                    />
                </div>
            )}

            <div className="flex items-center gap-4">
                <div className="flex-1 bg-gray-900 rounded-2xl px-6 py-4 flex items-center border border-gray-700 shadow-inner">
                    <span className={`italic text-lg ${transcript ? "text-white" : "text-gray-500"}`}>
                        {transcript || (isListening ? "Listening..." : "Click Mic to speak...")}
                    </span>
                </div>

                <button 
                    onClick={() => {
                        if (isListening) {
                            recognitionRef.current.stop(); 
                            setIsListening(false);
                        } else {
                            recognitionRef.current.start(); 
                            setIsListening(true);
                        }
                    }}
                    className={`p-5 rounded-full transition-all transform hover:scale-105 ${
                        isListening ? "bg-red-500 animate-pulse shadow-lg shadow-red-500/50" : "bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/50"
                    }`}
                >
                    {isListening ? <FiStopCircle size={24} className="text-white"/> : <FiMic size={24} className="text-white"/>}
                </button>

                <button 
                    onClick={handleAnswerSubmit}
                    disabled={loading || (!transcript && !codeSnippet)}
                    className="p-5 bg-green-600 rounded-full hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-600/50 transition-all transform hover:scale-105"
                >
                    <FiSend size={24} className="text-white"/>
                </button>
            </div>
        </div>
      </div>

      {/* RIGHT PANE: Video & Analysis */}
      <div className="w-[400px] flex flex-col gap-4">
        {/* User Camera */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-blue-500/30 shadow-2xl bg-black h-[250px]">
            <video ref={videoRef} autoPlay muted className="w-full h-full object-cover transform scale-x-[-1]" />
            <div className="absolute top-4 right-4 px-3 py-1 bg-red-600 rounded-full text-xs font-bold animate-pulse text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full"></span> LIVE
            </div>
        </div>

        {/* Live Feedback Panel */}
        <div className="flex-1 bg-gray-800 rounded-2xl p-6 border border-gray-700 overflow-y-auto shadow-xl flex flex-col">
            <h3 className="text-lg font-bold text-gray-300 mb-6 border-b border-gray-700 pb-4 flex items-center justify-between">
                <span>Real-time Feedback</span>
                <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-400">Turn {scoreHistory.length + 1}</span>
            </h3>
            
            {feedback.score !== null ? (
                <div className="space-y-6 animate-fade-in flex-1">
                    <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 flex items-center justify-between">
                        <span className="text-gray-400 font-medium">Score</span>
                        <span className={`text-4xl font-black ${
                            feedback.score >= 8 ? "text-green-400" : feedback.score >= 5 ? "text-yellow-400" : "text-red-400"
                        }`}>
                            {feedback.score}
                        </span>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Analysis</h4>
                        <p className="text-gray-300 text-sm leading-relaxed bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">{feedback.text}</p>
                    </div>

                    <div className="bg-blue-900/10 p-4 rounded-xl border border-blue-500/20">
                        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">💡 Ideal Answer</h4>
                        <p className="text-gray-400 text-sm italic leading-relaxed">"{feedback.ideal}"</p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-gray-700 rounded-full"></div>
                      <div className="w-16 h-16 border-4 border-t-blue-500 rounded-full absolute top-0 animate-spin"></div>
                    </div>
                    <p className="text-sm font-medium">Waiting for your first response...</p>
                </div>
            )}
        </div>
      </div>

    </div>
  );
}
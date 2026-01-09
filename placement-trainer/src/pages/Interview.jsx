// src/pages/Interview.jsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios"; // Ensure axios is installed
import { FiMic, FiStopCircle, FiSend } from "react-icons/fi";
import { useParams } from "react-router-dom"; // Assuming you use router

export default function Interview() {
  const [started, setStarted] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [config, setConfig] = useState({ type: "Technical", role: "", topic: "General" });
  
  const [messages, setMessages] = useState([]); // { role: "ai" | "user", content: "" }
  const [loading, setLoading] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  
  // Feedback State
  const [feedback, setFeedback] = useState({ score: null, ideal: "", text: "" });
  
  // Coding State
  const [isCodingMode, setIsCodingMode] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState("");

  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);
  const videoRef = useRef(null);

  // --- 1. Initialization ---
  useEffect(() => {
    // Speech Recognition Setup
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

  // --- 2. Start Interview ---
  const startInterview = async () => {
    if (!config.role) return alert("Please enter a Job Role");
    setLoading(true);
    try {
      // 1. Start Session in Backend
      // Replace '1' with actual logged-in user ID
      const res = await axios.post("http://localhost:8000/api/interview/start", {
        user_id: 1, 
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

  // --- 3. Interaction Loop ---
  const handleAnswerSubmit = async () => {
    // Combine voice transcript and code if applicable
    let finalAnswer = transcript;
    if (isCodingMode && codeSnippet) {
      finalAnswer += `\n[CODE_SUBMISSION]:\n${codeSnippet}`;
    }

    if (!finalAnswer.trim()) return;

    // Stop listening
    if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
    }

    // Add User Message to UI
    const newHistory = [...messages, { role: "user", content: finalAnswer }];
    setMessages(newHistory);
    setTranscript(""); 
    setCodeSnippet("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/interview/chat", {
        session_id: sessionId,
        user_input: finalAnswer,
        history: newHistory.map(m => ({ role: m.role, content: m.content })),
        is_code: isCodingMode
      });

      const data = res.data;

      // Update Feedback Panel
      setFeedback({
        score: data.score,
        ideal: data.ideal_answer,
        text: data.feedback
      });

      if (data.is_final) {
        setIsFinal(true);
        setMessages(prev => [...prev, { role: "ai", content: "Interview Complete! check your dashboard for the full report." }]);
        speak("Interview Complete! check your dashboard for the full report.");
      } else {
        // Handle Code Mode Trigger
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

  // --- Utilities ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false }); // Audio handled by SpeechRecog
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch(e) { console.error("Camera error", e); }
  };

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  // --- Render ---
  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white font-sans">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-blue-500 w-96">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">AI Interviewer</h1>
          
          <label className="block mb-2 text-sm text-gray-400">Target Role</label>
          <input 
            type="text" 
            placeholder="e.g. Frontend Developer"
            className="w-full p-3 bg-gray-700 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setConfig({...config, role: e.target.value})}
          />

          <div className="flex gap-4 mb-6">
            <button 
                onClick={() => setConfig({...config, type: "Technical"})}
                className={`flex-1 py-2 rounded-lg transition ${config.type === "Technical" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}
            >Technical</button>
            <button 
                onClick={() => setConfig({...config, type: "HR"})}
                className={`flex-1 py-2 rounded-lg transition ${config.type === "HR" ? "bg-purple-600" : "bg-gray-700 hover:bg-gray-600"}`}
            >HR Round</button>
          </div>

          <button 
            onClick={startInterview}
            disabled={!config.role || loading}
            className="w-full py-3 bg-green-500 hover:bg-green-600 text-black font-bold rounded-xl transition disabled:opacity-50"
          >
            {loading ? "Initializing..." : "Start Interview"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 text-white p-4 flex gap-4 overflow-hidden">
      
      {/* LEFT PANE: Chat & Inputs */}
      <div className="flex-1 flex flex-col bg-gray-800 rounded-2xl border border-gray-700 relative">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                msg.role === "user" 
                ? "bg-blue-600 text-white rounded-br-none" 
                : "bg-gray-700 text-gray-200 rounded-bl-none"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && <div className="text-gray-400 italic ml-4">AI is thinking...</div>}
        </div>

        {/* Inputs Area */}
        <div className="p-4 bg-gray-850 rounded-b-2xl border-t border-gray-700">
            {isCodingMode && (
                <div className="mb-4 animate-fade-in">
                    <div className="text-xs text-green-400 mb-1 font-mono">technical_mode_active: true</div>
                    <textarea 
                        value={codeSnippet}
                        onChange={(e) => setCodeSnippet(e.target.value)}
                        placeholder="// Write your code solution here..."
                        className="w-full h-32 bg-black text-green-400 font-mono p-3 rounded-lg border border-green-800 focus:border-green-500 outline-none resize-none"
                    />
                </div>
            )}

            <div className="flex items-center gap-4">
                <div className="flex-1 bg-gray-900 rounded-full px-6 py-4 flex items-center border border-gray-700">
                    <span className={`italic ${transcript ? "text-white" : "text-gray-500"}`}>
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
                    className={`p-4 rounded-full transition-all ${
                        isListening ? "bg-red-500 animate-pulse shadow-red-500/50" : "bg-blue-600 hover:bg-blue-500"
                    }`}
                >
                    {isListening ? <FiStopCircle size={24}/> : <FiMic size={24}/>}
                </button>

                <button 
                    onClick={handleAnswerSubmit}
                    disabled={loading || (!transcript && !codeSnippet)}
                    className="p-4 bg-green-600 rounded-full hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FiSend size={24}/>
                </button>
            </div>
        </div>
      </div>

      {/* RIGHT PANE: Video & Analysis */}
      <div className="w-[400px] flex flex-col gap-4">
        {/* User Camera */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-blue-500/30 shadow-lg bg-black">
            <video ref={videoRef} autoPlay muted className="w-full aspect-video object-cover transform scale-x-[-1]" />
            <div className="absolute top-4 right-4 px-3 py-1 bg-red-600 rounded-full text-xs font-bold animate-pulse">LIVE</div>
        </div>

        {/* Live Feedback Panel */}
        <div className="flex-1 bg-gray-800 rounded-2xl p-6 border border-gray-700 overflow-y-auto">
            <h3 className="text-xl font-bold text-blue-400 mb-4 border-b border-gray-700 pb-2">
                Live AI Feedback
            </h3>
            
            {feedback.score !== null ? (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-400">Last Answer Score</span>
                        <span className={`text-2xl font-bold ${
                            feedback.score >= 7 ? "text-green-400" : feedback.score >= 4 ? "text-yellow-400" : "text-red-400"
                        }`}>
                            {feedback.score}/10
                        </span>
                    </div>

                    <div>
                        <h4 className="text-sm text-gray-400 mb-1 uppercase tracking-wider">Analysis</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">{feedback.text}</p>
                    </div>

                    <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                        <h4 className="text-sm text-purple-400 mb-2 uppercase tracking-wider">Ideal Answer</h4>
                        <p className="text-gray-400 text-xs italic">{feedback.ideal}</p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
                    <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"/>
                    <p>Waiting for your first answer...</p>
                </div>
            )}
        </div>
      </div>

    </div>
  );
}
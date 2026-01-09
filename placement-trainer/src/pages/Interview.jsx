import React, { useState, useRef, useEffect } from "react";
import { processInterviewChat } from "../api";
import { FiMic, FiStopCircle, FiCode, FiUser } from "react-icons/fi";

export default function Interview() {
  const [started, setStarted] = useState(false);
  const [config, setConfig] = useState({ type: "Technical", role: "" });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // States for enhanced feedback
  const [feedback, setFeedback] = useState({ score: null, ideal: "", analysis: "" });
  const [isCodingMode, setIsCodingMode] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState("");

  // Speech & Media States
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.onresult = (e) => {
        let text = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          text += e.results[i][0].transcript;
        }
        setTranscript(text);
      };
    }
    if (started) startCamera();
  }, [started]);

  // 1. Add this useEffect inside your Interview component
useEffect(() => {
  if (started && messages.length === 0) {
    startInterview();
  }
}, [started]);

// 2. Add the startInterview function
const startInterview = async () => {
  setLoading(true);
  try {
    // We send an empty user_input or a "Hello" to trigger the first question
    const data = await processInterviewChat(
      [], 
      "I am ready to start the interview.", 
      null, 
      config.type, 
      config.topic
    );

    const aiText = data.next_question || data.response;
    setMessages([{ role: "ai", content: aiText }]);
    speak(aiText); // This makes the AI introduce itself and ask the first question

  } catch (err) {
    console.error("Failed to start interview:", err);
    setMessages([{ role: "ai", content: "Hello! I am your interviewer. Let's begin." }]);
  } finally {
    setLoading(false);
  }
};

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) videoRef.current.srcObject = stream;
  };

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleStopAndSubmit = async () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);

    const finalAnswer = isCodingMode ? codeSnippet : transcript;
    if (!finalAnswer) return;

    setLoading(true);
    setMessages(prev => [...prev, { role: "user", content: finalAnswer }]);

    try {
      const res = await processInterviewChat(messages, finalAnswer, null, config.type, config.role);
      const data = JSON.parse(res.response);

      setFeedback({
        score: data.score,
        ideal: data.ideal_answer,
        analysis: data.expression_analysis
      });

      setMessages(prev => [...prev, { role: "ai", content: data.next_question }]);
      speak(data.next_question);

      // Trigger coding mode if AI asks for code
      setIsCodingMode(data.next_question.includes("CODE_TASK:"));
      
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
      setTranscript("");
      setCodeSnippet("");
    }
  };

  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="bg-dark-card p-8 rounded-2xl border border-neon-blue w-96">
          <h2 className="text-2xl text-white mb-6">Interview Setup</h2>
          <input 
            type="text" placeholder="Enter Job Role (e.g. Java Developer)"
            className="w-full p-3 bg-black text-white rounded mb-4 border border-gray-700"
            onChange={(e) => setConfig({...config, role: e.target.value})}
          />
          <div className="flex gap-2 mb-6">
            <button onClick={() => setConfig({...config, type: "Technical"})}
              className={`flex-1 p-2 rounded ${config.type === "Technical" ? "bg-neon-blue text-black" : "border text-white"}`}>Technical</button>
            <button onClick={() => setConfig({...config, type: "HR"})}
              className={`flex-1 p-2 rounded ${config.type === "HR" ? "bg-neon-blue text-black" : "border text-white"}`}>HR Round</button>
          </div>
          <button onClick={() => setStarted(true)} disabled={!config.role}
            className="w-full py-3 bg-neon-green text-black font-bold rounded-xl disabled:opacity-50">Start Interview</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen p-4 flex gap-4 text-white">
      {/* LEFT: Chat & Code Area */}
      <div className="flex-1 flex flex-col bg-dark-card rounded-2xl border border-gray-800 p-6">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`p-4 rounded-xl max-w-[80%] ${msg.role === "user" ? "bg-neon-blue text-black" : "bg-gray-800"}`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {isCodingMode && (
          <textarea 
            className="w-full h-48 bg-black p-4 font-mono text-green-400 border border-neon-blue rounded-xl mb-4"
            placeholder="Type your code here..."
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
          />
        )}

        <div className="flex items-center gap-4">
          <p className="flex-1 italic text-gray-400">{transcript || "Your speech will appear here..."}</p>
          {!isListening ? (
            <button onClick={() => {setIsListening(true); recognitionRef.current.start();}} className="p-4 bg-neon-blue rounded-full text-black"><FiMic size={24}/></button>
          ) : (
            <button onClick={handleStopAndSubmit} className="p-4 bg-red-500 rounded-full animate-pulse"><FiStopCircle size={24}/></button>
          )}
        </div>
      </div>

      {/* RIGHT: Video & Feedback */}
      <div className="w-1/3 flex flex-col gap-4">
        <video ref={videoRef} autoPlay muted className="w-full rounded-2xl border-2 border-neon-blue aspect-video object-cover" />
        
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 flex-1 overflow-y-auto">
          <h3 className="font-bold text-neon-purple mb-2">Evaluation Panel</h3>
          {feedback.score !== null && (
            <div className="space-y-4">
              <div className="text-2xl font-bold">Score: {feedback.score}/10</div>
              <div>
                <p className="text-sm text-gray-400">Ideal Answer:</p>
                <p className="text-neon-green text-sm italic">{feedback.ideal}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Analysis:</p>
                <p className="text-sm">{feedback.analysis}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
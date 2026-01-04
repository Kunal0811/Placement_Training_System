import React, { useState, useRef, useEffect } from "react";
import { processInterviewChat } from "../api";
import { FiMic, FiStopCircle } from "react-icons/fi";

const INTERVIEW_TYPES = [
  { id: "HR", name: "HR Round", topics: ["Introduction", "Strengths", "Why us?"] },
  { id: "Technical", name: "Technical", topics: ["Java", "React", "Python", "DSA"] },
  { id: "Behavioral", name: "Behavioral", topics: ["Leadership", "Conflict", "Challenges"] },
];

export default function Interview() {
  const [started, setStarted] = useState(false);
  const [config, setConfig] = useState({ type: "HR", topic: "Introduction" });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Media & AI State
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState(""); // For real-time visual feedback
  const [expressionFeedback, setExpressionFeedback] = useState("");
  
  // Refs
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const chatContainerRef = useRef(null);

  // --- 1. Initialize Speech Recognition Safely ---
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => {
        console.log("Mic is on");
        setIsListening(true);
      };

      recognitionRef.current.onend = () => {
        console.log("Mic stopped");
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech Error:", event.error);
        if (event.error === "not-allowed") {
          alert("Microphone access blocked. Please allow permissions in your browser settings.");
        }
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event) => {
        let final = "";
        let interim = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (final) {
          setTranscript((prev) => prev + " " + final);
          setInterimText(""); // Clear interim when final is added
        } else {
          setInterimText(interim);
        }
      };
    } else {
      console.warn("Browser does not support Speech Recognition.");
    }
  }, []);

  // --- 2. Auto-scroll Chat ---
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, interimText]);

  // --- 3. Camera Handling ---
  useEffect(() => {
    if (started) startCamera();
    return () => stopCamera();
  }, [started]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera Error:", err);
      alert("Could not access camera. Ensure permissions are granted.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const captureImage = () => {
    if (!videoRef.current) return null;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    return canvas.toDataURL("image/jpeg");
  };

  const handleStartListening = () => {
    if (!recognitionRef.current) {
      alert("Your browser does not support Speech Recognition. Try Google Chrome.");
      return;
    }
    setTranscript("");
    setInterimText("");
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error("Start error:", e); // Handle case where it's already started
    }
  };

  const handleStopAndSubmit = async () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
    
    // Combine final transcript with any lingering interim text
    const finalAnswer = (transcript + " " + interimText).trim();
    if (!finalAnswer) return;

    setLoading(true);

    // Add user message immediately
    const userMsg = { role: "user", content: finalAnswer };
    setMessages((prev) => [...prev, userMsg]);

    const imageBase64 = captureImage();

    try {
      const data = await processInterviewChat(
        messages, 
        finalAnswer, 
        imageBase64, 
        config.type, 
        config.topic
      );

      const aiText = data.next_question || data.response;
      setExpressionFeedback(data.expression_analysis || "Analysis complete.");
      
      setMessages((prev) => [...prev, { role: "ai", content: aiText }]);
      speak(aiText);

    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "ai", content: "Error connecting to AI." }]);
    } finally {
      setLoading(false);
      setTranscript("");
      setInterimText("");
    }
  };

  if (!started) {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8 text-white text-glow">Setup Video Interview</h1>
        <div className="bg-dark-card p-8 rounded-2xl border border-neon-blue/20 w-full max-w-md">
           <label className="block text-gray-400 mb-2">Type</label>
           <div className="flex gap-2 mb-4">
             {INTERVIEW_TYPES.map(t => (
               <button key={t.id} onClick={() => setConfig({...config, type: t.id, topic: t.topics[0]})}
                 className={`flex-1 p-2 rounded border ${config.type === t.id ? 'bg-neon-blue text-black' : 'border-gray-600 text-gray-300'}`}>
                 {t.name}
               </button>
             ))}
           </div>
           
           <label className="block text-gray-400 mb-2">Topic</label>
           <select className="w-full p-2 bg-dark-bg text-white rounded border border-gray-600 mb-6"
             onChange={(e) => setConfig({...config, topic: e.target.value})}>
             {INTERVIEW_TYPES.find(t => t.id === config.type).topics.map(t => <option key={t}>{t}</option>)}
           </select>

           <button onClick={() => setStarted(true)} className="w-full py-3 bg-neon-green text-black font-bold rounded-xl hover:scale-105 transition-all">
             Enter Interview Room
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] p-4 flex gap-4 max-w-7xl mx-auto">
      {/* Left: AI & Chat */}
      <div className="flex-1 flex flex-col bg-dark-card rounded-2xl border border-gray-700 overflow-hidden">
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && <div className="text-gray-500 text-center mt-10">Press the mic to start speaking...</div>}
          
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`p-4 rounded-xl max-w-[80%] ${msg.role === "user" ? "bg-neon-blue text-black" : "bg-gray-800 text-gray-200"}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && <div className="text-neon-blue animate-pulse">AI is thinking...</div>}
        </div>
      </div>

      {/* Right: Video & Controls */}
      <div className="w-1/3 flex flex-col gap-4">
        <div className="relative bg-black rounded-2xl overflow-hidden border-2 border-neon-blue h-64">
           <video ref={videoRef} autoPlay muted className="w-full h-full object-cover transform scale-x-[-1]" />
           <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-neon-green flex items-center gap-2">
             <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> Live
           </div>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl border border-gray-700">
          <h3 className="text-sm font-bold text-gray-400 mb-1">AI Expression Analysis</h3>
          <p className="text-neon-purple text-lg font-medium">{expressionFeedback || "Waiting for input..."}</p>
        </div>

        <div className="bg-dark-card p-6 rounded-2xl border border-gray-700 flex flex-col items-center justify-center gap-4 flex-1">
           <div className="text-center mb-2 w-full">
             <p className="text-gray-400 text-sm mb-2">Live Transcript:</p>
             <p className="text-white italic min-h-[40px] border border-gray-800 p-2 rounded bg-black/30 w-full">
               {transcript} <span className="text-gray-400">{interimText}</span>
             </p>
           </div>

           {!isListening ? (
             <button onClick={handleStartListening} className="w-16 h-16 rounded-full bg-neon-blue text-black flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,255,255,0.5)]">
               <FiMic size={32} />
             </button>
           ) : (
             <button onClick={handleStopAndSubmit} className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform animate-pulse">
               <FiStopCircle size={32} />
             </button>
           )}
           <p className="text-sm text-gray-500">{isListening ? "Listening... (Speak clearly)" : "Click Mic to Speak"}</p>
        </div>
      </div>
    </div>
  );
}
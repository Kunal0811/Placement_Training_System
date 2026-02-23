import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Send, User, CheckCircle, AlertTriangle, 
  BarChart2, Zap, BrainCircuit, Video, VideoOff, Phone, 
  Briefcase, Code, Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- MOCK INTERVIEW QUESTIONS ---
const STAGE_1_QUESTIONS = [
  "Tell me about yourself.",
  "Why did you choose this field?",
  "What are your key strengths?"
];

const STAGE_2_QUESTIONS = [
  "Can you explain a complex technical concept or project you've worked on recently?",
  "How do you approach solving a difficult problem when you are stuck?",
  "How do you ensure your code or work is of high quality and error-free?"
];

const STAGE_3_QUESTIONS = [
  "Describe a challenging situation and how you handled it.",
  "What is your biggest weakness?",
  "Why should we hire you for this role?"
];

export default function Interview() {
  const [sessionState, setSessionState] = useState('setup'); 
  const [role, setRole] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  
  const [isListening, setIsListening] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [isAITalking, setIsAITalking] = useState(false);
  const [stage, setStage] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAITalking]);

  // Load Voices (fixes an issue where voices don't load immediately)
  useEffect(() => {
    window.speechSynthesis.getVoices();
    return () => {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
        }
    }
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      localStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  };

  // --- FIXED TEXT TO SPEECH ---
  const speakTextAsync = (text) => {
    return new Promise((resolve) => {
        const synth = window.speechSynthesis;
        if (!synth) return resolve();
        
        synth.cancel(); 
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.volume = 1; // Force max volume
        
        // Fetch voices fresh to guarantee they are loaded
        const voices = synth.getVoices();
        if (voices.length > 0) {
            utterance.voice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Aria') || v.name.includes('Female')) || voices[0];
        }
        
        utterance.pitch = 1.0; 
        utterance.rate = 1.05;

        utterance.onstart = () => setIsAITalking(true);
        utterance.onend = () => { setIsAITalking(false); resolve(); };
        utterance.onerror = (e) => { 
            console.error("Voice Error: ", e); 
            setIsAITalking(false); 
            resolve(); 
        };
        
        synth.speak(utterance);
    });
  };

  const processNextAIResponse = async () => {
      setIsAITalking(true);
      setLoading(true);
      await new Promise(r => setTimeout(r, 400)); 
      setLoading(false);

      let nextMessage = "";
      let newStage = stage;
      let newIndex = questionIndex + 1;

      if (stage === 1 && questionIndex === 2) {
          nextMessage = "Thank you. Your introduction was clear, and your confidence is solid. Try to keep your answers slightly more concise. Let’s move to the Technical Round. " + STAGE_2_QUESTIONS[0];
          newStage = 2;
          newIndex = 0;
      } else if (stage === 2 && questionIndex === 2) {
          nextMessage = "Great technical insights. You explain concepts well, but try to mention specific tools or languages you used next time. Now we’ll move to the final Behavioral round. " + STAGE_3_QUESTIONS[0];
          newStage = 3;
          newIndex = 0;
      } else if (stage === 3 && questionIndex === 2) {
          endSession();
          return;
      } else {
          if (stage === 1) nextMessage = STAGE_1_QUESTIONS[newIndex];
          else if (stage === 2) nextMessage = STAGE_2_QUESTIONS[newIndex];
          else if (stage === 3) nextMessage = STAGE_3_QUESTIONS[newIndex];
      }

      setMessages(prev => [...prev, { sender: "Interviewer", text: nextMessage }]);
      setStage(newStage);
      setQuestionIndex(newIndex);
      
      await speakTextAsync(nextMessage);
  };

  const startInterview = async () => {
    if (!role.trim()) return alert("Please enter the role you are interviewing for.");
    
    // --- BROWSER AUDIO UNLOCK HACK ---
    // This empty speech fires immediately on click, unlocking the browser's audio engine
    const synth = window.speechSynthesis;
    if (synth) {
        const unlock = new SpeechSynthesisUtterance('');
        unlock.volume = 0;
        synth.speak(unlock);
    }

    setSessionState('active');
    startCamera();

    const introText = `Hello, and welcome to your interview for the ${role} position. We will have a structured 3-stage process today. Let's begin. ${STAGE_1_QUESTIONS[0]}`;
    
    // Removed the artificial delay here so the browser doesn't block the audio!
    setMessages([{ sender: "Interviewer", text: introText }]);
    await speakTextAsync(introText);
  };

  const handleSend = async () => {
    if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
    }

    if (!input.trim()) return;
    
    const textToSend = input;
    setMessages(prev => [...prev, { sender: "Student", text: textToSend }]);
    setInput(""); 
    
    await processNextAIResponse();
  };

  const endSession = () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (localStreamRef.current) localStreamRef.current.getTracks().forEach(t => t.stop());
      
      setFeedback({
          overallScore: 8.5,
          recommendation: "Strong Hire",
          strengths: [
              "Very clear and professional communication style.", 
              "Structured answers using the STAR method.", 
              "Strong technical foundations for the requested role."
          ],
          improvements: [
              "Could provide more quantifiable metrics in your examples (e.g., 'increased speed by 20%').", 
              "Slight hesitation when discussing weaknesses—be more direct."
          ]
      });
      setSessionState('feedback');
  };

  const toggleListening = () => {
    if (isAITalking) return; 

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Your browser does not support the microphone here.");
    
    if (isListening) {
        recognitionRef.current?.stop();
        setIsListening(false);
        return;
    }

    if (window.speechSynthesis) window.speechSynthesis.cancel(); 
    
    const recognition = new SpeechRecognition();
    recognition.continuous = true; 
    recognition.interimResults = true; 
    
    let currentTranscript = input; 

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (e) => {
        let final = '';
        let interim = '';
        for (let i = e.resultIndex; i < e.results.length; ++i) {
            if (e.results[i].isFinal) final += e.results[i][0].transcript;
            else interim += e.results[i][0].transcript;
        }
        setInput(currentTranscript + final + interim);
        if (final) currentTranscript += final;
    };
    
    recognition.onerror = (e) => {
        console.error(e.error);
        setIsListening(false);
    };

    recognition.onend = () => {
        setIsListening(false);
    };
    
    recognitionRef.current = recognition;
    recognition.start();
  };

  if (sessionState === 'setup') {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 text-white relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse-soft"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] -z-10 animate-pulse-soft delay-500"></div>

        <div className="max-w-2xl w-full glass-panel p-10 rounded-3xl border border-white/10 shadow-2xl relative bg-[#1E293B]/80 backdrop-blur-xl">
          <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-mono mb-4 border border-primary/20">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div> Fast AI Engine
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Mock <span className="text-primary">Interview</span></h1>
              <p className="text-gray-400">A structured 3-stage voice interview. The AI will listen patiently until you click send.</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Target Job Role</label>
              <input 
                type="text" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Frontend Developer, Data Analyst"
                className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-4 px-5 focus:outline-none focus:border-primary transition-all text-lg"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                    <Briefcase className="mx-auto text-primary mb-2" />
                    <h4 className="text-xs font-bold text-gray-300 uppercase">Stage 1</h4>
                    <p className="text-[10px] text-gray-500 mt-1">Background</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                    <Code className="mx-auto text-secondary mb-2" />
                    <h4 className="text-xs font-bold text-gray-300 uppercase">Stage 2</h4>
                    <p className="text-[10px] text-gray-500 mt-1">Technical</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                    <Users className="mx-auto text-emerald-400 mb-2" />
                    <h4 className="text-xs font-bold text-gray-300 uppercase">Stage 3</h4>
                    <p className="text-[10px] text-gray-500 mt-1">Behavioral</p>
                </div>
            </div>

            <button 
              onClick={startInterview}
              className="w-full mt-4 py-4 bg-primary hover:bg-primary-hover text-white font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all hover:-translate-y-1"
            >
              Start Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (sessionState === 'feedback' && feedback) {
      return (
        <div className="min-h-screen bg-[#0F172A] p-6 flex items-center justify-center text-white overflow-y-auto pt-20">
            <div className="max-w-4xl w-full glass-panel p-10 rounded-3xl border border-white/10 shadow-2xl bg-[#1E293B]/80 backdrop-blur-xl relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary"></div>
                
                <h2 className="text-4xl font-display font-bold mb-8 text-center flex items-center justify-center gap-3">
                    <BarChart2 className="text-primary" size={40} /> Interview Results
                </h2>

                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-black/30 border border-white/10 p-6 rounded-2xl text-center">
                        <p className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Overall Score</p>
                        <div className="text-5xl font-display font-bold text-primary">{feedback.overallScore}<span className="text-2xl text-gray-500">/10</span></div>
                    </div>
                    <div className="bg-black/30 border border-white/10 p-6 rounded-2xl text-center flex flex-col items-center justify-center">
                        <p className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">AI Recommendation</p>
                        <div className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xl border border-emerald-500/30">
                            {feedback.recommendation}
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-10">
                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-2xl">
                        <h3 className="text-primary font-bold text-lg mb-4 flex items-center gap-2"><CheckCircle size={20}/> Top Strengths</h3>
                        <ul className="space-y-3">
                            {feedback.strengths.map((s, i) => (
                                <li key={i} className="text-gray-300 flex items-start gap-2 text-sm">
                                    <span className="text-primary mt-1">•</span> {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-warning/10 border border-warning/20 p-6 rounded-2xl">
                        <h3 className="text-warning font-bold text-lg mb-4 flex items-center gap-2"><AlertTriangle size={20}/> Areas to Improve</h3>
                        <ul className="space-y-3">
                            {feedback.improvements.map((s, i) => (
                                <li key={i} className="text-gray-300 flex items-start gap-2 text-sm">
                                    <span className="text-warning mt-1">•</span> {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex justify-center">
                    <Link to="/dashboard" className="px-10 py-4 bg-white/10 text-white font-bold rounded-xl shadow-lg hover:bg-white/20 transition-all border border-white/20">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="h-screen w-full bg-[#0F172A] text-white flex flex-col font-sans overflow-hidden">
      
      <div className="h-14 flex items-center justify-between px-6 bg-[#1E293B]/50 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
            <span className="font-bold text-lg flex items-center gap-2">
                <BrainCircuit size={18} className="text-primary" /> 
                AI <span className="text-primary">Interviewer</span>
            </span>
            <div className="h-4 w-px bg-white/20 hidden md:block"></div>
            <span className="text-gray-400 text-sm max-w-md truncate hidden md:block">Role: {role}</span>
        </div>
        
        <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded text-xs font-bold ${stage === 1 ? 'bg-primary text-white' : 'bg-gray-800 text-gray-500'}`}>1. Intro</span>
            <span className={`px-3 py-1 rounded text-xs font-bold ${stage === 2 ? 'bg-secondary text-white' : 'bg-gray-800 text-gray-500'}`}>2. Technical</span>
            <span className={`px-3 py-1 rounded text-xs font-bold ${stage === 3 ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-500'}`}>3. Behavioral</span>
            
            <button onClick={endSession} className="ml-4 px-4 py-1.5 bg-danger/20 text-danger border border-danger/50 rounded-lg text-sm font-bold hover:bg-danger hover:text-white transition-colors">
                End Early
            </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-4 gap-4">
        
        <div className="w-full md:w-[45%] lg:w-[50%] flex flex-col gap-4 h-full">
            <div className={`flex-1 relative rounded-3xl overflow-hidden bg-black/40 border-2 transition-all duration-500 flex flex-col items-center justify-center min-h-[200px]
                ${isAITalking ? `border-primary shadow-[0_0_30px_rgba(59,130,246,0.2)]` : 'border-white/5'}
            `}>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0F172A]/80 z-0"></div>
                <div className={`w-28 h-28 lg:w-32 lg:h-32 rounded-full flex items-center justify-center transition-transform duration-500 bg-primary z-10 shadow-2xl
                    ${isAITalking ? 'scale-110 animate-pulse-soft shadow-[0_0_40px_rgba(59,130,246,0.6)]' : ''}`}>
                    <BrainCircuit size={50} className="text-white" />
                </div>
                <div className="absolute bottom-4 z-10 text-center">
                    <h3 className="font-bold text-lg mb-0.5">HR Manager</h3>
                    <p className="text-primary font-mono text-xs uppercase tracking-wider">AI System</p>
                </div>
                {isAITalking && (
                    <div className="absolute top-4 right-4 flex gap-1 items-center h-6 z-10">
                        <div className="w-1.5 bg-primary rounded-full animate-[ping_1s_ease-in-out_infinite] h-3"></div>
                        <div className="w-1.5 bg-primary rounded-full animate-[ping_1.2s_ease-in-out_infinite] h-6"></div>
                        <div className="w-1.5 bg-primary rounded-full animate-[ping_0.8s_ease-in-out_infinite] h-4"></div>
                    </div>
                )}
            </div>

            <div className="flex-1 relative rounded-3xl overflow-hidden bg-black border-2 border-white/10 shadow-lg min-h-[200px]">
                {!isVideoOff ? (
                    <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                        <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-xl font-bold">YOU</div>
                    </div>
                )}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2">
                    {isListening ? <Mic size={12} className="text-primary animate-pulse"/> : <MicOff size={12} className="text-gray-400"/>}
                    You
                </div>
                <button onClick={() => setIsVideoOff(!isVideoOff)} className="absolute top-3 right-3 p-2 rounded-lg bg-black/60 hover:bg-white/20 transition-colors text-gray-300">
                    {isVideoOff ? <VideoOff size={16} /> : <Video size={16} />}
                </button>
            </div>
        </div>

        <div className="w-full md:w-[55%] lg:w-[50%] h-full bg-[#1E293B]/80 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20 shrink-0">
                <h3 className="font-bold flex items-center gap-2"><Zap className="text-primary" size={18}/> Interview Transcript</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                {messages.map((msg, i) => (
                    <div key={i} className="animate-fade-in-up">
                        <span className={`text-xs font-bold uppercase tracking-wider mb-1 block ${msg.sender === 'Interviewer' ? 'text-primary' : 'text-gray-400'}`}>
                            {msg.sender}
                        </span>
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed border ${
                            msg.sender === 'Student' 
                              ? 'bg-white/10 border-white/20 text-white rounded-tr-none' 
                              : 'bg-primary/10 border-primary/30 text-white rounded-tl-none'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                
                {loading && (
                    <div className="flex gap-2 items-center text-gray-500 text-sm p-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                        <span className="ml-2">Interviewer is evaluating...</span>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
        </div>
      </div>

      <div className="w-full bg-[#0F172A] border-t border-white/10 p-4 flex justify-center shrink-0">
        <div className="w-full max-w-5xl flex items-end gap-3 relative group">
            
            <button 
                onClick={toggleListening}
                disabled={isAITalking || loading}
                className={`p-4 rounded-2xl transition-all shadow-lg flex-shrink-0
                    ${isListening ? 'bg-danger text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
                    : isAITalking ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-primary text-white hover:bg-primary-hover shadow-primary-glow'}`}
                title={isListening ? "Click to Stop Listening" : "Click to Start Listening"}
            >
                {isListening ? <Mic size={24} /> : <MicOff size={24} />}
            </button>
            
            <div className={`flex-1 bg-black/60 border border-white/20 rounded-2xl p-2 flex items-center transition-all
                ${isAITalking ? 'opacity-50' : 'focus-within:border-primary focus-within:shadow-[0_0_15px_rgba(59,130,246,0.3)]'}`}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isAITalking ? "Wait for the interviewer..." : isListening ? "Listening... take your time. Click Send when done." : "Click the Mic to speak, or type your answer..."}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-gray-400 px-4 h-12"
                    disabled={loading || isAITalking}
                />
                
                <button 
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading || isAITalking}
                    className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2
                        ${!input.trim() || loading || isAITalking ? 'bg-white/10 text-gray-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-hover'}`}
                >
                    <Send size={18} /> <span className="hidden sm:inline">Send Answer</span>
                </button>
            </div>
        </div>
      </div>

    </div>
  );
}
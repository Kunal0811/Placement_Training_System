import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Send, User, CheckCircle, AlertTriangle, 
  BarChart2, Zap, BrainCircuit, ShieldAlert, Sparkles, Volume2, Timer
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- BOT PROFILES ---
const PARTICIPANTS = {
  "Student": { id: "Student", name: "You", role: "Candidate", color: "bg-primary", border: "border-primary", text: "text-primary", icon: <User size={40} className="text-white" /> },
  "Supportive Bot": { id: "Supportive Bot", name: "Moderator", role: "Friendly Guide", color: "bg-blue-500", border: "border-blue-500", text: "text-blue-400", icon: <BrainCircuit size={40} className="text-white" /> },
  "Positive Bot": { id: "Positive Bot", name: "Innovator", role: "Happy & Positive", color: "bg-emerald-500", border: "border-emerald-500", text: "text-emerald-400", icon: <Sparkles size={40} className="text-white" /> },
  "Negative Bot": { id: "Negative Bot", name: "Critic", role: "Cautious & Safe", color: "bg-rose-500", border: "border-rose-500", text: "text-rose-400", icon: <ShieldAlert size={40} className="text-white" /> }
};

// --- VERY SIMPLE, NON-REPEATING CONVERSATION POINTS ---
const POSITIVE_POINTS = [
    "I think this is a great idea. It will make our work much faster and easier.",
    "Also, it will help people connect from anywhere in the world. It brings us together.",
    "This will create many new jobs. People will learn new skills and make more money.",
    "It is very cheap to use once it is built. It saves a lot of money.",
    "Machines don't get tired. This will stop human mistakes and keep things running smoothly."
];

const NEGATIVE_POINTS = [
    "But what about our privacy? I worry that bad people might steal our personal data.",
    "I disagree. Many people might lose their current jobs because machines will do the work.",
    "It might not be fair to everyone. Only rich people or big companies might be able to use it.",
    "Using all these machines takes too much electricity. It is very bad for the environment.",
    "What happens if the internet goes down? If we rely on this too much, we will be stuck."
];

const MODERATOR_PROMPTS = [
    "We have two different sides here. Student, what do you think is the best answer?",
    "One side says it helps, the other side says it hurts. Student, how can we fix this?",
    "Those are good points. Student, what is the safest way to use this new technology?",
    "Student, do you agree more with the good things or the bad things they just said?",
    "Very interesting talk! Student, if you were the boss, how would you solve this problem?"
];

export default function GD() {
  const [sessionState, setSessionState] = useState('setup'); 
  const [topic, setTopic] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isBotsTalking, setIsBotsTalking] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  
  // 5 Minute Global Timer State (300 seconds)
  const [timeLeft, setTimeLeft] = useState(300);

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const sessionTimerRef = useRef(null);
  const conversationIndex = useRef(0);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeSpeaker]);

  // Load High-Quality Browser Voices
  useEffect(() => {
    const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) setAvailableVoices(voices);
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        clearTimeout(inactivityTimerRef.current);
        clearInterval(sessionTimerRef.current);
    }
  }, []);

  // --- 5 MINUTE GLOBAL TIMER ---
  useEffect(() => {
    if (sessionState === 'active' && timeLeft > 0) {
        sessionTimerRef.current = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
    } else if (timeLeft === 0 && sessionState === 'active') {
        endSession(); // Auto-end when time is up
    }
    return () => clearInterval(sessionTimerRef.current);
  }, [sessionState, timeLeft]);

  // Format time (e.g. 04:59)
  const formatTime = (seconds) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // --- 20-SECOND INACTIVITY TIMER ---
  const startInactivityTimer = () => {
    clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
        if (timeLeft > 10) handleTimeoutSequence(); // Only run if we have more than 10s left
    }, 20000); // Changed to 20 seconds
  };

  const stopInactivityTimer = () => {
    clearTimeout(inactivityTimerRef.current);
  };

  // --- ASYNC TEXT TO SPEECH (Finds the most human voices) ---
  const speakTextAsync = (text, botName) => {
    return new Promise((resolve) => {
        const synth = window.speechSynthesis;
        if (!synth) return resolve();
        
        synth.cancel(); 
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Find best human-like voices (Google Online or Microsoft Neural usually)
        if (availableVoices.length > 0) {
            if (botName === 'Supportive Bot') {
                utterance.voice = availableVoices.find(v => v.name.includes('Google US English') || v.name.includes('Aria') || v.name.includes('Female')) || availableVoices[0];
                utterance.pitch = 1.0; utterance.rate = 1.0;
            } else if (botName === 'Positive Bot') {
                utterance.voice = availableVoices.find(v => v.name.includes('Guy') || v.name.includes('Male') || v.name.includes('David')) || availableVoices[1 % availableVoices.length];
                utterance.pitch = 1.1; utterance.rate = 1.05; 
            } else if (botName === 'Negative Bot') {
                utterance.voice = availableVoices.find(v => v.name.includes('UK English') || v.name.includes('George') || v.name.includes('Daniel')) || availableVoices[2 % availableVoices.length];
                utterance.pitch = 0.9; utterance.rate = 0.95; 
            }
        }

        utterance.onstart = () => setActiveSpeaker(botName);
        utterance.onend = () => { setActiveSpeaker(null); resolve(); };
        utterance.onerror = () => { setActiveSpeaker(null); resolve(); };
        
        synth.speak(utterance);
    });
  };

  // --- BOT CONVERSATION SEQUENCE ---
  const runBotSequence = async () => {
      setIsBotsTalking(true);
      stopInactivityTimer();

      const idx = conversationIndex.current % 5; 
      const pText = POSITIVE_POINTS[idx];
      const nText = NEGATIVE_POINTS[idx];
      const mText = MODERATOR_PROMPTS[idx];

      const firstBot = idx % 2 === 0 ? "Positive Bot" : "Negative Bot";
      const firstText = idx % 2 === 0 ? pText : nText;
      
      setActiveSpeaker(firstBot);
      await new Promise(r => setTimeout(r, 1000));
      if (sessionState !== 'active') return; // stop if session ended
      setMessages(prev => [...prev, { sender: firstBot, text: firstText }]);
      await speakTextAsync(firstText, firstBot);

      const secondBot = idx % 2 === 0 ? "Negative Bot" : "Positive Bot";
      const secondText = idx % 2 === 0 ? nText : pText;

      setActiveSpeaker(secondBot);
      await new Promise(r => setTimeout(r, 800));
      setMessages(prev => [...prev, { sender: secondBot, text: secondText }]);
      await speakTextAsync(secondText, secondBot);

      setActiveSpeaker("Supportive Bot");
      await new Promise(r => setTimeout(r, 800));
      setMessages(prev => [...prev, { sender: "Supportive Bot", text: mText }]);
      await speakTextAsync(mText, "Supportive Bot");

      conversationIndex.current += 1; 

      setIsBotsTalking(false);
      startInactivityTimer();
  };

  // --- 20s INACTIVITY EVENT ---
  const handleTimeoutSequence = async () => {
      setIsBotsTalking(true);
      
      // Specifically ask another bot to continue the conversation about the topic
      const timeoutMsg = "Since the Student is thinking, let's keep going. Innovator, what is another point related to this topic?";
      
      setMessages(prev => [...prev, { sender: "Supportive Bot", text: timeoutMsg }]);
      await speakTextAsync(timeoutMsg, "Supportive Bot");
      await runBotSequence(); 
  };

  // --- START DISCUSSION ---
  const startGD = async () => {
    if (!topic.trim()) return alert("Please type a topic first.");
    setSessionState('active');
    setTimeLeft(300); // Reset timer to 5 minutes
    setIsBotsTalking(true);

    const introText = `Hi everyone! Today we are talking about: ${topic}. Let's keep it friendly and use simple words. Student, what are your first thoughts?`;
    
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    
    setMessages([{ sender: "Supportive Bot", text: introText }]);
    await speakTextAsync(introText, "Supportive Bot");
    
    setIsBotsTalking(false);
    startInactivityTimer(); 
  };

  // --- SEND MESSAGE ---
  const handleSend = async (overrideText = null) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim()) return;
    
    stopInactivityTimer();
    setMessages(prev => [...prev, { sender: "Student", text: textToSend }]);
    setInput("");
    await runBotSequence();
  };

  // --- END SESSION & SHOW FEEDBACK ---
  const endSession = () => {
      stopInactivityTimer();
      clearInterval(sessionTimerRef.current);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      
      // Simple, Voice-Confidence focused feedback
      setFeedback({
          strengths: [
              "You spoke very clearly and loudly.", 
              "You stayed calm when the Negative Bot disagreed.", 
              "Your ideas were very easy to understand."
          ],
          improvements: [
              "Try to speak a little faster so you sound more confident.", 
              "Use 'I believe' instead of 'I guess' to show strong Voice Confidence.",
              "Give one real-life example next time to prove your point."
          ],
          confidence: 8,
          clarity: 9
      });
      setSessionState('feedback');
  };

  // --- LAPTOP MIC ---
  const handleVoiceInput = () => {
    if (isBotsTalking) return; 
    stopInactivityTimer(); 

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Your browser does not support the microphone here.");
    
    if (window.speechSynthesis) window.speechSynthesis.cancel(); 
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false; 
    recognition.interimResults = true; 
    
    let finalTranscript = '';

    recognition.onstart = () => {
        setIsListening(true);
        setActiveSpeaker("Student");
    };
    
    recognition.onresult = (e) => {
        let interim = '';
        for (let i = e.resultIndex; i < e.results.length; ++i) {
            if (e.results[i].isFinal) finalTranscript += e.results[i][0].transcript;
            else interim += e.results[i][0].transcript;
        }
        setInput(finalTranscript + interim);
    };
    
    recognition.onend = () => {
        setIsListening(false);
        setActiveSpeaker(null);
        if (finalTranscript.trim() !== '') {
            handleSend(finalTranscript); 
        } else {
            startInactivityTimer(); 
        }
    };
    
    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleInputChange = (e) => {
      setInput(e.target.value);
      startInactivityTimer(); 
  };

  // ==========================================
  // VIEW 1: SETUP
  // ==========================================
  if (sessionState === 'setup') {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 text-white relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse-soft"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] -z-10 animate-pulse-soft delay-500"></div>

        <div className="max-w-2xl w-full glass-panel p-10 rounded-3xl border border-white/10 shadow-2xl relative bg-[#1E293B]/80 backdrop-blur-xl">
          <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">AI Group <span className="text-primary">Discussion</span></h1>
              <p className="text-gray-400">Speak naturally. The AI bots have human-like voices and use simple words. The session lasts for exactly 5 minutes.</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">What do you want to talk about?</label>
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Are robots going to take our jobs?"
                className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-4 px-5 focus:outline-none focus:border-primary transition-all text-lg"
              />
            </div>

            <button 
              onClick={startGD}
              className="w-full mt-4 py-4 bg-primary hover:bg-primary-hover text-white font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all hover:-translate-y-1"
            >
              Start 5-Minute Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: FEEDBACK SCREEN
  // ==========================================
  if (sessionState === 'feedback' && feedback) {
      return (
        <div className="min-h-screen bg-[#0F172A] p-6 flex items-center justify-center text-white overflow-y-auto pt-20">
            <div className="max-w-4xl w-full glass-panel p-10 rounded-3xl border border-white/10 shadow-2xl bg-[#1E293B]/80 backdrop-blur-xl relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary"></div>
                
                <h2 className="text-4xl font-display font-bold mb-8 text-center flex items-center justify-center gap-3">
                    <BarChart2 className="text-primary" size={40} /> Discussion Feedback
                </h2>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl">
                        <h3 className="text-emerald-400 font-bold text-lg mb-4 flex items-center gap-2"><CheckCircle size={20}/> What You Did Well</h3>
                        <ul className="space-y-3">
                            {feedback.strengths.map((s, i) => (
                                <li key={i} className="text-gray-300 flex items-start gap-2 text-sm">
                                    <span className="text-emerald-500 mt-1">•</span> {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-2xl">
                        <h3 className="text-rose-400 font-bold text-lg mb-4 flex items-center gap-2"><AlertTriangle size={20}/> How to Improve (Voice Confidence)</h3>
                        <ul className="space-y-3">
                            {feedback.improvements.map((s, i) => (
                                <li key={i} className="text-gray-300 flex items-start gap-2 text-sm">
                                    <span className="text-rose-500 mt-1">•</span> {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-10">
                    <div className="bg-black/30 border border-white/10 p-6 rounded-2xl text-center">
                        <p className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Voice Confidence Rating</p>
                        <div className="text-5xl font-display font-bold text-primary">{feedback.confidence}<span className="text-2xl text-gray-500">/10</span></div>
                    </div>
                    <div className="bg-black/30 border border-white/10 p-6 rounded-2xl text-center">
                        <p className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Language Clarity</p>
                        <div className="text-5xl font-display font-bold text-secondary">{feedback.clarity}<span className="text-2xl text-gray-500">/10</span></div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <Link to="/dashboard" className="px-10 py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-hover transition-all">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
      );
  }

  // ==========================================
  // VIEW 3: ACTIVE DISCUSSION ROOM
  // ==========================================
  return (
    <div className="h-screen w-full bg-[#0F172A] text-white flex flex-col font-sans overflow-hidden">
      
      {/* TOP HEADER */}
      <div className="h-14 flex items-center justify-between px-6 bg-[#1E293B]/50 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
            <span className="font-bold text-lg flex items-center gap-2">
                <Volume2 size={18} className="text-primary animate-pulse" /> 
                Live <span className="text-primary">Voice Room</span>
            </span>
            <div className="h-4 w-px bg-white/20 hidden md:block"></div>
            <span className="text-gray-400 text-sm max-w-md truncate hidden md:block">Topic: {topic}</span>
        </div>
        
        {/* 5 MINUTE TIMER DISPLAY */}
        <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-bold font-mono text-sm border 
                ${timeLeft < 60 ? 'bg-danger/20 text-danger border-danger/50 animate-pulse' : 'bg-primary/10 text-primary border-primary/30'}`}>
                <Timer size={16} />
                {formatTime(timeLeft)}
            </div>
            <button onClick={endSession} className="px-4 py-1.5 bg-danger/20 text-danger border border-danger/50 rounded-lg text-sm font-bold hover:bg-danger hover:text-white transition-colors">
                End Now
            </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        
        {/* LEFT: 2x2 GRID */}
        <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4 h-full">
            {Object.values(PARTICIPANTS).map((p) => {
                const isSpeaking = activeSpeaker === p.id;
                return (
                    <div 
                        key={p.id} 
                        className={`relative rounded-3xl overflow-hidden bg-black/40 border-2 transition-all duration-500 flex flex-col items-center justify-center h-full
                            ${isSpeaking ? `${p.border} shadow-[0_0_30px_rgba(255,255,255,0.1)] scale-[1.02] z-10` : 'border-white/5'}
                            ${isSpeaking && p.id === 'Supportive Bot' ? 'shadow-[0_0_30px_rgba(59,130,246,0.3)]' : ''}
                            ${isSpeaking && p.id === 'Positive Bot' ? 'shadow-[0_0_30px_rgba(16,185,129,0.3)]' : ''}
                            ${isSpeaking && p.id === 'Negative Bot' ? 'shadow-[0_0_30px_rgba(244,63,94,0.3)]' : ''}
                        `}
                    >
                        <div className={`w-24 h-24 lg:w-32 lg:h-32 rounded-full flex items-center justify-center transition-transform duration-500 ${p.color} ${isSpeaking ? 'scale-110 animate-pulse-soft' : ''} shadow-2xl`}>
                            {p.icon}
                        </div>
                        
                        <div className="absolute bottom-4 left-4 bg-[#0F172A]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                            <div>
                                <p className="font-bold text-sm leading-none mb-1">{p.name}</p>
                                <p className={`text-[10px] uppercase tracking-wider font-bold ${p.text}`}>{p.role}</p>
                            </div>
                            {isSpeaking && (
                                <div className="flex gap-1 items-center h-4 ml-2">
                                    <div className={`w-1 rounded-full animate-[ping_1s_ease-in-out_infinite] h-2 ${p.color}`}></div>
                                    <div className={`w-1 rounded-full animate-[ping_1.2s_ease-in-out_infinite] h-4 ${p.color}`}></div>
                                    <div className={`w-1 rounded-full animate-[ping_0.8s_ease-in-out_infinite] h-2 ${p.color}`}></div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>

        {/* RIGHT: LIVE TRANSCRIPT */}
        <div className="w-[350px] lg:w-[450px] h-full bg-[#1E293B]/80 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col shadow-2xl">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20 rounded-t-3xl shrink-0">
                <h3 className="font-bold flex items-center gap-2"><Zap className="text-primary" size={18}/> Live Conversation</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                {messages.map((msg, i) => {
                    const profile = PARTICIPANTS[msg.sender];
                    return (
                        <div key={i} className="animate-fade-in-up">
                            <span className={`text-xs font-bold uppercase tracking-wider mb-1 block ${profile.text}`}>
                                {profile.name}
                            </span>
                            <div className={`p-4 rounded-2xl text-sm leading-relaxed border ${
                                msg.sender === 'Student' 
                                  ? 'bg-primary/10 border-primary/30 text-white rounded-tr-none' 
                                  : 'bg-black/30 border-white/5 text-gray-300 rounded-tl-none'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    );
                })}
                {loading && activeSpeaker !== "Student" && activeSpeaker !== null && (
                    <div className="flex gap-2 items-center text-gray-500 text-sm p-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                        <span className="ml-2">{PARTICIPANTS[activeSpeaker]?.name} is thinking...</span>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
        </div>
      </div>

      {/* BOTTOM INPUT CONTROLS */}
      <div className="w-full bg-[#0F172A] border-t border-white/10 p-4 flex justify-center shrink-0">
        <div className="w-full max-w-4xl flex items-end gap-4 relative group">
            
            <button 
                onClick={handleVoiceInput}
                disabled={isBotsTalking}
                className={`p-4 rounded-2xl transition-all shadow-lg flex-shrink-0
                    ${isListening ? 'bg-danger text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
                    : isBotsTalking ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-primary text-white hover:bg-primary-hover shadow-primary-glow'}`}
            >
                {isListening ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            
            <div className={`flex-1 bg-black/60 border border-white/20 rounded-2xl p-2 flex items-center transition-all
                ${isBotsTalking ? 'opacity-50' : 'focus-within:border-primary focus-within:shadow-[0_0_15px_rgba(59,130,246,0.3)]'}`}>
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isBotsTalking ? "Listen to the discussion..." : isListening ? "Listening... (Auto sends when you stop)" : "Click the Mic to speak..."}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-gray-500 px-4 h-12"
                    disabled={loading || isBotsTalking}
                />
                <button 
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading || isListening || isBotsTalking}
                    className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all disabled:opacity-50"
                >
                    <Send size={20} className={loading ? 'animate-pulse' : ''} />
                </button>
            </div>
        </div>
      </div>

    </div>
  );
}
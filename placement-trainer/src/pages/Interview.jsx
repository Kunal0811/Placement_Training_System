import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../api';
import { FiMic, FiSquare, FiUser, FiCpu, FiCheckCircle, FiAlertCircle, FiSettings, FiArrowRight, FiFileText, FiVideo, FiVideoOff } from 'react-icons/fi';

export default function Interview() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // State Phases: 'setup' -> 'loading' -> 'interviewing' -> 'evaluating' -> 'report'
    const [phase, setPhase] = useState('setup');
    
    // Setup State
    const [role, setRole] = useState('Software Engineer');
    const [questionCount, setQuestionCount] = useState(5);
    
    // Interview State
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [currentAnswer, setCurrentAnswer] = useState("");
    
    // Voice & Video State
    const [isRecording, setIsRecording] = useState(false);
    const [isAiSpeaking, setIsAiSpeaking] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const recognitionRef = useRef(null);
    const videoRef = useRef(null);

    // Live NLP State (Tracking Filler Words)
    const [fillerCount, setFillerCount] = useState(0);

    // Report State
    const [report, setReport] = useState(null);

    // --- 1. INIT SPEECH RECOGNITION & LIVE NLP ---
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        const text = event.results[i][0].transcript;
                        finalTranscript += text + ' ';
                        
                        // 🔥 LIVE NLP: Detect Filler Words instantly
                        const fillers = (text.match(/\b(um|uh|like|you know|basically|literally)\b/gi) || []).length;
                        if (fillers > 0) setFillerCount(prev => prev + fillers);
                    }
                }
                if (finalTranscript) {
                    setCurrentAnswer(prev => prev + finalTranscript);
                }
            };

            recognition.onerror = (event) => console.error("Speech recognition error:", event.error);
            recognitionRef.current = recognition;
        } else {
            console.warn("Speech Recognition API not supported in this browser.");
        }
    }, []);

    // --- 2. CAMERA PERMISSIONS ---
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setCameraActive(true);
        } catch (err) {
            console.error("Camera access denied or unavailable.", err);
            setCameraActive(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        setCameraActive(false);
    };

    // Activate camera when interview phase starts
    useEffect(() => {
        if (phase === 'interviewing') {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera(); // Cleanup on unmount
    }, [phase]);

    // --- 3. AI TEXT TO SPEECH ---
    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); 
            const msg = new SpeechSynthesisUtterance(text);
            msg.rate = 1.0;
            msg.pitch = 1.0;
            
            msg.onstart = () => setIsAiSpeaking(true);
            msg.onend = () => setIsAiSpeaking(false);
            
            window.speechSynthesis.speak(msg);
        }
    };

    const handleStartInterview = async () => {
        if (!role.trim()) return alert("Please enter a role.");
        setPhase('loading');

        try {
            const res = await fetch(`${API_BASE}/api/interview/generate-questions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role, count: parseInt(questionCount) })
            });
            const data = await res.json();
            
            if (data.questions && data.questions.length > 0) {
                setQuestions(data.questions);
                setPhase('interviewing');
                speakText(data.questions[0]); 
            } else {
                throw new Error("No questions generated.");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to start interview. Check connection.");
            setPhase('setup');
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
        } else {
            recognitionRef.current?.start();
            setIsRecording(true);
        }
    };

    const handleNextQuestion = async () => {
        if (!currentAnswer.trim()) return alert("Please provide an answer before continuing.");
        
        if (isRecording) toggleRecording();
        window.speechSynthesis.cancel();

        const newAnswers = [...answers, currentAnswer];
        setAnswers(newAnswers);
        setCurrentAnswer("");
        setFillerCount(0); // Reset filler count for next question

        if (currentIndex < questions.length - 1) {
            const nextIdx = currentIndex + 1;
            setCurrentIndex(nextIdx);
            speakText(questions[nextIdx]);
        } else {
            setPhase('evaluating');
            stopCamera();
            try {
                const qaPairs = questions.map((q, i) => ({
                    question: q,
                    candidate_answer: newAnswers[i]
                }));

                const res = await fetch(`${API_BASE}/api/interview/evaluate-batch`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        user_id: user.id,  // 🔥 ADD THIS LINE!
                        role: role, 
                        qa_pairs: qaPairs 
                    })
                });
                
                const data = await res.json();
                setReport(data.report);
                setPhase('report');
            } catch (err) {
                console.error(err);
                alert("Failed to evaluate interview.");
                setPhase('setup'); 
            }
        }
    };


    // ==========================================
    // RENDER LOGIC
    // ==========================================

    if (phase === 'setup') {
        return (
            <div className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center p-6 font-sans">
                <div className="max-w-md w-full bg-black/40 border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-xl animate-fade-in-up">
                    <FiSettings className="text-5xl text-neon-blue mb-6" />
                    <h1 className="text-3xl font-display font-bold mb-2">AI Video Interview</h1>
                    <p className="text-gray-400 mb-8">Requires Camera & Microphone access for full NLP analysis.</p>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Target Role</label>
                            <input 
                                type="text" 
                                value={role} 
                                onChange={e => setRole(e.target.value)}
                                className="w-full bg-[#1e293b] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                                placeholder="e.g. Full Stack Developer"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Number of Questions</label>
                            <select 
                                value={questionCount} 
                                onChange={e => setQuestionCount(e.target.value)}
                                className="w-full bg-[#1e293b] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue cursor-pointer"
                            >
                                <option value="5">5 Questions (Quick Practice)</option>
                                <option value="10">10 Questions (Standard)</option>
                                <option value="15">15 Questions (Deep Dive)</option>
                            </select>
                        </div>
                        <button 
                            onClick={handleStartInterview}
                            className="w-full bg-neon-blue text-black font-bold text-lg py-4 rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(45,212,191,0.3)] mt-4 flex items-center justify-center gap-2"
                        >
                            <FiVideo /> Enter Interview Room
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (phase === 'loading') {
        return (
            <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center text-white">
                <FiCpu className="text-6xl text-neon-blue animate-pulse mb-6" />
                <h2 className="text-2xl font-bold font-display">Generating Interview Parameters...</h2>
                <p className="text-gray-400 mt-2">Preparing {questionCount} questions for {role}</p>
            </div>
        );
    }

    if (phase === 'evaluating') {
        return (
            <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center text-white">
                <FiFileText className="text-6xl text-neon-purple animate-bounce mb-6" />
                <h2 className="text-3xl font-bold font-display">Analyzing Your Performance</h2>
                <p className="text-gray-400 mt-2">Running deep NLP analysis on your responses...</p>
            </div>
        );
    }

    if (phase === 'interviewing') {
        return (
            <div className="h-screen bg-[#0F172A] text-white flex flex-col font-sans overflow-hidden">
                <header className="px-6 py-4 border-b border-white/10 bg-black/50 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-neon-blue">{role} Interview</h2>
                        <p className="text-sm text-gray-400">Question {currentIndex + 1} of {questions.length}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex gap-1 mr-4">
                            {questions.map((_, i) => (
                                <div key={i} className={`h-2 w-8 rounded-full ${i < currentIndex ? 'bg-neon-green' : i === currentIndex ? 'bg-neon-blue animate-pulse' : 'bg-gray-700'}`}></div>
                            ))}
                        </div>
                        {cameraActive ? <FiVideo className="text-green-400 text-xl" /> : <FiVideoOff className="text-red-400 text-xl" />}
                    </div>
                </header>

                <div className="flex-1 w-full p-4 md:p-6 flex flex-col lg:flex-row gap-6 overflow-hidden">
                    
                    {/* LEFT SIDE: AI INTERVIEWER & VIDEO FEED */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-6 shrink-0">
                        {/* User Camera Feed */}
                        <div className="bg-black/60 border border-white/10 rounded-3xl overflow-hidden relative shadow-2xl h-64 md:h-80 w-full flex items-center justify-center">
                            <video 
                                ref={videoRef} 
                                autoPlay 
                                playsInline 
                                muted 
                                className="object-cover w-full h-full transform scale-x-[-1]" 
                            />
                            {!cameraActive && <p className="text-gray-500 absolute font-bold uppercase tracking-widest">Camera Off</p>}
                            <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-lg backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></span>
                                Candidate
                            </div>
                        </div>

                        {/* Live NLP Stats Panel */}
                        <div className="bg-[#1e293b] border border-gray-700 p-6 rounded-3xl flex-1 flex flex-col justify-center items-center text-center">
                            <FiCpu className={`text-5xl mb-4 ${isAiSpeaking ? 'text-neon-blue animate-pulse' : 'text-gray-600'}`} />
                            <h3 className="text-xl font-bold text-white mb-1">AI Hiring Manager</h3>
                            <p className="text-sm text-gray-400 mb-6">{isAiSpeaking ? 'Speaking...' : 'Listening...'}</p>
                            
                            <div className="w-full bg-black/30 p-4 rounded-2xl border border-white/5">
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">Live NLP Feed</p>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-300">Filler Words Detected:</span>
                                    <span className={`font-bold ${fillerCount > 3 ? 'text-red-400' : 'text-green-400'}`}>{fillerCount}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Q&A AREA */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-6 h-full">
                        
                        {/* Question Card */}
                        <div className="bg-black/40 border border-white/10 p-6 md:p-8 rounded-3xl shadow-xl shrink-0 relative overflow-hidden">
                            {isAiSpeaking && <div className="absolute top-0 left-0 w-full h-1 bg-neon-blue animate-pulse"></div>}
                            <h3 className="text-xl md:text-2xl font-medium leading-relaxed">{questions[currentIndex]}</h3>
                            <button onClick={() => speakText(questions[currentIndex])} className="mt-4 text-xs font-bold text-gray-500 hover:text-neon-blue uppercase tracking-widest transition-colors">
                                ↺ Repeat Question
                            </button>
                        </div>

                        {/* Live Transcription Box */}
                        <div className="bg-[#1e293b] border border-gray-700 p-6 md:p-8 rounded-3xl shadow-xl flex-1 flex flex-col min-h-0 relative">
                            <div className="flex items-center justify-between mb-4 shrink-0">
                                <span className="font-bold text-gray-300 uppercase tracking-widest text-sm flex items-center gap-2">
                                    <FiMic className={isRecording ? 'text-red-400 animate-pulse' : 'text-gray-500'} /> Live Transcription
                                </span>
                                
                                <button 
                                    onClick={toggleRecording}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${isRecording ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-neon-blue text-black hover:scale-105 shadow-[0_0_15px_rgba(45,212,191,0.3)]'}`}
                                >
                                    {isRecording ? <><FiSquare /> Stop Recording</> : <><FiMic /> Start Speaking</>}
                                </button>
                            </div>

                            <textarea
                                value={currentAnswer}
                                onChange={(e) => setCurrentAnswer(e.target.value)}
                                placeholder="Your answer will appear here as you speak. You can also type to edit it manually..."
                                className="w-full flex-1 bg-black/20 text-white text-lg md:text-xl leading-relaxed resize-none focus:outline-none p-6 rounded-2xl border border-white/5 placeholder:text-gray-600 custom-scrollbar"
                            ></textarea>
                            
                            <div className="mt-4 flex justify-end shrink-0">
                                <button 
                                    onClick={handleNextQuestion}
                                    className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-transform hover:scale-105"
                                >
                                    {currentIndex === questions.length - 1 ? "Submit Interview" : "Next Question"} <FiArrowRight />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }

    if (phase === 'report' && report) {
        return (
            <div className="min-h-screen bg-[#0F172A] text-white p-4 md:p-8 font-sans">
                <div className="max-w-6xl mx-auto">
                    
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                        <div>
                            <h1 className="text-4xl font-display font-bold mb-2">Final Evaluation Report</h1>
                            <p className="text-gray-400">Role: <span className="text-neon-blue font-bold">{role}</span></p>
                        </div>
                        <button onClick={() => navigate('/dashboard')} className="px-6 py-2 border border-gray-600 hover:bg-gray-800 rounded-xl font-bold transition-colors">
                            Exit to Dashboard
                        </button>
                    </div>

                    {/* OVERALL METRICS GRID */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                        <div className="col-span-2 md:col-span-1 bg-black/40 border border-white/10 p-6 rounded-3xl text-center">
                            <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-2">Total Score</p>
                            <p className={`text-5xl font-black ${report.overall.score >= 75 ? 'text-neon-green' : report.overall.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{report.overall.score}</p>
                        </div>
                        {[
                            { label: "Technical", val: report.overall.technical },
                            { label: "Communication", val: report.overall.communication },
                            { label: "Problem Solving", val: report.overall.problem_solving },
                            { label: "Confidence", val: report.overall.confidence },
                        ].map((metric, i) => (
                            <div key={i} className="bg-black/40 border border-white/10 p-6 rounded-3xl flex flex-col items-center justify-center">
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2 text-center">{metric.label}</p>
                                <p className="text-3xl font-bold text-white">{metric.val}<span className="text-gray-600 text-lg">/10</span></p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-neon-purple/10 border border-neon-purple/30 p-6 rounded-3xl mb-12">
                        <h3 className="text-neon-purple font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><FiAlertCircle/> Final Verdict & Suggestions</h3>
                        <p className="text-gray-300 leading-relaxed">{report.overall.suggestions}</p>
                    </div>

                    {/* PER QUESTION ANALYSIS */}
                    <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-4">Detailed NLP Question Breakdown</h2>
                    <div className="space-y-8">
                        {report.per_question_analysis.map((item, index) => (
                            <div key={index} className="bg-[#1e293b] border border-gray-700 rounded-3xl overflow-hidden shadow-xl">
                                <div className="p-6 bg-black/20 border-b border-gray-700 flex gap-4">
                                    <div className="w-10 h-10 shrink-0 bg-gray-800 rounded-full flex items-center justify-center font-bold text-gray-400">
                                        Q{index + 1}
                                    </div>
                                    <h3 className="text-lg font-medium pt-1">{item.question}</h3>
                                </div>
                                
                                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="col-span-2 space-y-6">
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Your Answer Transcript</h4>
                                            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">{item.candidate_answer}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-2">Ideal AI Response</h4>
                                            <p className="text-green-100 whitespace-pre-wrap leading-relaxed text-sm bg-green-500/10 p-4 rounded-xl border border-green-500/20">{item.ideal_answer}</p>
                                        </div>
                                    </div>

                                    <div className="col-span-1 border-t lg:border-t-0 lg:border-l border-gray-700 pt-6 lg:pt-0 lg:pl-6">
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">NLP Metrics</h4>
                                        <div className="space-y-4 bg-black/20 p-5 rounded-2xl border border-white/5">
                                            {Object.entries(item.metrics).map(([key, value]) => (
                                                <div key={key}>
                                                    <div className="flex justify-between text-xs font-bold mb-1">
                                                        <span className="text-gray-400 uppercase">{key.replace('_', ' ')}</span>
                                                        <span className="text-white">{value}/10</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-neon-blue" style={{ width: `${(value / 10) * 100}%` }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        );
    }

    return null;
}
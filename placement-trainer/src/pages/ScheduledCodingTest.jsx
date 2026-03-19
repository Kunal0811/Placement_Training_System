import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../api';
import { useAuth } from '../context/AuthContext';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { githubDark } from '@uiw/codemirror-theme-github';
import { FiClock, FiCheckCircle, FiPlay, FiList, FiChevronRight, FiArrowLeft, FiCode } from 'react-icons/fi';

export default function ScheduledCodingTest() {
    const { testId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [testData, setTestData] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [submissions, setSubmissions] = useState([]); 
    const [loading, setLoading] = useState(true);
    
    // Timer States
    const [timeLeft, setTimeLeft] = useState(0); 
    const [hasStarted, setHasStarted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Execution States
    const [runOutput, setRunOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/tests/${testId}/start`);
                setTestData(res.data);
                setQuestions(res.data.questions);
                setTimeLeft(res.data.duration * 60);
                
                // Initialize code state for all 3 languages 
                // 🔥 Initialize with clean LeetCode-style starter code!
                const initialSubs = res.data.questions.map((p, idx) => ({
                    problem_title: p.title || `Problem ${idx + 1}`,
                    language: 'python',
                    codes: {
                        python: p.starter_code?.python || "# Write your python code here",
                        java: p.starter_code?.java || "// Write your java code here",
                        cpp: p.starter_code?.cpp || "// Write your C++ code here"
                    }
                }));
                setSubmissions(initialSubs);
            } catch (err) {
                alert("Failed to load Coding Test.");
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };
        fetchTest();
    }, [testId, navigate]);

    // Timer Logic (Without the security/tab tracking)
    useEffect(() => {
        if (!hasStarted || submitting) return;
        
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) { 
                    clearInterval(timer); 
                    handleSubmitTest(true); 
                    return 0; 
                }
                return prev - 1;
            });
        }, 1000);
        
        return () => clearInterval(timer);
    }, [hasStarted, submitting]);

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const startExam = () => {
        setHasStarted(true);
    };

    // Safely update only the active language's code, preserving the others
    const updateCurrentSubmission = (key, value) => {
        const newSubs = [...submissions];
        if (key === 'language') {
            newSubs[currentIndex].language = value;
        } else if (key === 'code') {
            const activeLang = newSubs[currentIndex].language;
            newSubs[currentIndex].codes[activeLang] = value;
        }
        setSubmissions(newSubs);
    };

    const handleRunCode = async () => {
        const currentSub = submissions[currentIndex];
        const activeCode = currentSub.codes[currentSub.language];
        const question = questions[currentIndex];

        if (!activeCode.trim()) return;

        setIsRunning(true);
        setRunOutput("Running test cases against the server...");

        try {
            // 🔥 Extract the hidden driver code for the current language
            const hiddenDriverCode = question.driver_code?.[currentSub.language] || "";

            const res = await axios.post(`${API_BASE}/api/coding/execute-bulk`, {
                language: currentSub.language,
                code: activeCode,
                test_cases: question.test_cases,
                driver_code: hiddenDriverCode // Send it to the backend secretly!
            });
            
            let outputText = "";
            let passedCount = 0;
            res.data.results.forEach((r, idx) => {
                if(r.passed) passedCount++;
                outputText += `Test Case ${idx+1}: ${r.passed ? '✅ PASSED' : '❌ FAILED'}\nYour Output: ${r.actual_output}\nExpected: ${r.expected_output}\n\n`;
            });
            setRunOutput(`Passed ${passedCount} / ${question.test_cases.length} cases\n\n${outputText}`);
        } catch (err) {
            setRunOutput("Execution failed. Check syntax or server connection.");
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmitTest = async (isForced = false) => {
        if (submitting) return;
        if (!isForced && !window.confirm("Are you sure you want to submit your final coding assessment?")) return;
        
        setSubmitting(true);
        // Calculate exact time taken in seconds!
        const timeTaken = (testData.duration * 60) - timeLeft;

        const finalAnswers = {};
        submissions.forEach((sub, idx) => {
            finalAnswers[idx] = {
                language: sub.language,
                code: sub.codes[sub.language]
            };
        });

        try {
            await axios.post(`${API_BASE}/api/tests/${testId}/submit`, {
                user_id: user.id,
                user_name: user.fname,
                answers: finalAnswers,
                time_taken: timeTaken // Send time to backend
            });
            alert("Coding Assessment Evaluated & Submitted Successfully!");
            navigate('/tests');
        } catch (err) {
            alert("Error submitting test.");
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center text-white">
                <FiCode className="text-6xl text-neon-blue animate-pulse mb-6" />
                <h2 className="text-2xl font-bold font-display">Preparing Exam Environment...</h2>
            </div>
        );
    }

    if (!hasStarted) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-game-bg text-white">
                <FiClock className="text-7xl text-neon-blue mb-6 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]" />
                <h1 className="text-4xl font-black mb-4 font-display">Scheduled Coding Assessment</h1>
                <div className="bg-black/40 border border-white/10 p-6 md:p-8 rounded-3xl max-w-xl text-left space-y-4 text-gray-300 shadow-2xl mt-4">
                    <p className="text-white font-bold flex items-center gap-2 mb-2"><FiList/> Exam Details:</p>
                    <ul className="list-disc pl-5 space-y-3 marker:text-neon-blue">
                        <li>You have exactly <strong>{testData.duration} minutes</strong> to solve {questions.length} problems.</li>
                        <li>The test will automatically submit when the timer reaches zero.</li>
                    </ul>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-10">
                    <button onClick={() => navigate(-1)} className="px-8 py-4 bg-gray-800 rounded-xl font-bold hover:bg-gray-700 transition-colors">Cancel</button>
                    <button onClick={startExam} className="px-8 py-4 bg-neon-blue text-black font-black rounded-xl hover:scale-105 shadow-[0_0_20px_rgba(45,212,191,0.3)] transition-all">Start Exam</button>
                </div>
            </div>
        );
    }

    const currentProb = questions[currentIndex];
    const currentSub = submissions[currentIndex];

    return (
        <div className="fixed inset-0 z-[5000] flex flex-col bg-[#0F172A] text-white font-sans overflow-hidden">
            
            {/* Header */}
            <header className="h-16 flex items-center justify-between px-6 bg-black/50 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => { if(window.confirm("Exit test? Your progress will not be saved.")) navigate(-1); }} className="text-gray-400 hover:text-white transition-colors">
                        <FiArrowLeft className="text-xl" />
                    </button>
                    <h1 className="text-xl font-bold font-display">{testData.title}</h1>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${timeLeft < 300 ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse' : 'bg-gray-900 border-gray-700'}`}>
                        <FiClock className={timeLeft < 300 ? 'text-red-400' : 'text-neon-orange'} />
                        <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
                    </div>
                    <button 
                        onClick={() => handleSubmitTest(false)}
                        disabled={submitting}
                        className="flex items-center gap-2 bg-neon-blue text-black hover:bg-cyan-300 px-5 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                    >
                        <FiCheckCircle /> {submitting ? "Submitting..." : "Submit Final Exam"}
                    </button>
                </div>
            </header>

            {/* Main 3-Column Layout */}
            <div className="flex flex-1 overflow-hidden">
                
                {/* Left: Problem List */}
                <div className="w-64 bg-black/30 border-r border-white/10 flex-col overflow-y-auto hidden md:flex shrink-0">
                    <div className="p-4 border-b border-white/5">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><FiList/> Problems</h2>
                    </div>
                    <div className="p-2 space-y-1">
                        {questions.map((p, idx) => (
                            <button
                                key={idx}
                                onClick={() => { setCurrentIndex(idx); setRunOutput(""); }}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium flex items-center justify-between ${currentIndex === idx ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <span className="truncate pr-2">{idx + 1}. {p.title}</span>
                                {currentIndex === idx && <FiChevronRight/>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Middle: Problem Description */}
                <div className="w-full md:w-1/3 p-6 overflow-y-auto border-r border-white/10 custom-scrollbar shrink-0">
                    <div className="flex justify-between items-center mb-4 text-white">
                        <h2 className="text-2xl font-bold">{currentProb?.title}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${currentProb?.difficulty === 'Hard' ? 'bg-red-500/20 text-red-500' : currentProb?.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>{currentProb?.difficulty}</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-6 whitespace-pre-wrap">{currentProb?.description}</p>

                    <div className="space-y-4">
                        {currentProb?.test_cases?.map((tc, i) => (
                            <div key={i}>
                                <h3 className="text-sm font-bold text-gray-400 uppercase mb-1">Test Case {i + 1}:</h3>
                                <pre className="bg-black/50 p-4 rounded-xl text-sm whitespace-pre-wrap font-mono border border-white/5 text-gray-300">
                                    <span className="text-neon-green">Input:</span> {tc.input}<br />
                                    <span className="text-neon-blue">Output:</span> {tc.expected_output}
                                </pre>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Code Editor & Console */}
                <div className="w-full md:w-auto flex-1 flex flex-col min-w-0 bg-[#0d1117]">
                    {/* Tool Bar */}
                    <div className="h-12 bg-[#161b22] border-b border-gray-800 flex items-center justify-between px-4 shrink-0">
                        <select 
                            className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-neon-blue cursor-pointer"
                            value={currentSub?.language}
                            onChange={(e) => updateCurrentSubmission('language', e.target.value)}
                        >
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="cpp">C++</option>
                        </select>
                        
                        <button 
                            onClick={handleRunCode} 
                            disabled={isRunning}
                            className="flex items-center gap-2 bg-green-600/20 border border-green-600/50 text-green-400 hover:bg-green-600 hover:text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                        >
                            {isRunning ? <FiClock className="animate-spin" /> : <FiPlay />}
                            Run Test Cases
                        </button>
                    </div>

                    {/* Editor */}
                    <div className="flex-1 overflow-auto bg-[#0d1117] text-base">
                        <CodeMirror
                            value={currentSub?.codes?.[currentSub?.language] || ""}
                            height="100%"
                            theme={githubDark}
                            extensions={[
                                currentSub?.language === 'python' ? python() :
                                currentSub?.language === 'java' ? java() : cpp()
                            ]}
                            onChange={(val) => updateCurrentSubmission('code', val)}
                            className="h-full"
                            style={{ fontSize: '15px' }}
                        />
                    </div>

                    {/* Output Console */}
                    <div className="h-64 bg-[#161b22] border-t border-gray-800 flex flex-col shrink-0">
                        <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-800 bg-[#0d1117]">
                            Test Case Results Console
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto font-mono text-sm custom-scrollbar bg-black/20">
                            {isRunning ? (
                                <span className="text-gray-500 animate-pulse">Running code against hidden test cases...</span>
                            ) : (
                                <pre className={runOutput.includes("FAILED") || runOutput.includes("Execution failed") ? "text-red-400" : "text-green-400"}>
                                    {runOutput || "Click 'Run Test Cases' to verify your logic."}
                                </pre>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
                .cm-theme-light, .cm-theme-dark { height: 100%; }
                .cm-scroller { font-family: 'JetBrains Mono', 'Fira Code', monospace !important; }
            `}</style>
        </div>
    );
}
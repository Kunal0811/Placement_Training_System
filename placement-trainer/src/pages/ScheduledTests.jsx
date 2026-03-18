import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../api';
import { FiClock, FiCheckCircle, FiAlertCircle, FiAward, FiXCircle } from 'react-icons/fi';

export default function ScheduledTests() {
    const { user } = useAuth();
    const [tests, setTests] = useState([]);
    
    const [activeTest, setActiveTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);

    const [reportData, setReportData] = useState(null);
    const [viewingReportId, setViewingReportId] = useState(null);

    useEffect(() => {
        if (!user) return;
        const fetchTests = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/tests/available?user_id=${user.id}`);
                setTests(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchTests();
        const interval = setInterval(fetchTests, 60000);
        return () => clearInterval(interval);
    }, [user]);

    useEffect(() => {
        if (activeTest && timeLeft > 0 && questions.length > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (activeTest && timeLeft === 0 && questions.length > 0) {
            handleSubmitTest();
        }
    }, [activeTest, timeLeft, questions.length]);

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleStartTest = async (testId) => {
        try {
            const res = await axios.get(`${API_BASE}/api/tests/${testId}/start`);
            setQuestions(res.data.questions);
            setTimeLeft(res.data.duration * 60);
            setActiveTest(testId);
        } catch (err) {
            alert("Failed to start test.");
        }
    };

    const handleSubmitTest = async () => {
        if(!activeTest) return;
        try {
            await axios.post(`${API_BASE}/api/tests/${activeTest}/submit`, {
                user_id: user.id,
                user_name: user.fname,
                answers: answers
            });
            alert("Test Submitted Successfully!");
            setActiveTest(null);
            setAnswers({});
            const res = await axios.get(`${API_BASE}/api/tests/available?user_id=${user.id}`);
            setTests(res.data);
        } catch (err) {
            alert("Submission failed.");
        }
    };

    const handleViewReport = async (testId) => {
        try {
            const res = await axios.get(`${API_BASE}/api/tests/${testId}/report?user_id=${user.id}`);
            setReportData(res.data);
            setViewingReportId(testId);
        } catch (err) {
            alert("Failed to load report.");
        }
    };

    // --- UI: TEST TAKING MODE ---
    if (activeTest) {
        // FIXED: CRASH PREVENTION. If AI is still generating, show a loading screen!
        if (!questions || questions.length === 0) {
            return (
                <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center text-white p-6 text-center">
                    <FiClock className="text-6xl text-blue-400 animate-spin mb-6" />
                    <h2 className="text-3xl font-bold mb-4 font-display">Test is still generating...</h2>
                    <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
                        The AI is currently building the questions for this test in the background. It takes about 3 minutes after the Admin schedules it. Please wait a moment and try again!
                    </p>
                    <button onClick={() => setActiveTest(null)} className="mt-8 px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold transition-colors">
                        Go Back to Dashboard
                    </button>
                </div>
            );
        }

        const q = questions[currentQ];

        return (
            <div className="min-h-screen bg-[#0F172A] text-white p-6 flex flex-col">
                <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
                    <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/10 mb-6">
                        <h2 className="font-bold text-xl">Question {currentQ + 1} / {questions.length}</h2>
                        <div className={`font-mono text-2xl font-bold px-4 py-2 rounded-xl ${timeLeft < 300 ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-blue-500/20 text-blue-400'}`}>
                            <FiClock className="inline mr-2 mb-1"/> {formatTime(timeLeft)}
                        </div>
                    </div>

                    <div className="flex-1 bg-black/20 border border-white/10 p-8 rounded-3xl mb-6">
                        <div className="flex justify-between items-start mb-8">
                            <h3 className="text-2xl font-bold leading-relaxed">{q.q}</h3>
                            <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full shrink-0 ml-4 ${q.diff === 'Hard' ? 'bg-red-500/20 text-red-400' : q.diff === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                                {q.diff}
                            </span>
                        </div>
                        
                        <div className="space-y-4">
                            {q.options.map((opt, i) => (
                                <button 
                                    key={i}
                                    onClick={() => setAnswers({...answers, [currentQ]: opt})}
                                    className={`w-full text-left p-4 rounded-xl border transition-all ${answers[currentQ] === opt ? 'bg-neon-blue/20 border-neon-blue text-white shadow-[0_0_15px_rgba(45,212,191,0.2)]' : 'bg-black/40 border-gray-700 text-gray-300 hover:border-gray-500'}`}
                                >
                                    {String.fromCharCode(65 + i)}. {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <button onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))} disabled={currentQ === 0} className="px-6 py-3 bg-gray-800 rounded-xl font-bold disabled:opacity-50 transition-opacity">Previous</button>
                        {currentQ === questions.length - 1 ? (
                            <button onClick={handleSubmitTest} className="px-8 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-bold transition-colors">Submit Final Test</button>
                        ) : (
                            <button onClick={() => setCurrentQ(prev => prev + 1)} className="px-8 py-3 bg-neon-blue text-black hover:bg-cyan-300 rounded-xl font-bold transition-colors">Next</button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // --- UI: LEADERBOARD & REPORT MODE ---
    if (viewingReportId && reportData) {
        return (
            <div className="min-h-screen bg-[#0F172A] text-white p-6 md:p-12">
                <div className="max-w-6xl mx-auto">
                    <button onClick={() => setViewingReportId(null)} className="mb-6 text-gray-400 hover:text-white flex items-center gap-2">
                        ← Back to Tests
                    </button>
                    
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Leaderboard */}
                        <div className="lg:col-span-1 bg-[#1E293B] border border-gray-700 rounded-3xl p-6 max-h-[600px] overflow-y-auto custom-scrollbar">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><FiAward className="text-yellow-400"/> Global Leaderboard</h3>
                            <div className="space-y-3">
                                {reportData.leaderboard.map((u, i) => (
                                    <div key={i} className={`p-4 rounded-xl flex justify-between items-center ${u.user_name === user.fname ? 'bg-neon-blue/20 border border-neon-blue/50' : 'bg-[#0F172A] border border-gray-700'}`}>
                                        <span className="font-bold">{i+1}. {u.user_name}</span>
                                        <span className="font-mono text-neon-green">{u.score} / {u.total}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mistakes/Report */}
                        <div className="lg:col-span-2 space-y-6 max-h-[800px] overflow-y-auto custom-scrollbar pr-2">
                            <h3 className="text-2xl font-bold">Your Detailed Report</h3>
                            {reportData.report.map((item, i) => (
                                <div key={i} className={`p-6 rounded-2xl border bg-black/40 ${item.is_correct ? 'border-green-500/30' : 'border-red-500/30'}`}>
                                    <div className="flex gap-3 mb-4">
                                        <div className="mt-1">
                                            {item.is_correct ? <FiCheckCircle className="text-green-500 text-xl"/> : <FiXCircle className="text-red-500 text-xl"/>}
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold leading-relaxed">{i+1}. {item.question}</p>
                                            <p className="text-sm mt-3 text-gray-400">Your Answer: <span className={item.is_correct ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>{item.user_ans}</span></p>
                                            {!item.is_correct && <p className="text-sm mt-1 text-gray-400">Correct Answer: <span className="text-green-400 font-bold">{item.correct_ans}</span></p>}
                                            {item.explanation && (
                                                <div className="mt-4 bg-white/5 p-4 rounded-xl border border-white/10 text-sm text-gray-300 leading-relaxed">
                                                    <span className="font-bold text-gray-400 block mb-1 uppercase tracking-widest text-[10px]">Explanation</span>
                                                    {item.explanation}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- UI: DASHBOARD (List Tests) ---
    return (
        <div className="min-h-screen bg-[#0F172A] text-white p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-display font-bold mb-2">Scheduled <span className="text-neon-blue">Assessments</span></h1>
                <p className="text-gray-400 mb-10">You have a strict 10-minute window to join a test once it begins.</p>

                <div className="space-y-4">
                    {tests.map(test => {
                        const testTime = new Date(test.scheduled_time).getTime();
                        const now = new Date().getTime();
                        const diffMins = (now - testTime) / (1000 * 60); 
                        
                        let statusUI;
                        if (test.is_attempted > 0) {
                            statusUI = <button onClick={() => handleViewReport(test.id)} className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-xl font-bold transition-colors">View Report</button>;
                        } else if (diffMins < 0) {
                            statusUI = <span className="text-gray-500 font-bold bg-gray-800 px-6 py-2 rounded-xl">Upcoming...</span>;
                        } else if (diffMins >= 0 && diffMins <= 10) {
                            statusUI = <button onClick={() => handleStartTest(test.id)} className="bg-green-600 hover:bg-green-500 animate-pulse px-6 py-2 rounded-xl font-bold shadow-[0_0_15px_rgba(34,197,94,0.4)]">Start Now</button>;
                        } else {
                            statusUI = <span className="text-red-500 font-bold flex items-center gap-2 bg-red-500/10 px-6 py-2 rounded-xl border border-red-500/20"><FiAlertCircle /> Closed</span>;
                        }

                        return (
                            <div key={test.id} className="bg-[#1E293B] p-6 rounded-2xl border border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{test.title}</h3>
                                    <div className="flex gap-4 mt-2 text-sm text-gray-400 font-mono">
                                        <span className="uppercase tracking-widest text-blue-400">{test.test_category}</span>
                                        <span><FiClock className="inline mb-0.5"/> {new Date(test.scheduled_time).toLocaleString()}</span>
                                        <span>{test.duration_minutes} Mins</span>
                                    </div>
                                </div>
                                <div>{statusUI}</div>
                            </div>
                        )
                    })}
                    {tests.length === 0 && (
                        <div className="text-center p-12 border border-dashed border-gray-700 rounded-3xl text-gray-500">
                            No tests have been scheduled by the admin yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
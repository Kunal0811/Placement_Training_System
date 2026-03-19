import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../api';
import { FiClock, FiCheckCircle, FiAlertCircle, FiAward, FiXCircle } from 'react-icons/fi';

export default function ScheduledTests() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);
    
    // Report States
    const [reportData, setReportData] = useState(null);
    const [viewingReportId, setViewingReportId] = useState(null);

    useEffect(() => {
        if (!user) return;
        const fetchTests = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/tests/available?user_id=${user.id}`);
                setTests(res.data);
            } catch (err) { console.error(err); }
        };
        fetchTests();
        const interval = setInterval(fetchTests, 60000);
        return () => clearInterval(interval);
    }, [user]);

    const handleViewReport = async (testId) => {
        try {
            const res = await axios.get(`${API_BASE}/api/tests/${testId}/report?user_id=${user.id}`);
            setReportData(res.data);
            setViewingReportId(testId);
        } catch (err) {
            alert("Failed to load report.");
        }
    };

    // --- UI: LEADERBOARD & REPORT MODE ---
    if (viewingReportId && reportData) {
        return (
            <div className="min-h-screen bg-[#0F172A] text-white p-6 md:p-12">
                <div className="max-w-7xl mx-auto">
                    <button onClick={() => setViewingReportId(null)} className="mb-6 text-gray-400 hover:text-white flex items-center gap-2">
                        ← Back to Dashboard
                    </button>
                    
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* High-Tech Leaderboard */}
                        <div className="lg:col-span-1 bg-[#1E293B] border border-gray-700 rounded-3xl p-6 max-h-[600px] overflow-y-auto custom-scrollbar">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><FiAward className="text-yellow-400"/> Global Leaderboard</h3>
                            <div className="space-y-3">
                                {reportData.leaderboard.map((u, i) => (
                                    <div key={i} className={`p-4 rounded-xl flex justify-between items-center ${u.user_name === user.fname ? 'bg-neon-blue/20 border border-neon-blue/50' : 'bg-[#0F172A] border border-gray-700'}`}>
                                        <div>
                                            <span className="font-bold">{i+1}. {u.user_name}</span>
                                            <div className="text-xs text-gray-400 mt-1 flex items-center gap-1"><FiClock/> {Math.floor(u.time_taken/60)}m {u.time_taken%60}s</div>
                                        </div>
                                        <span className="font-mono text-neon-green font-bold text-lg">{u.score} <span className="text-sm font-sans text-gray-500">/ {u.total}</span></span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Detailed Report View */}
                        <div className="lg:col-span-2 space-y-6 max-h-[800px] overflow-y-auto custom-scrollbar pr-2">
                            <div className="flex justify-between items-end mb-2 border-b border-gray-800 pb-6">
                                <h3 className="text-3xl font-bold font-display">Deep Report</h3>
                                <div className="bg-black/40 px-5 py-2 rounded-xl border border-white/10 text-center">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Time Taken</p>
                                    <p className="text-lg font-mono text-neon-blue">{Math.floor(reportData.time_taken/60)}m {reportData.time_taken%60}s</p>
                                </div>
                            </div>

                            {reportData.report.length > 0 ? reportData.report.map((item, i) => (
                                <div key={i} className={`p-6 rounded-2xl border bg-black/40 ${item.is_correct ? 'border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.05)]' : 'border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.05)]'}`}>
                                    
                                    {reportData.is_coding ? (
                                        /* --- CODING REPORT UI (Matches Practice Platform) --- */
                                        <div>
                                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                                                {item.is_correct ? <FiCheckCircle className="text-3xl text-green-500"/> : <FiXCircle className="text-3xl text-red-500"/>}
                                                <h4 className="text-2xl font-bold">{item.question}</h4>
                                            </div>
                                            
                                            <p className="text-sm text-gray-300 mb-6 whitespace-pre-wrap leading-relaxed">{item.description}</p>
                                            
                                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                                                <div className="flex flex-col h-full">
                                                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">Your Code ({item.language})</h5>
                                                    <pre className="bg-[#0d1117] p-4 rounded-xl border border-gray-700 text-xs overflow-x-auto text-gray-300 font-mono custom-scrollbar max-h-64 flex-1">
                                                        <code>{item.user_code}</code>
                                                    </pre>
                                                </div>
                                                <div className="flex flex-col h-full">
                                                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">AI Code Review</h5>
                                                    <p className="text-white text-sm leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10 flex-1">
                                                        {item.feedback}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {item.ideal_solution_snippets && (
                                                <div className="mt-6 pt-6 border-t border-white/10">
                                                    <h5 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-4">Ideal Solutions Comparison</h5>
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                        {item.ideal_solution_snippets.python && (
                                                            <div>
                                                                <span className="text-[10px] font-bold text-blue-400 uppercase bg-blue-500/10 px-3 py-1 rounded-t-lg border border-b-0 border-blue-500/20">Python</span>
                                                                <pre className="bg-[#0d1117] p-4 rounded-xl rounded-tl-none border border-gray-700 text-xs overflow-x-auto text-gray-300 custom-scrollbar max-h-48">
                                                                    <code>{item.ideal_solution_snippets.python}</code>
                                                                </pre>
                                                            </div>
                                                        )}
                                                        {item.ideal_solution_snippets.java && (
                                                            <div>
                                                                <span className="text-[10px] font-bold text-orange-400 uppercase bg-orange-500/10 px-3 py-1 rounded-t-lg border border-b-0 border-orange-500/20">Java</span>
                                                                <pre className="bg-[#0d1117] p-4 rounded-xl rounded-tl-none border border-gray-700 text-xs overflow-x-auto text-gray-300 custom-scrollbar max-h-48">
                                                                    <code>{item.ideal_solution_snippets.java}</code>
                                                                </pre>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        /* --- MCQ REPORT UI --- */
                                        <div className="flex gap-4">
                                            <div className="mt-1">
                                                {item.is_correct ? <FiCheckCircle className="text-green-500 text-2xl"/> : <FiXCircle className="text-red-500 text-2xl"/>}
                                            </div>
                                            <div>
                                                <p className="text-xl font-bold leading-relaxed mb-4">{i+1}. {item.question}</p>
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
                                    )}
                                </div>
                            )) : (
                                <p className="text-gray-500 italic">No detailed report available.</p>
                            )}
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
                            // 🔥 DYNAMIC ROUTING: Route to MCQ or Coding Engine
                            const isCodingTest = test.test_category.toLowerCase() === 'coding';
                            const targetUrl = isCodingTest ? `/scheduled-coding-test/${test.id}` : `/scheduled-test/${test.id}`;
                            
                            statusUI = <button onClick={() => navigate(targetUrl)} className="bg-green-600 hover:bg-green-500 animate-pulse px-6 py-2 rounded-xl font-bold shadow-[0_0_15px_rgba(34,197,94,0.4)]">Start Now</button>;
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
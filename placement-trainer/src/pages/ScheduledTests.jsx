import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../api';
import { FiClock, FiCheckCircle, FiAlertCircle, FiAward, FiXCircle, FiFileText, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function ScheduledTests() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);
    
    // Report States
    const [reportData, setReportData] = useState(null);
    const [viewingReportId, setViewingReportId] = useState(null);
    const [viewMode, setViewMode] = useState(null); 
    const [pageIndex, setPageIndex] = useState(0); // 🔥 UNIFIED: Used for both MCQ and Coding Pagination

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

    const handleViewData = async (testId, mode) => {
        try {
            const res = await axios.get(`${API_BASE}/api/tests/${testId}/report?user_id=${user.id}`);
            setReportData(res.data);
            setViewingReportId(testId);
            setViewMode(mode);
            setPageIndex(0); // Reset pagination when opening a new report
        } catch (err) {
            alert("Failed to load data.");
        }
    };

    // --- UI: LEADERBOARD & REPORT MODE ---
    if (viewingReportId && reportData) {
        
        // Grab the current item (works for both coding and MCQ)
        const currentItem = reportData.report.length > 0 ? reportData.report[pageIndex] : null;

        return (
            <div className="min-h-screen bg-[#0F172A] text-white p-4 md:p-8 font-sans flex flex-col">
                <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
                    
                    {/* Header Area */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 pb-6 border-b border-white/10 shrink-0">
                        <div>
                            <button onClick={() => { setViewingReportId(null); setViewMode(null); }} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors mb-4">
                                <FiChevronLeft /> Back to Dashboard
                            </button>
                            <h3 className="text-3xl font-bold font-display flex items-center gap-3">
                                {viewMode === 'leaderboard' ? <><FiAward className="text-yellow-400"/> Global Leaderboard</> : <><FiFileText className="text-blue-400"/> Performance Report</>}
                            </h3>
                        </div>
                        {viewMode === 'report' && (
                            <div className="bg-black/40 px-6 py-3 rounded-2xl border border-white/10 text-center mt-4 md:mt-0">
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Time Taken</p>
                                <p className="text-xl font-mono text-neon-blue font-bold">{Math.floor(reportData.time_taken/60)}m {reportData.time_taken%60}s</p>
                            </div>
                        )}
                    </div>
                    
                    {/* --- LEADERBOARD VIEW --- */}
                    {viewMode === 'leaderboard' && (
                        <div className="bg-[#1E293B] border border-gray-700 rounded-3xl p-8 animate-fade-in shadow-2xl flex-1 overflow-y-auto custom-scrollbar">
                            <div className="space-y-4 max-w-4xl mx-auto">
                                {reportData.leaderboard.map((u, i) => (
                                    <div key={i} className={`p-5 rounded-2xl flex justify-between items-center transition-all ${u.user_name === user.fname ? 'bg-neon-blue/10 border border-neon-blue/50 shadow-[0_0_15px_rgba(45,212,191,0.2)]' : 'bg-[#0F172A] border border-gray-700 hover:border-gray-500'}`}>
                                        <div className="flex items-center gap-4">
                                            <span className={`text-xl font-black ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-gray-500'}`}>#{i+1}</span>
                                            <div>
                                                <span className="font-bold text-lg">{u.user_name}</span>
                                                <div className="text-xs text-gray-400 mt-1 flex items-center gap-1"><FiClock/> {Math.floor(u.time_taken/60)}m {u.time_taken%60}s</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Score</p>
                                            <span className="font-mono text-neon-green font-bold text-2xl">{u.score} <span className="text-sm font-sans text-gray-500">/ {u.total}</span></span>
                                        </div>
                                    </div>
                                ))}
                                {reportData.leaderboard.length === 0 && <p className="text-gray-500 text-center py-10">No attempts yet.</p>}
                            </div>
                        </div>
                    )}

                    {/* --- DEEP REPORT VIEW (PAGINATED) --- */}
                    {viewMode === 'report' && currentItem && (
                        <div className="flex-1 flex flex-col min-h-0 bg-[#1E293B] rounded-3xl border border-gray-700 shadow-2xl overflow-hidden animate-fade-in">
                            
                            {/* Pagination Header */}
                            <div className="flex items-center justify-between bg-black/40 p-4 border-b border-gray-700 shrink-0">
                                <button 
                                    onClick={() => setPageIndex(prev => prev - 1)} 
                                    disabled={pageIndex === 0}
                                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed px-4 py-2 rounded-xl font-bold text-sm transition-colors"
                                >
                                    <FiChevronLeft /> Previous
                                </button>
                                
                                <div className="flex items-center gap-4">
                                    <span className="font-mono text-gray-400 font-bold hidden md:inline">
                                        {reportData.is_coding ? "Problem" : "Question"} {pageIndex + 1} of {reportData.report.length}
                                    </span>
                                    <div className="flex items-center gap-2 bg-[#0F172A] px-3 py-1.5 rounded-lg border border-gray-700">
                                        {currentItem.is_correct ? <FiCheckCircle className="text-green-500" /> : <FiXCircle className="text-red-500" />}
                                        <span className={`text-sm font-bold ${currentItem.is_correct ? 'text-green-400' : 'text-red-400'}`}>
                                            {reportData.is_coding 
                                                ? (currentItem.is_correct ? 'Passed' : 'Needs Improvement')
                                                : (currentItem.is_correct ? '+1 Marks' : '0 Marks')}
                                        </span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setPageIndex(prev => prev + 1)} 
                                    disabled={pageIndex === reportData.report.length - 1}
                                    className="flex items-center gap-2 bg-neon-blue text-black hover:bg-cyan-300 disabled:opacity-30 disabled:cursor-not-allowed px-4 py-2 rounded-xl font-bold text-sm transition-colors"
                                >
                                    Next <FiChevronRight />
                                </button>
                            </div>

                            {/* Content Area */}
                            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                                
                                {reportData.is_coding ? (
                                    /* --- CODING REPORT CONTENT (Full Width) --- */
                                    <div className="w-full p-6 lg:p-8 overflow-y-auto custom-scrollbar">
                                        <h2 className="text-xl lg:text-2xl font-bold leading-relaxed mb-6 text-white whitespace-pre-wrap">
                                            <span className="text-gray-500 mr-2">{pageIndex + 1}.</span> 
                                            {currentItem.question}
                                        </h2>
                                        
                                        <p className="text-sm text-gray-300 mb-8 whitespace-pre-wrap leading-relaxed bg-black/30 p-4 rounded-xl border border-white/5">{currentItem.description}</p>
                                        
                                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                                            <div className="flex flex-col h-full">
                                                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">Your Code ({currentItem.language})</h5>
                                                <pre className="bg-[#0d1117] p-5 rounded-2xl border border-gray-700 text-sm overflow-x-auto text-gray-300 font-mono custom-scrollbar max-h-80 flex-1">
                                                    <code>{currentItem.user_code}</code>
                                                </pre>
                                            </div>
                                            <div className="flex flex-col h-full">
                                                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">AI Code Review</h5>
                                                <p className="text-white text-base leading-relaxed bg-blue-500/5 p-5 rounded-2xl border border-blue-500/20 flex-1 whitespace-pre-wrap">
                                                    {currentItem.feedback}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {currentItem.ideal_solution_snippets && (
                                            <div className="mt-8 pt-8 border-t border-white/10">
                                                <h5 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-4">Ideal Solutions Comparison</h5>
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    {currentItem.ideal_solution_snippets.python && (
                                                        <div>
                                                            <span className="text-[10px] font-bold text-blue-400 uppercase bg-blue-500/10 px-4 py-1.5 rounded-t-xl border border-b-0 border-blue-500/20">Python</span>
                                                            <pre className="bg-[#0d1117] p-5 rounded-2xl rounded-tl-none border border-gray-700 text-xs overflow-x-auto text-gray-300 custom-scrollbar max-h-64"><code>{currentItem.ideal_solution_snippets.python}</code></pre>
                                                        </div>
                                                    )}
                                                    {currentItem.ideal_solution_snippets.java && (
                                                        <div>
                                                            <span className="text-[10px] font-bold text-orange-400 uppercase bg-orange-500/10 px-4 py-1.5 rounded-t-xl border border-b-0 border-orange-500/20">Java</span>
                                                            <pre className="bg-[#0d1117] p-5 rounded-2xl rounded-tl-none border border-gray-700 text-xs overflow-x-auto text-gray-300 custom-scrollbar max-h-64"><code>{currentItem.ideal_solution_snippets.java}</code></pre>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* --- MCQ REPORT CONTENT (Split Screen) --- */
                                    <>
                                        {/* LEFT PANEL: Question & Options */}
                                        <div className="w-full lg:w-1/2 p-6 lg:p-8 overflow-y-auto custom-scrollbar border-b lg:border-b-0 lg:border-r border-gray-700">
                                            <h2 className="text-xl lg:text-2xl font-bold leading-relaxed mb-8 text-white whitespace-pre-wrap">
                                                <span className="text-gray-500 mr-2">{pageIndex + 1}.</span> 
                                                {currentItem.question}
                                            </h2>
                                            
                                            <div className="space-y-4">
                                                {currentItem.options && currentItem.options.map((opt, idx) => {
                                                    const isUserSelected = opt === currentItem.user_ans;
                                                    const isCorrectAnswer = opt === currentItem.correct_ans;
                                                    
                                                    let boxStyle = "bg-[#0F172A] border-gray-700 text-gray-300"; 
                                                    
                                                    if (isCorrectAnswer) {
                                                        boxStyle = "bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]";
                                                    } else if (isUserSelected && !isCorrectAnswer) {
                                                        boxStyle = "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]";
                                                    }

                                                    return (
                                                        <div key={idx} className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${boxStyle}`}>
                                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${isCorrectAnswer ? 'border-green-500 bg-green-500/30' : isUserSelected ? 'border-red-500 bg-red-500/30' : 'border-gray-600'}`}>
                                                                {isCorrectAnswer && <FiCheckCircle className="text-green-400 text-sm" />}
                                                                {isUserSelected && !isCorrectAnswer && <FiXCircle className="text-red-400 text-sm" />}
                                                            </div>
                                                            <span className="font-medium text-base whitespace-pre-wrap">{opt}</span>
                                                        </div>
                                                    );
                                                })}
                                                
                                                {currentItem.user_ans === "Not Answered" && (
                                                    <div className="mt-6 p-4 rounded-2xl border-2 border-yellow-500/50 bg-yellow-500/10 text-yellow-400 flex items-center gap-3">
                                                        <FiAlertCircle className="text-xl shrink-0" />
                                                        <span className="font-bold">You did not attempt this question.</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* RIGHT PANEL: Explanation */}
                                        <div className="w-full lg:w-1/2 bg-[#0d1117] p-6 lg:p-8 overflow-y-auto custom-scrollbar">
                                            <div className="sticky top-0 bg-[#0d1117] pb-4 mb-4 border-b border-gray-800 z-10">
                                                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                                    <FiFileText className="text-lg" /> Detailed Explanation
                                                </h3>
                                            </div>
                                            
                                            {currentItem.explanation ? (
                                                <div className="text-gray-300 text-base leading-relaxed whitespace-pre-wrap font-serif">
                                                    {currentItem.explanation}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-48 text-gray-500 opacity-50">
                                                    <FiAlertCircle className="text-4xl mb-3" />
                                                    <p>No detailed explanation provided for this question.</p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {viewMode === 'report' && reportData.report.length === 0 && (
                        <div className="text-center py-20 border border-dashed border-gray-700 rounded-3xl bg-[#1E293B]/50">
                            <p className="text-gray-500 italic">No detailed report available.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- UI: DASHBOARD (List Tests) ---
    return (
        <div className="min-h-screen bg-[#0F172A] text-white p-6 md:p-12 font-sans">
            <div className="max-w-5xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-display font-black mb-3">Scheduled <span className="text-neon-blue">Assessments</span></h1>
                    <p className="text-gray-400 text-lg">You have a strict 10-minute window to join a test once it begins.</p>
                </div>

                <div className="space-y-6">
                    {tests.map(test => {
                        const testTime = new Date(test.scheduled_time).getTime();
                        const now = new Date().getTime();
                        const diffMins = (now - testTime) / (1000 * 60); 
                        
                        let statusUI;
                        if (test.is_attempted > 0) {
                            statusUI = (
                                <div className="flex flex-col md:items-end gap-3 mt-4 md:mt-0">
                                    <div className="text-neon-green font-bold text-lg bg-green-500/10 px-4 py-1.5 rounded-lg border border-green-500/20 w-fit md:w-auto">
                                        Marks: {test.user_score !== null ? test.user_score : '?'}/{test.total_score || '?'}
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => handleViewData(test.id, 'report')} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/20">Report</button>
                                        <button onClick={() => handleViewData(test.id, 'leaderboard')} className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-purple-500/20">Leaderboard</button>
                                    </div>
                                </div>
                            );
                        } else if (diffMins < 0) {
                            statusUI = <span className="text-gray-500 font-bold bg-gray-800 px-6 py-3 rounded-xl mt-4 md:mt-0 block w-fit">Upcoming...</span>;
                        } else if (diffMins >= 0 && diffMins <= 10) {
                            const isCodingTest = test.test_category.toLowerCase() === 'coding';
                            const targetUrl = isCodingTest ? `/scheduled-coding-test/${test.id}` : `/scheduled-test/${test.id}`;
                            statusUI = <button onClick={() => navigate(targetUrl)} className="bg-green-600 hover:bg-green-500 text-white animate-pulse px-8 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(34,197,94,0.4)] mt-4 md:mt-0 w-full md:w-auto">Start Now</button>;
                        } else {
                            statusUI = <span className="text-red-500 font-bold flex items-center gap-2 bg-red-500/10 px-6 py-3 rounded-xl border border-red-500/20 mt-4 md:mt-0 w-fit"><FiAlertCircle /> Closed</span>;
                        }

                        return (
                            <div key={test.id} className="bg-[#1E293B] p-6 md:p-8 rounded-3xl border border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gray-500 transition-colors shadow-lg">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{test.title}</h3>
                                    <div className="flex flex-wrap gap-3 md:gap-6 mt-3 text-sm text-gray-400 font-mono">
                                        <span className="uppercase tracking-widest text-blue-400 font-bold bg-blue-500/10 px-3 py-1 rounded-md border border-blue-500/20">{test.test_category}</span>
                                        <span className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-md"><FiClock className="text-gray-500"/> {new Date(test.scheduled_time).toLocaleString()}</span>
                                        <span className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-md">Duration: {test.duration_minutes} Mins</span>
                                    </div>
                                </div>
                                <div className="w-full md:w-auto">{statusUI}</div>
                            </div>
                        )
                    })}
                    {tests.length === 0 && (
                        <div className="text-center p-16 border border-dashed border-gray-700 rounded-3xl text-gray-500 bg-[#1E293B]/30">
                            <FiFileText className="text-4xl mx-auto mb-4 opacity-50" />
                            <p className="text-lg">No tests have been scheduled by the admin yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
// placement-trainer/src/pages/Aptitude/TestPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import API_BASE from "../../api";
import { FiX, FiChevronRight, FiChevronLeft, FiCheckCircle, FiXCircle, FiGrid, FiShield, FiAlertTriangle, FiClock } from "react-icons/fi";

export default function TestPage() {
  const { topic, mode } = useParams();
  const decodedTopic = decodeURIComponent(topic);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, fetchStats } = useAuth();

  // Test Data State
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Interactive State
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showMobilePalette, setShowMobilePalette] = useState(false);
  
  // Proctoring, Security & Timer State
  const [hasStarted, setHasStarted] = useState(false);
  const [violations, setViolations] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 Minutes default timer

  // Submission State
  const [isFinished, setIsFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // --- 1. FETCH QUESTIONS ---
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const isTechnical = location.pathname.includes('/technical');
        const endpoint = isTechnical ? '/api/technical/mcqs/test' : '/api/aptitude/mcqs/test';
        
        const count = decodedTopic === "Final Aptitude Test" ? 50 : 20;
        // Set time based on questions: 1.5 mins per question
        setTimeLeft(count * 90); 

        const res = await axios.post(`${API_BASE}${endpoint}`, {
          topic: decodedTopic,
          difficulty: mode,
          count: count,
        });
        setQuestions(res.data);
      } catch (err) {
        console.error("Failed to load questions:", err);
        alert("Failed to generate test. Try again.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [decodedTopic, mode, location.pathname, navigate]);

  // --- 2. ANTI-CHEAT LISTENERS ---
  useEffect(() => {
    if (!hasStarted || isFinished) return;

    const handleViolationTrigger = () => {
      setViolations(prev => prev + 1);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) handleViolationTrigger(); // User switched tabs or minimized
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) handleViolationTrigger(); // User pressed ESC
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [hasStarted, isFinished]);

  // --- 3. TIMER LOGIC ---
  useEffect(() => {
    if (!hasStarted || isFinished || submitting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishTest(true); // Auto submit on timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStarted, isFinished, submitting]);

  // Format Time (MM:SS)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // --- 4. VIOLATION LOGIC ---
  useEffect(() => {
    if (violations === 1) {
      setShowWarning(true);
    } else if (violations >= 2 && !isFinished && !submitting) {
      alert("Security Violation: You switched tabs or exited full-screen again. The test is being automatically submitted.");
      finishTest(true); // Force Auto-Submit
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [violations]);

  const startExam = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (e) {
      console.log("Could not enter fullscreen", e);
    }
    setHasStarted(true);
  };

  const returnToFullscreen = async () => {
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (e) {
      console.log(e);
    }
    setShowWarning(false);
  };

  // --- 5. TEST NAVIGATION & SUBMISSION ---
  const handleSelectOption = (opt) => setUserAnswers(prev => ({ ...prev, [currentIdx]: opt }));
  const handleNext = () => { if (currentIdx < questions.length - 1) { setCurrentIdx(curr => curr + 1); window.scrollTo({ top: 0 }); } };
  const handlePrev = () => { if (currentIdx > 0) { setCurrentIdx(curr => curr - 1); window.scrollTo({ top: 0 }); } };

  const handleManualSubmit = () => finishTest(false);

  const finishTest = async (isForced = false) => {
    if (submitting) return;
    if (!isForced && !window.confirm("Are you sure you want to submit the test?")) return;
    
    setSubmitting(true);

    // Force exit fullscreen gracefully when test is done
    if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.log(err));
    }
    
    let calculatedScore = 0;
    questions.forEach((q, idx) => {
        if (userAnswers[idx] === q.answer) calculatedScore += 1;
    });
    setFinalScore(calculatedScore);

    try {
      await axios.post(`${API_BASE}/api/test/submit`, {
        user_id: user.id,
        topic: decodedTopic,
        mode: mode,
        score: calculatedScore,
        total: questions.length,
      });
      await fetchStats(); 
      setIsFinished(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      alert("Error submitting score.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- RENDERS ---

  if (loading) {
    return (
      <div className="min-h-screen bg-game-bg flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold font-display animate-pulse text-neon-blue">Generating Test...</h2>
        <p className="text-gray-500 text-sm mt-2">AI is preparing your unique question set.</p>
      </div>
    );
  }

  // PRE-EXAM SECURITY SCREEN (Normal Layout)
  if (!hasStarted && !isFinished) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-game-bg text-white">
            <FiShield className="text-7xl text-neon-blue mb-6 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]" />
            <h1 className="text-4xl font-black mb-4 font-display">Proctored Exam Environment</h1>
            <p className="text-gray-400 mb-8 max-w-md">To maintain the integrity of Placify's leaderboard, this test is strictly monitored.</p>
            
            <div className="bg-black/40 border border-white/10 p-6 md:p-8 rounded-3xl max-w-xl text-left space-y-4 text-gray-300 shadow-2xl">
                <p className="text-red-400 font-bold flex items-center gap-2 mb-2"><FiAlertTriangle/> Important Rules:</p>
                <ul className="list-disc pl-5 space-y-3 marker:text-neon-blue">
                    <li>This test is timed at <strong>{Math.floor((questions.length * 90)/60)} Minutes</strong>.</li>
                    <li>This test will launch in <strong>Full-Screen Mode</strong>, hiding the sidebar and navigation.</li>
                    <li><strong>Tab switching is disabled.</strong> If you switch tabs, you receive 1 warning.</li>
                    <li><strong>Exiting full-screen is disabled.</strong> Hitting ESC triggers a warning.</li>
                    <li>A <strong>Second Violation</strong> will immediately auto-submit your exam with a score of 0 for remaining questions.</li>
                    <li>Copying, Pasting, and Right-Clicking are permanently disabled.</li>
                </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <button onClick={() => navigate(-1)} className="px-8 py-4 bg-gray-800 rounded-xl font-bold hover:bg-gray-700 transition-colors uppercase tracking-widest text-sm">
                    Cancel & Go Back
                </button>
                <button onClick={startExam} className="px-8 py-4 bg-neon-blue text-black font-black rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(45,212,191,0.3)] uppercase tracking-widest text-sm">
                    Accept Rules & Start
                </button>
            </div>
        </div>
    );
  }

  // RESULTS & DETAILED FEEDBACK SCREEN (Normal Layout - brings back Sidebar/Navbar)
  if (isFinished) {
      const accuracy = Math.round((finalScore / questions.length) * 100);
      const passed = finalScore >= 15;

      return (
        <div className="min-h-screen bg-game-bg text-white p-4 md:p-8 animate-fade-in">
          <div className="max-w-5xl mx-auto">
            <div className="glass-panel p-8 rounded-3xl text-center mb-10 border border-white/10 bg-black/40 mt-10">
              <div className="text-6xl mb-4">{passed ? '🏆' : '🎯'}</div>
              <h1 className={`text-4xl font-black mb-2 ${passed ? 'text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]' : 'text-neon-blue'}`}>
                  {passed ? 'Test Passed!' : 'Keep Practicing!'}
              </h1>
              <p className="text-gray-400 text-lg mb-8 font-bold max-w-md mx-auto leading-relaxed">
                  {passed 
                      ? "Great job! If this is your first time passing this specific test, XP has been added to your profile." 
                      : "Score 15 or higher to pass the test and earn XP. Review the explanations below and try again!"}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-2xl p-6 w-full sm:w-48">
                  <p className="text-yellow-500 font-bold uppercase text-xs mb-1 tracking-widest">Score</p>
                  <p className="text-4xl font-black">{finalScore} / {questions.length}</p>
                </div>
                <div className="bg-neon-blue/10 border-2 border-neon-blue/30 rounded-2xl p-6 w-full sm:w-48">
                  <p className="text-neon-blue font-bold uppercase text-xs mb-1 tracking-widest">Accuracy</p>
                  <p className="text-4xl font-black">{accuracy}%</p>
                </div>
              </div>
              
              <button onClick={() => navigate('/dashboard')} className="mt-8 px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all uppercase tracking-widest text-sm">
                Return to Dashboard
              </button>
            </div>

            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FiCheckCircle className="text-neon-green" /> Detailed Review
            </h2>
            
            <div className="space-y-6 pb-20">
              {questions.map((q, i) => {
                const isCorrect = userAnswers[i] === q.answer;
                const notAttempted = !userAnswers[i];

                return (
                  <div key={i} className="glass-panel p-6 rounded-2xl border border-white/10 bg-black/40">
                    <div className="flex gap-4 mb-4">
                      <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isCorrect ? 'bg-green-500/20 text-green-400' : notAttempted ? 'bg-gray-700 text-gray-400' : 'bg-red-500/20 text-red-400'}`}>
                        {i + 1}
                      </span>
                      <h3 className="text-lg font-medium leading-snug">{q.question}</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3 pl-12 mb-4">
                      {q.options.map((opt, optIdx) => {
                        const isUsersPick = userAnswers[i] === opt;
                        const isActualAnswer = q.answer === opt;
                        let optStyle = "bg-white/5 border-white/10 text-gray-400";
                        let icon = null;

                        if (isActualAnswer) {
                          optStyle = "bg-green-500/20 border-green-500/50 text-green-400 font-bold shadow-[0_0_15px_rgba(34,197,94,0.2)]";
                          icon = <FiCheckCircle className="ml-auto" />;
                        } else if (isUsersPick && !isActualAnswer) {
                          optStyle = "bg-red-500/20 border-red-500/50 text-red-400 font-bold";
                          icon = <FiXCircle className="ml-auto" />;
                        }

                        return (
                          <div key={optIdx} className={`p-3 rounded-xl border flex items-center gap-3 text-sm ${optStyle}`}>
                            <span className="opacity-70 font-mono">{String.fromCharCode(65 + optIdx)}.</span> {opt} {icon}
                          </div>
                        );
                      })}
                    </div>

                    <div className="pl-12">
                      <div className="bg-neon-blue/10 border border-neon-blue/20 rounded-xl p-4 text-sm text-blue-100">
                        <span className="font-bold text-neon-blue block mb-1">Explanation:</span>
                        {q.explanation || "No explanation provided for this question."}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
  }

  // --- 💻 MAIN TEST UI (ACTIVE TEST - FIXED OVERLAY TO HIDE SIDEBAR) ---
  const currentQuestion = questions[currentIdx];
  const isLastQuestion = currentIdx === questions.length - 1;

  const renderQuestionPalette = () => (
    <div className="grid grid-cols-5 gap-2 mt-4">
      {questions.map((_, i) => {
        const isAttempted = !!userAnswers[i];
        const isCurrent = i === currentIdx;
        let btnStyle = "bg-white/5 text-gray-400 hover:bg-white/10";
        if (isAttempted) btnStyle = "bg-neon-blue/20 text-neon-blue font-bold shadow-[0_0_10px_rgba(45,212,191,0.2)]";
        if (isCurrent) btnStyle += " ring-2 ring-white scale-110 z-10 bg-white/10";
        
        return (
          <button key={i} onClick={() => { setCurrentIdx(i); setShowMobilePalette(false); }} className={`w-10 h-10 rounded-lg text-sm transition-all flex items-center justify-center border border-white/10 ${btnStyle}`}>
            {i + 1}
          </button>
        );
      })}
    </div>
  );

  return (
    // SECURITY WRAPPER: Fixed inset-0 covers Sidebar/Navbar. Disables copy, paste, cut, and right-click
    <div 
      className="fixed inset-0 z-[5000] w-screen h-screen overflow-y-auto bg-game-bg text-white flex flex-col pb-24 select-none"
      onCopy={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    >
      
      {/* SECURITY WARNING MODAL */}
      {showWarning && (
        <div className="fixed inset-0 z-[6000] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center text-center p-6">
            <FiAlertTriangle className="text-red-500 text-8xl mb-6 animate-pulse drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]" />
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Security Violation</h2>
            <p className="text-gray-300 text-lg max-w-xl mb-8 leading-relaxed">
                You navigated away from the exam screen. This is a strict violation of testing rules.
                <br/><br/>
                <span className="text-red-400 font-bold bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/30 inline-block">
                  If you switch tabs or exit full-screen again, your exam will be permanently auto-submitted.
                </span>
            </p>
            <button 
                onClick={returnToFullscreen}
                className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl transition-all shadow-[0_0_30px_rgba(220,38,38,0.4)] uppercase tracking-widest"
            >
                I Understand, Return to Test
            </button>
        </div>
      )}

      {/* TOP HEADER WITH TIMER */}
      <div className="flex items-center justify-between p-4 md:p-6 sticky top-0 bg-black/60 backdrop-blur-xl z-30 border-b border-white/5">
        <button onClick={() => {
            if(window.confirm("Are you sure you want to exit? Your progress will be lost.")) {
              if (document.fullscreenElement) document.exitFullscreen().catch(e=>e);
              navigate(-1);
            }
          }} 
          className="text-gray-500 hover:text-white transition-colors bg-white/5 p-2 rounded-xl flex items-center gap-2"
        >
            <FiX size={20} /> <span className="text-xs font-bold uppercase hidden md:inline">Quit Exam</span>
        </button>
        
        {/* NEW TIMER */}
        <div className={`text-2xl font-mono font-black flex items-center gap-2 tracking-widest ${timeLeft < 180 ? 'text-red-500 animate-pulse' : 'text-neon-blue'}`}>
            <FiClock /> {formatTime(timeLeft)}
        </div>

        {/* Mobile Palette Toggle */}
        <button onClick={() => setShowMobilePalette(!showMobilePalette)} className="lg:hidden text-gray-400 hover:text-white bg-white/5 p-2 rounded-xl">
            <FiGrid size={20} />
        </button>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 flex gap-8">
        
        {/* LEFT: QUESTION AREA */}
        <div className="flex-1 animate-fade-in-up">
          <div className="flex justify-between items-end mb-6">
            <span className="text-neon-purple text-sm font-bold tracking-widest uppercase bg-neon-purple/10 px-3 py-1 rounded-md border border-neon-purple/20">
              Question {currentIdx + 1} of {questions.length}
            </span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-10 leading-snug bg-white/5 p-6 rounded-2xl border border-white/10 select-none">
              {currentQuestion.question}
          </h2>
          
          <div className="space-y-4">
            {currentQuestion.options.map((opt, i) => {
                const isSelected = userAnswers[currentIdx] === opt;
                const defaultStyle = "bg-black/40 border-white/10 text-gray-300 hover:bg-white/5 hover:border-white/20";
                const selectedStyle = "bg-neon-blue/10 border-neon-blue text-neon-blue shadow-[0_0_15px_rgba(45,212,191,0.2)] scale-[1.01]";

                return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(opt)}
                      className={`w-full p-5 rounded-2xl border transition-all text-left text-lg font-medium flex items-center gap-4 ${isSelected ? selectedStyle : defaultStyle}`}
                    >
                      <span className={`flex-shrink-0 w-8 h-8 rounded-lg border-2 flex items-center justify-center font-bold text-sm transition-colors ${isSelected ? 'border-neon-blue text-neon-blue bg-neon-blue/20' : 'border-gray-600 text-gray-500'}`}>
                          {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </button>
                );
            })}
          </div>
        </div>

        {/* RIGHT: DESKTOP PALETTE */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-black/40 sticky top-28">
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
              <h3 className="font-bold text-white flex items-center gap-2"><FiGrid className="text-neon-blue"/> Navigation</h3>
            </div>
            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4 justify-center">
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-neon-blue/30 border border-neon-blue"></div> Attempted</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-white/10 border border-white/20"></div> Unattempted</span>
            </div>
            {renderQuestionPalette()}
          </div>
        </div>
      </div>

      {/* BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-xl border-t border-white/10 p-4 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-2">
            <button onClick={handlePrev} disabled={currentIdx === 0} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all uppercase tracking-widest text-sm ${currentIdx === 0 ? 'opacity-0 pointer-events-none' : 'bg-white/5 hover:bg-white/10 text-white'}`}>
                <FiChevronLeft size={20}/> Prev
            </button>

            {!isLastQuestion ? (
                <button onClick={handleNext} className="flex items-center gap-2 px-8 py-3 rounded-xl font-black transition-all shadow-lg bg-white text-black hover:bg-gray-200 uppercase tracking-widest text-sm">
                    Next <FiChevronRight size={20}/>
                </button>
            ) : (
                <button onClick={handleManualSubmit} disabled={submitting} className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black transition-all shadow-[0_0_20px_rgba(45,212,191,0.3)] bg-neon-blue text-black hover:scale-105 uppercase tracking-widest text-sm ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {submitting ? "Submitting..." : "Submit Exam"}
                </button>
            )}
        </div>
      </div>

      {/* MOBILE PALETTE DRAWER */}
      {showMobilePalette && (
        <div className="fixed inset-0 z-[6000] lg:hidden flex flex-col justify-end bg-black/60 backdrop-blur-sm" onClick={() => setShowMobilePalette(false)}>
          <div className="bg-game-bg border-t border-white/10 rounded-t-3xl p-6 animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-white flex items-center gap-2"><FiGrid className="text-neon-blue"/> Jump to Question</h3>
               <button onClick={() => setShowMobilePalette(false)} className="p-2 bg-white/5 rounded-xl"><FiX /></button>
            </div>
            {renderQuestionPalette()}
          </div>
        </div>
      )}

    </div>
  );
}
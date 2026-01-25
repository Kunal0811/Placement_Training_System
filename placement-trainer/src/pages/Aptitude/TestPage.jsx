import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function TestPage() {
  const { topic, mode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const basePath = location.pathname.startsWith('/technical') ? 'technical' : 'aptitude';
  const isFinalTest = topic === "Final Aptitude Test";
  const initialTime = isFinalTest ? 3600 : 1800;
  const questionCount = isFinalTest ? 50 : 20;

  const { user } = useAuth();
  const userId = user?.id;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(initialTime);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const submissionLock = useRef(false);
  const answersRef = useRef(answers);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    if (!userId) navigate('/login');
  }, [userId, navigate]);

  useEffect(() => {
    if (!userId) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchQuestions = async () => {
      setLoading(true);
      setQuestions([]);
      setAnswers({});
      setScore(null);
      setTimeLeft(initialTime);
      try {
        const res = await fetch(`${API_BASE}/api/${basePath}/mcqs/test`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, count: questionCount, difficulty: mode }),
          signal,
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.detail || `HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        if (!signal.aborted) {
          setQuestions(Array.isArray(data) ? data : []);
          startTimeRef.current = Date.now();
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Error fetching questions:", err);
          alert(`Error loading test: ${err.message}`);
        }
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };

    fetchQuestions();
    return () => controller.abort();
  }, [topic, mode, userId, questionCount, basePath, initialTime]);

  useEffect(() => {
    if (loading || score !== null) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          submitTest(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [loading, score]);

  const handleSelect = (qIdx, option) => {
    setAnswers({ ...answers, [qIdx]: option });
  };

  const submitTest = async (autoSubmitted = false) => {
    if (submissionLock.current) return;
    submissionLock.current = true;
    setSubmitting(true);
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answersRef.current[idx] === q.answer) correct++;
    });
    const endTime = Date.now();
    const timeTaken = Math.round((endTime - startTimeRef.current) / 1000);
    try {
      await fetch(`${API_BASE}/api/test/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          topic,
          mode,
          score: correct,
          total: questions.length,
          time_taken: timeTaken,
        }),
      });
      setScore(correct);
      if (autoSubmitted) {
        alert("Time's up! Your test has been automatically submitted.");
      }
    } catch (err) {
      console.error("Error submitting test:", err);
      alert("Failed to submit test results. Please try again.");
      submissionLock.current = false;
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBackNavigation = () => {
    if (isFinalTest) {
        navigate('/aptitude');
    } else {
        navigate(`/${basePath}/modes/${encodeURIComponent(topic)}`);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-6">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-r-4 border-purple-500 rounded-full animate-spin-reverse"></div>
            <div className="absolute inset-4 border-b-4 border-pink-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-2xl font-semibold text-neon-blue">Generating your test...</p>
          <p className="text-gray-400">Our AI is preparing your questions. This might take a moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mb-10">
      <h1 className="text-4xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-pink text-glow">
        🚀 {decodeURIComponent(topic)}
      </h1>
      <p className="text-center text-gray-400 mb-6">
        Mode: <span className="font-semibold text-neon-blue">{mode.toUpperCase()}</span>
      </p>

      {score === null && (
        <div className="sticky top-20 bg-dark-card/80 backdrop-blur-sm py-3 z-10 shadow-lg mb-6 rounded-lg border border-neon-pink/30">
          <p className="text-center text-3xl font-bold text-neon-pink text-glow">
            Time Left: {formatTime(timeLeft)}
          </p>
        </div>
      )}

      {score === null ? (
        <>
          {questions.map((q, idx) => (
            <div key={idx} className="mb-6 p-6 bg-dark-card rounded-lg shadow-md border border-neon-blue/20">
              <p className="font-semibold text-lg text-white mb-4">{idx + 1}. {q.question}</p>
              <ul className="space-y-3">
                {q.options.map((opt, i) => (
                  <li key={i}>
                    <label className={`flex items-center space-x-4 p-4 rounded-lg cursor-pointer transition-all border-2 ${answers[idx] === opt ? 'border-neon-blue bg-neon-blue/20' : 'border-gray-700 hover:border-neon-blue/50'}`}>
                      <input
                        type="radio"
                        name={`q-${idx}`}
                        value={opt}
                        checked={answers[idx] === opt}
                        onChange={() => handleSelect(idx, opt)}
                        className="w-5 h-5 accent-neon-blue"
                      />
                      <span className="text-gray-300">{opt}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <button
            onClick={() => submitTest(false)}
            disabled={submitting}
            className="mt-6 w-full bg-neon-green text-black font-bold py-3 rounded-lg hover:scale-105 transition-transform animate-glow disabled:bg-gray-600 disabled:animate-none"
          >
            {submitting ? "Submitting..." : "✅ Submit Test"}
          </button>
        </>
      ) : (
        <div>
          <div className="mb-8 p-8 bg-dark-card rounded-lg shadow-lg text-center border-t-4 border-neon-green">
            <h2 className="text-4xl font-bold text-neon-green text-glow mb-2">🎉 Test Complete!</h2>
            <p className="text-6xl font-bold text-white my-4">{score} / {questions.length}</p>
            <p className="text-xl text-gray-300 mt-2">
              {score >= questions.length * 0.75 ? "🌟 Great job! You passed!" : "Keep practicing!"}
            </p>
          </div>

          {questions.map((q, idx) => {
            const userAnswer = answers[idx] || answersRef.current[idx];
            const isCorrect = userAnswer === q.answer;
            return (
              <div key={idx} className={`mb-4 p-6 rounded-lg shadow-md border-l-4 ${isCorrect ? "bg-neon-green/10 border-neon-green" : "bg-red-500/10 border-red-500"}`}>
                <p className="font-semibold text-lg text-white mb-3">{idx + 1}. {q.question}</p>
                <p className="mb-2"><span className="font-medium text-gray-400">✅ Correct Answer: </span><span className="font-semibold text-neon-green">{q.answer}</span></p>
                <p className="mb-3"><span className="font-medium text-gray-400">📝 Your Answer: </span><span className={`font-semibold ${isCorrect ? "text-neon-green" : "text-red-500"}`}>{userAnswer || "Not Attempted"}</span></p>
                <div className="bg-dark-card p-4 rounded border border-gray-700 mt-4">
                  <p className="text-sm text-neon-blue font-medium mb-1">💡 Explanation:</p>
                  <p className="text-gray-300">{q.explanation}</p>
                </div>
              </div>
            );
          })}

          <button
            onClick={handleBackNavigation}
            className="mt-8 w-full bg-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            {isFinalTest ? '← Back to Aptitude' : '← Back to Levels'}
          </button>
        </div>
      )}
    </div>
  );
}
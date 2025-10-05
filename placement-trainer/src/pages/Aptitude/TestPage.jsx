// src/pages/Aptitude/TestPage.jsx
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
  }, [topic, mode, userId, questionCount, basePath]);

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
        <div className="text-center">
          <p className="text-2xl font-semibold text-blue-600">Generating your test...</p>
          <p className="text-gray-500">Our AI is preparing your questions. This might take a moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mb-10">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">
        🚀 {decodeURIComponent(topic)}
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Mode: <span className="font-semibold text-blue-600">{mode.toUpperCase()}</span>
      </p>

      {score === null && (
        <div className="sticky top-0 bg-white py-2 z-10 shadow-sm mb-4 rounded-lg">
          <p className="text-center text-2xl font-bold text-red-600">
            Time Left: {formatTime(timeLeft)}
          </p>
        </div>
      )}

      {score === null ? (
        <>
          {questions.map((q, idx) => (
            <div key={idx} className="mb-6 p-6 bg-white rounded-lg shadow-md">
              <p className="font-semibold text-lg mb-4">{idx + 1}. {q.question}</p>
              <ul className="space-y-3">
                {q.options.map((opt, i) => (
                  <li key={i}>
                    <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name={`q-${idx}`}
                        value={opt}
                        checked={answers[idx] === opt}
                        onChange={() => handleSelect(idx, opt)}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-700">{opt}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <button
            onClick={() => submitTest(false)}
            disabled={submitting}
            className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {submitting ? "Submitting..." : "✅ Submit Test"}
          </button>
        </>
      ) : (
        <div>
          <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-lg text-center">
            <h2 className="text-3xl font-bold text-green-700 mb-2">🎉 Test Complete!</h2>
            <p className="text-4xl font-bold text-blue-600">{score} / {questions.length}</p>
            <p className="text-lg text-gray-700 mt-2">
              {score >= questions.length * 0.75 ? "🌟 Great job! You passed!" : "Keep practicing!"}
            </p>
          </div>

          {questions.map((q, idx) => {
            const userAnswer = answers[idx] || answersRef.current[idx];
            const isCorrect = userAnswer === q.answer;
            return (
              <div key={idx} className={`mb-4 p-6 rounded-lg shadow-md border-l-4 ${isCorrect ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"}`}>
                <p className="font-semibold text-lg mb-3">{idx + 1}. {q.question}</p>
                <p className="mb-2"><span className="font-medium text-gray-700">✅ Correct Answer: </span><span className="font-semibold text-green-700">{q.answer}</span></p>
                <p className="mb-3"><span className="font-medium text-gray-700">📝 Your Answer: </span><span className={`font-semibold ${isCorrect ? "text-green-700" : "text-red-700"}`}>{userAnswer || "Not Attempted"}</span></p>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <p className="text-sm text-gray-600 font-medium mb-1">💡 Explanation:</p>
                  <p className="text-gray-700">{q.explanation}</p>
                </div>
              </div>
            );
          })}

          <button
            onClick={handleBackNavigation}
            className="mt-4 w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 font-semibold"
          >
            {isFinalTest ? '← Back to Aptitude' : '← Back to Levels'}
          </button>
        </div>
      )}
    </div>
  );
}
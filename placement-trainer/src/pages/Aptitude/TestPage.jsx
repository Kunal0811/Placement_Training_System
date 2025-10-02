// src/pages/TestPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const MODES = ["easy", "moderate", "hard"];

export default function TestPage() {
  const { topic } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const userId = user?.id;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [mode, setMode] = useState("easy");
  const [modeUnlocked, setModeUnlocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if not logged in
  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-600">Please login to take tests.</p>
      </div>
    );
  }

  // Check mode unlock status
  useEffect(() => {
    const checkMode = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/test/mode-status`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, topic, mode }),
        });
        const data = await res.json();
        console.log("Mode status response:", data);
        setModeUnlocked(data.unlocked);
      } catch (err) {
        console.error("Error checking mode status:", err);
        setModeUnlocked(false);
      }
    };
    checkMode();
  }, [userId, topic, mode]);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!modeUnlocked) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setQuestions([]);
      setAnswers({});
      setScore(null);

      try {
        const res = await fetch(`${API_BASE}/api/mcqs/test`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, count: 20, difficulty: mode }),
        });
        const data = await res.json();
        setQuestions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching questions:", err);
        alert("Error loading test.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [topic, mode, modeUnlocked]);

  const handleSelect = (qIdx, option) => {
    setAnswers({ ...answers, [qIdx]: option });
  };

  const submitTest = async () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) correct++;
    });
    setScore(correct);

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/test/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          topic,
          mode,
          score: correct,
          total: questions.length,
        }),
      });
      const data = await res.json();
      console.log("Submitted:", data);
    } catch (err) {
      console.error("Error submitting test:", err);
      alert("Test submitted locally, but failed to save results.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextMode = () => {
    const currentIdx = MODES.indexOf(mode);
    if (currentIdx < MODES.length - 1) {
      setMode(MODES[currentIdx + 1]);
      window.scrollTo(0, 0);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl text-gray-600">⏳Loading Test...</p>
    </div>
  );

  if (!modeUnlocked) return (
    <div className="max-w-2xl mx-auto p-6 mt-10">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Mode Locked</h3>
        <p className="text-yellow-700">
          Complete previous mode(s) with at least 75% to unlock <strong>{mode}</strong>.
        </p>
        {mode !== "easy" && (
          <button
            onClick={() => setMode("easy")}
            className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
          >
            ← Start Easy Mode
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 mb-10">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">
        🚀 {decodeURIComponent(topic)}
      </h1>

      {/* Mode Selector */}
      <div className="mb-4 flex justify-center items-center space-x-4">
        <label className="font-semibold text-gray-700">Select Mode:</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1"
          disabled={!modeUnlocked || score !== null || submitting}
        >
          {MODES.map((m) => (
            <option key={m} value={m}>{m.toUpperCase()}</option>
          ))}
        </select>
      </div>

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
            onClick={submitTest}
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
              {score >= questions.length * 0.75 ? "🌟 Great job!" : "Keep practicing!"}
            </p>
          </div>

          {questions.map((q, idx) => {
            const userAnswer = answers[idx];
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

          {score >= questions.length * 0.75 && MODES.indexOf(mode) < MODES.length - 1 && (
            <button onClick={handleNextMode} className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold text-lg">
              ▶️ Proceed to {MODES[MODES.indexOf(mode) + 1].toUpperCase()} Mode
            </button>
          )}

          <button
            onClick={() => navigate(`/aptitude/notes/${encodeURIComponent(topic.split(' - ')[0] || topic)}`)}
            className="mt-4 w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 font-semibold"
          >
            ← Back to Notes
          </button>
        </div>
      )}
    </div>
  );
}

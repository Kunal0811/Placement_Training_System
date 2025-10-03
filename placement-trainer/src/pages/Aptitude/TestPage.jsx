// src/pages/TestPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function TestPage() {
  const { topic, mode } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const userId = user?.id;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  // Fetch questions
  useEffect(() => {
    if (!userId) return;

    const fetchQuestions = async () => {
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
  }, [topic, mode, userId]);

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
      await fetch(`${API_BASE}/api/test/submit`, {
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
    } catch (err) {
      console.error("Error submitting test:", err);
      alert("Test submitted locally, but failed to save results.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-600">Please login to take tests.</p>
      </div>
    );
  }

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
              {score >= questions.length * 0.75 ? "🌟 Great job! You passed!" : "Keep practicing!"}
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

          <button
            onClick={() => navigate(`/aptitude/modes/${encodeURIComponent(topic)}`)}
            className="mt-4 w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 font-semibold"
          >
            ← Back to Levels
          </button>
        </div>
      )}
    </div>
  );
}
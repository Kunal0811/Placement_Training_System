import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function TestPage() {
  const { topic } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  // 🔑 useRef to ensure fetch only happens once
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (hasFetched.current) return; // ✅ Stop duplicate calls
      hasFetched.current = true;

      try {
        const res = await fetch(`${API_BASE}/api/mcqs/test`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic }),
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setQuestions(data);
        }
      } catch (err) {
        console.error("Failed to fetch test:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [topic]);

  const handleSelect = (qIdx, option) => {
    setAnswers({ ...answers, [qIdx]: option });
  };

  const submitTest = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) correct++;
    });
    setScore(correct);
  };

  if (loading) return <div className="p-6 text-center">⏳ Loading Test...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        🚀 {topic} - Test
      </h1>

      {score === null ? (
        <>
          {questions.map((q, idx) => (
            <div key={idx} className="mb-6 p-4 bg-white rounded shadow">
              <p className="font-semibold mb-2">
                {idx + 1}. {q.question}
              </p>
              <ul className="space-y-2">
                {q.options.map((opt, i) => (
                  <li key={i}>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`q-${idx}`}
                        value={opt}
                        checked={answers[idx] === opt}
                        onChange={() => handleSelect(idx, opt)}
                      />
                      <span>{opt}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <button
            onClick={submitTest}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            ✅ Submit Test
          </button>
        </>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-green-700 text-center mb-6">
            🎉 You scored {score} / {questions.length}
          </h2>

          {questions.map((q, idx) => {
            const userAnswer = answers[idx];
            const isCorrect = userAnswer === q.answer;

            return (
              <div
                key={idx}
                className={`mb-4 p-4 rounded-lg shadow ${
                  isCorrect ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <p className="font-semibold mb-2">
                  {idx + 1}. {q.question}
                </p>
                <p>
                  ✅ Correct Answer:{" "}
                  <span className="font-medium text-green-700">{q.answer}</span>
                </p>
                <p>
                  📝 Your Answer:{" "}
                  <span
                    className={`font-medium ${
                      isCorrect ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {userAnswer || "Not Attempted"}
                  </span>
                </p>
                <p className="mt-2 text-gray-700">
                  💡 Explanation: {q.explanation || "No explanation provided."}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

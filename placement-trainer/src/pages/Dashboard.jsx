import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("results") || "[]");
    setResults(history.reverse()); // newest first
  }, []);

  if (!results.length)
    return <p className="p-6 text-center text-gray-600">No test history yet.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">📊 Dashboard</h1>
      <table className="w-full border-collapse bg-white shadow rounded">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-3 border">Date</th>
            <th className="p-3 border">Topic</th>
            <th className="p-3 border">Score</th>
            <th className="p-3 border">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, idx) => (
            <tr key={idx} className="text-center">
              <td className="p-3 border">
                {new Date(r.date).toLocaleString()}
              </td>
              <td className="p-3 border">{r.topic}</td>
              <td className="p-3 border">
                {r.score} / {r.total}
              </td>
              <td className="p-3 border">
                {((r.score / r.total) * 100).toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

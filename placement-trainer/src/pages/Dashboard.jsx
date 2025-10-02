// Dashboard.jsx
import React, { useEffect, useState } from "react";
import API_BASE, { getUserDetails } from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


export default function Dashboard() {
  const { user: authUser } = useAuth(); // get user from context
  const [user, setUser] = useState(null);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser) return; // Shouldn't happen if ProtectedRoute works

    async function fetchUser() {
      try {
        const data = await getUserDetails(authUser.id);
        setUser(data.user);
        setTests(data.tests || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [authUser]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-center mt-10">No user data found.</p>;

  // ------------------------------
  // Prepare data for charts
  // ------------------------------

  // Bar Chart Data → Average score per topic per mode
  const barChartData = [];
  const topicModeStats = {};

  tests.forEach((test) => {
    if (!topicModeStats[test.topic]) {
      topicModeStats[test.topic] = {
        easy: { totalScore: 0, count: 0 },
        moderate: { totalScore: 0, count: 0 },
        hard: { totalScore: 0, count: 0 },
      };
    }
    const mode = test.mode.toLowerCase();
    topicModeStats[test.topic][mode].totalScore += test.score;
    topicModeStats[test.topic][mode].count += 1;
  });

  Object.keys(topicModeStats).forEach((topic) => {
    barChartData.push({
      topic,
      easy: topicModeStats[topic].easy.count
        ? (
            topicModeStats[topic].easy.totalScore /
            topicModeStats[topic].easy.count
          ).toFixed(2)
        : 0,
      moderate: topicModeStats[topic].moderate.count
        ? (
            topicModeStats[topic].moderate.totalScore /
            topicModeStats[topic].moderate.count
          ).toFixed(2)
        : 0,
      hard: topicModeStats[topic].hard.count
        ? (
            topicModeStats[topic].hard.totalScore /
            topicModeStats[topic].hard.count
          ).toFixed(2)
        : 0,
    });
  });

  // Line Chart Data → Attempt-wise progress
  const lineChartData = [];
  const topicModeAttempts = {};

  tests.forEach((test) => {
    const key = `${test.topic}_${test.mode}`;
    if (!topicModeAttempts[key]) topicModeAttempts[key] = 0;
    topicModeAttempts[key] += 1;

    lineChartData.push({
      topic: test.topic,
      mode: test.mode,
      score: test.score,
      attempt: topicModeAttempts[key],
    });
  });

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Profile Details */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Profile Details</h2>
        <p>
          <strong>Name:</strong> {user.fname} {user.lname}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Year:</strong> {user.year}
        </p>
        <p>
          <strong>Field:</strong> {user.field}
        </p>
      </div>

      

      {/* Test History */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Test History</h2>
        {tests.length === 0 ? (
          <p>No tests attempted yet.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2">Topic</th>
                <th className="border-b p-2">Mode</th>
                <th className="border-b p-2">Score</th>
                <th className="border-b p-2">Total</th>
                <th className="border-b p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.id}>
                  <td className="border-b p-2">{test.topic}</td>
                  <td className="border-b p-2">{test.mode}</td>
                  <td className="border-b p-2">{test.score}</td>
                  <td className="border-b p-2">{test.total}</td>
                  <td className="border-b p-2">
                    {new Date(test.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>


      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">
            Average Score per Topic (by Mode)
          </h2>
          {barChartData.length === 0 ? (
            <p>No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="topic" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="easy" fill="#82ca9d" />
                <Bar dataKey="moderate" fill="#8884d8" />
                <Bar dataKey="hard" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Line Chart */}
        {/* Line Charts: Attempt-wise Progress Per Topic */}
<div className="bg-white p-6 rounded shadow mt-6">
  <h2 className="text-xl font-semibold mb-4">Progress by Topic & Mode</h2>

  {Object.keys(
    tests.reduce((acc, test) => {
      if (!acc[test.topic]) acc[test.topic] = [];
      acc[test.topic].push(test);
      return acc;
    }, {})
  ).map((topic) => {
    // Get attempts data for this topic
    const topicTests = tests.filter((t) => t.topic === topic);

    // Prepare attempt-wise data (Easy, Moderate, Hard separate)
    const attemptTracker = { easy: 0, moderate: 0, hard: 0 };
    const topicLineData = topicTests.map((t) => {
      const mode = t.mode.toLowerCase();
      attemptTracker[mode] += 1;
      return {
        attempt: attemptTracker[mode],
        mode,
        score: t.score,
      };
    });

    // Split into datasets for each mode
    const easyData = topicLineData.filter((d) => d.mode === "easy");
    const moderateData = topicLineData.filter((d) => d.mode === "moderate");
    const hardData = topicLineData.filter((d) => d.mode === "hard");

    return (
      <div key={topic} className="mb-8">
        <h3 className="text-lg font-semibold mb-2">{topic}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="attempt" />
            <YAxis />
            <Tooltip />
            <Legend />

            {/* Lines per mode */}
            <Line
              type="monotone"
              dataKey="score"
              data={easyData}
              stroke="#82ca9d"
              name="Easy"
              dot
            />
            <Line
              type="monotone"
              dataKey="score"
              data={moderateData}
              stroke="#8884d8"
              name="Moderate"
              dot
            />
            <Line
              type="monotone"
              dataKey="score"
              data={hardData}
              stroke="#FF8042"
              name="Hard"
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  })}
</div>

      </div>
    </div>
  );
}
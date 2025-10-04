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

export default function Dashboard() {
  const { user: authUser } = useAuth(); // get user from context
  const [user, setUser] = useState(null);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!authUser) return;

    async function fetchUser() {
      try {
        // Pass the current page to the API call
        const data = await getUserDetails(authUser.id, page);
        setUser(data.user);

        // When loading more pages, you would append the new tests instead of replacing them
        const sortedTests = (data.tests || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        setTests(sortedTests);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [authUser, page]);

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

  // --- Start of New Changes: Line Chart Data Processing ---
  
  // Group tests by topic for separate line charts
  const testsByTopic = tests.reduce((acc, test) => {
    if (!acc[test.topic]) {
      acc[test.topic] = [];
    }
    acc[test.topic].push(test);
    return acc;
  }, {});

  // --- End of New Changes ---


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
      <div className="bg-white p-6 rounded shadow mb-6">
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
              {tests.map((test, index) => (
                <tr key={index}>
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
      </div>
      
      {/* --- Start of New Changes: Line Chart Rendering --- */}

      <div className="bg-white p-6 rounded shadow mt-6">
        <h2 className="text-xl font-semibold mb-4">Progress by Topic & Mode</h2>
        {Object.keys(testsByTopic).length === 0 ? (
          <p>No test data available for progress charts.</p>
        ) : (
          Object.keys(testsByTopic).map((topic) => {
            const topicTests = testsByTopic[topic];

            const attemptData = { easy: [], moderate: [], hard: [] };
            let attemptCounters = { easy: 0, moderate: 0, hard: 0 };
            
            topicTests.forEach(test => {
                const mode = test.mode.toLowerCase();
                attemptCounters[mode]++;
                attemptData[mode].push({
                    attempt: attemptCounters[mode],
                    score: test.score
                });
            });

            return (
              <div key={topic} className="mb-8">
                <h3 className="text-lg font-semibold mb-2">{topic}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="attempt" 
                        type="number" 
                        allowDecimals={false}
                        domain={[1, 'dataMax']} // This line fixes the axis
                        label={{ value: "Attempt Number", position: "insideBottom", offset: -5 }}
                    />
                    <YAxis label={{ value: "Score", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />

                    {attemptData.easy.length > 0 && (
                      <Line
                        type="monotone"
                        dataKey="score"
                        data={attemptData.easy}
                        name="Easy"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        dot
                      />
                    )}
                    {attemptData.moderate.length > 0 && (
                      <Line
                        type="monotone"
                        dataKey="score"
                        data={attemptData.moderate}
                        name="Moderate"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot
                      />
                    )}
                    {attemptData.hard.length > 0 && (
                      <Line
                        type="monotone"
                        dataKey="score"
                        data={attemptData.hard}
                        name="Hard"
                        stroke="#FF8042"
                        strokeWidth={2}
                        dot
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            );
          })
        )}
      </div>

      {/* --- End of New Changes --- */}
    </div>
  );
}
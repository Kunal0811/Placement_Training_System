// Dashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import { getUserDetails } from "../api";
import { useAuth } from "../context/AuthContext";
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

// Define which topics belong to which category
const APTITUDE_TOPICS = [
  'Percentages', 'Profit & Loss', 'Time, Speed & Distance', 'Ratio & Proportion', 
  'Number System', 'Simple & Compound Interest', 'Permutation & Combination', 
  'Geometry & Mensuration', 'Series & Patterns', 'Coding-Decoding', 'Blood Relations', 
  'Direction Sense', 'Grammar', 'Vocabulary', 'Reading Comprehension', 'Final Aptitude Test'
];

const TECHNICAL_TOPICS = [
  'C Programming', 'C++ Programming', 'Java Programming', 'Python Programming', 'Data Structures & Algorithms',
  'Database Management Systems', 'Operating Systems', 'Computer Networks'
];

export default function Dashboard() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('aptitude'); // 'aptitude' or 'technical'

  useEffect(() => {
    if (!authUser) return;

    async function fetchUser() {
      try {
        const data = await getUserDetails(authUser.id);
        setUser(data.user);
        const sortedTests = (data.tests || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        setTests(sortedTests);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [authUser]);

  // Filter tests based on the selected view
  const filteredTests = useMemo(() => {
    if (selectedView === 'aptitude') {
      return tests.filter(test => APTITUDE_TOPICS.includes(test.topic));
    }
    // 'technical'
    return tests.filter(test => TECHNICAL_TOPICS.includes(test.topic));
  }, [tests, selectedView]);

  // Process data for charts using only the filtered tests
  const { barChartData, testsByTopic } = useMemo(() => {
    const barData = [];
    const topicModeStats = {};
    filteredTests.forEach((test) => {
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
      barData.push({
        topic,
        easy: topicModeStats[topic].easy.count ? (topicModeStats[topic].easy.totalScore / topicModeStats[topic].easy.count).toFixed(2) : 0,
        moderate: topicModeStats[topic].moderate.count ? (topicModeStats[topic].moderate.totalScore / topicModeStats[topic].moderate.count).toFixed(2) : 0,
        hard: topicModeStats[topic].hard.count ? (topicModeStats[topic].hard.totalScore / topicModeStats[topic].hard.count).toFixed(2) : 0,
      });
    });

    const groupedByTopic = filteredTests.reduce((acc, test) => {
      if (!acc[test.topic]) acc[test.topic] = [];
      acc[test.topic].push(test);
      return acc;
    }, {});

    return { barChartData: barData, testsByTopic: groupedByTopic };
  }, [filteredTests]);


  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-center mt-10">No user data found.</p>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Profile Details */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Profile Details</h2>
        <p><strong>Name:</strong> {user.fname} {user.lname}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Year:</strong> {user.year}</p>
        <p><strong>Field:</strong> {user.field}</p>
      </div>

      {/* --- Performance Section with Toggles --- */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <div className="flex border-b mb-4">
          <button
            onClick={() => setSelectedView('aptitude')}
            className={`px-4 py-2 text-lg font-semibold ${selectedView === 'aptitude' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            Aptitude
          </button>
          <button
            onClick={() => setSelectedView('technical')}
            className={`px-4 py-2 text-lg font-semibold ${selectedView === 'technical' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            Technical
          </button>
        </div>

        {/* Test History Table */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Test History ({selectedView})</h2>
          {filteredTests.length === 0 ? (
            <p>No tests attempted for this category yet.</p>
          ) : (
            <div className="overflow-x-auto">
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
                  {filteredTests.map((test, index) => (
                    <tr key={index}>
                      <td className="border-b p-2">{test.topic}</td>
                      <td className="border-b p-2">{test.mode}</td>
                      <td className="border-b p-2">{test.score}</td>
                      <td className="border-b p-2">{test.total}</td>
                      <td className="border-b p-2">{new Date(test.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* --- Graphs Section --- */}
      <div className="bg-white p-6 rounded shadow mt-6">
        <h2 className="text-xl font-semibold mb-4">Performance Graphs ({selectedView})</h2>

        {filteredTests.length === 0 ? (
          <p>No data available to display graphs.</p>
        ) : (
          <>
            {/* Bar Chart */}
            <div className="mb-12">
              <h3 className="text-lg font-semibold mb-4">Average Score per Topic (by Mode)</h3>
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
            </div>

            {/* Line Charts */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Progress by Topic & Mode</h3>
              {Object.keys(testsByTopic).map((topic) => {
                const topicTests = testsByTopic[topic];
                const attemptData = { easy: [], moderate: [], hard: [] };
                let attemptCounters = { easy: 0, moderate: 0, hard: 0 };
                topicTests.forEach(test => {
                  const mode = test.mode.toLowerCase();
                  attemptCounters[mode]++;
                  attemptData[mode].push({ attempt: attemptCounters[mode], score: test.score });
                });
                return (
                  <div key={topic} className="mb-8">
                    <h4 className="text-md font-semibold mb-2">{topic}</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="attempt" type="number" allowDecimals={false} domain={[1, 'dataMax']} label={{ value: "Attempt Number", position: "insideBottom", offset: -5 }}/>
                        <YAxis label={{ value: "Score", angle: -90, position: "insideLeft" }} />
                        <Tooltip />
                        <Legend />
                        {attemptData.easy.length > 0 && <Line type="monotone" dataKey="score" data={attemptData.easy} name="Easy" stroke="#82ca9d" strokeWidth={2} dot />}
                        {attemptData.moderate.length > 0 && <Line type="monotone" dataKey="score" data={attemptData.moderate} name="Moderate" stroke="#8884d8" strokeWidth={2} dot />}
                        {attemptData.hard.length > 0 && <Line type="monotone" dataKey="score" data={attemptData.hard} name="Hard" stroke="#FF8042" strokeWidth={2} dot />}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
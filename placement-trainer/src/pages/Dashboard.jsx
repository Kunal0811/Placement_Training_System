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

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-card/80 backdrop-blur-sm p-4 border border-neon-blue/30 rounded-lg">
        <p className="label text-white font-bold">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{`${p.name}: ${p.value}`}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [tests, setTests] = useState([]);
  const [codingAttempts, setCodingAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('aptitude');

  useEffect(() => {
    if (!authUser) return;
    async function fetchUser() {
      try {
        const data = await getUserDetails(authUser.id);
        setUser(data.user);
        setTests((data.tests || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
        setCodingAttempts((data.coding || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [authUser]);

  const { mcqBarChartData, testsByTopic, filteredTests } = useMemo(() => {
    const relevantTopics = selectedView === 'aptitude' ? APTITUDE_TOPICS : TECHNICAL_TOPICS;
    const filteredTests = tests.filter(test => relevantTopics.includes(test.topic));
    const topicModeStats = {};
    filteredTests.forEach((test) => {
      if (!topicModeStats[test.topic]) {
        topicModeStats[test.topic] = { easy: { s: 0, c: 0 }, moderate: { s: 0, c: 0 }, hard: { s: 0, c: 0 } };
      }
      const mode = test.mode.toLowerCase();
      topicModeStats[test.topic][mode].s += test.score;
      topicModeStats[test.topic][mode].c += 1;
    });
    const barData = Object.keys(topicModeStats).map(topic => ({
      topic,
      easy: topicModeStats[topic].easy.c ? (topicModeStats[topic].easy.s / topicModeStats[topic].easy.c).toFixed(2) : 0,
      moderate: topicModeStats[topic].moderate.c ? (topicModeStats[topic].moderate.s / topicModeStats[topic].moderate.c).toFixed(2) : 0,
      hard: topicModeStats[topic].hard.c ? (topicModeStats[topic].hard.s / topicModeStats[topic].hard.c).toFixed(2) : 0,
    }));
    const groupedByTopic = filteredTests.reduce((acc, test) => {
      if (!acc[test.topic]) acc[test.topic] = [];
      acc[test.topic].push(test);
      return acc;
    }, {});
    return { mcqBarChartData: barData, testsByTopic: groupedByTopic, filteredTests };
  }, [tests, selectedView]);

  const { codingBarChartData, codingLineChartData } = useMemo(() => {
    const solvedByDifficulty = { easy: 0, medium: 0, hard: 0 };
    const uniqueSolved = new Set();
    const solvedAttempts = [];
    codingAttempts.forEach(attempt => {
      if(attempt.is_correct && !uniqueSolved.has(attempt.problem_title)) {
        uniqueSolved.add(attempt.problem_title);
        solvedAttempts.push(attempt);
        if (solvedByDifficulty[attempt.difficulty] !== undefined) solvedByDifficulty[attempt.difficulty]++;
      }
    });
    const barData = [
      { difficulty: 'Easy', solved: solvedByDifficulty.easy },
      { difficulty: 'Medium', solved: solvedByDifficulty.medium },
      { difficulty: 'Hard', solved: solvedByDifficulty.hard },
    ];
    let cumulativeSolved = 0;
    const lineData = solvedAttempts.map(attempt => ({
      date: new Date(attempt.created_at).toLocaleDateString(),
      'Problems Solved': ++cumulativeSolved,
    }));
    return { codingBarChartData: barData, codingLineChartData: lineData };
  }, [codingAttempts]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⚙️</div>
          <p className="text-2xl text-gray-400">Loading Dashboard...</p>
        </div>
      </div>
  );

  const renderContent = () => {
    if (selectedView === 'coding') {
      return (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-white">Coding History</h2>
            {codingAttempts.length === 0 ? <p className="text-gray-400">No coding problems attempted yet.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-neon-blue/30">
                      <th className="p-3 text-white">Problem Title</th>
                      <th className="p-3 text-white">Difficulty</th>
                      <th className="p-3 text-white">Status</th>
                      <th className="p-3 text-white">Date</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    {codingAttempts.map((attempt, index) => (
                      <tr key={index} className="border-b border-gray-800 hover:bg-dark-bg">
                        <td className="p-3">{attempt.problem_title}</td>
                        <td className="p-3 capitalize">{attempt.difficulty}</td>
                        <td className={`p-3 font-semibold ${attempt.is_correct ? 'text-neon-green' : 'text-red-500'}`}>{attempt.is_correct ? 'Solved' : 'Attempted'}</td>
                        <td className="p-3">{new Date(attempt.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      );
    }
    
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4 text-white">Test History ({selectedView})</h2>
        {filteredTests.length === 0 ? <p className="text-gray-400">No tests attempted for this category yet.</p> : (
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-neon-blue/30">
                            <th className="p-3 text-white">Topic</th>
                            <th className="p-3 text-white">Mode</th>
                            <th className="p-3 text-white">Score</th>
                            <th className="p-3 text-white">Total</th>
                            <th className="p-3 text-white">Date</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300">
                        {filteredTests.map((test, index) => (
                            <tr key={index} className="border-b border-gray-800 hover:bg-dark-bg">
                                <td className="p-3">{test.topic}</td>
                                <td className="p-3 capitalize">{test.mode}</td>
                                <td className="p-3">{test.score}</td>
                                <td className="p-3">{test.total}</td>
                                <td className="p-3">{new Date(test.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    );
  };

  const renderGraphs = () => {
    if (selectedView === 'coding') {
      return codingAttempts.length === 0 ? <p className="text-gray-400">No data available to display graphs.</p> : (
        <>
          <div className="mb-12">
            <h3 className="text-lg font-semibold mb-4 text-white">Problems Solved by Difficulty</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={codingBarChartData}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00BFFF" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FF00FF" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="difficulty" tick={{ fill: '#a0a0a0' }} />
                <YAxis allowDecimals={false} tick={{ fill: '#a0a0a0' }} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: '#ffffff10'}} />
                <Legend wrapperStyle={{ color: '#ffffff' }} />
                <Bar dataKey="solved" name="Problems Solved" fill="url(#colorUv)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Cumulative Progress Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={codingLineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20"/>
                <XAxis dataKey="date" tick={{ fill: '#a0a0a0' }}/>
                <YAxis allowDecimals={false} tick={{ fill: '#a0a0a0' }}/>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="Problems Solved" stroke="#39FF14" strokeWidth={3} dot={{ r: 4, fill: '#39FF14' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      );
    }

    return filteredTests.length === 0 ? <p className="text-gray-400">No data available to display graphs.</p> : (
      <>
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4 text-white">Average Score per Topic (by Mode)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mcqBarChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="topic" tick={{ fill: '#a0a0a0' }} />
              <YAxis tick={{ fill: '#a0a0a0' }} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: '#ffffff10'}}/>
              <Legend />
              <Bar dataKey="easy" fill="#39FF14" />
              <Bar dataKey="moderate" fill="#00BFFF" />
              <Bar dataKey="hard" fill="#FF00FF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Progress by Topic & Mode</h3>
          {Object.keys(testsByTopic).map((topic) => {
            const topicTests = testsByTopic[topic];
            const attemptData = { easy: [], moderate: [], hard: [] };
            let counters = { easy: 0, moderate: 0, hard: 0 };
            topicTests.forEach(test => {
              const mode = test.mode.toLowerCase();
              counters[mode]++;
              attemptData[mode].push({ attempt: counters[mode], score: test.score });
            });
            return (
              <div key={topic} className="mb-8">
                <h4 className="text-md font-semibold mb-2 text-gray-300">{topic}</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="attempt" type="number" allowDecimals={false} domain={[1, 'dataMax']} tick={{ fill: '#a0a0a0' }} label={{ value: "Attempt", position: "insideBottom", offset: -5, fill: '#a0a0a0' }}/>
                    <YAxis tick={{ fill: '#a0a0a0' }} label={{ value: "Score", angle: -90, position: "insideLeft", fill: '#a0a0a0' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {attemptData.easy.length > 0 && <Line type="monotone" dataKey="score" data={attemptData.easy} name="Easy" stroke="#39FF14" strokeWidth={2} dot />}
                    {attemptData.moderate.length > 0 && <Line type="monotone" dataKey="score" data={attemptData.moderate} name="Moderate" stroke="#00BFFF" strokeWidth={2} dot />}
                    {attemptData.hard.length > 0 && <Line type="monotone" dataKey="score" data={attemptData.hard} name="Hard" stroke="#FF00FF" strokeWidth={2} dot />}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            );
          })}
        </div>
      </>
    );
  }
  
  return (
    <div className="p-6">
      <h1 className="text-5xl font-bold mb-8 text-glow text-white">Dashboard</h1>
      <div className="bg-dark-card p-6 rounded-xl shadow-lg border border-neon-blue/20 mb-8">
        <h2 className="text-2xl font-semibold mb-3 text-neon-blue">Profile Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
          <p><strong>Name:</strong> {user.fname} {user.lname}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Year:</strong> {user.year}</p>
          <p><strong>Field:</strong> {user.field}</p>
        </div>
      </div>
      <div className="bg-dark-card p-6 rounded-xl shadow-lg border border-neon-blue/20 mb-8">
        <div className="flex border-b border-neon-blue/20 mb-6">
          <button onClick={() => setSelectedView('aptitude')} className={`px-6 py-3 text-lg font-semibold transition-colors ${selectedView === 'aptitude' ? 'border-b-2 border-neon-blue text-neon-blue' : 'text-gray-500 hover:text-white'}`}>Aptitude</button>
          <button onClick={() => setSelectedView('technical')} className={`px-6 py-3 text-lg font-semibold transition-colors ${selectedView === 'technical' ? 'border-b-2 border-neon-blue text-neon-blue' : 'text-gray-500 hover:text-white'}`}>Technical</button>
          <button onClick={() => setSelectedView('coding')} className={`px-6 py-3 text-lg font-semibold transition-colors ${selectedView === 'coding' ? 'border-b-2 border-neon-blue text-neon-blue' : 'text-gray-500 hover:text-white'}`}>Coding</button>
        </div>
        {renderContent()}
      </div>
      <div className="bg-dark-card p-6 rounded-xl shadow-lg border border-neon-blue/20">
        <h2 className="text-2xl font-semibold mb-6 text-neon-blue capitalize">{selectedView} Performance Graphs</h2>
        {renderGraphs()}
      </div>
    </div>
  );
}
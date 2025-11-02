import React, { useEffect, useState, useMemo } from "react";
import { getUserDetails } from "../api";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../api";
import axios from "axios";
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

// Define topic categories
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

// Custom Tooltip for better styling
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
  const { user: authUser, updateUser } = useAuth();
  const [user, setUser] = useState(authUser);
  const [tests, setTests] = useState([]);
  const [codingAttempts, setCodingAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('aptitude');
  
  // State for profile picture upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  useEffect(() => {
    if (!authUser?.id) {
      setLoading(false);
      return;
    }
    async function fetchUser() {
      try {
        const data = await getUserDetails(authUser.id);
        setUser(data.user);
        updateUser(data.user); // Update global context
        setTests((data.tests || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
        setCodingAttempts((data.coding || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [authUser?.id, updateUser]);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadError('');
      setUploadSuccess('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !authUser?.id) return;
    setUploading(true);
    setUploadError('');
    setUploadSuccess('');

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post(`${API_BASE}/api/user/${authUser.id}/upload-pfp`, formData);
      const updatedUser = { ...user, profile_picture_url: res.data.profile_picture_url };
      setUser(updatedUser);
      updateUser(updatedUser);
      setUploadSuccess(res.data.message);
      setSelectedFile(null);
    } catch (err) {
      setUploadError(err.response?.data?.detail || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const { mcqBarChartData, testsByTopic, filteredTests } = useMemo(() => {
    const relevantTopics = selectedView === 'aptitude' ? APTITUDE_TOPICS : TECHNICAL_TOPICS;
    const filtered = tests.filter(test => relevantTopics.includes(test.topic));
    
    const stats = {};
    filtered.forEach(test => {
      if (!stats[test.topic]) {
        stats[test.topic] = { easy: { s: 0, c: 0 }, moderate: { s: 0, c: 0 }, hard: { s: 0, c: 0 } };
      }
      const mode = test.mode.toLowerCase();
      if (stats[test.topic][mode]) {
        stats[test.topic][mode].s += test.score;
        stats[test.topic][mode].c += 1;
      }
    });

    const barData = Object.keys(stats).map(topic => ({
      topic,
      easy: stats[topic].easy.c > 0 ? parseFloat((stats[topic].easy.s / stats[topic].easy.c).toFixed(2)) : 0,
      moderate: stats[topic].moderate.c > 0 ? parseFloat((stats[topic].moderate.s / stats[topic].moderate.c).toFixed(2)) : 0,
      hard: stats[topic].hard.c > 0 ? parseFloat((stats[topic].hard.s / stats[topic].hard.c).toFixed(2)) : 0,
    }));

    const grouped = filtered.reduce((acc, test) => {
      if (!acc[test.topic]) acc[test.topic] = [];
      acc[test.topic].push(test);
      return acc;
    }, {});

    return { mcqBarChartData: barData, testsByTopic: grouped, filteredTests: filtered };
  }, [tests, selectedView]);

  const { codingBarChartData, codingLineChartData } = useMemo(() => {
    const solvedByDifficulty = { easy: 0, medium: 0, hard: 0 };
    const uniqueSolved = new Set();
    const solvedAttempts = [];
    codingAttempts.forEach(attempt => {
      if (attempt.is_correct && !uniqueSolved.has(attempt.problem_title)) {
        uniqueSolved.add(attempt.problem_title);
        solvedAttempts.push(attempt);
        if (solvedByDifficulty[attempt.difficulty] !== undefined) {
          solvedByDifficulty[attempt.difficulty]++;
        }
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⚙️</div>
          <p className="text-2xl text-gray-400">Loading Dashboard...</p>
        </div>
      </div>
    );
  }
  
  const renderContent = () => {
    const testsToDisplay = selectedView === 'coding' ? codingAttempts : filteredTests;
    const noDataMessage = 
        selectedView === 'coding' ? "No coding problems attempted yet." : "No tests attempted for this category yet.";

    if (testsToDisplay.length === 0) {
        return <p className="text-gray-400">{noDataMessage}</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-neon-blue/30">
                        {selectedView === 'coding' ? (
                            <>
                                <th className="p-3 text-white">Problem Title</th>
                                <th className="p-3 text-white">Difficulty</th>
                                <th className="p-3 text-white">Status</th>
                            </>
                        ) : (
                            <>
                                <th className="p-3 text-white">Topic</th>
                                <th className="p-3 text-white">Mode</th>
                                <th className="p-3 text-white">Score</th>
                                <th className="p-3 text-white">Total</th>
                            </>
                        )}
                        <th className="p-3 text-white">Date</th>
                    </tr>
                </thead>
                <tbody className="text-gray-300">
                    {testsToDisplay.map((item, index) => (
                        <tr key={index} className="border-b border-gray-800 hover:bg-dark-bg">
                            {selectedView === 'coding' ? (
                                <>
                                    <td className="p-3">{item.problem_title}</td>
                                    <td className="p-3 capitalize">{item.difficulty}</td>
                                    <td className={`p-3 font-semibold ${item.is_correct ? 'text-neon-green' : 'text-red-500'}`}>{item.is_correct ? 'Solved' : 'Attempted'}</td>
                                </>
                            ) : (
                                <>
                                    <td className="p-3">{item.topic}</td>
                                    <td className="p-3 capitalize">{item.mode}</td>
                                    <td className="p-3">{item.score}</td>
                                    <td className="p-3">{item.total}</td>
                                </>
                            )}
                            <td className="p-3">{new Date(item.created_at).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
  };

  const renderGraphs = () => {
    // ... (coding graphs logic is unchanged)
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
    
    if (filteredTests.length === 0) {
      return <p className="text-gray-400">No data available to display graphs.</p>;
    }

    return (
      <>
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4 text-white">Average Score per Topic (by Mode)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={mcqBarChartData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
              <XAxis 
                dataKey="topic" 
                angle={-45} 
                textAnchor="end" 
                interval={0}
                tick={{ fill: '#a0a0a0' }} 
                stroke="#a0a0a0"
              />
              {/* --- FIX 1: Added domain prop to YAxis --- */}
              <YAxis tick={{ fill: '#a0a0a0' }} stroke="#a0a0a0" domain={[0, 20]} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: '#ffffff10'}}/>
              <Legend wrapperStyle={{ color: '#ffffff' }} />
              <Bar dataKey="easy" name="Easy" fill="#39FF14" />
              <Bar dataKey="moderate" name="Moderate" fill="#00BFFF" />
              <Bar dataKey="hard" name="Hard" fill="#FF00FF" />
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
              if (counters[mode] !== undefined) {
                counters[mode]++;
                attemptData[mode].push({ attempt: counters[mode], score: test.score });
              }
            });
            return (
              <div key={topic} className="mb-8">
                <h4 className="text-md font-semibold mb-2 text-gray-300">{topic}</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                    <XAxis 
                      dataKey="attempt" 
                      type="number" 
                      allowDecimals={false} 
                      domain={[1, 'dataMax']} 
                      tick={{ fill: '#a0a0a0' }} 
                      stroke="#a0a0a0"
                      label={{ value: "Attempt", position: "insideBottom", offset: -15, fill: '#a0a0a0' }}
                    />
                    <YAxis 
                      tick={{ fill: '#a0a0a0' }} 
                      stroke="#a0a0a0"
                      domain={[0, 20]} // Added domain here as well for consistency
                      label={{ value: "Score", angle: -90, position: "insideLeft", fill: '#a0a0a0' }} 
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ color: '#ffffff' }} />
                    {/* --- FIX 2: Added connectNulls prop to all Lines --- */}
                    {attemptData.easy.length > 0 && <Line type="monotone" dataKey="score" data={attemptData.easy} name="Easy" stroke="#39FF14" strokeWidth={2} dot connectNulls />}
                    {attemptData.moderate.length > 0 && <Line type="monotone" dataKey="score" data={attemptData.moderate} name="Moderate" stroke="#00BFFF" strokeWidth={2} dot connectNulls />}
                    {attemptData.hard.length > 0 && <Line type="monotone" dataKey="score" data={attemptData.hard} name="Hard" stroke="#FF00FF" strokeWidth={2} dot connectNulls />}
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
        <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-1/3 text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                  {preview ? (
                      <img src={preview} alt="Preview" className="w-32 h-32 rounded-full object-cover border-4 border-neon-blue" />
                  ) : user && user.profile_picture_url ? (
                      <img src={`${API_BASE}${user.profile_picture_url}`} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-neon-blue" />
                  ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-neon-blue font-bold text-5xl border-4 border-neon-blue">
                          {user?.fname?.[0].toUpperCase() || 'U'}
                      </div>
                  )}
              </div>
              <input type="file" id="pfp-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
              <label htmlFor="pfp-upload" className="cursor-pointer bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                  Choose Image
              </label>
              {selectedFile && (
                <div className="mt-4">
                  <button onClick={handleUpload} disabled={uploading} className="bg-neon-blue text-black font-bold py-2 px-6 rounded-lg hover:scale-105 transition-transform animate-glow disabled:bg-gray-600 disabled:animate-none">
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              )}
              {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
              {uploadSuccess && <p className="text-neon-green text-sm mt-2">{uploadSuccess}</p>}
            </div>

            <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300 pt-4">
              <p><strong>Name:</strong> {user?.fname} {user?.lname}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Year:</strong> {user?.year}</p>
              <p><strong>Field:</strong> {user?.field}</p>
            </div>
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
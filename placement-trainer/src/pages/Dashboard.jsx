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
  const [interviewAttempts, setInterviewAttempts] = useState([]); // New state
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('aptitude');
  
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

    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchUser() {
      try {
        const data = await getUserDetails(authUser.id, 1, 20, signal);
        
        setUser(data.user);
        updateUser(data.user);
        setTests((data.tests || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
        setCodingAttempts((data.coding || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
        setInterviewAttempts(data.interviews || []); // Fetch interview data
      
      } catch (err) {
        if (err.name !== 'AbortError') console.error("Failed to fetch user details:", err);
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    }

    fetchUser();
    return () => controller.abort();
  }, [authUser?.id]);

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

  // Memoized Data for Graphs
  const { mcqBarChartData, filteredTests } = useMemo(() => {
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

    return { mcqBarChartData: barData, filteredTests: filtered };
  }, [tests, selectedView]);

  const codingData = useMemo(() => {
    const solvedByDifficulty = { easy: 0, medium: 0, hard: 0 };
    const uniqueSolved = new Set();
    const solvedAttempts = [];
    codingAttempts.forEach(attempt => {
      if (attempt.is_correct && !uniqueSolved.has(attempt.problem_title)) {
        uniqueSolved.add(attempt.problem_title);
        solvedAttempts.push(attempt);
        if (solvedByDifficulty[attempt.difficulty] !== undefined) solvedByDifficulty[attempt.difficulty]++;
      }
    });

    return {
      bar: [
        { difficulty: 'Easy', solved: solvedByDifficulty.easy },
        { difficulty: 'Medium', solved: solvedByDifficulty.medium },
        { difficulty: 'Hard', solved: solvedByDifficulty.hard },
      ],
      line: solvedAttempts.map((attempt, i) => ({
        date: new Date(attempt.created_at).toLocaleDateString(),
        'Problems Solved': i + 1,
      }))
    };
  }, [codingAttempts]);

  // NEW: Interview Performance memo
  const interviewGraphData = useMemo(() => {
    return interviewAttempts.map(item => ({
      role: item.job_role,
      score: item.overall_score,
      date: new Date(item.created_at).toLocaleDateString()
    }));
  }, [interviewAttempts]);

  const renderContent = () => {
    let items = [];
    if (selectedView === 'coding') items = codingAttempts;
    else if (selectedView === 'interview') items = interviewAttempts;
    else items = filteredTests;

    if (items.length === 0) return <p className="text-gray-400 p-4">No attempts recorded yet.</p>;

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neon-blue/30">
              {selectedView === 'interview' ? (
                <>
                  <th className="p-3 text-white">Job Role</th>
                  <th className="p-3 text-white">Type</th>
                  <th className="p-3 text-white">Overall Score</th>
                </>
              ) : selectedView === 'coding' ? (
                <>
                  <th className="p-3 text-white">Problem</th>
                  <th className="p-3 text-white">Difficulty</th>
                  <th className="p-3 text-white">Status</th>
                </>
              ) : (
                <>
                  <th className="p-3 text-white">Topic</th>
                  <th className="p-3 text-white">Mode</th>
                  <th className="p-3 text-white">Score</th>
                </>
              )}
              <th className="p-3 text-white">Date</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {items.map((item, index) => (
              <tr key={index} className="border-b border-gray-800 hover:bg-dark-bg transition-colors">
                {selectedView === 'interview' ? (
                  <>
                    <td className="p-3 font-medium text-neon-blue">{item.job_role}</td>
                    <td className="p-3">{item.interview_type}</td>
                    <td className="p-3 font-bold">{item.overall_score}/10</td>
                  </>
                ) : selectedView === 'coding' ? (
                  <>
                    <td className="p-3">{item.problem_title}</td>
                    <td className="p-3 capitalize">{item.difficulty}</td>
                    <td className={`p-3 font-semibold ${item.is_correct ? 'text-neon-green' : 'text-red-500'}`}>{item.is_correct ? 'Solved' : 'Attempted'}</td>
                  </>
                ) : (
                  <>
                    <td className="p-3">{item.topic}</td>
                    <td className="p-3 capitalize">{item.mode}</td>
                    <td className="p-3">{item.score}/{item.total}</td>
                  </>
                )}
                <td className="p-3 text-xs">{new Date(item.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderGraphs = () => {
    if (selectedView === 'interview') {
      return (
        <div className="h-[400px]">
          <h3 className="text-lg font-semibold mb-4 text-white">Interview Score Consistency</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={interviewGraphData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="date" tick={{ fill: '#a0a0a0' }} />
              <YAxis domain={[0, 10]} tick={{ fill: '#a0a0a0' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="score" name="Interview Score" stroke="#00BFFF" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (selectedView === 'coding') {
      return (
        <div className="grid grid-cols-1 gap-12">
          <div className="h-[300px]">
            <h3 className="text-lg font-semibold mb-4 text-white">Solved by Difficulty</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={codingData.bar}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="difficulty" tick={{ fill: '#a0a0a0' }} />
                <YAxis allowDecimals={false} tick={{ fill: '#a0a0a0' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="solved" name="Solved" fill="#FF00FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    return (
      <div className="h-[400px]">
        <h3 className="text-lg font-semibold mb-4 text-white">Avg Scores by Difficulty</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mcqBarChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis dataKey="topic" angle={-45} textAnchor="end" height={80} tick={{ fill: '#a0a0a0', fontSize: 12 }} />
            <YAxis domain={[0, 20]} tick={{ fill: '#a0a0a0' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="easy" name="Easy" fill="#39FF14" />
            <Bar dataKey="moderate" name="Moderate" fill="#00BFFF" />
            <Bar dataKey="hard" name="Hard" fill="#FF00FF" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-dark-bg">
      <div className="animate-pulse text-neon-blue text-xl">Loading your progress...</div>
    </div>
  );
  
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <h1 className="text-5xl font-bold text-white text-glow">Dashboard</h1>

      {/* Profile Section */}
      <div className="bg-dark-card p-8 rounded-2xl border border-neon-blue/20 flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="flex flex-col items-center gap-4">
          <div className="w-40 h-40 rounded-full border-4 border-neon-blue overflow-hidden bg-gray-800 flex items-center justify-center">
            {preview ? <img src={preview} className="w-full h-full object-cover" /> :
             user?.profile_picture_url ? <img src={`${API_BASE}${user.profile_picture_url}`} className="w-full h-full object-cover" /> :
             <span className="text-5xl font-bold text-neon-blue">{user?.fname?.[0]}</span>}
          </div>
          <input type="file" id="pfp" className="hidden" onChange={handleFileChange} />
          <label htmlFor="pfp" className="text-sm bg-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-600">Change Photo</label>
          {selectedFile && <button onClick={handleUpload} className="bg-neon-blue text-black px-4 py-2 rounded font-bold text-sm w-full">{uploading ? "..." : "Upload"}</button>}
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-4 text-gray-300">
          <p><span className="text-gray-500 block text-xs uppercase tracking-widest">Full Name</span> {user?.fname} {user?.lname}</p>
          <p><span className="text-gray-500 block text-xs uppercase tracking-widest">Email Address</span> {user?.email}</p>
          <p><span className="text-gray-500 block text-xs uppercase tracking-widest">Academic Year</span> {user?.year}</p>
          <p><span className="text-gray-500 block text-xs uppercase tracking-widest">Specialization</span> {user?.field}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-dark-card rounded-2xl border border-neon-blue/10 overflow-hidden">
        <div className="flex bg-black/40 p-1">
          {['aptitude', 'technical', 'coding', 'interview'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedView(tab)}
              className={`flex-1 py-3 px-6 rounded-xl capitalize font-bold transition-all ${
                selectedView === tab ? 'bg-neon-blue text-black' : 'text-gray-500 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {renderContent()}
        </div>
      </div>

      {/* Graphs Section */}
      <div className="bg-dark-card p-8 rounded-2xl border border-neon-blue/20">
        {renderGraphs()}
      </div>
    </div>
  );
}
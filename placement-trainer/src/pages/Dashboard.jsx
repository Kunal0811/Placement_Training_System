import React, { useEffect, useState, useMemo } from "react";
import { getUserDetails } from "../api";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../api";
import axios from "axios";
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
  AreaChart,
  Area,
} from "recharts";
import { FiActivity, FiCode, FiCpu, FiTrendingUp, FiUser, FiCamera, FiZap, FiTarget, FiCheckCircle, FiAward, FiUpload } from "react-icons/fi";

// --- CONSTANTS ---
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

// --- COMPONENTS ---

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 backdrop-blur-xl p-4 border border-white/20 rounded-xl shadow-[0_0_20px_rgba(45,212,191,0.2)] z-50">
        <p className="text-gray-400 font-bold mb-2 text-xs uppercase tracking-widest border-b border-white/10 pb-1">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-3 mb-1">
            <div className="w-2 h-2 rounded-full shadow-[0_0_8px]" style={{ backgroundColor: p.color, boxShadow: `0 0 8px ${p.color}` }} />
            <span className="text-sm font-medium text-gray-200">{p.name}: <span className="font-bold text-lg" style={{ color: p.color }}>{p.value}</span></span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const StatCard = ({ title, value, icon, gradient, glowColor }) => (
  <div className="relative overflow-hidden p-6 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl">
    {/* Background Glow */}
    <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity ${glowColor}`} />
    
    <div className="flex items-start justify-between relative z-10">
        <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-4xl font-black text-white tracking-tight drop-shadow-lg">
                {value}
            </h3>
        </div>
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
            <div className="text-white text-xl">{icon}</div>
        </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { user: authUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(authUser);
  const [tests, setTests] = useState([]);
  const [codingAttempts, setCodingAttempts] = useState([]);
  const [interviewAttempts, setInterviewAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedView, setSelectedView] = useState('aptitude');
  const [graphTopic, setGraphTopic] = useState(APTITUDE_TOPICS[0]); 

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authUser?.id) { setLoading(false); return; }
    const controller = new AbortController();
    
    async function fetchUser() {
      try {
        const data = await getUserDetails(authUser.id, 1, 100, controller.signal);
        if(data.user) {
            setUser(data.user);
            updateUser(data.user);
        }
        setTests((data.tests || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
        setCodingAttempts((data.coding || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
        setInterviewAttempts(data.interviews || []);
      } catch (err) {
        if (err.name !== 'AbortError') console.error("Fetch error:", err);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    fetchUser();
    return () => controller.abort();
  }, [authUser?.id]);

  useEffect(() => {
    if (!selectedFile) { setPreview(undefined); return; }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);
  
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
      setSelectedFile(null);
    } catch (err) { alert("Upload failed."); } finally { setUploading(false); }
  };

  // --- MEMOIZED LOGIC ---
  const stats = useMemo(() => {
    const totalTests = tests.length;
    const avgScore = totalTests > 0 ? (tests.reduce((a, b) => a + (b.score || 0), 0) / totalTests).toFixed(1) : 0;
    const codingSolved = codingAttempts.filter(c => c.is_correct).length;
    return { totalTests, avgScore, codingSolved, interviewCount: interviewAttempts.length };
  }, [tests, codingAttempts, interviewAttempts]);

  const { mcqBarChartData, filteredTests } = useMemo(() => {
    const relevantTopics = selectedView === 'aptitude' ? APTITUDE_TOPICS : TECHNICAL_TOPICS;
    const filtered = tests.filter(test => test.topic && relevantTopics.includes(test.topic));
    
    const stats = {};
    filtered.forEach(test => {
      const mode = test.mode ? test.mode.toLowerCase() : 'moderate';
      const topic = test.topic || 'Unknown';
      if (!stats[topic]) stats[topic] = { easy: { s: 0, c: 0 }, moderate: { s: 0, c: 0 }, hard: { s: 0, c: 0 } };
      if (stats[topic][mode]) { stats[topic][mode].s += (test.score || 0); stats[topic][mode].c += 1; }
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
        { difficulty: 'Easy', solved: solvedByDifficulty.easy, fill: '#4ade80' },
        { difficulty: 'Medium', solved: solvedByDifficulty.medium, fill: '#60a5fa' },
        { difficulty: 'Hard', solved: solvedByDifficulty.hard, fill: '#f472b6' },
      ],
      line: solvedAttempts.map((attempt, i) => ({
        date: new Date(attempt.created_at).toLocaleDateString(),
        'Problems Solved': i + 1,
      }))
    };
  }, [codingAttempts]);

  const topicTrendData = useMemo(() => {
    if (!graphTopic) return [];
    const topicTests = tests.filter(t => t.topic === graphTopic && t.mode);
    const easyTests = topicTests.filter(t => t.mode.toLowerCase() === 'easy');
    const moderateTests = topicTests.filter(t => t.mode.toLowerCase() === 'moderate');
    const hardTests = topicTests.filter(t => t.mode.toLowerCase() === 'hard');
    
    const maxAttempts = Math.max(easyTests.length, moderateTests.length, hardTests.length);
    const data = [];
    for (let i = 0; i < maxAttempts; i++) {
      data.push({
        attempt: `Attempt ${i + 1}`,
        Easy: easyTests[i] ? easyTests[i].score : null,
        Moderate: moderateTests[i] ? moderateTests[i].score : null,
        Hard: hardTests[i] ? hardTests[i].score : null,
      });
    }
    return data;
  }, [tests, graphTopic]);

  const interviewGraphData = useMemo(() => interviewAttempts.map(item => ({
    role: item.job_role || "General",
    score: item.overall_score || 0,
    date: item.created_at ? new Date(item.created_at).toLocaleDateString() : "N/A"
  })), [interviewAttempts]);

  // --- RENDERERS ---

  const renderTable = () => {
    let items = [], headers = [];
    if (selectedView === 'coding') { items = codingAttempts; headers = ['Problem', 'Difficulty', 'Status', 'Date']; }
    else if (selectedView === 'interview') { items = interviewAttempts; headers = ['Job Role', 'Type', 'Score', 'Date']; }
    else { items = filteredTests; headers = ['Topic', 'Mode', 'Score', 'Date']; }

    if (items.length === 0) return <div className="p-12 text-center text-gray-500 font-mono text-sm border-t border-white/5">No data logs found. Start grinding! 🚀</div>;

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
              {headers.map(h => <th key={h} className="p-4 font-semibold">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm text-gray-300">
            {items.slice().reverse().map((item, index) => (
              <tr key={index} className="hover:bg-white/5 transition-colors group">
                {selectedView === 'interview' ? (
                  <>
                    <td className="p-4 font-bold text-blue-400 group-hover:text-blue-300 transition-colors">{item.job_role}</td>
                    <td className="p-4 text-xs opacity-70">{item.interview_type}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded-md text-xs font-bold ${item.overall_score >= 7 ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>{item.overall_score}/10</span></td>
                  </>
                ) : selectedView === 'coding' ? (
                  <>
                    <td className="p-4 font-medium text-white">{item.problem_title}</td>
                    <td className="p-4"><span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded border ${item.difficulty === 'easy' ? 'border-green-500/50 text-green-400' : item.difficulty === 'medium' ? 'border-blue-500/50 text-blue-400' : 'border-pink-500/50 text-pink-400'}`}>{item.difficulty}</span></td>
                    <td className="p-4">{item.is_correct ? <span className="text-green-400 flex items-center gap-1"><FiCheckCircle/> Solved</span> : <span className="text-red-400">Failed</span>}</td>
                  </>
                ) : (
                  <>
                    <td className="p-4 font-medium">{item.topic}</td>
                    <td className="p-4 capitalize text-xs opacity-70">{item.mode || 'Standard'}</td>
                    <td className="p-4 font-bold font-mono">{item.score}/{item.total}</td>
                  </>
                )}
                <td className="p-4 opacity-50 text-xs font-mono">{item.created_at ? new Date(item.created_at).toLocaleDateString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-game-bg text-white">
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold tracking-widest animate-pulse text-neon-blue">LOADING...</p>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-game-bg text-white p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-8">
            <div>
                <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-2 tracking-tight">
                    DASHBOARD
                </h1>
                <p className="text-gray-400 text-sm">Welcome back, <span className="text-neon-blue font-bold">{user?.fname}</span>. Let's crush some goals.</p>
            </div>
            
            <button 
                onClick={() => navigate('/leaderboard')}
                className="group relative inline-flex items-center gap-3 px-6 py-3 bg-neon-yellow/10 border border-neon-yellow/40 rounded-xl text-neon-yellow font-bold uppercase tracking-widest hover:bg-neon-yellow hover:text-black transition-all duration-300 overflow-hidden"
            >
                <FiAward size={20} />
                <span>Hall of Fame</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
        </div>

        {/* 1. STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Tests" value={stats.totalTests} icon={<FiActivity/>} gradient="from-cyan-500 to-blue-500" glowColor="bg-cyan-500" />
          <StatCard title="Avg Score" value={stats.avgScore} icon={<FiTarget/>} gradient="from-emerald-400 to-green-600" glowColor="bg-emerald-500" />
          <StatCard title="Coding Streak" value={stats.codingSolved} icon={<FiCode/>} gradient="from-purple-500 to-pink-500" glowColor="bg-purple-500" />
          <StatCard title="Interviews" value={stats.interviewCount} icon={<FiUser/>} gradient="from-orange-400 to-red-500" glowColor="bg-orange-500" />
        </div>

        {/* 2. PROFILE & MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* PROFILE CARD */}
            <div className="lg:col-span-1 bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 flex flex-col items-center text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-neon-blue/20 to-transparent opacity-50" />
                
                <div className="relative w-40 h-40 mb-6 group-hover:scale-105 transition-transform duration-500">
                    {/* Ring Animation */}
                    <div className="absolute inset-0 border-2 border-dashed border-neon-blue/50 rounded-full animate-spin-slow"></div>
                    
                    <div className="w-full h-full rounded-full p-2 bg-black/50 relative z-10">
                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-800 relative z-10 border-2 border-white/10">
                            {preview ? <img src={preview} className="w-full h-full object-cover" alt="Profile" /> :
                            user?.profile_picture_url ? <img src={`${API_BASE}${user.profile_picture_url}`} className="w-full h-full object-cover" alt="Profile" /> :
                            <div className="w-full h-full flex items-center justify-center text-5xl font-black text-gray-600">{user?.fname?.[0]}</div>}
                        </div>
                    </div>
                    
                    <label htmlFor="pfp" className="absolute bottom-2 right-2 z-20 bg-neon-blue text-black p-3 rounded-xl cursor-pointer hover:bg-white transition-colors shadow-lg shadow-neon-blue/30">
                        <FiCamera size={18} />
                    </label>
                    <input type="file" id="pfp" className="hidden" onChange={(e) => { if(e.target.files[0]) setSelectedFile(e.target.files[0]) }} />
                </div>

                {selectedFile && (
                    <button onClick={handleUpload} className="mb-6 px-6 py-2 bg-neon-blue text-black rounded-lg text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2">
                        {uploading ? "Uploading..." : <><FiUpload /> Save Photo</>}
                    </button>
                )}

                <h2 className="text-2xl font-bold text-white mb-1">{user?.fname} {user?.lname}</h2>
                <p className="text-gray-400 text-sm mb-6 font-mono">{user?.email}</p>

                <div className="w-full grid grid-cols-2 gap-3">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Year</p>
                        <p className="text-xl font-bold text-white">{user?.year}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Field</p>
                        <p className="text-xl font-bold text-white truncate">{user?.field}</p>
                    </div>
                </div>
            </div>

            {/* CHARTS SECTION */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* TABS */}
                <div className="p-1 bg-black/40 backdrop-blur rounded-2xl border border-white/10 inline-flex w-full overflow-x-auto">
                    {['aptitude', 'technical', 'coding', 'interview'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => { 
                                setSelectedView(tab); 
                                if(tab === 'technical') setGraphTopic(TECHNICAL_TOPICS[0]); 
                                else if(tab === 'aptitude') setGraphTopic(APTITUDE_TOPICS[0]); 
                            }}
                            className={`flex-1 py-3 px-4 min-w-[100px] text-xs md:text-sm font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${
                                selectedView === tab 
                                ? 'bg-neon-blue text-black shadow-[0_0_15px_rgba(45,212,191,0.4)]' 
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* GRAPH CONTAINER */}
                {selectedView === 'interview' ? (
                   <div className="bg-black/40 backdrop-blur-xl p-6 rounded-3xl border border-white/10 relative overflow-hidden h-[400px]">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/10 rounded-full blur-[80px] -z-10" />
                      <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2"><FiCamera className="text-neon-blue"/> Interview Mastery</h3>
                      <ResponsiveContainer width="100%" height="90%">
                        <AreaChart data={interviewGraphData}>
                          <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                          <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                          <YAxis domain={[0, 10]} tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                          <Tooltip content={<CustomTooltip />} />
                          <Area type="monotone" dataKey="score" stroke="#2DD4BF" strokeWidth={3} fill="url(#colorScore)" />
                        </AreaChart>
                      </ResponsiveContainer>
                   </div>
                ) : selectedView === 'coding' ? (
                   <div className="grid grid-cols-1 gap-6 h-[400px]">
                      <div className="bg-black/40 backdrop-blur-xl p-6 rounded-3xl border border-white/10 h-full">
                         <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2"><FiCode className="text-neon-purple"/> Problems Solved</h3>
                         <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={codingData.bar} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="difficulty" type="category" width={60} tick={{fill:'#fff', fontSize:12}} axisLine={false} tickLine={false}/>
                                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                                <Bar dataKey="solved" radius={[0, 10, 10, 0]} barSize={30}>
                                   {codingData.bar.map((entry, index) => <cell key={`cell-${index}`} fill={entry.fill} />)}
                                </Bar>
                            </BarChart>
                         </ResponsiveContainer>
                      </div>
                   </div>
                ) : (
                  <div className="bg-black/40 backdrop-blur-xl p-6 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl h-[450px]">
                    <div className="absolute -top-20 -left-20 w-96 h-96 bg-neon-purple/10 rounded-full blur-[100px] -z-10" />
                    
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 z-20 relative">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                                <FiTrendingUp className="text-neon-green"/> Topic Progress
                            </h3>
                            <p className="text-xs text-gray-400">Track your score history.</p>
                        </div>
                        
                        {/* FIXED INVISIBLE DROPDOWN */}
                        <div className="relative group min-w-[200px]">
                            <select 
                                value={graphTopic} 
                                onChange={(e) => setGraphTopic(e.target.value)}
                                className="w-full appearance-none bg-black border border-white/20 text-white rounded-xl py-3 pl-4 pr-10 text-sm outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-colors cursor-pointer"
                            >
                                {(selectedView === 'aptitude' ? APTITUDE_TOPICS : TECHNICAL_TOPICS).map(t => (
                                    <option key={t} value={t} className="bg-black text-gray-200">{t}</option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</div>
                        </div>
                    </div>

                    <div className="h-[320px] w-full">
                        {topicTrendData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={topicTrendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="attempt" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis domain={[0, 20]} tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                <Line type="monotone" dataKey="Easy" stroke="#4ade80" strokeWidth={3} dot={{r:0}} activeDot={{r:6, strokeWidth: 0, fill:'#4ade80'}} connectNulls />
                                <Line type="monotone" dataKey="Moderate" stroke="#60a5fa" strokeWidth={3} dot={{r:0}} activeDot={{r:6, strokeWidth: 0, fill:'#60a5fa'}} connectNulls />
                                <Line type="monotone" dataKey="Hard" stroke="#f472b6" strokeWidth={3} dot={{r:0}} activeDot={{r:6, strokeWidth: 0, fill:'#f472b6'}} connectNulls />
                            </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                                <FiZap size={40} className="text-gray-700 opacity-50"/>
                                <p>No data recorded for {graphTopic}.</p>
                            </div>
                        )}
                    </div>
                  </div>
                )}
            </div>
        </div>

        {/* 3. ACTIVITY LOG TABLE */}
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden mb-12">
            <div className="p-6 border-b border-white/10 flex items-center gap-3 bg-white/5">
                <FiActivity className="text-neon-blue" />
                <h3 className="text-lg font-bold text-white">Recent Activity Log</h3>
            </div>
            <div className="p-2">
                {renderTable()}
            </div>
        </div>

      </div>
    </div>
  );
}
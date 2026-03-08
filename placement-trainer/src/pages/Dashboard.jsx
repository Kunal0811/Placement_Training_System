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
import { FiActivity, FiCode, FiCpu, FiTrendingUp, FiUser, FiCamera, FiZap, FiTarget, FiCheckCircle, FiAward, FiUpload, FiBriefcase } from "react-icons/fi";

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

// Upgraded Light Theme Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-4 border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-50">
        <p className="text-gray-500 font-bold mb-3 text-xs uppercase tracking-widest border-b border-gray-100 pb-2">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-3 mb-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color, boxShadow: `0 0 8px ${p.color}80` }} />
            <span className="text-sm font-medium text-slate-600">{p.name}: <span className="font-bold text-lg text-slate-900">{p.value}</span></span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Upgraded Light Theme Stat Card
const StatCard = ({ title, value, icon, gradient, glowColor }) => (
  <div className="relative overflow-hidden p-6 rounded-[2rem] bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group hover:-translate-y-1">
    <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-10 group-hover:opacity-20 transition-opacity ${glowColor}`} />
    
    <div className="flex items-start justify-between relative z-10">
        <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-4xl font-black text-slate-800 tracking-tight drop-shadow-sm">
                {value}
            </h3>
        </div>
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg shadow-${glowColor}/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
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
        { difficulty: 'Easy', solved: solvedByDifficulty.easy, fill: '#10b981' }, // emerald-500
        { difficulty: 'Medium', solved: solvedByDifficulty.medium, fill: '#3b82f6' }, // blue-500
        { difficulty: 'Hard', solved: solvedByDifficulty.hard, fill: '#8b5cf6' }, // violet-500
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

    if (items.length === 0) return <div className="p-12 text-center text-slate-400 font-mono text-sm">No data logs found. Start grinding! 🚀</div>;

    return (
      <div className="overflow-x-auto rounded-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-gray-100">
              {headers.map(h => <th key={h} className="p-4 font-bold">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm text-slate-700 bg-white/40">
            {items.slice().reverse().map((item, index) => (
              <tr key={index} className="hover:bg-white transition-colors group">
                {selectedView === 'interview' ? (
                  <>
                    <td className="p-4 font-bold text-blue-600">{item.job_role}</td>
                    <td className="p-4 text-xs font-medium text-slate-500">{item.interview_type}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${item.overall_score >= 7 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                        {item.overall_score}/10
                      </span>
                    </td>
                  </>
                ) : selectedView === 'coding' ? (
                  <>
                    <td className="p-4 font-bold text-slate-800">{item.problem_title}</td>
                    <td className="p-4">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded border ${item.difficulty === 'easy' ? 'border-emerald-200 text-emerald-600 bg-emerald-50' : item.difficulty === 'medium' ? 'border-blue-200 text-blue-600 bg-blue-50' : 'border-purple-200 text-purple-600 bg-purple-50'}`}>
                        {item.difficulty}
                      </span>
                    </td>
                    <td className="p-4">{item.is_correct ? <span className="text-emerald-600 font-bold flex items-center gap-1.5"><FiCheckCircle/> Solved</span> : <span className="text-red-500 font-medium">Failed</span>}</td>
                  </>
                ) : (
                  <>
                    <td className="p-4 font-bold text-slate-800">{item.topic}</td>
                    <td className="p-4 capitalize text-xs font-medium text-slate-500">{item.mode || 'Standard'}</td>
                    <td className="p-4 font-bold font-mono text-blue-600">{item.score}/{item.total}</td>
                  </>
                )}
                <td className="p-4 text-slate-400 text-xs font-mono">{item.created_at ? new Date(item.created_at).toLocaleDateString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold tracking-widest animate-pulse text-blue-500">LOADING DASHBOARD...</p>
      </div>
    </div>
  );
  
  return (
    // MAIN WRAPPER: Added Fixed Background Image
    <div 
      className="min-h-screen bg-fixed bg-cover bg-center font-sans text-slate-900 relative"
      style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2000&auto=format&fit=crop")' }}
    >
      {/* Light overlay to ensure text is readable over the image */}
      <div className="absolute inset-0 bg-sky-50/80 backdrop-blur-sm -z-10"></div>

      <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-200/60 pb-8">
            <div>
                <h1 className="text-5xl md:text-6xl font-display font-extrabold text-slate-800 mb-2 tracking-tight">
                    DASHBOARD
                </h1>
                <p className="text-slate-500 text-sm font-medium">Welcome back, <span className="text-blue-600 font-bold">{user?.fname}</span>. Here is your performance breakdown.</p>
            </div>
            
            <button 
                onClick={() => navigate('/leaderboard')}
                className="group relative inline-flex items-center gap-3 px-6 py-3 bg-white border border-gray-200 rounded-xl text-slate-700 font-bold uppercase tracking-widest hover:border-blue-500 hover:text-blue-600 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
                <FiAward size={20} className="text-amber-500" />
                <span>Hall of Fame</span>
            </button>
        </div>

        {/* 1. STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Tests" value={stats.totalTests} icon={<FiActivity/>} gradient="from-blue-500 to-sky-400" glowColor="bg-blue-500" />
          <StatCard title="Avg Score" value={stats.avgScore} icon={<FiTarget/>} gradient="from-emerald-400 to-teal-500" glowColor="bg-emerald-500" />
          <StatCard title="Coding Streak" value={stats.codingSolved} icon={<FiCode/>} gradient="from-violet-500 to-purple-500" glowColor="bg-violet-500" />
          <StatCard title="Interviews" value={stats.interviewCount} icon={<FiUser/>} gradient="from-orange-400 to-amber-500" glowColor="bg-orange-500" />
        </div>

        {/* 2. PROFILE & MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* PROFILE CARD */}
            <div className="lg:col-span-1 bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-xl flex flex-col items-center text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-100 to-transparent opacity-50" />
                
                <div className="relative w-40 h-40 mb-6 group-hover:scale-105 transition-transform duration-500">
                    {/* Ring Animation */}
                    <div className="absolute inset-0 border-2 border-dashed border-blue-300 rounded-full animate-spin-slow"></div>
                    
                    <div className="w-full h-full rounded-full p-2 bg-white relative z-10 shadow-sm">
                        <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 relative z-10 border border-gray-100">
                            {preview ? <img src={preview} className="w-full h-full object-cover" alt="Profile" /> :
                            user?.profile_picture_url ? <img src={`${API_BASE}${user.profile_picture_url}`} className="w-full h-full object-cover" alt="Profile" /> :
                            <div className="w-full h-full flex items-center justify-center text-5xl font-black text-blue-200">{user?.fname?.[0]}</div>}
                        </div>
                    </div>
                    
                    <label htmlFor="pfp" className="absolute bottom-2 right-2 z-20 bg-blue-600 text-white p-3 rounded-xl cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                        <FiCamera size={18} />
                    </label>
                    <input type="file" id="pfp" className="hidden" onChange={(e) => { if(e.target.files[0]) setSelectedFile(e.target.files[0]) }} />
                </div>

                {selectedFile && (
                    <button onClick={handleUpload} className="mb-6 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2 shadow-md">
                        {uploading ? "Uploading..." : <><FiUpload /> Save Photo</>}
                    </button>
                )}

                <h2 className="text-2xl font-bold text-slate-800 mb-1">{user?.fname} {user?.lname}</h2>
                <p className="text-slate-500 text-sm mb-6 font-mono bg-slate-100 px-3 py-1 rounded-full">{user?.email}</p>

                <div className="w-full grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Year</p>
                        <p className="text-xl font-bold text-slate-700">{user?.year}</p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Field</p>
                        <p className="text-lg font-bold text-slate-700 truncate">{user?.field}</p>
                    </div>
                </div>
            </div>

            {/* CHARTS SECTION */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* TABS */}
                <div className="p-1.5 bg-white/60 backdrop-blur rounded-2xl border border-white shadow-sm inline-flex w-full overflow-x-auto">
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
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'text-slate-500 hover:text-slate-800 hover:bg-white/80'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* GRAPH CONTAINER */}
                {selectedView === 'interview' ? (
                   <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-xl relative overflow-hidden h-[400px]">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-[80px] -z-10" />
                      <h3 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2"><FiBriefcase className="text-blue-500"/> Interview Mastery</h3>
                      <ResponsiveContainer width="100%" height="90%">
                        <AreaChart data={interviewGraphData}>
                          <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
                          <YAxis domain={[0, 10]} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
                          <Tooltip content={<CustomTooltip />} />
                          <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={4} fill="url(#colorScore)" />
                        </AreaChart>
                      </ResponsiveContainer>
                   </div>
                ) : selectedView === 'coding' ? (
                   <div className="grid grid-cols-1 gap-6 h-[400px]">
                      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-xl h-full">
                         <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2"><FiCode className="text-violet-500"/> Problems Solved</h3>
                         <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={codingData.bar} layout="vertical" barSize={32}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="difficulty" type="category" width={70} tick={{fill:'#64748b', fontSize:12, fontWeight: 600}} axisLine={false} tickLine={false}/>
                                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(241, 245, 249, 0.5)'}} />
                                <Bar dataKey="solved" radius={[0, 10, 10, 0]}>
                                   {codingData.bar.map((entry, index) => <cell key={`cell-${index}`} fill={entry.fill} />)}
                                </Bar>
                            </BarChart>
                         </ResponsiveContainer>
                      </div>
                   </div>
                ) : (
                  <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white relative overflow-hidden shadow-xl h-[450px]">
                    <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-50 rounded-full blur-[100px] -z-10" />
                    
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 z-20 relative gap-4">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-1 flex items-center gap-2">
                                <FiTrendingUp className="text-emerald-500"/> Topic Progress
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">Track your score history over time.</p>
                        </div>
                        
                        {/* Upgraded Light Theme Dropdown */}
                        <div className="relative group min-w-[220px]">
                            <select 
                                value={graphTopic} 
                                onChange={(e) => setGraphTopic(e.target.value)}
                                className="w-full appearance-none bg-white border border-gray-200 text-slate-700 font-semibold rounded-xl py-3 pl-4 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer shadow-sm"
                            >
                                {(selectedView === 'aptitude' ? APTITUDE_TOPICS : TECHNICAL_TOPICS).map(t => (
                                    <option key={t} value={t} className="text-slate-800">{t}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">▼</div>
                        </div>
                    </div>

                    <div className="h-[320px] w-full mt-4">
                        {topicTrendData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={topicTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="attempt" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
                                <YAxis domain={[0, 20]} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '13px', fontWeight: 600, color: '#475569' }} />
                                <Line type="monotone" dataKey="Easy" stroke="#10b981" strokeWidth={3} dot={{r:0}} activeDot={{r:6, strokeWidth: 0, fill:'#10b981'}} connectNulls />
                                <Line type="monotone" dataKey="Moderate" stroke="#3b82f6" strokeWidth={3} dot={{r:0}} activeDot={{r:6, strokeWidth: 0, fill:'#3b82f6'}} connectNulls />
                                <Line type="monotone" dataKey="Hard" stroke="#8b5cf6" strokeWidth={3} dot={{r:0}} activeDot={{r:6, strokeWidth: 0, fill:'#8b5cf6'}} connectNulls />
                            </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                                <div className="p-4 bg-slate-50 rounded-full">
                                    <FiZap size={32} className="text-slate-300"/>
                                </div>
                                <p className="font-medium">No data recorded for {graphTopic}.</p>
                            </div>
                        )}
                    </div>
                  </div>
                )}
            </div>
        </div>

        {/* 3. ACTIVITY LOG TABLE */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-xl overflow-hidden mb-12">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-white">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <FiActivity className="text-blue-600" size={20} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Recent Activity Log</h3>
            </div>
            <div className="p-1">
                {renderTable()}
            </div>
        </div>

      </div>
    </div>
  );
}
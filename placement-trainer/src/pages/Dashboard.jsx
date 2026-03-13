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

// Advanced Dark Theme Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-xl p-4 border border-white/10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] z-50">
        <p className="text-slate-400 font-bold mb-3 text-xs uppercase tracking-widest border-b border-white/10 pb-2">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-3 mb-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color, boxShadow: `0 0 10px ${p.color}` }} />
            <span className="text-sm font-medium text-slate-300">{p.name}: <span className="font-bold text-lg text-white">{p.value}</span></span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Advanced Dark Theme Stat Card
const StatCard = ({ title, value, icon, gradient, glowColor }) => (
  <div className="relative overflow-hidden p-6 rounded-[2rem] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl transition-all duration-300 group hover:-translate-y-1 hover:bg-white/10 hover:border-white/20">
    <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity ${glowColor}`} />
    
    <div className="flex items-start justify-between relative z-10">
        <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-4xl font-black text-white tracking-tight drop-shadow-md">
                {value}
            </h3>
        </div>
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
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

  const { filteredTests } = useMemo(() => {
    const relevantTopics = selectedView === 'aptitude' ? APTITUDE_TOPICS : TECHNICAL_TOPICS;
    const filtered = tests.filter(test => test.topic && relevantTopics.includes(test.topic));
    return { filteredTests: filtered };
  }, [tests, selectedView]);

  const codingData = useMemo(() => {
    const solvedByDifficulty = { easy: 0, medium: 0, hard: 0 };
    const uniqueSolved = new Set();
    codingAttempts.forEach(attempt => {
      if (attempt.is_correct && !uniqueSolved.has(attempt.problem_title)) {
        uniqueSolved.add(attempt.problem_title);
        if (solvedByDifficulty[attempt.difficulty] !== undefined) solvedByDifficulty[attempt.difficulty]++;
      }
    });

    return {
      bar: [
        { difficulty: 'Easy', solved: solvedByDifficulty.easy, fill: '#10b981' }, 
        { difficulty: 'Medium', solved: solvedByDifficulty.medium, fill: '#3b82f6' }, 
        { difficulty: 'Hard', solved: solvedByDifficulty.hard, fill: '#8b5cf6' }, 
      ]
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

    if (items.length === 0) return <div className="p-12 text-center text-slate-400 font-mono text-sm bg-white/5 rounded-2xl border border-white/5">No datalogs detected in the mainframe. 🚀</div>;

    return (
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/10 text-slate-300 text-xs uppercase tracking-widest border-b border-white/10">
              {headers.map(h => <th key={h} className="p-5 font-black">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm text-slate-300 bg-black/20 backdrop-blur-md">
            {items.slice().reverse().map((item, index) => (
              <tr key={index} className="hover:bg-white/10 transition-colors group">
                {selectedView === 'interview' ? (
                  <>
                    <td className="p-5 font-bold text-blue-400 group-hover:text-blue-300">{item.job_role}</td>
                    <td className="p-5 text-xs font-black uppercase tracking-widest text-slate-400">{item.interview_type}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-widest ${item.overall_score >= 7 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                        {item.overall_score}/10
                      </span>
                    </td>
                  </>
                ) : selectedView === 'coding' ? (
                  <>
                    <td className="p-5 font-bold text-slate-200">{item.problem_title}</td>
                    <td className="p-5">
                      <span className={`text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-lg border ${item.difficulty === 'easy' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : item.difficulty === 'medium' ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' : 'border-purple-500/30 text-purple-400 bg-purple-500/10'}`}>
                        {item.difficulty}
                      </span>
                    </td>
                    <td className="p-5">{item.is_correct ? <span className="text-emerald-400 font-bold flex items-center gap-2"><FiCheckCircle/> Verified</span> : <span className="text-red-400 font-medium">Failed</span>}</td>
                  </>
                ) : (
                  <>
                    <td className="p-5 font-bold text-slate-200">{item.topic}</td>
                    <td className="p-5 capitalize text-[10px] font-black tracking-widest text-slate-400">{item.mode || 'Standard'}</td>
                    <td className="p-5 font-bold font-mono text-blue-400">{item.score}/{item.total}</td>
                  </>
                )}
                <td className="p-5 text-slate-500 text-xs font-mono">{item.created_at ? new Date(item.created_at).toLocaleDateString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="font-black tracking-[0.3em] uppercase text-xs text-blue-400 animate-pulse">DECRYPTING DASHBOARD...</p>
      </div>
    </div>
  );
  
  return (
    // ADVANCED BACKGROUND ENGINE
    <div className="min-h-screen relative overflow-hidden font-sans text-slate-200">
      {/* High-Tech Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center -z-30 scale-105"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop")', filter: 'brightness(0.3) contrast(1.2)' }}
      />
      {/* Cyber Grid & Blurs */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#3b82f61a_1px,transparent_1px),linear-gradient(to_bottom,#3b82f61a_1px,transparent_1px)] bg-[size:40px_40px] -z-20 [transform:perspective(1000px)_rotateX(60deg)_translateZ(-200px)_translateY(-200px)] opacity-50" />
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-[8px] -z-10"></div>

      <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-8">
            <div>
                <div className="flex items-center gap-2 text-blue-500 font-black tracking-[0.3em] text-[10px] uppercase mb-3">
                  <FiCpu className="animate-spin-slow" /> Mainframe Uplink Active
                </div>
                <h1 className="text-5xl md:text-6xl font-display font-black text-white mb-2 tracking-tighter drop-shadow-lg">
                    PERFORMANCE <span className="text-blue-500 italic">MATRIX</span>
                </h1>
                <p className="text-slate-400 text-sm font-medium tracking-wide">Commander <span className="text-white font-bold">{user?.fname}</span>, your analytics are ready.</p>
            </div>
            
            <button 
                onClick={() => navigate('/leaderboard')}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl text-white font-black uppercase tracking-widest hover:bg-blue-600 hover:border-blue-500 shadow-2xl transition-all duration-300 overflow-hidden text-xs"
            >
                <FiAward size={20} className="text-amber-400 group-hover:scale-110 group-hover:text-white transition-all" />
                <span>Global Rankings</span>
            </button>
        </div>

        {/* 1. STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Assessments" value={stats.totalTests} icon={<FiActivity/>} gradient="from-blue-600 to-sky-500" glowColor="bg-blue-500" />
          <StatCard title="Accuracy Rating" value={stats.avgScore} icon={<FiTarget/>} gradient="from-emerald-500 to-teal-400" glowColor="bg-emerald-500" />
          <StatCard title="Algorithms Solved" value={stats.codingSolved} icon={<FiCode/>} gradient="from-violet-600 to-purple-500" glowColor="bg-violet-500" />
          <StatCard title="Simulations" value={stats.interviewCount} icon={<FiUser/>} gradient="from-orange-500 to-amber-500" glowColor="bg-orange-500" />
        </div>

        {/* 2. PROFILE & MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* PROFILE CARD */}
            <div className="lg:col-span-1 bg-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-blue-600/20 to-transparent opacity-80" />
                
                <div className="relative w-40 h-40 mb-8 group-hover:scale-105 transition-transform duration-500 mt-4">
                    {/* Glowing Tech Ring Animation */}
                    <div className="absolute inset-0 border-[3px] border-dashed border-blue-500/50 rounded-full animate-spin-slow shadow-[0_0_20px_rgba(59,130,246,0.3)]"></div>
                    
                    <div className="w-full h-full rounded-full p-2.5 bg-black/40 backdrop-blur-sm relative z-10 shadow-inner">
                        <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 relative z-10 border border-white/10">
                            {preview ? <img src={preview} className="w-full h-full object-cover" alt="Profile" /> :
                            user?.profile_picture_url ? <img src={`${API_BASE}${user.profile_picture_url}`} className="w-full h-full object-cover" alt="Profile" /> :
                            <div className="w-full h-full flex items-center justify-center text-5xl font-black text-slate-700">{user?.fname?.[0]}</div>}
                        </div>
                    </div>
                    
                    <label htmlFor="pfp" className="absolute bottom-2 right-2 z-20 bg-blue-600 text-white p-3.5 rounded-xl cursor-pointer hover:bg-blue-500 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                        <FiCamera size={18} />
                    </label>
                    <input type="file" id="pfp" className="hidden" onChange={(e) => { if(e.target.files[0]) setSelectedFile(e.target.files[0]) }} />
                </div>

                {selectedFile && (
                    <button onClick={handleUpload} className="mb-6 px-8 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-blue-600/30">
                        {uploading ? "Transmitting..." : <><FiUpload /> Save Identity</>}
                    </button>
                )}

                <h2 className="text-3xl font-black text-white mb-2 tracking-tight">{user?.fname} {user?.lname}</h2>
                <p className="text-blue-400 text-[11px] mb-8 font-mono bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-lg tracking-wider">{user?.email}</p>

                <div className="w-full grid grid-cols-2 gap-4">
                    <div className="p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Clearance</p>
                        <p className="text-xl font-black text-white">Yr {user?.year}</p>
                    </div>
                    <div className="p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Division</p>
                        <p className="text-lg font-black text-white truncate">{user?.field}</p>
                    </div>
                </div>
            </div>

            {/* CHARTS SECTION */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* TABS */}
                <div className="p-2 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl inline-flex w-full overflow-x-auto no-scrollbar">
                    {['aptitude', 'technical', 'coding', 'interview'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => { 
                                setSelectedView(tab); 
                                if(tab === 'technical') setGraphTopic(TECHNICAL_TOPICS[0]); 
                                else if(tab === 'aptitude') setGraphTopic(APTITUDE_TOPICS[0]); 
                            }}
                            className={`flex-1 py-3.5 px-4 min-w-[120px] text-[10px] md:text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 ${
                                selectedView === tab 
                                ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' 
                                : 'text-slate-500 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* GRAPH CONTAINER */}
                {selectedView === 'interview' ? (
                   <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden h-[450px]">
                      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] -z-10" />
                      <h3 className="text-2xl font-black mb-8 text-white flex items-center gap-3"><FiBriefcase className="text-blue-500"/> Interview Diagnostics</h3>
                      <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={interviewGraphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                          <YAxis domain={[0, 10]} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                          <Tooltip content={<CustomTooltip />} />
                          <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={4} fill="url(#colorScore)" />
                        </AreaChart>
                      </ResponsiveContainer>
                   </div>
                ) : selectedView === 'coding' ? (
                   <div className="grid grid-cols-1 gap-6 h-[450px]">
                      <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl h-full relative overflow-hidden">
                         <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-violet-600/20 rounded-full blur-[100px] -z-10" />
                         <h3 className="text-2xl font-black mb-8 text-white flex items-center gap-3"><FiCode className="text-violet-500"/> Algorithms Decrypted</h3>
                         <ResponsiveContainer width="100%" height="85%">
                            <BarChart data={codingData.bar} layout="vertical" barSize={36} margin={{ left: -20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="difficulty" type="category" width={90} tick={{fill:'#cbd5e1', fontSize:11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px'}} axisLine={false} tickLine={false}/>
                                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255, 255, 255, 0.05)'}} />
                                <Bar dataKey="solved" radius={[0, 12, 12, 0]}>
                                   {codingData.bar.map((entry, index) => <cell key={`cell-${index}`} fill={entry.fill} />)}
                                </Bar>
                            </BarChart>
                         </ResponsiveContainer>
                      </div>
                   </div>
                ) : (
                  <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden shadow-2xl h-[450px]">
                    <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -z-10" />
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 z-20 relative gap-4">
                        <div>
                            <h3 className="text-2xl font-black text-white mb-1 flex items-center gap-3">
                                <FiTrendingUp className="text-emerald-400"/> Module Progress
                            </h3>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Historical trajectory data</p>
                        </div>
                        
                        {/* Cyber Dropdown */}
                        <div className="relative group min-w-[240px]">
                            <select 
                                value={graphTopic} 
                                onChange={(e) => setGraphTopic(e.target.value)}
                                className="w-full appearance-none bg-black/50 border border-white/20 text-white font-bold rounded-xl py-3.5 pl-5 pr-10 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer shadow-inner"
                            >
                                {(selectedView === 'aptitude' ? APTITUDE_TOPICS : TECHNICAL_TOPICS).map(t => (
                                    <option key={t} value={t} className="bg-slate-900 text-white">{t}</option>
                                ))}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none text-xs">▼</div>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        {topicTrendData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={topicTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="attempt" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }} axisLine={false} tickLine={false} />
                                <YAxis domain={[0, 20]} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#cbd5e1' }} />
                                <Line type="monotone" dataKey="Easy" stroke="#10b981" strokeWidth={3} dot={{r:0}} activeDot={{r:6, strokeWidth: 0, fill:'#10b981'}} connectNulls />
                                <Line type="monotone" dataKey="Moderate" stroke="#3b82f6" strokeWidth={3} dot={{r:0}} activeDot={{r:6, strokeWidth: 0, fill:'#3b82f6'}} connectNulls />
                                <Line type="monotone" dataKey="Hard" stroke="#8b5cf6" strokeWidth={3} dot={{r:0}} activeDot={{r:6, strokeWidth: 0, fill:'#8b5cf6'}} connectNulls />
                            </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                                <div className="p-5 bg-white/5 border border-white/10 rounded-full shadow-inner">
                                    <FiZap size={32} className="text-slate-600"/>
                                </div>
                                <p className="font-black uppercase tracking-widest text-[10px]">No telemetry found for {graphTopic}</p>
                            </div>
                        )}
                    </div>
                  </div>
                )}
            </div>
        </div>

        {/* 3. ACTIVITY LOG TABLE */}
        <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden mb-12">
            <div className="p-6 md:p-8 border-b border-white/10 flex items-center gap-4 bg-black/20">
                <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-xl shadow-inner">
                    <FiActivity className="text-blue-400" size={24} />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">System Activity Log</h3>
            </div>
            <div className="p-4 md:p-6">
                {renderTable()}
            </div>
        </div>

      </div>
    </div>
  );
}
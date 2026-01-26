import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../api";
import { FiAward, FiFilter, FiCpu, FiCode, FiMessageCircle, FiBookOpen } from "react-icons/fi";

// Constants for Dropdowns
const TOPICS = {
  aptitude: ['Percentages', 'Profit & Loss', 'Number System', 'Time, Speed & Distance'],
  technical: ['C Programming', 'Java', 'Python', 'DBMS', 'OS'],
  interview: ['Full Stack Developer', 'Data Scientist', 'SDE', 'HR'], // Job Roles
  coding: [] // Coding doesn't filter by topic in this DB schema, only difficulty
};

const DIFFICULTIES = ['easy', 'moderate', 'hard'];

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [category, setCategory] = useState("aptitude"); // aptitude, technical, coding, interview
  const [topic, setTopic] = useState("all");
  const [difficulty, setDifficulty] = useState("all");

  useEffect(() => {
    fetchFilteredLeaderboard();
  }, [category, topic, difficulty]);

  const fetchFilteredLeaderboard = async () => {
    setLoading(true);
    try {
      // Build Query Params
      const params = new URLSearchParams();
      params.append("category", category);
      if (topic !== "all") params.append("topic", topic);
      if (difficulty !== "all") params.append("difficulty", difficulty);

      const res = await axios.get(`${API_BASE}/api/leaderboard/filter?${params.toString()}`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get Icon based on Category
  const getCategoryIcon = () => {
    if (category === 'aptitude') return <FiBookOpen className="text-yellow-400" />;
    if (category === 'technical') return <FiCpu className="text-blue-400" />;
    if (category === 'coding') return <FiCode className="text-green-400" />;
    if (category === 'interview') return <FiMessageCircle className="text-purple-400" />;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 uppercase tracking-tighter mb-2">
            Global Rankings
          </h1>
          <p className="text-gray-400 font-medium">Where the elite developers come to play.</p>
        </div>

        {/* --- CONTROL CENTER (FILTERS) --- */}
        <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl mb-12 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                
                {/* 1. Category Tabs */}
                <div className="flex bg-black/40 p-1.5 rounded-xl overflow-x-auto w-full md:w-auto">
                    {['aptitude', 'technical', 'coding', 'interview'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => { setCategory(cat); setTopic("all"); setDifficulty("all"); }}
                            className={`px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
                                category === cat 
                                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                                : 'text-gray-500 hover:text-white'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* 2. Specific Filters */}
                <div className="flex gap-4 w-full md:w-auto">
                    {/* Topic Dropdown (Only if topics exist for category) */}
                    {TOPICS[category]?.length > 0 && (
                        <div className="relative group flex-1">
                            <select 
                                value={topic} 
                                onChange={(e) => setTopic(e.target.value)}
                                className="w-full appearance-none bg-black border border-white/20 text-white py-3 px-6 rounded-xl font-medium outline-none focus:border-cyan-400 transition-all cursor-pointer"
                            >
                                <option value="all">All Topics</option>
                                {TOPICS[category].map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <div className="absolute right-4 top-4 text-cyan-400 pointer-events-none text-xs">▼</div>
                        </div>
                    )}

                    {/* Difficulty Dropdown (Not for Interviews) */}
                    {category !== 'interview' && (
                        <div className="relative group flex-1">
                            <select 
                                value={difficulty} 
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="w-full appearance-none bg-black border border-white/20 text-white py-3 px-6 rounded-xl font-medium outline-none focus:border-pink-400 transition-all cursor-pointer uppercase"
                            >
                                <option value="all">Any Difficulty</option>
                                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <div className="absolute right-4 top-4 text-pink-400 pointer-events-none text-xs">▼</div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* --- LEADERBOARD DISPLAY --- */}
        <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Top 3 Podium (Left Column on large screens) */}
            <div className="lg:col-span-1 flex flex-col gap-4">
                {users.slice(0,3).map((u, i) => (
                    <div key={u.id} className={`relative p-1 rounded-2xl bg-gradient-to-r ${i===0 ? 'from-yellow-300 to-yellow-600' : i===1 ? 'from-gray-300 to-gray-500' : 'from-orange-400 to-red-600'}`}>
                        <div className="bg-gray-900 rounded-xl p-4 flex items-center gap-4 h-full relative overflow-hidden">
                            <div className="text-4xl">{i===0 ? '👑' : i===1 ? '🥈' : '🥉'}</div>
                            <div>
                                <h3 className="font-bold text-white text-lg">{u.fname} {u.lname}</h3>
                                <p className="text-sm text-gray-400 font-mono">{u.score} PTS</p>
                            </div>
                            <img 
                                src={u.profile_picture_url ? `${API_BASE}${u.profile_picture_url}` : "/default-pfp.png"} 
                                className="absolute right-4 w-16 h-16 rounded-full border-2 border-white/10 object-cover opacity-80"
                            />
                        </div>
                    </div>
                ))}
                {users.length === 0 && !loading && (
                    <div className="p-8 text-center text-gray-600 border border-gray-800 rounded-2xl">
                        No champions found in this category yet. Be the first!
                    </div>
                )}
            </div>

            {/* The List (Right Column) */}
            <div className="lg:col-span-2 bg-gray-900/40 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center gap-3 bg-white/5">
                    {getCategoryIcon()}
                    <h3 className="text-lg font-bold text-white uppercase tracking-widest">
                        {category} • {topic === 'all' ? 'Global' : topic} • {difficulty === 'all' ? 'Mixed' : difficulty}
                    </h3>
                </div>
                
                <table className="w-full text-left">
                    <thead className="text-xs uppercase text-gray-500">
                        <tr>
                            <th className="p-5">#</th>
                            <th className="p-5">Player</th>
                            <th className="p-5 text-right">Stats</th>
                            <th className="p-5 text-right">Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                        {users.slice(3).map((u, index) => (
                            <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-5 font-mono text-gray-500">0{index + 4}</td>
                                <td className="p-5 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[1px]">
                                        <img src={u.profile_picture_url ? `${API_BASE}${u.profile_picture_url}` : "/default-pfp.png"} className="w-full h-full rounded-full object-cover border-2 border-black" />
                                    </div>
                                    <span className="font-bold text-gray-300">{u.fname}</span>
                                </td>
                                <td className="p-5 text-right text-gray-500">
                                    {u.attempts} {category === 'interview' ? 'Sessions' : 'Solved'}
                                </td>
                                <td className="p-5 text-right font-black text-white">{u.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
}
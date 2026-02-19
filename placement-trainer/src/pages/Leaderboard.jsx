// src/pages/Leaderboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../api";
import { FiAward, FiCpu, FiCode, FiMessageCircle, FiBookOpen, FiZap, FiLayers } from "react-icons/fi";

const TOPICS = {
  aptitude: ['Percentages', 'Profit & Loss', 'Number System', 'Time, Speed & Distance'],
  technical: ['C Programming', 'Java', 'Python', 'DBMS', 'OS'],
  interview: ['Full Stack Developer', 'Data Scientist', 'SDE', 'HR'],
  coding: [] 
};

const DIFFICULTIES = ['easy', 'moderate', 'hard'];

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("aptitude");
  const [topic, setTopic] = useState("all");
  const [difficulty, setDifficulty] = useState("all");

  useEffect(() => {
    fetchFilteredLeaderboard();
  }, [category, topic, difficulty]);

  const fetchFilteredLeaderboard = async () => {
    setLoading(true);
    try {
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

  const getCategoryIcon = () => {
    if (category === 'aptitude') return <FiBookOpen className="text-neon-yellow" />;
    if (category === 'technical') return <FiCpu className="text-neon-blue" />;
    if (category === 'coding') return <FiCode className="text-neon-green" />;
    if (category === 'interview') return <FiMessageCircle className="text-neon-purple" />;
  };

  return (
    <div className="min-h-screen bg-game-bg text-white p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-2 tracking-tight">
            HALL OF <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-yellow to-neon-orange text-glow">FAME</span>
          </h1>
          <p className="text-gray-400">Compete against the best and earn your rank.</p>
        </div>

        {/* CONTROLS */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between bg-black/40">
            <div className="flex bg-black/60 rounded-xl p-1 border border-white/10">
                {['aptitude', 'technical', 'coding', 'interview'].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => { setCategory(cat); setTopic("all"); setDifficulty("all"); }}
                        className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                            category === cat 
                            ? 'bg-neon-blue text-black shadow-[0_0_10px_rgba(45,212,191,0.4)]' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="flex gap-3">
                {TOPICS[category]?.length > 0 && (
                    <select 
                        value={topic} 
                        onChange={(e) => setTopic(e.target.value)} 
                        className="bg-black text-white text-sm px-4 py-2.5 rounded-xl border border-white/20 outline-none focus:border-neon-blue transition-colors"
                    >
                        <option value="all">All Topics</option>
                        {TOPICS[category].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                )}
                {category !== 'interview' && (
                    <select 
                        value={difficulty} 
                        onChange={(e) => setDifficulty(e.target.value)} 
                        className="bg-black text-white text-sm px-4 py-2.5 rounded-xl border border-white/20 outline-none focus:border-neon-purple capitalize transition-colors"
                    >
                        <option value="all">All Levels</option>
                        {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                )}
            </div>
        </div>

        {/* LEADERBOARD TABLE */}
        <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden bg-black/40 shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center gap-3 bg-white/5">
                {getCategoryIcon()}
                <h3 className="text-lg font-bold text-white uppercase tracking-widest">
                    Top Performers
                </h3>
            </div>
            
            <table className="w-full text-left">
                <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest">
                    <tr>
                        <th className="p-6 font-semibold">Rank</th>
                        <th className="p-6 font-semibold">Player</th>
                        <th className="p-6 font-semibold text-right">XP / Score</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                    {users.map((u, index) => (
                        <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                            <td className="p-6">
                                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                                    index === 0 ? 'bg-neon-yellow text-black shadow-[0_0_10px_#FACC15]' : 
                                    index === 1 ? 'bg-gray-300 text-black' : 
                                    index === 2 ? 'bg-orange-500 text-white' : 
                                    'text-gray-500 bg-white/5'
                                }`}>
                                    {index + 1}
                                </div>
                            </td>
                            <td className="p-6 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center overflow-hidden">
                                    {u.profile_picture_url ? (
                                        <img src={`${API_BASE}${u.profile_picture_url}`} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-gray-500 font-bold">{u.fname[0]}</span>
                                    )}
                                </div>
                                <span className="font-bold text-gray-200 group-hover:text-white transition-colors">{u.fname} {u.lname}</span>
                            </td>
                            <td className="p-6 text-right">
                                <span className="font-mono font-bold text-neon-blue text-lg">{Math.round(u.score)}</span>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && !loading && (
                        <tr>
                            <td colSpan="3" className="p-12 text-center text-gray-500">No records found. Be the first!</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

      </div>
    </div>
  );
}
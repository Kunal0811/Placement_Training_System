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
    if (category === 'aptitude') return <FiBookOpen className="text-yellow-400" />;
    if (category === 'technical') return <FiCpu className="text-blue-400" />;
    if (category === 'coding') return <FiCode className="text-green-400" />;
    if (category === 'interview') return <FiMessageCircle className="text-purple-400" />;
  };

  const getUnitName = () => {
    if (category === 'coding') return 'Solved';
    if (category === 'interview') return 'Sessions';
    return 'Tests';
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 uppercase tracking-tighter mb-2">
            Global Rankings
          </h1>
          <p className="text-gray-400 font-medium">Compete, Earn XP, and Dominate.</p>
        </div>

        {/* --- SCORING RULES CARD (New!) --- */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-white/10 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between shadow-lg">
            <div className="flex items-center gap-3 mb-3 md:mb-0">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><FiZap size={20}/></div>
                <div>
                    <h4 className="font-bold text-sm text-gray-200">Point Distribution</h4>
                    <p className="text-xs text-gray-500">How scores are calculated for {category}</p>
                </div>
            </div>
            <div className="flex gap-4 text-xs font-mono text-gray-300">
                {category === 'coding' ? (
                    <>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full"></span> Easy: 5 XP</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-400 rounded-full"></span> Med: 10 XP</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-purple-400 rounded-full"></span> Hard: 20 XP</span>
                    </>
                ) : category === 'interview' ? (
                    <span>Based on Average Interview Rating (0-10)</span>
                ) : (
                    <span>Cumulative Score from all Tests</span>
                )}
            </div>
        </div>

        {/* --- FILTERS --- */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10">
            <div className="flex bg-gray-900/80 p-1 rounded-xl border border-white/10 overflow-x-auto w-full md:w-auto">
                {['aptitude', 'technical', 'coding', 'interview'].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => { setCategory(cat); setTopic("all"); setDifficulty("all"); }}
                        className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                            category === cat ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="flex gap-3 w-full md:w-auto">
                {TOPICS[category]?.length > 0 && (
                    <select value={topic} onChange={(e) => setTopic(e.target.value)} className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg border border-white/10 outline-none focus:border-cyan-500">
                        <option value="all">All Topics</option>
                        {TOPICS[category].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                )}
                {category !== 'interview' && (
                    <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg border border-white/10 outline-none focus:border-pink-500 capitalize">
                        <option value="all">All Levels</option>
                        {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                )}
            </div>
        </div>

        {/* --- LEADERBOARD DISPLAY --- */}
        <div className="grid lg:grid-cols-3 gap-8">
            
            {/* TOP 3 PODIUM (Updated with Stats!) */}
            <div className="lg:col-span-1 flex flex-col gap-4">
                {users.slice(0,3).map((u, i) => (
                    <div key={u.id} className={`relative p-0.5 rounded-2xl bg-gradient-to-r ${i===0 ? 'from-yellow-300 to-yellow-600' : i===1 ? 'from-gray-300 to-gray-500' : 'from-orange-400 to-red-600'}`}>
                        <div className="bg-black rounded-[14px] p-4 flex items-center gap-4 relative overflow-hidden">
                            <div className="text-3xl filter drop-shadow-lg">{i===0 ? '👑' : i===1 ? '🥈' : '🥉'}</div>
                            <div className="flex-1 min-w-0 z-10">
                                <h3 className="font-bold text-white text-lg truncate">{u.fname} {u.lname}</h3>
                                
                                {/* Points */}
                                <div className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                                    {u.score} PTS
                                </div>

                                {/* Stats Badge (Requested Feature) */}
                                <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded bg-white/10 border border-white/5 text-[10px] uppercase font-bold text-gray-400 gap-1">
                                    <FiLayers size={10}/> {u.attempts} {getUnitName()}
                                </div>
                            </div>
                            
                            <img src={u.profile_picture_url ? `${API_BASE}${u.profile_picture_url}` : "/default-pfp.png"} className="w-14 h-14 rounded-full border-2 border-white/10 object-cover" />
                            
                            {/* Glow Effect */}
                            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${i===0 ? 'from-yellow-500' : i===1 ? 'from-gray-500' : 'from-red-500'} opacity-20 blur-xl rounded-full`}></div>
                        </div>
                    </div>
                ))}
                {users.length === 0 && !loading && (
                    <div className="p-8 text-center text-gray-600 border border-gray-800 rounded-2xl">
                        No data found. Start solving to appear here!
                    </div>
                )}
            </div>

            {/* THE LIST (Rank 4+) */}
            <div className="lg:col-span-2 bg-gray-900/40 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center gap-3 bg-white/5">
                    {getCategoryIcon()}
                    <h3 className="text-lg font-bold text-white uppercase tracking-widest">
                        {topic === 'all' ? 'Global' : topic} • {difficulty}
                    </h3>
                </div>
                
                <table className="w-full text-left">
                    <thead className="text-xs uppercase text-gray-500 bg-black/20">
                        <tr>
                            <th className="p-5">#</th>
                            <th className="p-5">Player</th>
                            <th className="p-5 text-right">Stats</th>
                            <th className="p-5 text-right">Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                        {users.slice(3).map((u, index) => (
                            <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-5 font-mono text-gray-500">0{index + 4}</td>
                                <td className="p-5 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[1px]">
                                        <img src={u.profile_picture_url ? `${API_BASE}${u.profile_picture_url}` : "/default-pfp.png"} className="w-full h-full rounded-full object-cover border-2 border-black" />
                                    </div>
                                    <span className="font-bold text-gray-300 group-hover:text-white transition-colors">{u.fname} {u.lname}</span>
                                </td>
                                <td className="p-5 text-right text-gray-500 font-mono">
                                    {u.attempts} {getUnitName()}
                                </td>
                                <td className="p-5 text-right">
                                    <span className="font-black text-white">{u.score}</span>
                                </td>
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
import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../api";
import { FiAward, FiZap, FiCode, FiUser } from "react-icons/fi";

const RankBadge = ({ rank }) => {
  if (rank === 1) return <span className="text-3xl">👑</span>;
  if (rank === 2) return <span className="text-3xl">🥈</span>;
  if (rank === 3) return <span className="text-3xl">🥉</span>;
  return <span className="font-mono text-gray-500 font-bold">#{rank}</span>;
};

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [timeframe, setTimeframe] = useState("all"); // 'all' or 'week'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/leaderboard?timeframe=${timeframe}`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const topThree = users.slice(0, 3);
  const rest = users.slice(3);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans overflow-hidden relative">
      {/* Background FX */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header & Toggle */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 uppercase italic tracking-tighter">
            Hall of Fame
          </h1>
          <p className="text-gray-400 font-medium">Compete, Earn XP, and Dominate the Ranks</p>
          
          <div className="inline-flex bg-gray-900 p-1 rounded-xl border border-white/10 mt-6">
            <button 
                onClick={() => setTimeframe("week")}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${timeframe === 'week' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
                THIS WEEK
            </button>
            <button 
                onClick={() => setTimeframe("all")}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${timeframe === 'all' ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
                ALL TIME
            </button>
          </div>
        </div>

        {/* PODIUM SECTION */}
        {users.length > 0 && (
          <div className="flex flex-col md:flex-row justify-center items-end gap-4 md:gap-8 mb-16 px-4">
            
            {/* 2nd Place */}
            {topThree[1] && (
                <div className="flex flex-col items-center group">
                    <div className="relative mb-4">
                        <img 
                            src={topThree[1].profile_picture_url ? `${API_BASE}${topThree[1].profile_picture_url}` : "/default-pfp.png"} 
                            className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-gray-400 object-cover shadow-[0_0_20px_rgba(156,163,175,0.5)]"
                        />
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-400 text-black font-black px-2 py-0.5 rounded text-xs">LVL {Math.floor(topThree[1].total_xp / 1000)}</div>
                    </div>
                    <div className="w-24 md:w-32 h-32 md:h-40 bg-gradient-to-t from-gray-900 to-gray-800 rounded-t-2xl border-t-4 border-gray-400 flex flex-col justify-end p-4 text-center relative overflow-hidden">
                        <div className="text-2xl mb-1">🥈</div>
                        <h3 className="font-bold text-gray-300 truncate w-full text-sm">{topThree[1].fname}</h3>
                        <p className="text-xs text-gray-500 font-mono">{topThree[1].total_xp} XP</p>
                    </div>
                </div>
            )}

            {/* 1st Place */}
            {topThree[0] && (
                <div className="flex flex-col items-center z-10 group">
                    <div className="relative mb-4">
                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-300 to-orange-500 rounded-full blur opacity-75 animate-pulse"></div>
                        <img 
                            src={topThree[0].profile_picture_url ? `${API_BASE}${topThree[0].profile_picture_url}` : "/default-pfp.png"} 
                            className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-yellow-400 object-cover relative z-10"
                        />
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl animate-bounce">👑</span>
                    </div>
                    <div className="w-28 md:w-40 h-44 md:h-56 bg-gradient-to-t from-yellow-900/40 to-yellow-600/20 rounded-t-2xl border-t-4 border-yellow-400 flex flex-col justify-end p-4 text-center relative shadow-[0_0_50px_rgba(234,179,8,0.2)]">
                        <h3 className="font-black text-yellow-400 truncate w-full text-lg">{topThree[0].fname}</h3>
                        <p className="text-sm text-yellow-200/70 font-mono font-bold">{topThree[0].total_xp} XP</p>
                        <div className="mt-2 text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full border border-yellow-500/30">
                            🔥 TOP G
                        </div>
                    </div>
                </div>
            )}

            {/* 3rd Place */}
            {topThree[2] && (
                <div className="flex flex-col items-center group">
                    <div className="relative mb-4">
                        <img 
                            src={topThree[2].profile_picture_url ? `${API_BASE}${topThree[2].profile_picture_url}` : "/default-pfp.png"} 
                            className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-orange-700 object-cover shadow-[0_0_20px_rgba(194,65,12,0.5)]"
                        />
                    </div>
                    <div className="w-24 md:w-32 h-24 md:h-32 bg-gradient-to-t from-gray-900 to-orange-900/30 rounded-t-2xl border-t-4 border-orange-700 flex flex-col justify-end p-4 text-center">
                        <div className="text-2xl mb-1">🥉</div>
                        <h3 className="font-bold text-orange-200 truncate w-full text-sm">{topThree[2].fname}</h3>
                        <p className="text-xs text-orange-500 font-mono">{topThree[2].total_xp} XP</p>
                    </div>
                </div>
            )}
          </div>
        )}

        {/* LIST SECTION */}
        <div className="bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-white/5 text-xs uppercase text-gray-400">
                    <tr>
                        <th className="p-6">Rank</th>
                        <th className="p-6">User</th>
                        <th className="p-6 text-right">Problems Solved</th>
                        <th className="p-6 text-right">Total XP</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {rest.map((u, i) => (
                        <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                            <td className="p-6">
                                <RankBadge rank={i + 4} />
                            </td>
                            <td className="p-6 flex items-center gap-4">
                                <img 
                                    src={u.profile_picture_url ? `${API_BASE}${u.profile_picture_url}` : "/default-pfp.png"} 
                                    className="w-10 h-10 rounded-full object-cover border border-white/10 group-hover:border-blue-500 transition-colors"
                                />
                                <div>
                                    <p className="font-bold text-white group-hover:text-blue-400 transition-colors">{u.fname} {u.lname}</p>
                                    <p className="text-xs text-gray-500">Level {Math.floor(u.total_xp / 1000)}</p>
                                </div>
                            </td>
                            <td className="p-6 text-right font-mono text-gray-400">
                                {u.problems_solved}
                            </td>
                            <td className="p-6 text-right">
                                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                    {u.total_xp}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {users.length === 0 && !loading && (
                <div className="p-12 text-center text-gray-500">No data found for this period.</div>
            )}
        </div>

      </div>
    </div>
  );
}
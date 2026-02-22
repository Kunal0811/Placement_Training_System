import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../api";
import { FiAward, FiZap, FiStar, FiTrendingUp } from "react-icons/fi";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("global");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        // Hit appropriate endpoints based on tab
        const endpoint = category === "global" 
            ? `${API_BASE}/api/leaderboard` 
            : `${API_BASE}/api/leaderboard/filter?category=${category}`;
            
        const res = await axios.get(endpoint);
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [category]);

  const topThree = users.slice(0, 3);
  const restUsers = users.slice(3);

  // Helper to render the Podium for Top 3
  const renderPodiumCard = (user, pos) => {
    if (!user) return null;
    
    const isGold = pos === 1;
    const isSilver = pos === 2;
    const isBronze = pos === 3;

    const colors = isGold 
        ? "from-yellow-400 to-yellow-600 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.4)]" 
        : isSilver 
        ? "from-gray-300 to-gray-500 border-gray-300 shadow-[0_0_20px_rgba(209,213,219,0.3)]"
        : "from-amber-600 to-amber-800 border-amber-600 shadow-[0_0_20px_rgba(217,119,6,0.3)]";

    const height = isGold ? "h-64 scale-110 z-20" : "h-56 z-10 mt-8";

    // ✅ SAFE FALLBACKS (Prevents the crash!)
    const displayName = user.name || user.fname || "Student";
    const initial = displayName[0] ? displayName[0].toUpperCase() : "U";
    const displayXP = user.xp !== undefined ? user.xp : (user.score || 0);
    const displayLevel = user.level || 1;

    return (
        <div className={`relative flex flex-col items-center justify-end w-1/3 ${height} transition-transform`}>
            {isGold && <div className="absolute -top-10 text-4xl animate-bounce">👑</div>}
            
            <div className={`w-20 h-20 mb-4 rounded-full border-4 flex items-center justify-center text-2xl font-bold bg-black object-cover overflow-hidden ${isGold ? 'border-yellow-400' : isSilver ? 'border-gray-300' : 'border-amber-600'}`}>
                {user.profile_picture_url ? (
                    <img src={`${API_BASE}${user.profile_picture_url}`} alt="PFP" className="w-full h-full object-cover"/>
                ) : (
                    initial
                )}
            </div>
            
            <div className={`w-full flex-1 rounded-t-3xl border-t-4 border-l border-r flex flex-col items-center pt-4 bg-gradient-to-b ${colors} opacity-90 backdrop-blur-xl`}>
                <h3 className="font-bold text-white text-lg truncate w-full text-center px-2">{displayName}</h3>
                <div className="flex items-center gap-1 text-black font-black mt-1">
                    <FiStar /> {displayXP} XP
                </div>
                <div className="mt-2 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    Level {displayLevel}
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-game-bg text-white p-6 pb-20">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4 tracking-tight drop-shadow-lg">
            Hall of Fame
          </h1>
          <p className="text-gray-400 text-lg">Earn XP. Level Up. Claim your rank.</p>
        </div>

        {/* Categories / Tabs */}
        <div className="flex justify-center gap-2 mb-16 overflow-x-auto">
            {['global', 'aptitude', 'technical', 'coding', 'interview'].map(cat => (
                <button 
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-6 py-3 rounded-2xl uppercase font-bold text-xs tracking-widest transition-all ${
                        category === cat ? 'bg-neon-blue text-black shadow-[0_0_15px_rgba(45,212,191,0.5)] scale-105' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>

        {loading ? (
            <div className="flex justify-center items-center h-64"><div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
            <>
                {/* 🏆 Top 3 Podium */}
                {topThree.length > 0 && (
                    <div className="flex justify-center items-end max-w-3xl mx-auto mb-16 px-4 mt-12">
                        {renderPodiumCard(topThree[1], 2)} {/* Silver */}
                        {renderPodiumCard(topThree[0], 1)} {/* Gold */}
                        {renderPodiumCard(topThree[2], 3)} {/* Bronze */}
                    </div>
                )}

                {/* 📋 Rank 4 and below Table */}
                <div className="glass-panel rounded-3xl overflow-hidden bg-black/40 border border-white/10">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest border-b border-white/10">
                            <tr>
                                <th className="p-6">Rank</th>
                                <th className="p-6">Candidate</th>
                                <th className="p-6 hidden md:table-cell">Progression</th>
                                <th className="p-6 hidden lg:table-cell">Badges</th>
                                <th className="p-6 text-right">Total XP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {restUsers.map((u, index) => {
                                // ✅ SAFE FALLBACKS
                                const displayName = u.name || u.fname || "Student";
                                const initial = displayName[0] ? displayName[0].toUpperCase() : "U";
                                const displayXP = u.xp !== undefined ? u.xp : (u.score || 0);
                                const displayLevel = u.level || 1;
                                const streak = u.streak || 0;
                                const badges = u.badges || ["🌱 Rising Star"];
                                
                                const next_level_xp = u.next_level_xp || 100;
                                const progress = Math.min((displayXP / next_level_xp) * 100, 100);
                                
                                const rank = u.rank || (index + 4);
                                
                                return (
                                <tr key={u.id || index} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-6 font-black text-xl text-gray-500">#{rank}</td>
                                    
                                    <td className="p-6 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center font-bold text-lg overflow-hidden border border-white/10">
                                            {u.profile_picture_url ? <img src={`${API_BASE}${u.profile_picture_url}`} className="w-full h-full object-cover"/> : initial}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-lg">{displayName}</p>
                                            <p className="text-xs text-neon-orange font-mono flex items-center gap-1">
                                                <FiZap /> {streak} Day Streak
                                            </p>
                                        </div>
                                    </td>

                                    <td className="p-6 hidden md:table-cell w-1/4">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="font-bold text-neon-blue">Level {displayLevel}</span>
                                            <span className="text-gray-500">{displayXP} / {next_level_xp}</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-cyan-400 to-neon-blue transition-all" style={{ width: `${progress}%` }}></div>
                                        </div>
                                    </td>

                                    <td className="p-6 hidden lg:table-cell">
                                        <div className="flex gap-2">
                                            {badges.slice(0, 2).map((badge, i) => (
                                                <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-gray-300 whitespace-nowrap">
                                                    {badge}
                                                </span>
                                            ))}
                                        </div>
                                    </td>

                                    <td className="p-6 text-right font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                                        {displayXP}
                                    </td>
                                </tr>
                            )})}
                            
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-gray-500 font-mono">No data available yet. Start practicing!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </>
        )}
      </div>
    </div>
  );
}
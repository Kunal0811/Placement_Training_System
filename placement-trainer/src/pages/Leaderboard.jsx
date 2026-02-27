// placement-trainer/src/pages/Leaderboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../api";
import { useAuth } from "../context/AuthContext";
import { FiClock, FiChevronUp, FiChevronDown, FiShield } from "react-icons/fi";

// Simulate Duolingo Leagues based on User Level
const LEAGUES = [
  { name: "Bronze League", color: "text-amber-700", bg: "bg-amber-700/20", border: "border-amber-700/50", icon: "🥉" },
  { name: "Silver League", color: "text-gray-300", bg: "bg-gray-300/20", border: "border-gray-300/50", icon: "🥈" },
  { name: "Gold League", color: "text-yellow-400", bg: "bg-yellow-400/20", border: "border-yellow-400/50", icon: "🥇" },
  { name: "Sapphire League", color: "text-blue-400", bg: "bg-blue-400/20", border: "border-blue-400/50", icon: "💎" },
  { name: "Diamond League", color: "text-cyan-300", bg: "bg-cyan-300/20", border: "border-cyan-300/50", icon: "💠" },
];

export default function Leaderboard() {
  const { user, stats } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("global");
  
  // Countdown Timer Logic (Simulating weekly reset on Sunday midnight)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextSunday = new Date();
      nextSunday.setDate(now.getDate() + (7 - now.getDay()));
      nextSunday.setHours(23, 59, 59, 999);
      
      const diff = nextSunday - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      setTimeLeft({ days, hours });
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000 * 60 * 60); // update every hour
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
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

  // Determine user's simulated league based on their global level
  const userLevel = stats?.level || 1;
  const currentLeague = LEAGUES[Math.min(userLevel - 1, 4)];

  return (
    <div className="min-h-screen bg-game-bg text-white p-4 md:p-8 pb-32">
      <div className="max-w-3xl mx-auto">
        
        {/* --- DUOLINGO LEAGUE HEADER --- */}
        <div className="glass-panel rounded-3xl p-8 flex flex-col items-center justify-center text-center mb-10 border border-white/5 relative overflow-hidden bg-black/40">
            {/* Background Glow */}
            <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full opacity-20 blur-[100px] ${currentLeague.bg}`}></div>
            
            <div className="text-8xl mb-4 relative z-10 animate-float drop-shadow-2xl">
                {currentLeague.icon}
            </div>
            
            <h1 className={`text-4xl font-black font-display tracking-tight relative z-10 ${currentLeague.color} drop-shadow-lg`}>
                {currentLeague.name}
            </h1>
            
            <div className="flex flex-col items-center mt-6 relative z-10">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Weekly Reset In</p>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2 rounded-xl text-lg font-mono text-neon-blue font-bold shadow-inner">
                    <FiClock /> {timeLeft.days}d {timeLeft.hours}h
                </div>
            </div>
        </div>

        {/* --- CATEGORY PILLS --- */}
        <div className="flex overflow-x-auto gap-3 mb-8 pb-2 custom-scrollbar justify-start md:justify-center">
            {['global', 'aptitude', 'technical', 'coding', 'interview'].map(cat => (
                <button 
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`whitespace-nowrap px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                        category === cat 
                        ? 'bg-neon-blue text-black border-b-4 border-teal-600 hover:-translate-y-1 active:border-b-0 active:translate-y-1' 
                        : 'bg-white/5 text-gray-400 border-b-4 border-transparent hover:bg-white/10'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>

        {/* --- LEADERBOARD LIST --- */}
        {loading ? (
            <div className="flex justify-center items-center h-48"><div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
            <div className="space-y-1">
                {users.map((u, index) => {
                    const isPromotionZone = index < 5;
                    const isDemotionZone = index >= users.length - 5 && users.length > 10;
                    const isCurrentUser = user?.id === u.id;

                    // Fallbacks for data format
                    const displayName = u.name || u.fname || "Student";
                    const initial = displayName[0] ? displayName[0].toUpperCase() : "U";
                    const displayXP = u.xp !== undefined ? u.xp : (u.score || 0);
                    const rank = u.rank || (index + 1);

                    // Rank Color Logic
                    let rankStyle = "text-gray-500 font-bold";
                    if (rank === 1) rankStyle = "text-yellow-400 font-black text-xl drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]";
                    if (rank === 2) rankStyle = "text-gray-300 font-black text-xl";
                    if (rank === 3) rankStyle = "text-amber-600 font-black text-xl";

                    return (
                        <React.Fragment key={u.id || index}>
                            
                            {/* PROMOTION ZONE DIVIDER */}
                            {index === 5 && (
                                <div className="flex items-center gap-4 py-4 animate-fade-in">
                                    <hr className="flex-1 border-green-500/30" />
                                    <span className="flex items-center gap-2 text-green-500 font-black uppercase text-xs tracking-widest bg-green-500/10 px-4 py-1 rounded-full border border-green-500/20">
                                        <FiChevronUp size={16}/> Promotion Zone
                                    </span>
                                    <hr className="flex-1 border-green-500/30" />
                                </div>
                            )}

                            {/* DEMOTION ZONE DIVIDER */}
                            {index === users.length - 5 && users.length > 10 && (
                                <div className="flex items-center gap-4 py-4 mt-4 animate-fade-in">
                                    <hr className="flex-1 border-red-500/30" />
                                    <span className="flex items-center gap-2 text-red-500 font-black uppercase text-xs tracking-widest bg-red-500/10 px-4 py-1 rounded-full border border-red-500/20">
                                        <FiChevronDown size={16}/> Demotion Zone
                                    </span>
                                    <hr className="flex-1 border-red-500/30" />
                                </div>
                            )}

                            {/* USER ROW */}
                            <div 
                                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                                    isCurrentUser 
                                        ? 'bg-neon-blue/10 border-2 border-neon-blue/50 shadow-[0_0_20px_rgba(45,212,191,0.1)] scale-[1.02] z-10 relative' 
                                        : 'bg-white/5 border border-transparent hover:bg-white/10'
                                }`}
                            >
                                {/* Rank */}
                                <div className={`w-8 text-center ${rankStyle}`}>
                                    {rank}
                                </div>

                                {/* Avatar */}
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg overflow-hidden border-2 ${
                                    isPromotionZone ? 'border-green-500' : isDemotionZone ? 'border-red-500' : 'border-gray-600'
                                }`}>
                                    {u.profile_picture_url ? (
                                        <img src={`${API_BASE}${u.profile_picture_url}`} className="w-full h-full object-cover"/>
                                    ) : (
                                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">{initial}</div>
                                    )}
                                </div>

                                {/* Name & Badges */}
                                <div className="flex-1 min-w-0">
                                    <p className={`font-bold text-lg truncate ${isCurrentUser ? 'text-neon-blue' : 'text-white'}`}>
                                        {displayName} {isCurrentUser && "(You)"}
                                    </p>
                                    <div className="flex gap-2 mt-1">
                                        {u.badges?.slice(0, 1).map((badge, i) => (
                                            <span key={i} className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-400 font-bold uppercase tracking-wider truncate">
                                                {badge}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* XP Score */}
                                <div className="text-right">
                                    <p className={`font-black text-xl ${isCurrentUser ? 'text-white' : 'text-gray-300'}`}>
                                        {displayXP} <span className="text-xs text-gray-500 font-bold">XP</span>
                                    </p>
                                    {isPromotionZone && <p className="text-xs text-green-500 font-bold flex items-center justify-end gap-1"><FiChevronUp/> Advancing</p>}
                                    {isDemotionZone && <p className="text-xs text-red-500 font-bold flex items-center justify-end gap-1"><FiChevronDown/> Falling</p>}
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })}

                {users.length === 0 && (
                    <div className="text-center p-12 bg-white/5 rounded-3xl border border-white/10">
                        <FiShield className="text-6xl text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No data yet</h3>
                        <p className="text-gray-400">Complete a lesson to join the league!</p>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
}
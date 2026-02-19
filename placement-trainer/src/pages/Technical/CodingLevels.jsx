import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API_BASE from '../../api';

// ✅ FIXED: Defined full Tailwind class strings so the compiler detects them.
// Changed 'Hard' to use 'neon-red' since 'neon-pink' does not exist in your config.
const LEVELS = [
  { 
    id: 'easy', 
    title: 'Easy', 
    problems: 5, 
    icon: '🌱', 
    borderClass: "border-neon-green/50 group-hover:border-neon-green",
    // Button: Solid neon background, black text for contrast, glow effect
    buttonClass: "bg-neon-green text-black hover:bg-[#bef264] shadow-[0_0_15px_rgba(34,197,94,0.4)]", 
    gradientClass: "from-neon-green/70 to-neon-green",
    shadowClass: "group-hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]"
  },
  { 
    id: 'medium', 
    title: 'Medium', 
    problems: 5, 
    icon: '🔥', 
    borderClass: "border-neon-blue/50 group-hover:border-neon-blue",
    buttonClass: "bg-neon-blue text-black hover:bg-cyan-300 shadow-[0_0_15px_rgba(45,212,191,0.4)]",
    gradientClass: "from-neon-blue/70 to-neon-blue",
    shadowClass: "group-hover:shadow-[0_0_30px_rgba(45,212,191,0.2)]"
  },
  { 
    id: 'hard', 
    title: 'Hard', 
    problems: 5, 
    icon: '💎', 
    // Switched to neon-red (or you can use hot-pink if you prefer)
    borderClass: "border-neon-red/50 group-hover:border-neon-red",
    buttonClass: "bg-neon-red text-white hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]",
    gradientClass: "from-neon-red/70 to-neon-red",
    shadowClass: "group-hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]"
  }
];

export default function CodingLevels() {
    const { user } = useAuth();
    const [solvedCounts, setSolvedCounts] = useState({ easy: 0, medium: 0, hard: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchAllLevelStatus = async () => {
            try {
                const difficulties = ['easy', 'medium', 'hard'];
                const promises = difficulties.map(difficulty =>
                    fetch(`${API_BASE}/api/coding/level-status`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user_id: user.id, difficulty }),
                    }).then(res => res.json())
                );

                const results = await Promise.all(promises);
                
                setSolvedCounts({
                    easy: results[0]?.solved_count || 0,
                    medium: results[1]?.solved_count || 0,
                    hard: results[2]?.solved_count || 0,
                });
            } catch (error) {
                console.error("Failed to fetch level status:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllLevelStatus();
    }, [user]);
    
    const isLevelUnlocked = (levelId) => {
        if (levelId === 'easy') return true;
        if (levelId === 'medium') return solvedCounts.easy >= LEVELS[0].problems;
        if (levelId === 'hard') return solvedCounts.medium >= LEVELS[1].problems;
        return false;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-game-bg">
                <div className="text-center flex flex-col items-center gap-6">
                    <div className="relative w-24 h-24">
                        <div className="absolute inset-0 border-t-4 border-neon-blue rounded-full animate-spin"></div>
                        <div className="absolute inset-2 border-r-4 border-neon-purple rounded-full animate-spin-reverse"></div>
                        <div className="absolute inset-4 border-b-4 border-hot-pink rounded-full animate-spin"></div>
                    </div>
                    <p className="text-2xl text-gray-400 font-display">Loading Levels...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6 md:p-12">
            <div className="text-center mb-16 animate-fade-in">
                <h1 className="text-5xl md:text-6xl font-bold font-display text-white mb-4 text-glow bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-hot-pink">
                    Coding Arena
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    Master Data Structures & Algorithms. Solve <span className="text-white font-bold">{LEVELS[0].problems}</span> problems to unlock the next tier.
                </p>
            </div>

            <div className="space-y-8">
                {LEVELS.map((level, index) => {
                    const unlocked = isLevelUnlocked(level.id);
                    const solved = solvedCounts[level.id];
                    const progress = Math.min((solved / level.problems) * 100, 100);

                    return (
                        <Link 
                            key={level.id}
                            to={unlocked ? `/technical/coding-test/${level.id}` : '#'} // Ensure this route exists in App.jsx
                            className={`group relative block bg-game-card rounded-3xl p-8 border-2 transition-all duration-500 transform ${
                                unlocked 
                                ? `${level.borderClass} hover:-translate-y-2 ${level.shadowClass}` 
                                : 'border-white/5 opacity-70 grayscale'
                            }`}
                        >
                            {/* Lock Overlay */}
                            {!unlocked && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-3xl z-10 flex items-center justify-center">
                                    <div className="bg-black/80 px-6 py-3 rounded-xl border border-white/10 flex items-center gap-3">
                                        <span className="text-2xl">🔒</span>
                                        <span className="text-gray-400 font-mono text-sm">
                                            Complete <strong>{LEVELS[index-1].title}</strong> first
                                        </span>
                                    </div>
                                </div>
                            )}
                            
                            <div className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex items-center space-x-8 text-center md:text-left w-full md:w-auto">
                                    <div className={`text-7xl transition-transform duration-500 filter drop-shadow-lg ${unlocked ? 'group-hover:scale-110 group-hover:rotate-6' : ''}`}>
                                        {level.icon}
                                    </div>
                                    <div>
                                        <h2 className={`text-4xl font-bold font-display tracking-tight ${unlocked ? 'text-white' : 'text-gray-500'}`}>
                                            {level.title}
                                        </h2>
                                        <p className={`mt-2 font-mono text-sm ${unlocked ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {solved >= level.problems 
                                                ? <span className="text-neon-green">★ Level Completed</span> 
                                                : `${solved} / ${level.problems} Solved`
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="w-full md:w-auto">
                                    <button
                                        className={`w-full md:w-48 py-4 rounded-xl font-bold text-lg transition-all duration-300 tracking-wide ${
                                            unlocked 
                                            ? `${level.buttonClass} animate-glow-pulse hover:scale-105` 
                                            : 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed'
                                        }`}
                                    >
                                        {solved >= level.problems ? 'Practice' : 'Start'}
                                    </button>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="relative z-20 mt-8">
                                <div className="w-full bg-black/50 rounded-full h-3 overflow-hidden border border-white/5">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${
                                            unlocked ? level.gradientClass : 'from-gray-700 to-gray-600'
                                        }`} 
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
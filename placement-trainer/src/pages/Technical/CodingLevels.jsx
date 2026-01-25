import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API_BASE from '../../api';

const LEVELS = [
    { id: 'easy', title: 'Easy', problems: 5, icon: '🌱', color: 'neon-green' },
    { id: 'medium', title: 'Medium', problems: 5, icon: '🔥', color: 'neon-blue' },
    { id: 'hard', title: 'Hard', problems: 5, icon: '💎', color: 'neon-pink' }
];

// Tailwind CSS classes need to be complete strings to be detected.
const borderColors = {
  "neon-green": "border-neon-green/50 group-hover:border-neon-green",
  "neon-blue": "border-neon-blue/50 group-hover:border-neon-blue",
  "neon-pink": "border-neon-pink/50 group-hover:border-neon-pink",
};

const bgColors = {
  "neon-green": "bg-neon-green",
  "neon-blue": "bg-neon-blue",
  "neon-pink": "bg-neon-pink",
};

const shadowColors = {
    "neon-green": "group-hover:shadow-neon-green/20",
    "neon-blue": "group-hover:shadow-neon-blue/20",
    "neon-pink": "group-hover:shadow-neon-pink/20",
};

const gradientColors = {
    "neon-green": "from-neon-green/70 to-neon-green",
    "neon-blue": "from-neon-blue/70 to-neon-blue",
    "neon-pink": "from-neon-pink/70 to-neon-pink",
};


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
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center flex flex-col items-center gap-6">
                    <div className="relative w-24 h-24">
                        <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-2 border-r-4 border-purple-500 rounded-full animate-spin-reverse"></div>
                        <div className="absolute inset-4 border-b-4 border-pink-500 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-2xl text-gray-400">Loading Levels...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold text-white mb-3 text-glow bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-pink">
                    Coding Practice Levels
                </h1>
                <p className="text-lg text-gray-400">
                    Solve {LEVELS[0].problems} unique problems in each level to unlock the next.
                </p>
            </div>

            <div className="space-y-8">
                {LEVELS.map(level => {
                    const unlocked = isLevelUnlocked(level.id);
                    const solved = solvedCounts[level.id];
                    const progress = Math.min((solved / level.problems) * 100, 100);

                    return (
                        <Link 
                            key={level.id}
                            to={unlocked ? `/technical/coding-test/${level.id}` : '#'}
                            className={`group relative block bg-dark-card rounded-2xl p-6 border-2 transition-all duration-300 transform ${
                                unlocked 
                                ? `${borderColors[level.color]} hover:-translate-y-2 shadow-lg ${shadowColors[level.color]}` 
                                : 'border-gray-800'
                            }`}
                        >
                            {!unlocked && <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl z-10"></div>}
                            
                            <div className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center space-x-6 text-center md:text-left">
                                    <div className={`text-6xl transition-transform duration-300 ${unlocked ? 'group-hover:scale-110' : ''}`}>{unlocked ? level.icon : '🔒'}</div>
                                    <div>
                                        <h2 className={`text-3xl font-bold ${unlocked ? 'text-white' : 'text-gray-600'}`}>{level.title}</h2>
                                        <p className={`mt-1 ${unlocked ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {solved >= level.problems ? "Level Completed!" : `${solved} / ${level.problems} Problems Solved`}
                                        </p>
                                    </div>
                                </div>
                                <div className="w-full md:w-auto">
                                    <div
                                        className={`w-full text-center px-8 py-3 rounded-lg text-black font-bold text-lg transition-all transform group-hover:scale-105 ${
                                            unlocked 
                                            ? `${bgColors[level.color]} shadow-lg shadow-${level.color}/30` 
                                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        {solved >= level.problems ? 'Practice More' : 'Start'}
                                    </div>
                                </div>
                            </div>
                            <div className="relative z-20 mt-6">
                                <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
                                    <div 
                                        className={`h-4 rounded-full transition-all duration-500 bg-gradient-to-r ${
                                            unlocked
                                            ? (gradientColors[level.color] || 'from-gray-500 to-gray-400') 
                                            : 'from-gray-700 to-gray-600'
                                        }`} 
                                        style={{ width: `${progress}%` }}>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
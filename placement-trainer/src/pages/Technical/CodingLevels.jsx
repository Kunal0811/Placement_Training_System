import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API_BASE from '../../api';

const LEVELS = [
    { id: 'easy', title: 'Easy', problems: 5, icon: '🌱' },
    { id: 'medium', title: 'Medium', problems: 5, icon: '🔥' },
    { id: 'hard', title: 'Hard', problems: 5, icon: '💎' }
];

export default function CodingLevels() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [solvedCounts, setSolvedCounts] = useState({ easy: 0, medium: 0, hard: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

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
                    easy: results[0].solved_count || 0,
                    medium: results[1].solved_count || 0,
                    hard: results[2].solved_count || 0,
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
        return <div className="text-center mt-10">Loading Levels...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-4xl font-bold mb-6 text-center text-indigo-700">Coding Practice Levels</h1>
            <p className="mb-10 text-center text-lg text-gray-700">
                Solve 5 unique problems in each level to unlock the next.
            </p>

            <div className="space-y-6">
                {LEVELS.map(level => {
                    const unlocked = isLevelUnlocked(level.id);
                    const solved = solvedCounts[level.id];
                    const progress = Math.min((solved / level.problems) * 100, 100);

                    return (
                        <div key={level.id} className={`p-6 rounded-lg shadow-md border-l-4 ${unlocked ? 'border-indigo-500 bg-white' : 'border-gray-400 bg-gray-100'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="text-5xl mr-4">{unlocked ? level.icon : '🔒'}</span>
                                    <div>
                                        <h2 className={`text-2xl font-bold ${unlocked ? 'text-gray-800' : 'text-gray-500'}`}>{level.title}</h2>
                                        <p className="text-gray-600">
                                            {solved >= level.problems ? "Completed!" : `${solved} / ${level.problems} Problems Solved`}
                                        </p>
                                    </div>
                                </div>
                                <Link to={unlocked ? `/technical/coding-test/${level.id}` : '#'}
                                    className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${unlocked ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'}`}
                                >
                                    {solved >= level.problems ? 'Practice More' : 'Start'}
                                </Link>
                            </div>
                            <div className="mt-4">
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div className={`h-4 rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-indigo-500'}`} style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FiLock, FiAlertCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function ModuleLock({ children, reqLevel, feature, limitType }) {
    const { stats } = useAuth();
    const navigate = useNavigate();
    const level = stats?.level || 1;

    // RULE 1: STRICT LOCK IF LEVEL IS TOO LOW
    if (level < reqLevel) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 animate-fade-in">
                <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-gray-700 relative">
                    <FiLock className="text-4xl text-gray-400" />
                    <div className="absolute -bottom-2 -right-2 bg-neon-purple text-white text-xs font-black px-2 py-1 rounded-md">LVL {reqLevel}</div>
                </div>
                <h2 className="text-4xl font-display font-bold text-white mb-4">
                    {feature} <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">Locked</span>
                </h2>
                <p className="text-gray-400 max-w-md mb-8">
                    You need to reach <span className="text-neon-blue font-bold">Level {reqLevel}</span> to unlock this module. Go practice Aptitude and Coding to earn XP!
                </p>
                <button onClick={() => navigate('/aptitude')} className="px-8 py-3 bg-neon-blue text-black font-bold rounded-xl hover:scale-105 transition-transform">
                    Grind XP
                </button>
            </div>
        );
    }

    // RULE 2: LEVEL 4 LIMITED ATTEMPTS FOR GD/INTERVIEW
    if (level === 4 && limitType) {
        const attempts = limitType === 'interview' ? stats.interviews_taken : stats.gds_taken;
        
        if (attempts >= 5) {
            return (
                <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 animate-fade-in">
                    <div className="w-24 h-24 bg-orange-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(249,115,22,0.3)] border border-orange-500/50">
                        <FiAlertCircle className="text-4xl text-orange-500" />
                    </div>
                    <h2 className="text-4xl font-display font-bold text-white mb-4">Limit Reached</h2>
                    <p className="text-gray-400 max-w-md mb-8">
                        You have exhausted your <span className="text-orange-400 font-bold">5 Mock Attempts</span> for Level 4. Reach <span className="text-neon-purple font-bold">Level 5</span> to unlock UNLIMITED access!
                    </p>
                    <button onClick={() => navigate('/coding')} className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:scale-105 transition-transform">
                        Level Up to 5
                    </button>
                </div>
            );
        }

        // Feature is unlocked, but render a persistent warning banner at the top
        return (
            <div className="relative">
                <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 text-orange-200 p-3 text-center text-xs font-bold tracking-widest uppercase mb-6 rounded-xl animate-pulse-fast">
                    {feature}: {5 - attempts} Attempts Remaining. Reach Lvl 5 for Unlimited!
                </div>
                {children}
            </div>
        );
    }

    // RULE 3: FULL UNLIMITED ACCESS
    return children;
}
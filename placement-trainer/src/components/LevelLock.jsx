import React, { useEffect, useState } from 'react';
import { FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_BASE from '../api';

export default function LevelLock({ children, requiredLevel = 2, featureName = "This feature" }) {
  const { user } = useAuth();
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
        axios.get(`${API_BASE}/api/user/${user.id}/gamification`)
             .then(res => setLevel(res.data.level))
             .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <div className="opacity-50 pointer-events-none">{children}</div>;

  if (level >= requiredLevel) {
    return <>{children}</>;
  }

  // Locked State
  return (
    <div className="relative group rounded-xl overflow-hidden">
        <div className="opacity-30 blur-[2px] pointer-events-none select-none transition-all">
            {children}
        </div>
        
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl transition-all group-hover:bg-black/80">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-2 shadow-lg border border-gray-600">
                <FiLock className="text-gray-400 text-xl" />
            </div>
            <p className="font-bold text-white tracking-wide">{featureName} Locked</p>
            <p className="text-xs text-neon-blue font-bold mt-1 uppercase">Requires Level {requiredLevel}</p>
        </div>
    </div>
  );
}
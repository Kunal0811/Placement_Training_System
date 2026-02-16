// src/pages/Aptitude/ModeSelection.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// ✅ UPDATED: Explicit Tailwind classes to avoid dynamic string issues
const MODES = [
  {
    id: "easy",
    title: "Easy Level",
    description: "Perfect for beginners. Start your journey here!",
    icon: "🌱",
    previousMode: null,
    buttonClass: "bg-neon-green hover:bg-green-600 text-black",
    borderClass: "border-neon-green",
    progressClass: "from-neon-green/70 to-neon-green",
  },
  {
    id: "moderate",
    title: "Moderate Level",
    description: "Intermediate challenges. Test your knowledge!",
    icon: "🔥",
    previousMode: "Easy",
    buttonClass: "bg-neon-orange hover:bg-orange-600 text-black",
    borderClass: "border-neon-orange",
    progressClass: "from-neon-orange/70 to-neon-orange",
  },
  {
    id: "hard",
    title: "Hard Level",
    description: "Expert level. Prove your mastery!",
    icon: "💎",
    previousMode: "Moderate",
    buttonClass: "bg-neon-red hover:bg-red-600 text-white",
    borderClass: "border-neon-red",
    progressClass: "from-neon-red/70 to-neon-red",
  }
];

export default function ModeSelection() {
  const { topic } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [modeStatus, setModeStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [bestScores, setBestScores] = useState({});

  const userId = user?.id;
  const basePath = location.pathname.startsWith('/technical') ? 'technical' : 'aptitude';

  useEffect(() => {
    const checkAllModes = async () => {
      if (typeof userId !== 'number') {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const modePromises = MODES.map(mode => {
          const statusPromise = fetch(`${API_BASE}/api/test/mode-status`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, topic, mode: mode.id }),
          }).then(res => res.json());

          const scorePromise = fetch(`${API_BASE}/api/test/best-score`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, topic, mode: mode.id }),
          }).then(res => res.json());
          
          return Promise.all([statusPromise, scorePromise]).then(([statusData, scoreData]) => ({
              modeId: mode.id,
              unlocked: statusData.unlocked,
              best_score: scoreData.best_score
          }));
        });

        const results = await Promise.all(modePromises);
        
        const newStatus = {};
        const newScores = {};
        results.forEach(result => {
          newStatus[result.modeId] = result.unlocked;
          newScores[result.modeId] = result.best_score;
        });

        setModeStatus(newStatus);
        setBestScores(newScores);

      } catch (err) {
        console.error("Failed to check mode status:", err);
      } finally {
        setLoading(false);
      }
    };

    if(userId) checkAllModes();
  }, [userId, topic]);

  const handleModeClick = (modeId, isUnlocked) => {
    if (!isUnlocked) return;
    navigate(`/${basePath}/test/${encodeURIComponent(topic)}/${modeId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-game-bg">
        <div className="text-center flex flex-col items-center gap-6">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-r-4 border-purple-500 rounded-full animate-spin-reverse"></div>
            <div className="absolute inset-4 border-b-4 border-pink-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-2xl text-gray-400 font-display">Loading Levels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 bg-game-bg">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold font-display text-white mb-3 text-glow bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-pink">
            🎯 {decodeURIComponent(topic)}
          </h1>
          <p className="text-lg text-gray-400">
            Select your difficulty level and start testing!
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-neon-blue hover:text-white transition-colors hover:underline"
          >
            ← Back to Notes
          </button>
        </div>

        <div className="space-y-8">
          {MODES.map((mode) => {
            const isUnlocked = mode.id === 'easy' || (modeStatus[mode.id] || false);
            const bestScore = bestScores[mode.id];
            const isPassed = bestScore >= 15;
            const progress = bestScore ? (bestScore / 20) * 100 : 0;

            return (
              <div
                key={mode.id}
                className={`relative bg-dark-card rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-2xl hover:shadow-neon-blue/20 ${
                  isUnlocked ? `${mode.borderClass} hover:opacity-100` : 'border-gray-700 opacity-70'
                }`}
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center space-x-6 text-center md:text-left">
                    <div className="text-6xl filter drop-shadow-md">{isUnlocked ? mode.icon : "🔒"}</div>
                    <div>
                      <h2 className={`text-3xl font-bold font-display ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                        {mode.title}
                      </h2>
                      <p className="text-gray-400 mt-1 text-sm md:text-base">{mode.description}</p>
                      
                      {isUnlocked && bestScore !== null && bestScore !== undefined && (
                        <div className="mt-2">
                          <span className={`text-md font-semibold ${isPassed ? 'text-neon-green' : 'text-yellow-400'}`}>
                            Best Score: {bestScore}/20 {isPassed ? '✅' : ''}
                          </span>
                        </div>
                      )}

                      {!isUnlocked && mode.id !== 'easy' && (
                        <p className="text-sm text-red-400 mt-2 font-semibold">
                          🔒 Complete <strong>{mode.previousMode}</strong> level with 15/20 to unlock
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="w-full md:w-auto">
                    <button
                      onClick={() => handleModeClick(mode.id, isUnlocked)}
                      disabled={!isUnlocked}
                      className={`w-full px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                        isUnlocked 
                          ? `${mode.buttonClass} animate-glow-pulse` 
                          : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                      }`}
                    >
                      {isUnlocked ? (bestScore !== null && bestScore !== undefined ? "Retake Test" : "Start Test") : "Locked"}
                    </button>
                  </div>
                </div>

                {isUnlocked && bestScore !== null && bestScore !== undefined && (
                  <div className="mt-6">
                    <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden border border-white/5">
                      <div
                        className={`h-3 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${mode.progressClass}`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
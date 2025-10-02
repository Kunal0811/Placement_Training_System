// src/pages/Aptitude/ModeSelection.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const MODES = [
  {
    id: "easy",
    title: "Easy Level",
    description: "Perfect for beginners. Start your journey here!",
    icon: "🌱",
    color: "green",
    requiredScore: null,
    previousMode: null
  },
  {
    id: "moderate",
    title: "Moderate Level",
    description: "Intermediate challenges. Test your knowledge!",
    icon: "🔥",
    color: "orange",
    requiredScore: 15,
    previousMode: "easy"
  },
  {
    id: "hard",
    title: "Hard Level",
    description: "Expert level. Prove your mastery!",
    icon: "💎",
    color: "purple",
    requiredScore: 15,
    previousMode: "moderate"
  }
];

export default function ModeSelection() {
  const { topic } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [modeStatus, setModeStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [bestScores, setBestScores] = useState({});

  const userId = user?.id;

  useEffect(() => {
    const checkAllModes = async () => {
      if (!userId) return;

      setLoading(true);
      const status = {};
      const scores = {};

      try {
        // Check all modes
        for (const mode of MODES) {
          // Check unlock status
          const statusRes = await fetch(`${API_BASE}/api/test/mode-status`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, topic, mode: mode.id }),
          });
          const statusData = await statusRes.json();
          status[mode.id] = statusData.unlocked;

          // Get best score for this mode
          const scoreRes = await fetch(`${API_BASE}/api/test/best-score`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, topic, mode: mode.id }),
          });
          const scoreData = await scoreRes.json();
          scores[mode.id] = scoreData.best_score;
        }

        setModeStatus(status);
        setBestScores(scores);
      } catch (err) {
        console.error("Failed to check mode status:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAllModes();
  }, [userId, topic]);

  const handleModeClick = (modeId, isUnlocked) => {
    if (!isUnlocked) {
      alert("Complete the previous level first!");
      return;
    }
    navigate(`/aptitude/test/${encodeURIComponent(topic)}/${modeId}`);
  };

  const getColorClasses = (color, isUnlocked) => {
    if (!isUnlocked) {
      return "bg-gray-300 border-gray-400 cursor-not-allowed";
    }
    
    const colors = {
      green: "bg-green-100 border-green-500 hover:bg-green-200 hover:shadow-lg",
      orange: "bg-orange-100 border-orange-500 hover:bg-orange-200 hover:shadow-lg",
      purple: "bg-purple-100 border-purple-500 hover:bg-purple-200 hover:shadow-lg"
    };
    return colors[color] || colors.green;
  };

  const getButtonColorClasses = (color, isUnlocked) => {
    if (!isUnlocked) {
      return "bg-gray-400 cursor-not-allowed";
    }
    
    const colors = {
      green: "bg-green-600 hover:bg-green-700",
      orange: "bg-orange-600 hover:bg-orange-700",
      purple: "bg-purple-600 hover:bg-purple-700"
    };
    return colors[color] || colors.green;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">Loading Levels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            🎯 {decodeURIComponent(topic)}
          </h1>
          <p className="text-lg text-gray-600">
            Select your difficulty level and start testing!
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-blue-600 hover:underline"
          >
            ← Back to Notes
          </button>
        </div>

        {/* Mode Cards */}
        <div className="space-y-6">
          {MODES.map((mode) => {
            const isUnlocked = modeStatus[mode.id] || false;
            const bestScore = bestScores[mode.id];
            const isPassed = bestScore >= 15;

            return (
              <div
                key={mode.id}
                className={`border-4 rounded-2xl p-6 transition-all duration-300 ${getColorClasses(
                  mode.color,
                  isUnlocked
                )}`}
              >
                <div className="flex items-center justify-between">
                  {/* Left side - Info */}
                  <div className="flex items-center space-x-4">
                    <div className="text-6xl">{isUnlocked ? mode.icon : "🔒"}</div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {mode.title}
                      </h2>
                      <p className="text-gray-600 mt-1">{mode.description}</p>
                      
                      {/* Score display */}
                      {isUnlocked && bestScore !== null && bestScore !== undefined && (
                        <div className="mt-2">
                          <span className={`text-sm font-semibold ${isPassed ? 'text-green-600' : 'text-orange-600'}`}>
                            Best Score: {bestScore}/20 {isPassed ? '✅' : ''}
                          </span>
                        </div>
                      )}

                      {/* Unlock requirement */}
                      {!isUnlocked && mode.previousMode && (
                        <p className="text-sm text-red-600 mt-2">
                          🔒 Complete <strong>{mode.previousMode}</strong> level with 15/20 to unlock
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right side - Button */}
                  <div>
                    <button
                      onClick={() => handleModeClick(mode.id, isUnlocked)}
                      disabled={!isUnlocked}
                      className={`px-6 py-3 rounded-lg text-white font-semibold text-lg transition-all ${getButtonColorClasses(
                        mode.color,
                        isUnlocked
                      )}`}
                    >
                      {isUnlocked ? (
                        bestScore !== null && bestScore !== undefined ? (
                          "Retake Test"
                        ) : (
                          "Start Test"
                        )
                      ) : (
                        "Locked"
                      )}
                    </button>
                  </div>
                </div>

                {/* Progress bar (optional) */}
                {isUnlocked && bestScore !== null && bestScore !== undefined && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          isPassed ? 'bg-green-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${(bestScore / 20) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="mt-10 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-3">📋 How it works</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Complete <strong>Easy Level</strong> first to unlock Moderate</li>
            <li>• Score at least <strong>15/20 (75%)</strong> to pass each level</li>
            <li>• Complete <strong>Moderate Level</strong> to unlock Hard</li>
            <li>• You can retake any unlocked level to improve your score</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
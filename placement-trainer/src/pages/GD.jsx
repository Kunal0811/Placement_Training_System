import React, { useState } from "react";
import { FiMessageSquare, FiMic, FiUsers, FiCpu } from "react-icons/fi";

export default function GD() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const topics = [
    "AI replacing jobs: Threat or Opportunity?",
    "Cryptocurrency: Future of Finance?",
    "Social Media: Connecting or Isolating?",
    "Remote Work vs Office Work"
  ];

  return (
    <div className="min-h-screen bg-game-bg p-6 md:p-12 text-white">
      <div className="max-w-5xl mx-auto">
        
        <div className="text-center mb-12">
            <h1 className="text-5xl font-display font-bold mb-4">
                Group <span className="text-neon-orange">Discussion</span>
            </h1>
            <p className="text-gray-400">Practice your communication skills with our AI moderator.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            {/* Topic Selector */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <FiMessageSquare className="text-neon-blue"/> Select Topic
                </h3>
                <div className="space-y-3">
                    {topics.map((t, i) => (
                        <button 
                            key={i}
                            onClick={() => setTopic(t)}
                            className={`w-full text-left p-4 rounded-xl border transition-all ${
                                topic === t 
                                ? "bg-neon-blue/20 border-neon-blue text-white" 
                                : "bg-black/40 border-white/10 text-gray-400 hover:bg-white/5"
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* AI Simulator Preview */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center bg-black/40">
                <div className="w-24 h-24 rounded-full bg-neon-orange/10 flex items-center justify-center mb-6 animate-pulse-fast">
                    <FiMic size={40} className="text-neon-orange"/>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">AI Moderator Ready</h3>
                <p className="text-gray-400 text-sm mb-6 max-w-xs">
                    The AI will analyze your speech clarity, confidence, and relevance to the topic.
                </p>
                <button 
                    disabled={!topic}
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-bold text-white shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {topic ? "Start Discussion" : "Select a Topic First"}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
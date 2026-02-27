// src/pages/Aptitude/Quant/NumberSystemNotes.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import MarkdownViewer from "../../../components/MarkdownViewer";

// IMPORTANT: Import the markdown file as a raw URL path
import NumberSystemMD from "../../../content/NumberSystem.md?url"; 

export default function NumberSystemNotes() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-game-bg text-gray-300 pb-24">
      
      {/* Sticky Header with Call to Action */}
      <div className="bg-black/60 border-b border-white/10 pt-10 pb-6 px-6 sticky top-0 z-30 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <span className="text-neon-pink font-bold tracking-widest uppercase text-xs mb-1 block">Quantitative Aptitude</span>
            <h1 className="text-2xl font-bold text-white">Number System Deep Dive</h1>
          </div>
          <button 
            onClick={() => navigate('/aptitude/modes/Number System')}
            className="px-6 py-2 bg-neon-pink text-white font-black rounded-xl hover:scale-105 transition-transform uppercase tracking-widest shadow-[0_0_20px_rgba(244,114,182,0.4)]"
          >
            Take Test
          </button>
        </div>
      </div>

      {/* Deep Markdown Content Rendered Here */}
      <div className="max-w-5xl mx-auto px-6 mt-12">
        <div className="glass-panel p-8 md:p-12 rounded-3xl bg-black/40 border border-white/10">
            <MarkdownViewer filePath={NumberSystemMD} />
        </div>
      </div>
    </div>
  );
}
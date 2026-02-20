import React from "react";
import { Link } from "react-router-dom";
import { FiPercent, FiCpu, FiBookOpen, FiArrowRight } from "react-icons/fi";

const sections = [
  {
    title: "Quantitative",
    subtitle: "Aptitude",
    desc: "Master numbers, algebra, and geometry concepts.",
    path: "quantitative", 
    icon: <FiPercent size={32} />,
    color: "from-blue-600 to-cyan-500",
    textGlow: "text-cyan-400",
    // Abstract geometric shapes / math
    bgImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop" 
  },
  {
    title: "Logical",
    subtitle: "Reasoning",
    desc: "Enhance your critical thinking and problem-solving.",
    path: "logical",
    icon: <FiCpu size={32} />,
    color: "from-purple-600 to-pink-500",
    textGlow: "text-pink-400",
    // Chessboard representing strategy and logic
    bgImage: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=800&auto=format&fit=crop" 
  },
  {
    title: "Verbal",
    subtitle: "Ability",
    desc: "Improve your vocabulary, grammar, and comprehension.",
    path: "verbal",
    icon: <FiBookOpen size={32} />,
    color: "from-yellow-500 to-orange-500",
    textGlow: "text-yellow-400",
    // Vintage typewriter / literature
    bgImage: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=800&auto=format&fit=crop" 
  },
];

export default function Aptitude() {
  return (
    // We removed bg-game-bg here to let the global body bg-exam-bg show through
    <div className="min-h-screen p-6 md:p-12 overflow-visible">
      <div className="max-w-7xl mx-auto space-y-20 pb-20">
        
        {/* HEADER SECTION */}
        <div className="relative text-center pt-10" style={{ perspective: '1000px' }}>
            {/* Glowing Orbs behind the title */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse-soft"></div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 drop-shadow-2xl">
                Aptitude <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-glow-primary">Arena</span>
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
                Sharpen your mind. Select a domain to begin your mental training and master the fundamentals of placement exams.
            </p>
        </div>

        {/* 3D ADVANCED GRID SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl mx-auto transition-all duration-500">
          {sections.map((section, index) => (
            <Link
              key={index}
              to={section.path}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#121215] transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] flex flex-col justify-between p-8 hover:border-white/30 min-h-[400px]"
            >
              {/* Outer glowing aura that appears only on hover */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${section.color} opacity-0 group-hover:opacity-20 blur-2xl transition-all duration-700 -z-10`}></div>
              
              {/* ADVANCED BACKGROUND IMAGE SYSTEM */}
              <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
                {/* Fetched Image (Scales slowly on hover) */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700 ease-out"
                  style={{ backgroundImage: `url(${section.bgImage})` }}
                ></div>
                
                {/* Dark Vignette Overlay (Ensures text stays highly readable) */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500"></div>

                {/* Colored Hue Overlay (Matches the card's theme color) */}
                <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-10 group-hover:opacity-30 mix-blend-color transition-opacity duration-500`}></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  {/* Icon Container */}
                  <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/20 shadow-lg group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500">
                    {section.icon}
                  </div>
                  {/* Arrow Container */}
                  <div className="p-3 rounded-full bg-white/5 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-500 -rotate-45 group-hover:rotate-0 group-hover:translate-x-1">
                    <FiArrowRight className="text-white opacity-50 group-hover:opacity-100 transition-opacity duration-300" size={24} />
                  </div>
                </div>

                <div className="mt-auto">
                  {/* Subtitle / Code-like text */}
                  <p className={`font-mono font-bold text-sm mb-2 tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r ${section.color}`}>
                     // {section.subtitle}
                  </p>
                  
                  {/* Title */}
                  <h3 className="font-bold text-white text-4xl mb-4 group-hover:text-5xl transition-all duration-500 drop-shadow-lg">
                    {section.title}
                  </h3>

                  {/* Description */}
                  <div className="transform transition-all duration-500 group-hover:-translate-y-1">
                     <p className="text-gray-300 text-base leading-relaxed group-hover:text-white transition-colors duration-300 drop-shadow-md">
                       {section.desc}
                     </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* FINAL GRAND MASTER TEST CTA */}
        <div className="mt-20 text-center relative z-10">
            <Link 
              to={`/aptitude/test/${encodeURIComponent("Final Aptitude Test")}/hard`} 
              className="group relative inline-flex items-center gap-3 px-8 py-5 bg-surface/40 backdrop-blur-md border border-danger/30 text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:shadow-[0_0_40px_rgba(239,68,68,0.6)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
                {/* Red hover background fill */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                
                <span className="text-xl">🔥</span>
                <span className="text-lg tracking-wide">Take the Grand Master Test</span>
                <FiArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={22} />
            </Link>
        </div>

      </div>
    </div>
  );
}
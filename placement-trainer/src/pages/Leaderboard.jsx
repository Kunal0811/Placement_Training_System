// src/pages/Aptitude.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FiPercent, FiCpu, FiBookOpen, FiArrowRight } from "react-icons/fi";

const sections = [
  {
    title: "Quantitative Aptitude",
    desc: "Master numbers, algebra, and geometry concepts.",
    path: "quantitative", 
    icon: <FiPercent size={32} />,
    color: "text-neon-blue",
    border: "group-hover:border-neon-blue",
    glow: "group-hover:shadow-[0_0_30px_rgba(45,212,191,0.3)]"
  },
  {
    title: "Logical Reasoning",
    desc: "Enhance your critical thinking and problem-solving.",
    path: "logical",
    icon: <FiCpu size={32} />,
    color: "text-neon-purple",
    border: "group-hover:border-neon-purple",
    glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
  },
  {
    title: "Verbal Ability",
    desc: "Improve your vocabulary, grammar, and comprehension.",
    path: "verbal",
    icon: <FiBookOpen size={32} />,
    color: "text-neon-yellow",
    border: "group-hover:border-neon-yellow",
    glow: "group-hover:shadow-[0_0_30px_rgba(250,204,21,0.3)]"
  },
];

export default function Aptitude() {
  return (
    <div className="min-h-screen bg-game-bg p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4">
                Aptitude <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Arena</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Sharpen your mind. Select a domain to begin your training.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sections.map((section, index) => (
            <Link
              key={index}
              to={section.path}
              className={`group relative overflow-hidden rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 p-8 transition-all duration-500 hover:-translate-y-2 ${section.border}`}
            >
              {/* Hover Glow */}
              <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 ${section.glow}`}></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className={`mb-6 p-4 rounded-2xl bg-white/5 w-fit ${section.color}`}>
                        {section.icon}
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">{section.title}</h2>
                    <p className="text-gray-400 leading-relaxed mb-8">{section.desc}</p>
                </div>
                
                <div className={`flex items-center gap-2 font-bold uppercase tracking-wider text-sm ${section.color}`}>
                    Start Practice <FiArrowRight className="group-hover:translate-x-1 transition-transform"/>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Final Test CTA */}
        <div className="mt-16 text-center">
            <Link to="/test/Final Aptitude Test/hard" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-red-500/40 hover:scale-105 transition-all">
                <span>🔥 Take the Grand Master Test</span>
                <FiArrowRight />
            </Link>
        </div>

      </div>
    </div>
  );
}
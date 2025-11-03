// src/pages/Aptitude.jsx
import React from "react";
import { Link } from "react-router-dom";

const sections = [
  {
    title: "Quantitative Aptitude",
    path: "/aptitude/quantitative", // <-- CHANGED
    desc: "Covers arithmetic, algebra, geometry, probability, and statistics.",
    details: ["25+ Topics", "1000+ Practice Questions", "Step-by-step Solutions"],
    icon: "🧮",
  },
  {
    title: "Logical Reasoning",
    path: "/aptitude/logical", // <-- CHANGED
    desc: "Practice puzzles, seating arrangements, blood relations, and coding-decoding.",
    details: ["20+ Types of Puzzles", "Timed Tests", "Explanations & Tricks"],
    icon: "🧠",
  },
  {
    title: "Verbal Ability",
    path: "/aptitude/verbal", // <-- CHANGED
    desc: "Enhance grammar, vocabulary, comprehension, and communication skills.",
    details: ["Grammar Rules", "Reading Comprehension", "Synonyms & Antonyms"],
    icon: "📖",
  },
];

export default function Aptitude() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 text-white text-glow bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-pink">
          Aptitude Module
        </h1>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto">
          Sharpen your problem-solving and analytical thinking with our structured aptitude modules. Each section is designed with topic-wise notes, practice questions, and real exam-style tests.
        </p>
      </div>

      <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {sections.map((sec) => (
          <li key={sec.title}>
            <Link
              to={sec.path} // <-- CHANGED
              className="group relative block h-full bg-dark-card rounded-2xl p-8 border border-neon-blue/20 hover:border-neon-blue transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="absolute top-0 left-0 w-full h-full rounded-2xl bg-gradient-to-r from-neon-blue to-neon-pink opacity-0 group-hover:opacity-10 transition duration-500 blur-md"></div>
              <div className="relative z-10 flex flex-col h-full text-center items-center">
                <div className="text-6xl mb-5 transition-transform duration-300 group-hover:scale-110">{sec.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {sec.title}
                </h3>
                <p className="text-gray-400 mb-6 flex-grow">{sec.desc}</p>
                <div className="text-sm text-neon-blue/80 space-y-1 mb-6">
                  {sec.details.map((d, i) => (
                    <div key={i}>• {d}</div>
                  ))}
                </div>
                <span className="mt-auto inline-block text-neon-blue font-bold group-hover:text-glow transition-all">
                  Explore →
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* --- Final Test Section (no change needed) --- */}
      <div className="mt-24 pt-12 border-t-2 border-dashed border-neon-pink/20">
        <h2 className="text-4xl font-bold text-center mb-4 text-neon-pink text-glow">
          Final Challenge 🏆
        </h2>
        <p className="text-center text-lg text-gray-400 mb-8 max-w-md mx-auto">
            A comprehensive test combining all aptitude topics to simulate a real exam.
        </p>
        <div className="max-w-md mx-auto">
          <Link
            to={`/aptitude/test/${encodeURIComponent("Final Aptitude Test")}/hard`}
            className="group block bg-dark-card rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:shadow-neon-pink/20 transition-all duration-300 transform hover:-translate-y-2 border-2 border-neon-pink/50 hover:border-neon-pink"
          >
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce">🚀</div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                Final Aptitude Test
              </h3>
              <p className="text-gray-400 mb-4">
                50 Questions | 60 Minutes | High Difficulty
              </p>
              <span className="mt-4 inline-block bg-neon-pink text-black font-bold py-3 px-8 rounded-lg group-hover:scale-105 transition-transform">
                Start Final Test →
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
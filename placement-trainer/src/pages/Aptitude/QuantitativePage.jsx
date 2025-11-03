// src/pages/Aptitude/QuantitativePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const topics = [
  { name: "Number System", path: "number-system", icon: "🔢" },
  { name: "Percentages", path: "percentages", icon: "📊" },
  { name: "Profit & Loss", path: "profit-loss", icon: "💰" },
  { name: "Simple & Compound Interest", path: "interest", icon: "📈" },
  { name: "Time, Speed & Distance", path: "time-speed-distance", icon: "🚗" },
  { name: "Ratio & Proportion", path: "ratio-proportion", icon: "⚖️" },
  { name: "Permutation & Combination", path: "permutation-combination", icon: "🔄" },
  { name: "Geometry & Mensuration", path: "geometry", icon: "📐" },
];

export default function QuantitativePage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 text-white text-glow bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-pink">
          Quantitative Aptitude
        </h1>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto">
          Select a topic to start learning. Each section includes detailed notes, solved examples, and a practice test.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {topics.map((topic) => (
          <Link
            key={topic.name}
            to={`/aptitude/quantitative/${topic.path}`}
            className="group relative bg-dark-card rounded-2xl p-6 border border-neon-blue/20 hover:border-neon-blue transition-all duration-300 transform hover:-translate-y-2 h-48 flex flex-col justify-between"
          >
            <div className="absolute top-0 left-0 w-full h-full rounded-2xl bg-gradient-to-r from-neon-blue to-neon-pink opacity-0 group-hover:opacity-10 transition duration-500 blur-md"></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="text-4xl font-bold text-neon-blue text-glow mb-4">{topic.icon}</div>
              <h2 className="text-xl font-semibold text-white flex-grow">{topic.name}</h2>
              <span className="mt-auto inline-block text-neon-blue font-bold group-hover:text-glow transition-all">
                Learn →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
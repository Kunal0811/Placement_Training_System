// src/pages/Technical.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FiCode, FiDatabase, FiServer, FiCpu, FiTerminal } from "react-icons/fi";

const technicalModules = [
  { name: "C Programming", path: "cnotes", icon: "C", color: "text-blue-400", border: "hover:border-blue-500" },
  { name: "C++ Programming", path: "cpp", icon: "C++", color: "text-blue-500", border: "hover:border-blue-600" },
  { name: "Java Programming", path: "java", icon: "☕", color: "text-orange-500", border: "hover:border-orange-500" },
  { name: "Python Programming", path: "python", icon: "🐍", color: "text-yellow-400", border: "hover:border-yellow-400" },
  { name: "DSA", path: "dsa", icon: "📈", color: "text-green-400", border: "hover:border-green-500" },
  { name: "DBMS", path: "dbms", icon: "🗃️", color: "text-purple-400", border: "hover:border-purple-500" },
  { name: "Operating Systems", path: "os", icon: "🖥️", color: "text-red-400", border: "hover:border-red-500" },
  { name: "Computer Networks", path: "cn", icon: "🌐", color: "text-cyan-400", border: "hover:border-cyan-500" },
];

export default function Technical() {
  return (
    <div className="min-h-screen bg-game-bg p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
            <h1 className="text-5xl font-display font-bold text-white mb-2">Technical <span className="text-neon-blue">Hub</span></h1>
            <p className="text-gray-400">Deep dive into core engineering concepts.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {technicalModules.map((module, index) => (
            <Link
              key={index}
              to={module.path}
              className={`group bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-2xl ${module.border}`}
            >
              <div className={`mb-4 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${module.color}`}>
                {module.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{module.name}</h3>
              <p className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">View Notes & Practice &rarr;</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
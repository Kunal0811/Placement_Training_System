import React from "react";
import { Link } from "react-router-dom";
import { FiPercent, FiCpu, FiBookOpen, FiActivity, FiAward } from "react-icons/fi";

const sections = [
  {
    title: "Quantitative Aptitude",
    desc: "Master numbers, algebra, and geometry concepts.",
    path: "quantitative", // <--- FIXED: Matches App.jsx route
    icon: <FiPercent />,
    color: "text-green-400",
    border: "group-hover:border-green-500",
    bg: "from-green-500/10 to-transparent",
    glow: "group-hover:shadow-[0_0_30px_rgba(74,222,128,0.3)]"
  },
  {
    title: "Logical Reasoning",
    desc: "Enhance your critical thinking and problem-solving.",
    path: "logical", // Matches /aptitude/logical
    icon: <FiCpu />,
    color: "text-purple-400",
    border: "group-hover:border-purple-500",
    bg: "from-purple-500/10 to-transparent",
    glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
  },
  {
    title: "Verbal Ability",
    desc: "Improve grammar, vocabulary, and comprehension.",
    path: "verbal", // Matches /aptitude/verbal
    icon: <FiBookOpen />,
    color: "text-pink-400",
    border: "group-hover:border-pink-500",
    bg: "from-pink-500/10 to-transparent",
    glow: "group-hover:shadow-[0_0_30px_rgba(244,114,182,0.3)]"
  },
];

export default function Aptitude() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center space-y-4 animate-fade-in-up">
        <div className="inline-block p-3 rounded-full bg-white/5 border border-white/10 mb-4 animate-bounce-slow">
            <span className="text-3xl">🧠</span>
        </div>
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-500 to-purple-600">
          APTITUDE MASTERY
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
          Level up your problem-solving skills with our AI-curated practice modules. 
          Crack the logic, ace the numbers.
        </p>
      </div>

      {/* Quick Stats Section */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 flex flex-col md:flex-row justify-around items-center gap-8 shadow-2xl">
        <div className="text-center group">
            <h3 className="text-5xl font-black text-white mb-2 group-hover:text-shadow-glow transition-all">25+</h3>
            <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Topics Covered</p>
        </div>
        <div className="h-16 w-px bg-white/10 hidden md:block"></div>
        <div className="text-center group">
            <h3 className="text-5xl font-black text-white mb-2 group-hover:text-shadow-glow transition-all">1000+</h3>
            <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Question Bank</p>
        </div>
        <div className="h-16 w-px bg-white/10 hidden md:block"></div>
        <div className="text-center group">
            <h3 className="text-5xl font-black text-white mb-2 group-hover:text-shadow-glow transition-all">AI</h3>
            <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Adaptive Difficulty</p>
        </div>
      </div>

      {/* Main Modules Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {sections.map((section, idx) => (
          <Link 
            to={section.path} 
            key={idx}
            className={`group relative h-80 rounded-[2rem] bg-dark-card border border-white/5 p-8 flex flex-col justify-between overflow-hidden transition-all duration-500 hover:-translate-y-3 ${section.border} ${section.glow}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${section.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative z-10">
                <div className={`text-5xl mb-6 ${section.color} p-4 bg-white/5 rounded-2xl w-fit backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform duration-500`}>
                    {section.icon}
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">{section.title}</h2>
                <p className="text-gray-400 leading-relaxed">{section.desc}</p>
            </div>

            <div className="relative z-10 flex items-center gap-2 text-sm font-bold tracking-widest uppercase opacity-60 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                <span className={section.color}>Start Practice</span>
                <span>→</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Boss Level: Final Aptitude Test */}
      <div className="relative group mt-12">
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-[2.5rem] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
        
        <div className="relative bg-gray-900 rounded-[2.5rem] p-8 md:p-12 text-center overflow-hidden border border-white/10">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="p-4 bg-yellow-500/20 rounded-full mb-6 text-yellow-400 animate-pulse">
                    <FiAward size={48} />
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                    THE FINAL ASSESSMENT
                </h2>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
                    Prove your mastery. A comprehensive evaluation combining Quantitative, Logical, and Verbal skills in a single high-stakes test.
                </p>
                
                <Link 
                    // Matches the pattern: /aptitude/test/:topic/:mode
                    to={`/aptitude/test/${encodeURIComponent("Final Aptitude Test")}/hard`}
                    className="group relative inline-flex items-center gap-3 px-10 py-4 bg-white text-black font-black text-xl rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] overflow-hidden"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        START TEST <FiActivity />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
            </div>
        </div>
      </div>

    </div>
  );
}
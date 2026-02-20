import React from "react";
import { Link } from "react-router-dom";
import { 
  FiArrowRight, FiTerminal, FiCode, FiCoffee, 
  FiDatabase, FiServer, FiCpu, FiGlobe, FiGitBranch
} from "react-icons/fi";

const technicalModules = [
  { 
    name: "C Programming", 
    path: "cnotes", 
    icon: <FiTerminal size={28} />, 
    color: "from-blue-600 to-indigo-500",
    bgImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    name: "C++ Programming", 
    path: "cpp", 
    icon: <FiCode size={28} />, 
    color: "from-indigo-600 to-blue-500",
    bgImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    name: "Java Programming", 
    path: "java", 
    icon: <FiCoffee size={28} />, 
    color: "from-orange-600 to-red-500",
    bgImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    name: "Python", 
    path: "python", 
    icon: <FiCode size={28} />, 
    color: "from-yellow-400 to-green-500",
    bgImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    name: "Data Structures", 
    path: "dsa", 
    icon: <FiGitBranch size={28} />, 
    color: "from-emerald-600 to-teal-500",
    bgImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    name: "DBMS", 
    path: "dbms", 
    icon: <FiDatabase size={28} />, 
    color: "from-cyan-600 to-blue-500",
    bgImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    name: "Operating Systems", 
    path: "os", 
    icon: <FiCpu size={28} />, 
    color: "from-slate-600 to-gray-400",
    bgImage: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    name: "Computer Networks", 
    path: "cn", 
    icon: <FiGlobe size={28} />, 
    color: "from-purple-600 to-indigo-500",
    bgImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop" 
  },
];

export default function Technical() {
  return (
    <div className="min-h-screen p-6 md:p-12 overflow-visible">
      <div className="max-w-7xl mx-auto space-y-20 pb-20">
        
        {/* HEADER SECTION */}
        <div className="relative text-center pt-10" style={{ perspective: '1000px' }}>
            {/* Glowing Orbs behind the title */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-secondary/20 rounded-[100%] blur-[120px] -z-10 animate-pulse-soft"></div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 drop-shadow-2xl">
                Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-glow-primary">Module</span>
            </h1>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
                The core subjects essential for your technical interviews. Master programming languages, data structures, and computer science fundamentals.
            </p>
        </div>

        {/* 3D ADVANCED GRID SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto transition-all duration-500">
          {technicalModules.map((module, index) => (
            <Link
              key={index}
              to={module.path}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#121215] transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] flex flex-col justify-between p-6 hover:border-white/30 h-64"
            >
              {/* Outer glowing aura that appears only on hover */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${module.color} opacity-0 group-hover:opacity-20 blur-2xl transition-all duration-700 -z-10`}></div>
              
              {/* ADVANCED BACKGROUND IMAGE SYSTEM */}
              <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
                {/* Fetched Image (Scales slowly on hover) */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700 ease-out"
                  style={{ backgroundImage: `url(${module.bgImage})` }}
                ></div>
                
                {/* Dark Vignette Overlay (Ensures text stays highly readable) */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500"></div>

                {/* Colored Hue Overlay (Matches the card's theme color) */}
                <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-10 group-hover:opacity-30 mix-blend-color transition-opacity duration-500`}></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  {/* Icon Container */}
                  <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/20 shadow-lg group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500">
                    {module.icon}
                  </div>
                </div>

                <div className="mt-auto">
                  {/* Title */}
                  <h3 className="font-bold text-white text-2xl mb-2 group-hover:text-3xl transition-all duration-500 drop-shadow-lg leading-tight">
                    {module.name}
                  </h3>

                  {/* Arrow/Learn More */}
                  <div className="flex items-center gap-2 font-mono text-sm tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-200 group-hover:from-white group-hover:to-white transition-all duration-300">
                    Learn <FiArrowRight className="text-white opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* --- CODING PLATFORM CTA --- */}
        <div className="mt-24 pt-10">
          <div className="group relative overflow-hidden rounded-[2rem] border border-primary/30 bg-[#0F172A]/80 backdrop-blur-md p-1 md:p-1 shadow-[0_0_40px_rgba(59,130,246,0.15)] transition-all duration-500 hover:shadow-[0_0_60px_rgba(59,130,246,0.3)] hover:border-primary/60">
            
            {/* Animated Border Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-700 animate-border-flow"></div>
            
            <div className="relative bg-[#121215]/90 backdrop-blur-xl rounded-[1.9rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
                
                {/* Text Content */}
                <div className="flex-1 z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-mono mb-6">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> Live Editor
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
                        Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Coding Challenge</span>
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-xl">
                        Solve real interview-style coding problems generated by AI. Write your code in our interactive editor and get instant feedback on your solution.
                    </p>
                    
                    <Link
                      to="/technical/coding-levels"
                      className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] hover:-translate-y-1 transition-all duration-300"
                    >
                      <FiTerminal size={20} />
                      Start Coding Practice
                    </Link>
                </div>

                {/* Decorative Right Side (Mock Terminal) */}
                <div className="hidden md:block w-[400px] h-[250px] bg-[#09090b] rounded-xl border border-white/10 p-4 shadow-2xl relative transform perspective-1000 rotate-y-[-10deg] rotate-x-[5deg] group-hover:rotate-y-[0deg] group-hover:rotate-x-[0deg] transition-transform duration-700">
                    {/* Terminal Header */}
                    <div className="flex gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    {/* Terminal Code */}
                    <div className="font-mono text-sm text-gray-400 space-y-2 opacity-80">
                        <p><span className="text-pink-500">def</span> <span className="text-blue-400">solve_dsa</span>(array):</p>
                        <p className="pl-4">max_val = <span className="text-orange-400">float</span>(<span className="text-green-400">'-inf'</span>)</p>
                        <p className="pl-4"><span className="text-pink-500">for</span> num <span className="text-pink-500">in</span> array:</p>
                        <p className="pl-8"><span className="text-pink-500">if</span> num &gt; max_val:</p>
                        <p className="pl-12">max_val = num</p>
                        <p className="pl-4"><span className="text-pink-500">return</span> max_val</p>
                        <p className="mt-4 text-green-400 animate-pulse">&gt; All test cases passed! (14ms)</p>
                    </div>
                </div>
                
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
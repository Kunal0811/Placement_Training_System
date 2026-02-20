import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiTarget, FiCpu, FiUsers, FiMic } from "react-icons/fi";

function Home() {
  // Hero Parallax State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const cards = [
    {
      title: "Aptitude",
      subtitle: "Master Reasoning",
      desc: "Practice Quant, Logical & Verbal with adaptive tests.",
      icon: <FiTarget size={32} />,
      link: "/aptitude",
      color: "from-blue-600 to-cyan-500",
      bgImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Technical",
      subtitle: "Code Like a Pro",
      desc: "DSA, System Design, and competitive coding challenges.",
      icon: <FiCpu size={32} />,
      link: "/technical",
      color: "from-emerald-600 to-lime-500",
      bgImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Interview",
      subtitle: "AI Simulator",
      desc: "Real-time speech analysis and mock HR rounds.",
      icon: <FiMic size={32} />,
      link: "/interview",
      color: "from-purple-600 to-pink-500",
      bgImage: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Discussion",
      subtitle: "Speak Up",
      desc: "Group discussion topics and AI communication feedback.",
      icon: <FiUsers size={32} />,
      link: "/gd",
      color: "from-orange-600 to-yellow-500",
      bgImage: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=800&auto=format&fit=crop"
    }
  ];

  useEffect(() => {
    // Track mouse for Hero Parallax Background
    const handleGlobalMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20, // -10 to 10
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);

    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-32 pb-20 overflow-visible">
      
      {/* 1. HERO SECTION (With Parallax Orbs) */}
      <section className="relative pt-24 pb-16 text-center" style={{ perspective: '1000px' }}>
        {/* Parallax Glowing Orbs */}
        <div 
          className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-neon-blue/20 rounded-full blur-[100px] -z-10"
          style={{ transform: `translate3d(${mousePos.x * -2}px, ${mousePos.y * -2}px, -100px)` }}
        />
        <div 
          className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[120px] -z-10"
          style={{ transform: `translate3d(${mousePos.x * 2}px, ${mousePos.y * 2}px, -200px)` }}
        />
        
        <div 
          className="inline-block px-4 py-1.5 rounded-full border border-neon-purple/30 bg-neon-purple/10 text-neon-purple text-sm font-bold mb-6 animate-bounce-slow"
          style={{ transform: 'translateZ(20px)' }}
        >
          AI Placement Trainer - Your Ultimate Job Prep Companion
        </div>
        
        <h1 
          className="text-6xl md:text-8xl font-display font-bold text-white tracking-tight mb-6 leading-[0.9] drop-shadow-2xl"
          style={{ transform: `translate3d(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px, 50px)` }}
        >
          CRACK YOUR <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-white to-neon-purple text-glow">
            DREAM JOB
          </span>
        </h1>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Smart placement prep with gamified learning, AI mock interviews, and real-time analytics.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-20">
          <Link to="/aptitude" className="px-8 py-4 bg-neon-blue text-black font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(45,212,191,0.4)] hover:shadow-[0_0_40px_rgba(45,212,191,0.8)] hover:-translate-y-2 transition-all flex items-center justify-center gap-2 duration-300">
            Start Training <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* 2. ADVANCED CSS GRID ARENA (With Background Images) */}
      <section className="px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-10 text-center">
          Choose Your <span className="text-neon-yellow">Arena</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto transition-all duration-500">
          {cards.map((card, index) => {
            return (
              <Link 
                key={index} 
                to={card.link}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#121215] transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] flex flex-col justify-between p-8 hover:border-white/30"
              >
                {/* Outer glowing aura that appears only on hover */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-20 blur-2xl transition-all duration-700 -z-10`}></div>
                
                {/* ADVANCED BACKGROUND IMAGE SYSTEM */}
                <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
                  {/* Fetched Image (Scales slowly on hover) */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700 ease-out"
                    style={{ backgroundImage: `url(${card.bgImage})` }}
                  ></div>
                  
                  {/* Dark Vignette Overlay (Ensures text stays highly readable) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-[#121215]/80 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500"></div>

                  {/* Colored Hue Overlay (Matches the card's theme color) */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-10 group-hover:opacity-30 mix-blend-color transition-opacity duration-500`}></div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    {/* Icon Container */}
                    <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/20 shadow-lg group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500">
                      {card.icon}
                    </div>
                    {/* Arrow Container */}
                    <div className="p-3 rounded-full bg-white/5 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-500 -rotate-45 group-hover:rotate-0 group-hover:translate-x-1">
                      <FiArrowRight className="text-white opacity-50 group-hover:opacity-100 transition-opacity duration-300" size={24} />
                    </div>
                  </div>

                  <div className="mt-auto">
                    {/* Title */}
                    <h3 className="font-bold text-white text-3xl mb-3 group-hover:text-4xl transition-all duration-500 drop-shadow-lg">
                      {card.title}
                    </h3>

                    {/* Description */}
                    <div className="transform transition-all duration-500 group-hover:-translate-y-1">
                       <p className={`font-mono font-bold text-sm mb-3 tracking-wider text-transparent bg-clip-text bg-gradient-to-r ${card.color}`}>
                         // {card.subtitle}
                       </p>
                       <p className="text-gray-300 text-base leading-relaxed max-w-sm group-hover:text-white transition-colors duration-300 drop-shadow-md">
                         {card.desc}
                       </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      
      {/* 3. ISOMETRIC 3D DASHBOARD PREVIEW */}
      <section className="px-4 pb-20">
        <div className="glass-panel rounded-3xl p-8 md:p-16 border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-center gap-16" style={{ perspective: '1500px' }}>
            
            {/* Left Content */}
            <div className="flex-1 z-10" style={{ transform: 'translateZ(30px)' }}>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
                  Track Your <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-purple text-glow">Evolution</span>
                </h2>
                <ul className="space-y-6">
                    {[
                        { title: "Daily Streaks", desc: "Keep the fire alive to earn badges.", color: "bg-orange-500", glow: "shadow-[0_0_15px_#f97316]" },
                        { title: "Skill Radar", desc: "Visualize your weak & strong zones.", color: "bg-neon-blue", glow: "shadow-[0_0_15px_#2DD4BF]" },
                        { title: "Leaderboards", desc: "Compete with peers for top ranks.", color: "bg-neon-yellow", glow: "shadow-[0_0_15px_#FACC15]" },
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-4 group">
                            <div className={`w-4 h-4 mt-1.5 rounded-full ${item.color} ${item.glow} group-hover:scale-150 transition-transform duration-300`}></div>
                            <div>
                                <h4 className="text-white font-bold text-xl">{item.title}</h4>
                                <p className="text-gray-400 mt-1">{item.desc}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                <Link to="/dashboard" className="mt-10 inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-white font-bold text-lg transition-all hover:translate-x-2">
                    Open Dashboard <FiArrowRight />
                </Link>
            </div>
            
            {/* Right: 3D Isometric Mock UI */}
            <div className="flex-1 w-full flex justify-center perspective-1000 relative">
                {/* Glowing Aura Behind UI */}
                <div className="absolute inset-0 bg-gradient-to-tr from-neon-purple/30 to-neon-blue/30 rounded-[3rem] blur-[80px]"></div>
                
                {/* 3D Tilted Card */}
                <div 
                  className="relative w-full max-w-md bg-[#0f0f13] rounded-2xl border border-white/10 p-8 shadow-[20px_20px_60px_rgba(0,0,0,0.8)] transition-transform duration-700 hover:scale-105"
                  style={{ 
                    transform: 'rotateX(15deg) rotateY(-25deg) rotateZ(5deg)',
                    transformStyle: 'preserve-3d'
                  }}
                >
                    <div className="flex justify-between items-center mb-8" style={{ transform: 'translateZ(20px)' }}>
                        <span className="text-gray-400 font-medium tracking-wider uppercase text-sm">Your Progress</span>
                        <span className="px-3 py-1 bg-neon-blue/20 text-neon-blue border border-neon-blue/30 rounded-lg font-bold text-sm">Top 5%</span>
                    </div>
                    
                    {/* Floating Progress Bars */}
                    <div className="space-y-6" style={{ transformStyle: 'preserve-3d' }}>
                        <div className="relative group" style={{ transform: 'translateZ(30px)' }}>
                            <div className="flex justify-between text-xs text-gray-400 mb-2"><span>Algorithms</span> <span>85%</span></div>
                            <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div className="h-full w-[85%] bg-gradient-to-r from-cyan-500 to-neon-blue shadow-[0_0_15px_#2DD4BF] relative overflow-hidden">
                                  <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-shimmer"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="relative group" style={{ transform: 'translateZ(45px)' }}>
                            <div className="flex justify-between text-xs text-gray-400 mb-2"><span>System Design</span> <span>65%</span></div>
                            <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div className="h-full w-[65%] bg-gradient-to-r from-purple-500 to-neon-purple shadow-[0_0_15px_#A855F7]"></div>
                            </div>
                        </div>
                        
                        <div className="relative group" style={{ transform: 'translateZ(60px)' }}>
                            <div className="flex justify-between text-xs text-gray-400 mb-2"><span>Aptitude</span> <span>92%</span></div>
                            <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div className="h-full w-[92%] bg-gradient-to-r from-yellow-500 to-neon-yellow shadow-[0_0_15px_#FACC15]"></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Floating Badges */}
                    <div className="mt-10 flex justify-between gap-4" style={{ transform: 'translateZ(80px)' }}>
                        <div className="flex-1 h-16 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-xl backdrop-blur-md hover:-translate-y-2 transition-transform">🔥</div>
                        <div className="flex-1 h-16 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-xl backdrop-blur-md hover:-translate-y-2 transition-transform">🏆</div>
                        <div className="flex-1 h-16 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-xl backdrop-blur-md hover:-translate-y-2 transition-transform">💎</div>
                    </div>
                </div>
            </div>
        </div>
      </section>

    </div>
  );
}

export default Home;
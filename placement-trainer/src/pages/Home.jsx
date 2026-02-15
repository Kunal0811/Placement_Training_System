// placement-trainer/src/pages/Home.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiTarget, FiCpu, FiUsers, FiMic } from "react-icons/fi";

function Home() {
  // State now tracks both the active card index and which side is expanded
  const [layoutState, setLayoutState] = useState({ active: null, side: null });
  const timeoutRef = useRef(null);

  const cards = [
    {
      id: 0, // Top-Left (Natural Side: Left)
      title: "Aptitude",
      subtitle: "Master Reasoning",
      desc: "Practice Quant, Logical & Verbal with adaptive tests.",
      icon: <FiTarget size={32} />,
      link: "/aptitude",
      color: "from-blue-600 to-cyan-500",
      glow: "shadow-[0_0_30px_rgba(6,182,212,0.5)]"
    },
    {
      id: 1, // Top-Right (Natural Side: Right)
      title: "Technical",
      subtitle: "Code Like a Pro",
      desc: "DSA, System Design, and competitive coding challenges.",
      icon: <FiCpu size={32} />,
      link: "/technical",
      color: "from-emerald-600 to-lime-500",
      glow: "shadow-[0_0_30px_rgba(132,204,22,0.5)]"
    },
    {
      id: 2, // Bottom-Left (Natural Side: Left)
      title: "Interview",
      subtitle: "AI Simulator",
      desc: "Real-time speech analysis and mock HR rounds.",
      icon: <FiMic size={32} />,
      link: "/interview",
      color: "from-purple-600 to-pink-500",
      glow: "shadow-[0_0_30px_rgba(236,72,153,0.5)]"
    },
    {
      id: 3, // Bottom-Right (Natural Side: Right)
      title: "Discussion",
      subtitle: "Speak Up",
      desc: "Group discussion topics and AI communication feedback.",
      icon: <FiUsers size={32} />,
      link: "/gd",
      color: "from-orange-600 to-yellow-500",
      glow: "shadow-[0_0_30px_rgba(234,179,8,0.5)]"
    }
  ];

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = (index) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setLayoutState((prev) => {
      // If entering from Idle (2x2), decide side based on natural column
      if (prev.active === null) {
        const isLeftColumn = index === 0 || index === 2;
        return { active: index, side: isLeftColumn ? 'left' : 'right' };
      }
      
      // If moving BETWEEN cards, we simply flip the side to ensure stability.
      // E.g., If I was Left (Expanded), and I hit a card in the Right Stack,
      // that card becomes Big Right.
      if (prev.active !== index) {
         return { active: index, side: prev.side === 'left' ? 'right' : 'left' };
      }

      return prev;
    });
  };

  const handleMouseLeave = () => {
    // Debounce the reset: Wait 100ms before snapping back to 2x2.
    // This allows the mouse to cross the gap without resetting layout.
    timeoutRef.current = setTimeout(() => {
      setLayoutState({ active: null, side: null });
    }, 100);
  };

  const getCardClasses = (index) => {
    const { active, side } = layoutState;

    // 1. Idle State: Standard 2x2 Grid
    if (active === null) {
      return "md:col-span-1 md:row-span-1";
    }

    const isActive = active === index;

    // 2. Active State Logic
    if (side === 'left') {
      // LEFT SIDE EXPANDED
      return isActive 
        ? "md:col-start-1 md:col-end-3 md:row-start-1 md:row-end-4" // Active: Big Left
        : "md:col-start-3 md:col-end-4 md:row-span-1";             // Others: Stack Right
    } else {
      // RIGHT SIDE EXPANDED
      return isActive
        ? "md:col-start-2 md:col-end-4 md:row-start-1 md:row-end-4" // Active: Big Right
        : "md:col-start-1 md:col-end-2 md:row-span-1";             // Others: Stack Left
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-10 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-blue/20 rounded-full blur-[120px] -z-10 opacity-50 animate-pulse-fast"></div>
        
        <div className="inline-block px-4 py-1.5 rounded-full border border-neon-purple/30 bg-neon-purple/10 text-neon-purple text-sm font-bold mb-6 animate-bounce-slow">
           🚀 The #1 AI Placement Trainer
        </div>
        
        <h1 className="text-6xl md:text-8xl font-display font-bold text-white tracking-tight mb-6 leading-[0.9]">
          CRACK THE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-white to-neon-purple text-glow">
            DREAM JOB
          </span>
        </h1>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Gamified learning, AI-powered mock interviews, and real-time analytics to make you placement-ready.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/aptitude" className="px-8 py-4 bg-neon-blue text-black font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(45,212,191,0.4)] hover:shadow-[0_0_30px_rgba(45,212,191,0.6)] hover:scale-105 transition-all flex items-center justify-center gap-2">
            Start Training <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* DYNAMIC GRID ARENA */}
      <section className="px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-10 text-center">
          Choose Your <span className="text-neon-yellow">Arena</span>
        </h2>
        
        <div 
          className={`grid gap-4 w-full h-[800px] md:h-[600px] transition-all duration-500 ease-in-out
            ${layoutState.active === null ? "grid-cols-1 md:grid-cols-2 md:grid-rows-2" : "grid-cols-1 md:grid-cols-3 md:grid-rows-3"}`}
          onMouseLeave={handleMouseLeave}
        >
          {cards.map((card, index) => {
            const isActive = layoutState.active === index;
            const isInactive = layoutState.active !== null && !isActive;

            return (
              <Link 
                key={index} 
                to={card.link}
                onMouseEnter={() => handleMouseEnter(index)}
                className={`
                  group relative overflow-hidden rounded-3xl border border-white/10 bg-dark-card transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                  flex flex-col justify-between p-6
                  ${getCardClasses(index)}
                  ${isActive ? card.glow : 'hover:border-neon-blue/30'}
                `}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-b ${card.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-xl bg-white/5 backdrop-blur-sm text-white transition-all duration-500 ${isActive ? 'scale-110 bg-white/10' : ''}`}>
                      {card.icon}
                    </div>
                    <FiArrowRight className={`text-gray-400 transition-all duration-300 ${isActive ? 'rotate-0 opacity-100' : '-rotate-45 opacity-50'}`} size={24} />
                  </div>

                  <div className="mt-auto">
                    <h3 className={`font-bold text-white transition-all duration-300 ${isActive ? 'text-4xl mb-2' : 'text-2xl'}`}>
                      {card.title}
                    </h3>

                    {/* Description - Hides when another card is active */}
                    <div className={`overflow-hidden transition-all duration-500 ${isInactive ? 'max-h-0 opacity-0' : 'max-h-40 opacity-100'}`}>
                       <p className="text-neon-blue font-bold text-sm mb-2">{card.subtitle}</p>
                       <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
                         {card.desc}
                       </p>
                    </div>
                  </div>
                </div>

                {/* Decorative Big Icon */}
                <div className={`absolute -right-4 -bottom-4 text-9xl text-white opacity-5 transition-transform duration-500 ${isActive ? 'scale-110 rotate-0' : 'rotate-12'}`}>
                  {card.icon}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      
      {/* 3. GAMIFIED DASHBOARD PREVIEW */}
      <section className="px-4">
        <div className="glass-panel rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent"></div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-4xl font-display font-bold text-white mb-6">Track Your <span className="text-neon-pink">Evolution</span></h2>
                    <ul className="space-y-4">
                        {[
                            { title: "Daily Streaks", desc: "Keep the fire alive to earn badges.", color: "bg-orange-500" },
                            { title: "Skill Radar", desc: "Visualize your weak & strong zones.", color: "bg-neon-blue" },
                            { title: "Leaderboards", desc: "Compete with peers for top ranks.", color: "bg-neon-yellow" },
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-4">
                                <div className={`w-3 h-3 mt-1.5 rounded-full ${item.color} shadow-[0_0_10px_currentColor]`}></div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">{item.title}</h4>
                                    <p className="text-gray-400 text-sm">{item.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <Link to="/dashboard" className="mt-8 inline-block px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-white font-semibold transition-all">
                        Go to Dashboard
                    </Link>
                </div>
                
                {/* Mock UI Element */}
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-neon-pink to-neon-blue rounded-2xl blur opacity-30"></div>
                    <div className="relative bg-black rounded-xl border border-white/10 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-400 text-sm">Your Progress</span>
                            <span className="text-neon-blue font-bold">Top 5%</span>
                        </div>
                        <div className="space-y-3">
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full w-[85%] bg-neon-blue shadow-[0_0_10px_#2DD4BF]"></div>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full w-[65%] bg-neon-purple shadow-[0_0_10px_#A855F7]"></div>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full w-[92%] bg-neon-yellow shadow-[0_0_10px_#FACC15]"></div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-between">
                            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-2xl">🔥</div>
                            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-2xl">🏆</div>
                            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-2xl">💎</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

    </div>
  );
}

export default Home;
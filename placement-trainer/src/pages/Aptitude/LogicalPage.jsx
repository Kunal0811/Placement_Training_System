import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCommand, FiActivity } from 'react-icons/fi';

const topics = [
  { 
    name: "Series & Patterns", 
    path: "series-patterns", 
    icon: "📊",
    img: "https://images.unsplash.com/photo-1502139214982-d0ad755818d8?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    name: "Coding-Decoding", 
    path: "coding-decoding", 
    icon: "🔒",
    img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    name: "Blood Relations", 
    path: "blood-relations", 
    icon: "👨‍👩‍👧‍👦",
    img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    name: "Direction Sense", 
    path: "direction-sense", 
    icon: "🧭",
    img: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=400&auto=format&fit=crop" 
  },
];

export default function LogicalPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200/60 pb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 tracking-tight">
            LOGICAL <span className="text-blue-600">REASONING</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-2 flex items-center gap-2">
            <FiCommand className="text-blue-500" /> Decode patterns and master systematic deduction
          </p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white shadow-sm flex items-center gap-3">
             <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
             <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Aptitude Module 02</span>
        </div>
      </div>

      {/* Logical Topics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              to={`/aptitude/logical/${topic.path}`}
              className="group relative h-48 flex flex-col justify-end overflow-hidden rounded-[2rem] border border-white shadow-xl transition-all duration-500 hover:shadow-blue-200/50 hover:-translate-y-1.5"
            >
              {/* Background Image Layer */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                style={{ backgroundImage: `url(${topic.img})` }}
              />
              
              {/* Dark Overlay for Text Clarity */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-90 transition-opacity" />

              {/* Content Container */}
              <div className="relative z-10 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-3xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-300">
                    {topic.icon}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <FiArrowRight />
                  </div>
                </div>
                
                <h2 className="text-lg font-bold text-white tracking-tight leading-tight">
                  {topic.name}
                </h2>
                
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  Analyze &bull; Practice &bull; Master
                </p>
              </div>

              {/* Glass Rim Hover Effect */}
              <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 rounded-[2rem] transition-colors duration-500" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Logic Breakdown Info */}
      <div className="pt-10 border-t border-slate-200/60">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm">
                <p className="text-slate-800 font-bold text-xs">Syllogism Prep</p>
                <p className="text-slate-500 text-[10px] uppercase mt-1">Deductive Logic</p>
            </div>
            <div className="p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm">
                <p className="text-slate-800 font-bold text-xs">Cryptic Analysis</p>
                <p className="text-slate-500 text-[10px] uppercase mt-1">Coding Secrets</p>
            </div>
            <div className="p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm">
                <p className="text-slate-800 font-bold text-xs">Family Trees</p>
                <p className="text-slate-500 text-[10px] uppercase mt-1">Blood Relations</p>
            </div>
            <div className="p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm">
                <p className="text-slate-800 font-bold text-xs">Vector Sense</p>
                <p className="text-slate-500 text-[10px] uppercase mt-1">Mapping Directions</p>
            </div>
        </div>
      </div>

    </div>
  );
}
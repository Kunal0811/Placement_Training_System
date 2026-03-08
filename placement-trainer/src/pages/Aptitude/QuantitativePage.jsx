import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBookOpen, FiArrowRight, FiActivity, FiLayers } from 'react-icons/fi';

const topics = [
  { 
    name: "Number System", 
    path: "number-system", 
    icon: "🔢",
    img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    name: "Percentages", 
    path: "percentages", 
    icon: "📊",
    // NEW: Analytical/Data growth image
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    name: "Profit & Loss", 
    path: "profit-loss", 
    icon: "💰",
    img: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    name: "Simple Interest", 
    path: "interest", 
    icon: "📈",
    // NEW: Financial/Banking documents image
    img: "https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    name: "Time & Distance", 
    path: "time-speed-distance", 
    icon: "🚗",
    img: "https://images.unsplash.com/photo-1501139083538-0139583c060f?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    name: "Ratio & Proportion", 
    path: "ratio-proportion", 
    icon: "⚖️",
    img: "https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    name: "Permutations", 
    path: "permutation-combination", 
    icon: "🔄",
    img: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    name: "Geometry", 
    path: "geometry", 
    icon: "📐",
    // NEW: Clean architectural/geometric blueprint
    img: "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?q=80&w=400&auto=format&fit=crop" 
  },
];

export default function QuantitativePage() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12">
      
      {/* Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 tracking-tight">
            QUANTITATIVE <span className="text-blue-600">HUB</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-2 flex items-center gap-2">
            <FiLayers className="text-blue-500" /> Mastery track for mathematical reasoning
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="px-5 py-2.5 bg-white/70 backdrop-blur-md rounded-2xl border border-white shadow-sm flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">8 Modules Ready</span>
          </div>
        </div>
      </div>

      {/* COMPACT TOPICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              to={`/aptitude/quantitative/${topic.path}`}
              className="group relative h-44 flex flex-col justify-end overflow-hidden rounded-[2rem] border border-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(37,99,235,0.1)] hover:-translate-y-1"
            >
              {/* Image with Darker Initial Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${topic.img})` }}
              />
              
              {/* Modern Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90 transition-opacity" />

              {/* Compact Content Container */}
              <div className="relative z-10 p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl drop-shadow-md group-hover:scale-110 transition-transform duration-300">
                    {topic.icon}
                  </div>
                  <FiArrowRight className="text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" size={18} />
                </div>
                
                <h2 className="text-lg font-bold text-white tracking-tight mb-1">
                  {topic.name}
                </h2>
                
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                  Explore Theory &bull; Take Test
                </p>
              </div>

              {/* Subtle Border Glow on Hover */}
              <div className="absolute inset-0 border-2 border-blue-500/0 group-hover:border-blue-500/20 rounded-[2rem] transition-colors duration-500" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="pt-10 border-t border-gray-200/60 flex justify-center">
        <div className="flex items-center gap-8 text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em]">
           <span>Notes Included</span>
           <span className="w-1 h-1 bg-slate-300 rounded-full" />
           <span>Step-by-Step Solved Examples</span>
           <span className="w-1 h-1 bg-slate-300 rounded-full" />
           <span>Timed Practice Tests</span>
        </div>
      </div>

    </div>
  );
}
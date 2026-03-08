import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiEdit3, FiActivity } from 'react-icons/fi';

const topics = [
  { 
    name: "Grammar", 
    path: "grammar", 
    icon: "📚",
    // Image: Classic library/writing desk
    img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    name: "Vocabulary", 
    path: "vocabulary", 
    icon: "🗣️",
    // Image: Abstract speech/words concept
    img: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    name: "Comprehension", 
    path: "reading-comprehension", 
    icon: "📰",
    // Image: Morning newspaper/reading coffee
    img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=400&auto=format&fit=crop" 
  },
];

export default function VerbalPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200/60 pb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 tracking-tight">
            VERBAL <span className="text-blue-600">ABILITY</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-2 flex items-center gap-2">
            <FiEdit3 className="text-blue-500" /> Master communication, syntax, and critical reading
          </p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white shadow-sm flex items-center gap-3">
             <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
             <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Aptitude Module 03</span>
        </div>
      </div>

      {/* --- VERBAL TOPICS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              to={`/aptitude/verbal/${topic.path}`}
              className="group relative h-48 flex flex-col justify-end overflow-hidden rounded-[2rem] border border-white shadow-xl transition-all duration-500 hover:shadow-blue-200/50 hover:-translate-y-1.5"
            >
              {/* Background Image Layer */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                style={{ backgroundImage: `url(${topic.img})` }}
              />
              
              {/* Dark Overlay for Text Visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent opacity-90 transition-opacity" />

              {/* Content Container */}
              <div className="relative z-10 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-300">
                    {topic.icon}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <FiArrowRight size={20} />
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-white tracking-tight leading-tight">
                  {topic.name}
                </h2>
                
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  Syntax &bull; Semantics &bull; Speed
                </p>
              </div>

              {/* Glass Rim Hover Effect */}
              <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 rounded-[2rem] transition-colors duration-500" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* --- LEARNING OUTCOMES --- */}
      <div className="pt-10 border-t border-slate-200/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-slate-800 font-bold mb-2 flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-blue-500" /> Grammar Rules
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed">Master parts of speech, active/passive voice, and complex sentence structure.</p>
            </div>
            <div className="p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-slate-800 font-bold mb-2 flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-blue-500" /> Lexical Power
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed">Expand your vocabulary with synonyms, antonyms, and high-frequency corporate terms.</p>
            </div>
            <div className="p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-slate-800 font-bold mb-2 flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-blue-500" /> Speed Reading
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed">Techniques to quickly extract key information from dense passages and case studies.</p>
            </div>
        </div>
      </div>

    </div>
  );
}
import React from 'react';
import { motion } from 'framer-motion';

const ScoreDonutChart = ({ score }) => {
  // Normalize score to percentage if it's 0-10 or 0-100
  const displayScore = score <= 10 ? score * 10 : score;
  const radius = 70;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  // Dynamic color based on score performance
  const getStrokeColor = (s) => {
    if (s >= 80) return "#10b981"; // Emerald 500
    if (s >= 50) return "#3b82f6"; // Blue 500
    return "#f43f5e"; // Rose 500
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        {/* Background Track */}
        <circle
          stroke="#f1f5f9"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress Circle with Animation */}
        <motion.circle
          stroke={getStrokeColor(displayScore)}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      
      {/* Center Text */}
      <div className="absolute flex flex-col items-center justify-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-4xl font-black text-slate-800"
        >
          {Math.round(displayScore)}%
        </motion.span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Match</span>
      </div>
    </div>
  );
};

export default ScoreDonutChart;
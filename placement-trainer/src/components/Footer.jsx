// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Placify from "../assets/Placify1.png"; // Re-using your existing logo

const Footer = () => {
  return (
    <footer className="bg-dark-card text-gray-400 p-6 mt-auto border-t border-neon-blue/20">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <img src={Placify} alt="Placify Logo" className="w-8 h-8" />
          <span className="text-lg font-bold text-neon-blue">Placify</span>
        </div>
        <div className="text-sm">
          &copy; {new Date().getFullYear()} Placify. All rights reserved.
        </div>
        <div className="text-sm hidden md:block">
          An AI-Powered Placement Training System.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
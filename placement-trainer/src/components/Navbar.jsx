// placement-trainer/src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Placify from "../assets/Placify1.png";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../api";
import { FiAward, FiBell, FiZap } from "react-icons/fi"; // Added icons

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <div className="sticky top-4 z-50 px-4 mb-4">
      <div className="glass-panel rounded-2xl px-6 py-3 flex justify-between items-center relative">
        
        {/* Left: Burger & Brand */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl bg-white/5 hover:bg-neon-blue/20 hover:text-neon-blue transition-all active:scale-95"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          
          <Link to="/" className="flex items-center gap-2 group">
             {/* Logo with subtle rotation on hover */}
            <img src={Placify} alt="Logo" className="w-10 h-10 transition-transform group-hover:rotate-12" />
            <span className="text-2xl font-black tracking-tighter text-white">
              PLACI<span className="text-neon-blue">FY</span>
            </span>
          </Link>
        </div>

        {/* Right: Gamified Profile */}
        <div className="flex items-center gap-6" ref={dropdownRef}>
          {user && (
            <div className="hidden md:flex items-center gap-4">
              {/* Streak Counter */}
              <div className="flex items-center gap-2 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 text-orange-400 text-sm font-bold">
                <FiZap className="fill-current" />
                <span>12 Day Streak</span>
              </div>
              
              {/* XP Bar */}
              <div className="flex flex-col w-32">
                <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase">
                  <span>Lvl 5</span>
                  <span>1200 / 2000 XP</span>
                </div>
                <div className="h-1.5 bg-gray-700 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-neon-blue to-neon-purple w-[60%]"></div>
                </div>
              </div>
            </div>
          )}

          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)} 
              className="flex items-center gap-3 focus:outline-none group"
            >
              {user?.profile_picture_url ? (
                <div className="relative">
                  <img
                    src={`${API_BASE}${user.profile_picture_url}`}
                    alt="Profile"
                    className="w-11 h-11 rounded-xl object-cover border-2 border-white/10 group-hover:border-neon-purple transition-colors"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-game-bg rounded-full"></div>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {user ? (user?.fname?.[0].toUpperCase() || 'U') : 'G'}
                </div>
              )}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-4 w-56 glass-panel rounded-xl overflow-hidden animate-fade-in-down origin-top-right border border-white/10">
                {!user ? (
                  <div className="p-2 space-y-1">
                    <Link to="/login" onClick={() => setDropdownOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-white/10 text-sm font-medium transition-colors">Login</Link>
                    <Link to="/register" onClick={() => setDropdownOpen(false)} className="block px-4 py-3 rounded-lg bg-neon-blue/20 text-neon-blue hover:bg-neon-blue/30 text-sm font-bold transition-colors">Sign Up Free</Link>
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    <div className="px-4 py-2 border-b border-white/5 mb-2">
                       <p className="text-sm font-bold text-white">{user.fname} {user.lname}</p>
                       <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 text-sm text-gray-300 transition-colors">
                      <FiAward /> Dashboard
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-500/20 hover:text-red-400 text-sm text-gray-300 transition-colors">
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
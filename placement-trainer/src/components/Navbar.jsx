import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Placify from "../assets/Placify1.png";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../api"; // <-- 1. IMPORT THE API_BASE URL

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
    <div className="relative bg-dark-card/80 backdrop-blur-sm p-4 flex justify-between items-center z-50 border-b border-neon-blue/20">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-dark-card border border-neon-blue/20 text-gray-300 hover:text-neon-blue hover:border-neon-blue hover:shadow-lg hover:shadow-neon-blue/30 transition-all duration-300 transform hover:scale-110 focus:outline-none"
        >
          ☰
        </button>
      </div>

      {/* Centered Logo */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3">
        
          <img src={Placify} alt="Placify Logo" className="w-12 h-12" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-pink drop-shadow-glow-blue">
            PLACIFY
          </span>
       
      </div>

      {/* Right Section */}
      <div className="relative" ref={dropdownRef}>
        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-3 focus:outline-none">
          {user && (
            <span className="font-semibold text-gray-300 hover:text-white transition-colors hidden sm:block">
              {user?.fname ? `${user.fname} ${user.lname}` : user?.email}
            </span>
          )}

          {/* Logic to display profile picture or initial */}
          {user?.profile_picture_url ? (
            <img
              // --- 2. PREPEND THE API_BASE URL TO THE SRC ATTRIBUTE ---
              src={`${API_BASE}${user.profile_picture_url}`}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-neon-blue/50"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-neon-blue font-bold text-xl border-2 border-neon-blue/50">
              {user ? (user?.fname?.[0].toUpperCase() || 'U') : '?'}
            </div>
          )}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-3 w-48 bg-dark-card border border-neon-blue/20 rounded-lg shadow-lg overflow-hidden animate-fade-in-down">
            {!user ? (
              <>
                <Link to="/login" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-gray-300 hover:bg-neon-blue hover:text-black transition-colors">Login</Link>
                <Link to="/register" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-gray-300 hover:bg-neon-blue hover:text-black transition-colors">Register</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-gray-300 hover:bg-neon-blue hover:text-black transition-colors">Dashboard</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-gray-300 hover:bg-neon-blue hover:text-black transition-colors">Logout</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
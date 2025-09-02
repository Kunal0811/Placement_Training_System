import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import userImage from "../assets/user-3296.png";
import Placify from "../assets/Placify.png" // Make sure this file exists here
import { useAuth } from "../context/AuthContext";
import Dashboard from "../pages/Dashboard";

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
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
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      {/* Hamburger button */}
      <button
        onClick={toggleSidebar}
        className="text-2xl px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
      >
        ☰
      </button>

      <div className="flex items-center">
        <div className="flex-shrink-0 flex items-center">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center">
            <img
            src={Placify}
            alt="User"
            className="w-10 h-10 rounded-lg border-gray-300"
          />
          </div>
          <span className="ml-3 text-xl font-bold text-yellow-600">Placify</span>
        </div>
      </div>


      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 focus:outline-none"
        >
          <img
            src={userImage}
            alt="User"
            className="w-10 h-10 rounded-full border border-gray-300"
          />
          {user && <span className="font-semibold">{user.email || "Student"}</span>}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 hover:bg-blue-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 hover:bg-blue-100"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 hover:bg-blue-100"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-blue-100"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

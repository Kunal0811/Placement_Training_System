// placement-trainer/src/pages/auth/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE from "../../api";
import { FiUser, FiMail, FiLock, FiBook, FiBriefcase, FiArrowRight } from "react-icons/fi";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    year: "",
    field: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...formData,
            year: parseInt(formData.year) || 0
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-game-bg relative overflow-hidden p-4 py-12">
      
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-blue/10 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>

      <div className="glass-panel w-full max-w-lg p-8 rounded-3xl border border-white/10 shadow-2xl relative z-10 backdrop-blur-xl">
        
        <div className="text-center mb-8">
            <h2 className="text-4xl font-display font-bold text-white mb-2">
              Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Account</span>
            </h2>
            <p className="text-gray-400 text-sm">Join Placify and start your placement journey.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-center text-sm font-bold animate-fade-in">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">First Name</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-neon-blue transition-colors">
                        <FiUser />
                    </div>
                    <input
                      type="text"
                      name="fname"
                      className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all placeholder:text-gray-600"
                      onChange={handleChange}
                      placeholder="John"
                      required
                    />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Last Name</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-neon-blue transition-colors">
                        <FiUser />
                    </div>
                    <input
                      type="text"
                      name="lname"
                      className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all placeholder:text-gray-600"
                      onChange={handleChange}
                      placeholder="Doe"
                      required
                    />
                </div>
              </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Email Address</label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-neon-purple transition-colors">
                    <FiMail />
                </div>
                <input
                  type="email"
                  name="email"
                  className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all placeholder:text-gray-600"
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
            </div>
          </div>

          {/* Academic Info Row */}
          <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Year</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-neon-yellow transition-colors">
                        <FiBook />
                    </div>
                    <input
                      type="number"
                      name="year"
                      className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-neon-yellow focus:ring-1 focus:ring-neon-yellow transition-all placeholder:text-gray-600"
                      onChange={handleChange}
                      placeholder="e.g. 3"
                      min="1"
                      max="4"
                      required
                    />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Field/Branch</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-neon-yellow transition-colors">
                        <FiBriefcase />
                    </div>
                    <input
                      type="text"
                      name="field"
                      className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-neon-yellow focus:ring-1 focus:ring-neon-yellow transition-all placeholder:text-gray-600"
                      onChange={handleChange}
                      placeholder="Computer Science"
                      required
                    />
                </div>
              </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Password</label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-neon-green transition-colors">
                    <FiLock />
                </div>
                <input
                  type="password"
                  name="password"
                  className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-all placeholder:text-gray-600"
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
            </div>
            <p className="text-[10px] text-gray-500 ml-1">Must be 8+ characters, with uppercase, number & symbol.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? (
                <>
                 <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                 Creating Account...
                </>
            ) : (
                <>
                 Sign Up <FiArrowRight />
                </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-neon-purple font-bold hover:text-white transition-colors">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
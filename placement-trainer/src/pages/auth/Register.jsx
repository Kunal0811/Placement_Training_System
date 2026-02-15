// placement-trainer/src/pages/auth/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE from "../../api";
import { FiUser, FiMail, FiLock, FiBook, FiCheckCircle } from "react-icons/fi";

export default function Register() {
  const navigate = useNavigate();
  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [year, setYear] = useState("");
  const [field, setField] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fname || !lname || !email || !year || !field || !password || !confirmPwd) {
      setError("All fields are required");
      return;
    }
    if (password !== confirmPwd) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fname, lname, email, year, field, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Registration failed");
      }

      navigate("/login");
    } catch (err) {
      setError(err.message || "Server error, try again later");
    } finally {
      setLoading(false);
    }
  };

  const inputGroupClasses = "relative group";
  const iconClasses = "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-neon-blue transition-colors";
  // UPDATED: High visibility background
  const inputClasses = "w-full bg-black/40 border border-white/10 text-white rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all placeholder:text-gray-600 appearance-none";
  const labelClasses = "block mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-wide ml-1";

  return (
    <div className="min-h-screen flex items-center justify-center bg-game-bg relative overflow-hidden p-4 py-10">
      
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-blue/10 rounded-full blur-[120px] -z-10"></div>

      <div className="glass-panel w-full max-w-2xl p-8 rounded-3xl border border-white/10 shadow-2xl relative z-10 backdrop-blur-xl">
        
        <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
              Join the <span className="text-neon-blue">Squad</span>
            </h2>
            <p className="text-gray-400 text-sm">Start your placement journey with AI.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-center text-sm font-bold animate-pulse">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClasses}>First Name</label>
              <div className={inputGroupClasses}>
                  <div className={iconClasses}><FiUser /></div>
                  <input type="text" className={inputClasses} value={fname} onChange={(e) => setFName(e.target.value)} placeholder="John" required />
              </div>
            </div>
            <div>
              <label className={labelClasses}>Last Name</label>
              <div className={inputGroupClasses}>
                  <div className={iconClasses}><FiUser /></div>
                  <input type="text" className={inputClasses} value={lname} onChange={(e) => setLName(e.target.value)} placeholder="Doe" required />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className={labelClasses}>Email Address</label>
            <div className={inputGroupClasses}>
                <div className={iconClasses}><FiMail /></div>
                <input type="email" className={inputClasses} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@university.edu" required />
            </div>
          </div>
          
          {/* Academic Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
                <label className={labelClasses}>Year of Study</label>
                <div className={inputGroupClasses}>
                    <div className={iconClasses}><FiBook /></div>
                    <select className={inputClasses} value={year} onChange={(e) => setYear(e.target.value)} required>
                        <option value="" className="bg-gray-900 text-gray-500">Select Year</option>
                        <option value="1" className="bg-gray-900">1st Year</option>
                        <option value="2" className="bg-gray-900">2nd Year</option>
                        <option value="3" className="bg-gray-900">3rd Year</option>
                        <option value="4" className="bg-gray-900">4th Year</option>
                    </select>
                </div>
            </div>
            <div>
                <label className={labelClasses}>Field of Study</label>
                <div className={inputGroupClasses}>
                    <div className={iconClasses}><FiBook /></div>
                    <select className={inputClasses} value={field} onChange={(e) => setField(e.target.value)} required>
                        <option value="" className="bg-gray-900 text-gray-500">Select Field</option>
                        <option value="CSE" className="bg-gray-900">Computer Science</option>
                        <option value="IT" className="bg-gray-900">IT</option>
                        <option value="DS" className="bg-gray-900">Data Science</option>
                        <option value="AIML" className="bg-gray-900">AI & ML</option>
                        <option value="ECE" className="bg-gray-900">Electronics</option>
                    </select>
                </div>
            </div>
          </div>

          {/* Password Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClasses}>Password</label>
              <div className={inputGroupClasses}>
                  <div className={iconClasses}><FiLock /></div>
                  <input type="password" className={inputClasses} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
            </div>
            <div>
              <label className={labelClasses}>Confirm Password</label>
              <div className={inputGroupClasses}>
                  <div className={iconClasses}><FiLock /></div>
                  <input type="password" className={inputClasses} value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} placeholder="••••••••" required />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-neon-blue text-black font-bold shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all mt-6 flex justify-center items-center gap-2">
             {loading ? "Creating Account..." : <><FiCheckCircle /> Create Account</>}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-neon-blue font-bold hover:text-white transition-colors">Login here</Link>
        </p>
      </div>
    </div>
  );
}
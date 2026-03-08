import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API_BASE from "../../api";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiArrowRight, FiShield, FiCheck, FiCpu } from "react-icons/fi";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Invalid credentials");
      login(data.user);
      navigate("/");
    } catch (err) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans bg-slate-950">
      
      {/* --- BACKGROUND ENGINE --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="fixed inset-0 bg-cover bg-center -z-20 scale-100"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop")' }}
      />
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] -z-10" />

      {/* --- DESKTOP PORTAL CARD --- */}
      <motion.div 
        initial={{ opacity: 0, y: 40, rotateX: 15 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[1000px] h-[600px] bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] flex overflow-hidden z-10"
        style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
      >
        
        {/* LEFT PANEL: System Branding */}
        <div className="hidden lg:flex w-5/12 bg-blue-600 relative flex-col justify-between p-12 text-white overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            
            <div className="relative z-10">
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 1 }}
                  className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/30"
                >
                    <FiShield size={24} />
                </motion.div>
                <h2 className="text-4xl font-black tracking-tighter leading-tight mb-6">
                    SECURE <br /> ACCESS <span className="text-blue-200">PORTAL</span>
                </h2>
                <div className="space-y-5">
                    {[
                      { icon: <FiCheck />, text: 'Advanced Analytics' },
                      { icon: <FiCpu />, text: 'Assessment Ready' },
                      { icon: <FiLock />, text: 'Data Encryption' }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-blue-100/80">
                            <span className="text-white">{item.icon}</span> {item.text}
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative z-10 border-t border-white/10 pt-6">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-200">Auth Engine v.4.0</p>
                <p className="text-[9px] font-medium text-blue-100/50 mt-1 uppercase italic tracking-widest">Placify AI Ecosystem</p>
            </div>
        </div>

        {/* RIGHT PANEL: Form Area */}
        <div className="flex-1 flex flex-col justify-center px-12 md:px-20 bg-slate-950/20">
          <header className="mb-10 text-center lg:text-left">
            <h3 className="text-3xl font-black text-white tracking-tight mb-2 uppercase italic leading-none">
              Identity <span className="text-blue-500">Check</span>
            </h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest opacity-60">System Credentials Required</p>
          </header>

          {error && (
            <motion.div 
              initial={{ x: -20, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-center text-[10px] font-black uppercase tracking-widest"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Identity Protocol</label>
              <div className="relative group">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="email"
                    className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 pl-12 pr-4 focus:bg-white/10 transition-all outline-none focus:border-blue-500/50 text-sm font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Access Key</label>
                <Link to="/forgot-password" className="text-[9px] font-black text-blue-500 hover:text-white transition-colors uppercase tracking-widest">Recovery</Link>
              </div>
              <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="password"
                    className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 pl-12 pr-4 focus:bg-white/10 transition-all outline-none focus:border-blue-500/50 text-sm font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full py-4 mt-4 bg-blue-600 text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl shadow-2xl shadow-blue-900/40 hover:bg-blue-500 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>System Access <FiArrowRight className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <footer className="mt-12 text-center border-t border-white/5 pt-8">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
              No Clearance? <Link to="/register" className="text-blue-500 hover:text-white ml-2 underline underline-offset-4 decoration-blue-500/20 transition-all">Apply for access</Link>
            </p>
          </footer>
        </div>
      </motion.div>
    </div>
  );
}
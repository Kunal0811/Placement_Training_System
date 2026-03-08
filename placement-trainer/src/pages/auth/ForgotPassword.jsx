import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_BASE from "../../api";
import { motion } from "framer-motion";
import { FiMail, FiArrowRight, FiKey, FiShield, FiArrowLeft } from "react-icons/fi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Identity verification required");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Verification failed");

      setMessage(data.message);
      // Seamless transition to OTP verification
      setTimeout(() => navigate(`/verify-otp/${email}`), 2000);
    } catch (err) {
      setError(err.message || "Protocol error, check connection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans p-4">
      {/* --- SHARED BACKGROUND ENGINE --- */}
      <div 
        className="fixed inset-0 bg-cover bg-center -z-20"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=2000&auto=format&fit=crop")' }}
      />
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[3px] -z-10" />

      {/* --- COMPACT RECOVERY CARD --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-[850px] h-[500px] bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl flex overflow-hidden z-10"
      >
        
        {/* Left Side: Security Branding */}
        <div className="hidden lg:flex w-1/3 bg-blue-600/90 relative flex-col justify-between p-8 text-white">
            <div className="relative z-10">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-6 border border-white/30">
                    <FiKey size={20} />
                </div>
                <h2 className="text-2xl font-black tracking-tighter uppercase mb-4 leading-tight">Access <br/>Recovery</h2>
                <div className="space-y-4">
                    {['Identity Check', 'OTP Dispatch', 'Key Reset'].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-blue-100">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> {item}
                        </div>
                    ))}
                </div>
            </div>
            <div className="relative z-10">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-200">Security Dept.</p>
                <p className="text-[9px] font-medium text-blue-100/40">PLACIFY PROTECT</p>
            </div>
        </div>

        {/* Right Side: Recovery Form */}
        <div className="flex-1 flex flex-col justify-center py-8 px-10 md:px-16 bg-slate-950/20">
          
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
                <FiShield className="text-blue-500" />
                <h3 className="text-2xl font-black text-white tracking-tight uppercase italic">Forgot Password</h3>
            </div>
            <p className="text-slate-400 text-xs font-medium tracking-wide">Enter your identity to receive a recovery code.</p>
          </div>

          {message && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl mb-6 text-center text-[10px] font-black uppercase tracking-widest">
              {message}
            </motion.div>
          )}
          
          {error && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl mb-6 text-center text-[10px] font-black uppercase tracking-widest">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Account Identity</label>
              <div className="relative group">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    type="email"
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-4 pl-12 pr-4 focus:bg-white/10 transition-all outline-none focus:border-blue-500 shadow-inner text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter registered email"
                    required
                  />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full py-4 mt-2 bg-blue-600 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-xl shadow-xl shadow-blue-900/20 hover:bg-blue-500 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? "Verifying..." : <>Send OTP <FiArrowRight className="group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors group">
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Terminal
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE from "../../api";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiBook, FiBriefcase, FiArrowRight, FiCheckCircle } from "react-icons/fi";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fname: "", lname: "", email: "", year: "", field: "", password: "",
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
        body: JSON.stringify({ ...formData, year: parseInt(formData.year) || 0 }),
      });
      if (!res.ok) throw new Error("Registration failed");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans p-4">
      {/* Background Layer */}
      <div 
        className="fixed inset-0 bg-cover bg-center -z-20 scale-100"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2000&auto=format&fit=crop")' }}
      />
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[3px] -z-10" />

      {/* --- COMPACT REGISTRATION CARD --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-[900px] h-[580px] bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl flex overflow-hidden z-10"
      >
        
        {/* Left Side: Features (Compact) */}
        <div className="hidden lg:flex w-1/3 bg-indigo-600/90 relative flex-col justify-between p-8 text-white">
            <div className="relative z-10">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                    <FiCheckCircle size={20} />
                </div>
                <h2 className="text-2xl font-black tracking-tighter uppercase mb-4">New <br/>Enrolment</h2>
                <div className="space-y-4">
                    {['AI Diagnostics', 'Skill Roadmap', 'Mock Engine'].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-indigo-100">
                            <div className="w-1 h-1 bg-white rounded-full" /> {item}
                        </div>
                    ))}
                </div>
            </div>
            <p className="text-[9px] font-medium text-indigo-200/60">© 2026 PLACIFY SYSTEMS</p>
        </div>

        {/* Right Side: Compact Form */}
        <div className="flex-1 flex flex-col justify-center py-8 px-10 md:px-14 bg-slate-950/20">
          <div className="mb-6">
            <h3 className="text-2xl font-black text-white tracking-tight uppercase italic">Candidate Setup</h3>
            <p className="text-slate-400 text-xs font-medium">Please provide your academic credentials.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                    <div className="relative group">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 size-3.5" />
                        <input name="fname" type="text" onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 transition-all" placeholder="John" required />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                    <div className="relative group">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 size-3.5" />
                        <input name="lname" type="text" onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 transition-all" placeholder="Doe" required />
                    </div>
                </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
              <div className="relative group">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 size-3.5" />
                  <input name="email" type="email" onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 transition-all" placeholder="john@edu.com" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Year</label>
                    <div className="relative group">
                        <FiBook className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 size-3.5" />
                        <input name="year" type="number" onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 transition-all" placeholder="3" required />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Field</label>
                    <div className="relative group">
                        <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 size-3.5" />
                        <input name="field" type="text" onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 transition-all" placeholder="CS" required />
                    </div>
                </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Security Key</label>
              <div className="relative group">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 size-3.5" />
                  <input name="password" type="password" onChange={handleChange} className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 transition-all" placeholder="••••••••" required />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 bg-indigo-600 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-xl shadow-lg hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Initializing..." : <>Initialize Profile <FiArrowRight /></>}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            Member? <Link to="/login" className="text-indigo-500 hover:text-white ml-1">Log In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
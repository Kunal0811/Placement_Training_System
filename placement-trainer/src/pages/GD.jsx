import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiClock, FiPlus, FiCalendar, FiActivity, FiMail, FiSend, FiVideo, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../api";
import axios from "axios";

export default function GD() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Layout 1 State: Configuration
  const [topic, setTopic] = useState("AI replacing jobs: Threat or Opportunity?");
  const [scheduledTime, setScheduledTime] = useState("");
  
  // Layout 2 State: Invite System
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitedList, setInvitedList] = useState([]);
  
  // Layout 3 State: Queue
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/gd/sessions`);
      setSessions(res.data);
    } catch (err) {
      console.error("Failed to fetch sessions", err);
    }
  };

  useEffect(() => { fetchSessions(); }, []);

  const addInvite = () => {
    if (!inviteEmail.includes("@")) return alert("Please enter a valid email.");
    if (invitedList.length < 3) {
      setInvitedList([...invitedList, inviteEmail]);
      setInviteEmail("");
    } else {
      alert("Bridge limit reached: Max 4 students (Host + 3 Guests).");
    }
  };

  const removeInvite = (emailToRemove) => {
    setInvitedList(invitedList.filter(email => email !== emailToRemove));
  };

  const handleCreateSession = async () => {
    if (!scheduledTime) return alert("Select a time!");
    if (invitedList.length === 0) return alert("Add at least one student email to invite!");
    
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/gd/create`, {
        host_id: user.id,
        host_name: user.fname,
        scheduled_time: scheduledTime,
        topic: topic,
        // THE FIX: Changed 'invites' to 'invited_emails' to match backend exactly
        invited_emails: invitedList 
      });
      alert(res.data.message);
      fetchSessions();
      setScheduledTime("");
      setInvitedList([]);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to create session. Check server.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (session) => {
    try {
      await axios.post(`${API_BASE}/api/gd/join`, {
        session_id: session.id,
        user_id: user.id,
        user_name: user.fname
      });
      navigate(`/gd/room/${session.id}?topic=${encodeURIComponent(session.topic)}`);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to join room");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-sans text-white">
      {/* --- PROFESSIONAL IMAGE BACKGROUND --- */}
      <div 
        className="fixed inset-0 bg-cover bg-center -z-20 scale-105"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2000&auto=format&fit=crop")',
          filter: 'brightness(0.3)' 
        }}
      />
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-[6px] -z-10" />
      
      {/* Animated Ambient Orbs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-red-500/10 rounded-full blur-[100px] animate-pulse" />

      <div className="max-w-[1400px] mx-auto p-6 md:p-10 relative z-10">
        
        {/* --- HEADER SECTION --- */}
        <header className="mb-12 border-b border-white/10 pb-6 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-orange-400 font-black tracking-[0.3em] text-[10px] uppercase mb-3"
            >
              <FiActivity className="animate-pulse" /> Meet Bridge Protocol
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter">
              COMMUNICATION <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 italic">HUB</span>
            </h1>
          </div>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest max-w-sm text-right hidden md:block">
            Invite up to 4 students for a private debate via secure email link.
          </p>
        </header>

        {/* --- ADVANCED 3-COLUMN LAYOUT --- */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
            
            {/* COLUMN 1: Configuration */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col gap-6"
            >
              <h2 className="text-xl font-black text-white flex items-center gap-3">
                <span className="p-2.5 bg-orange-500 rounded-xl shadow-lg shadow-orange-500/20"><FiVideo /></span>
                1. Configure Bridge
              </h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Discussion Subject</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white font-medium transition-all focus:border-orange-500/50 outline-none" 
                    value={topic} 
                    onChange={e => setTopic(e.target.value)} 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Schedule Time</label>
                  <input 
                    type="datetime-local" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white font-medium transition-all focus:border-orange-500/50 outline-none [color-scheme:dark]" 
                    value={scheduledTime} 
                    onChange={e => setScheduledTime(e.target.value)} 
                  />
                </div>
              </div>
            </motion.div>

            {/* COLUMN 2: Dispatch Center (Invites) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-black/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col gap-6"
            >
              <h2 className="text-xl font-black text-white flex items-center gap-3">
                <span className="p-2.5 bg-red-500 rounded-xl shadow-lg shadow-red-500/20"><FiMail /></span>
                2. Invite Students
              </h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Email (Max 3 Guests)</label>
                  <div className="flex gap-2">
                    <input 
                      type="email" 
                      placeholder="student@university.com"
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white text-sm outline-none focus:border-red-500/50 transition-all" 
                      value={inviteEmail} 
                      onChange={e => setInviteEmail(e.target.value)} 
                      onKeyPress={e => e.key === 'Enter' && addInvite()}
                    />
                    <button onClick={addInvite} className="px-5 bg-white/10 hover:bg-red-500 transition-colors rounded-2xl border border-white/10 text-white">
                      <FiPlus size={20} />
                    </button>
                  </div>
                </div>

                {/* Email Chips Box */}
                <div className="min-h-[90px] p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-wrap gap-2 content-start">
                  <AnimatePresence>
                    {invitedList.length === 0 && <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest p-1">No pending invites</span>}
                    {invitedList.map((email, i) => (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                        key={i} 
                        className="px-3 py-1.5 bg-red-500/20 border border-red-500/30 text-red-300 text-[10px] font-black rounded-lg flex items-center gap-2 group cursor-pointer hover:bg-red-500 hover:text-white transition-colors"
                        onClick={() => removeInvite(email)}
                      >
                        <FiMail size={12} /> {email} <FiX className="ml-1 opacity-50 group-hover:opacity-100" />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <button 
                  onClick={handleCreateSession} 
                  disabled={loading} 
                  className="w-full py-5 bg-gradient-to-r from-orange-600 to-red-600 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? "Generating Links..." : <><FiSend size={14} /> Dispatch Secure Invites</>}
                </button>
              </div>
            </motion.div>

            {/* COLUMN 3: Live Queue */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-black/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-8 shadow-2xl flex flex-col h-[550px]"
            >
              <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black text-white flex items-center gap-3">
                      <span className="p-2.5 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-600/20"><FiCalendar /></span>
                      3. Live Queue
                  </h2>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2 no-scrollbar">
                  {sessions.map((session, index) => {
                      const date = new Date(session.time);
                      const isFull = session.participants >= 4; 
                      return (
                        <motion.div 
                          key={session.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-5 rounded-[1.5rem] bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col gap-4"
                        >
                          <div>
                              <div className="flex items-center gap-2 mb-2">
                                  <span className={`w-2.5 h-2.5 rounded-full ${session.status === 'active' ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`}></span>
                                  <h3 className="font-bold text-sm text-white truncate">{session.topic}</h3>
                              </div>
                              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                                  <span className="flex items-center gap-1.5"><FiClock className="text-emerald-400"/> {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                  <span className="flex items-center gap-1.5"><FiUsers className="text-emerald-400"/> {session.participants}/4</span>
                              </div>
                          </div>

                          <button 
                              onClick={() => handleJoin(session)} 
                              disabled={isFull} 
                              className={`w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                  isFull 
                                  ? "bg-slate-800 text-slate-600" 
                                  : "bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 hover:bg-emerald-600 hover:text-white"
                              }`}
                          >
                              {isFull ? "Bridge Full" : (session.status === 'active' ? "Join Live" : "Enter Waiting Room")}
                          </button>
                        </motion.div>
                      );
                  })}
                  
                  {sessions.length === 0 && (
                      <div className="flex-1 h-full flex flex-col items-center justify-center opacity-40 text-center">
                          <FiActivity size={40} className="mb-4 text-slate-400" />
                          <p className="font-black uppercase tracking-[0.2em] text-[10px] text-slate-400">No active bridges found</p>
                      </div>
                  )}
              </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
}
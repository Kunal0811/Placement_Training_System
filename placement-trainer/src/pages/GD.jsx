import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiClock, FiPlus, FiCalendar } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../api";
import axios from "axios";

export default function GD() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scheduledTime, setScheduledTime] = useState("");
  const [topic, setTopic] = useState("AI replacing jobs: Threat or Opportunity?");
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch scheduled sessions from the database
  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/gd/sessions`);
      setSessions(res.data);
    } catch (err) {
      console.error("Failed to fetch sessions", err);
    }
  };

  useEffect(() => { 
    fetchSessions(); 
  }, []);

  const handleCreateSession = async () => {
    if (!scheduledTime) return alert("Select a time!");
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/gd/create`, {
        host_id: user.id,
        host_name: user.fname,
        scheduled_time: scheduledTime,
        topic: topic
      });
      alert(res.data.message);
      fetchSessions(); // Refresh the list
      setScheduledTime("");
    } catch (err) {
      alert("Failed to create session.");
    } finally {
      setLoading(false);
    }
  };

  // THIS IS THE FUNCTION THAT HANDLES "ENTER WAITING ROOM"
  const handleJoin = async (session) => {
      try {
          await axios.post(`${API_BASE}/api/gd/join`, {
              session_id: session.id,
              user_id: user.id,
              user_name: user.fname
          });
          // Navigates the user to the Live Room
          navigate(`/gd/room/${session.id}?topic=${encodeURIComponent(session.topic)}`);
      } catch (err) {
          alert(err.response?.data?.detail || "Failed to join room");
      }
  };

  return (
    <div className="min-h-screen bg-game-bg p-6 md:p-12 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-display font-bold mb-4">
                Live <span className="text-neon-orange">Group Discussions</span>
            </h1>
            <p className="text-gray-400">Schedule a session, invite peers, and get evaluated by AI.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
            {/* LEFT SIDE: Create Session */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-black/40 relative overflow-hidden h-fit">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><FiPlus className="text-neon-orange"/> Host a Session</h2>
                <p className="text-sm text-gray-400 mb-6">We will email all registered students to join you.</p>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Topic</label>
                        <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:border-neon-orange text-white" value={topic} onChange={e => setTopic(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Schedule Time</label>
                        <input type="datetime-local" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:border-neon-orange text-white" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} />
                    </div>
                    <button onClick={handleCreateSession} disabled={loading} className="w-full py-4 mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-transform">
                        {loading ? "Scheduling & Emailing..." : "Schedule & Notify Everyone"}
                    </button>
                </div>
            </div>

            {/* RIGHT SIDE: Scheduled Sessions */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-black/20">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><FiCalendar className="text-neon-blue"/> Upcoming Sessions</h2>
                <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
                    {sessions.map((session) => {
                        const date = new Date(session.time);
                        const isFull = session.participants >= 6;
                        return (
                            <div key={session.id} className="p-5 rounded-2xl bg-black/40 border border-white/5 hover:border-white/20 transition-all flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div>
                                    <h3 className="font-bold text-white flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${session.status === 'active' ? 'bg-red-500 animate-pulse' : 'bg-neon-green'}`}></span>
                                        {session.topic}
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-1">Host: {session.host}</p>
                                    <div className="flex gap-4 mt-2 text-xs text-gray-500 font-mono">
                                        <span><FiClock className="inline"/> {date.toLocaleString()}</span>
                                        <span><FiUsers className="inline"/> {session.participants}/6 Joined</span>
                                    </div>
                                </div>
                                <button 
                                  onClick={() => handleJoin(session)} 
                                  disabled={isFull} 
                                  className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${isFull ? "bg-gray-800 text-gray-500" : "bg-neon-blue text-black hover:bg-cyan-300 shadow-[0_0_10px_rgba(45,212,191,0.2)]"}`}
                                >
                                    {isFull ? "Full" : (session.status === 'active' ? "Join Live" : "Enter Waiting Room")}
                                </button>
                            </div>
                        );
                    })}
                    {sessions.length === 0 && (
                        <div className="text-center p-10 border border-dashed border-white/10 rounded-2xl text-gray-500">
                            No upcoming sessions. Be the first to host one!
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
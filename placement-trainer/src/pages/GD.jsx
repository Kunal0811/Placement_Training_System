import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiClock, FiPlus, FiCalendar, FiCpu } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../api";
import axios from "axios";

export default function GD() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scheduledTime, setScheduledTime] = useState("");
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

  useEffect(() => { 
    fetchSessions(); 
    const interval = setInterval(fetchSessions, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateSession = async () => {
    if (!scheduledTime) return alert("Select a time!");
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/gd/create`, {
        host_id: user.id,
        host_name: user.fname,
        scheduled_time: scheduledTime
      });
      alert(res.data.message);
      fetchSessions(); 
      setScheduledTime("");
    } catch (err) {
      alert("Failed to create session.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (session, actionType) => {
    try {
        if (actionType === "book") {
            await axios.post(`${API_BASE}/api/gd/book`, {
                session_id: session.id,
                user_id: user.id,
                user_name: user.fname
            });
            alert("Seat booked! Enter the room 5 minutes before start time.");
            fetchSessions();
        } else {
            // FIX: If they click "Enter Live Room", check if they are already in the database.
            // If not, silently book their seat right now so the AI knows they exist!
            const participantIdsArray = (session.participant_ids || "").split(",");
            if (!participantIdsArray.includes(user.id.toString())) {
                await axios.post(`${API_BASE}/api/gd/book`, {
                    session_id: session.id,
                    user_id: user.id,
                    user_name: user.fname
                });
            }

            // Now navigate them securely to the room
            navigate(`/gd/room/${session.id}`, { 
                state: { topic: session.topic, hostId: session.host_id } 
            });
        }
    } catch (err) {
        alert(err.response?.data?.detail || "Action failed");
    }
};

  return (
    <div className="min-h-screen bg-game-bg p-6 md:p-12 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-display font-bold mb-4">
                Live <span className="text-neon-orange">Group Discussions</span>
            </h1>
            <p className="text-gray-400">Schedule, book a seat, and get evaluated by AI in real-time.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
            <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-black/40 relative overflow-hidden h-fit">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><FiPlus className="text-neon-orange"/> Host a Session</h2>
                <p className="text-sm text-gray-400 mb-6">Set a time. The AI will generate a surprise topic behind the scenes.</p>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Schedule Time</label>
                        <input type="datetime-local" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:border-neon-orange text-white" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} />
                    </div>
                    <button onClick={handleCreateSession} disabled={loading} className="w-full py-4 mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-transform">
                        {loading ? "Generating Topic & Notifying..." : "Schedule & Notify Everyone"}
                    </button>
                </div>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-black/20">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><FiCalendar className="text-neon-blue"/> Upcoming Sessions</h2>
                <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
                    {sessions.map((session) => {
                        const date = new Date(session.time);
                        const now = new Date();
                        const timeDiffMins = (date - now) / (1000 * 60);
                        const isFull = session.participants >= 6;
                        
                        const canJoinLive = (timeDiffMins <= 5 && timeDiffMins >= -30) || session.status === 'active';
                        const participantIdsArray = (session.participant_ids || "").split(",");
                        const hasBooked = participantIdsArray.includes(user.id.toString());

                        return (
                            <div key={session.id} className="p-5 rounded-2xl bg-black/40 border border-white/5 hover:border-white/20 transition-all flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div>
                                    <h3 className="font-bold text-white flex items-center gap-2">
                                        <FiCpu className="text-purple-400" /> Topic: Revealed in Live Room
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-1">Host: {session.host}</p>
                                    <div className="flex gap-4 mt-2 text-xs text-gray-500 font-mono">
                                        <span><FiClock className="inline"/> {date.toLocaleString()}</span>
                                        <span><FiUsers className="inline"/> {session.participants}/6 Booked</span>
                                    </div>
                                </div>
                                <button 
                                  onClick={() => handleAction(session, canJoinLive ? "join" : "book")} 
                                  disabled={isFull && !hasBooked && !canJoinLive} 
                                  className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap 
                                    ${canJoinLive ? "bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]" : 
                                      hasBooked ? "bg-green-500/20 text-green-400 border border-green-500/50" :
                                      isFull ? "bg-gray-800 text-gray-500" : "bg-neon-blue text-black hover:bg-cyan-300 shadow-[0_0_10px_rgba(45,212,191,0.2)]"}`}
                                >
                                    {canJoinLive ? "Enter Live Room" : hasBooked ? "Seat Booked" : isFull ? "Full" : "Book Seat"}
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
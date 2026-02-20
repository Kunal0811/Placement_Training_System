import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, Phone, MonitorUp, 
  Users, Settings, MessageSquare, Copy, Send, CheckCircle, Plus, X
} from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../api';

export default function GD() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomID = searchParams.get("room");

  // --- LOBBY STATE ---
  const [emails, setEmails] = useState([""]);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  // --- ROOM STATE ---
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  
  // Real Camera Refs
  const localVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);

  // Clock Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Real Camera & Mic Access Effect (Runs only when in a room)
  useEffect(() => {
    if (roomID) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setLocalStream(stream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Camera/Mic access denied:", err);
          alert("Please allow camera and microphone access to join the GD.");
        });
    }

    // Cleanup: Turn off camera when leaving the page
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [roomID]);

  // Toggle local mute
  useEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => track.enabled = !isMuted);
    }
  }, [isMuted, localStream]);

  // Toggle local video
  useEffect(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => track.enabled = !isVideoOff);
    }
  }, [isVideoOff, localStream]);

  // --- LOBBY LOGIC ---
  const handleAddEmail = () => {
    if (emails.length < 3) setEmails([...emails, ""]); // Max 3 guests + 1 host = 4 members
  };

  const handleCreateAndInvite = async () => {
    const validEmails = emails.filter(e => e.trim() !== "");
    const newRoomID = `gd-${Math.random().toString(36).substring(2, 9)}`;
    const roomLink = `${window.location.origin}/gd?room=${newRoomID}`;

    setIsInviting(true);
    try {
      if (validEmails.length > 0) {
        // Send emails via FastAPI backend
        await axios.post(`${API_BASE}/api/gd/invite`, {
          emails: validEmails,
          room_link: roomLink
        });
      }
      setInviteSuccess(true);
      setTimeout(() => navigate(`/gd?room=${newRoomID}`), 1500);
    } catch (error) {
      alert("Failed to send invites.");
    } finally {
      setIsInviting(false);
    }
  };

  // ==========================================
  // VIEW 1: LOBBY (Create Room & Invite)
  // ==========================================
  if (!roomID) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 text-white font-sans">
        <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden bg-[#1E293B]/80 backdrop-blur-xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
          
          <h2 className="text-3xl font-display font-bold mb-2">Create <span className="text-primary">GD Room</span></h2>
          <p className="text-gray-400 text-sm mb-6">Host a peer-to-peer group discussion. Maximum 4 members allowed per session.</p>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Invite Participants (Max 3)</label>
              {emails.map((email, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input 
                    type="email" 
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => {
                      const newEmails = [...emails];
                      newEmails[index] = e.target.value;
                      setEmails(newEmails);
                    }}
                    className="flex-1 bg-black/40 border border-white/10 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-primary transition-all text-sm"
                  />
                  {emails.length > 1 && (
                    <button onClick={() => setEmails(emails.filter((_, i) => i !== index))} className="p-3 bg-danger/20 text-danger hover:bg-danger/30 rounded-xl transition-colors">
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
              {emails.length < 3 && (
                <button onClick={handleAddEmail} className="text-primary text-sm font-bold flex items-center gap-1 mt-2 hover:text-primary-hover">
                  <Plus size={16} /> Add another email
                </button>
              )}
            </div>

            <button 
              onClick={handleCreateAndInvite}
              disabled={isInviting || inviteSuccess}
              className="w-full mt-6 py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-primary-glow flex justify-center items-center gap-2 transition-all disabled:opacity-50"
            >
              {inviteSuccess ? <><CheckCircle size={20}/> Invites Sent!</> : isInviting ? "Creating Room..." : <><Send size={20}/> Create & Invite</>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: ACTIVE ROOM (Real Camera & Mic)
  // ==========================================
  return (
    <div className="h-screen w-full bg-[#0F172A] text-white flex flex-col overflow-hidden font-sans">
      
      {/* HEADER */}
      <div className="h-14 w-full flex items-center justify-between px-6 shrink-0 bg-[#0F172A]/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
            <span className="font-display font-bold text-lg tracking-wide">Placify <span className="text-primary">Meet</span></span>
            <div className="h-4 w-px bg-white/20"></div>
            <span className="text-gray-300 font-medium hidden sm:block">Room: {roomID}</span>
        </div>
        <div className="flex items-center gap-6">
            <button 
              onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Meeting link copied!"); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium border border-white/10 transition-colors"
            >
              <Copy size={14} /> Copy Link
            </button>
            <span className="text-gray-300 font-medium font-mono">{currentTime}</span>
        </div>
      </div>

      {/* VIDEO GRID (Max 4 Members) */}
      <div className="flex-1 overflow-hidden p-4 relative flex items-center justify-center pb-24">
        <div className="w-full max-w-6xl h-full grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-4">
            
            {/* 1. LOCAL USER (Real Camera) */}
            <div className="relative rounded-2xl overflow-hidden bg-[#1E293B] shadow-lg border-2 border-primary shadow-primary-glow">
                {!isVideoOff ? (
                    <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1E293B] to-[#0F172A]">
                        <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold shadow-xl bg-primary text-white">YOU</div>
                    </div>
                )}
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-3 border border-white/10">
                    You {isMuted && <MicOff size={14} className="text-danger" />}
                </div>
            </div>

            {/* 2. WAITING FOR PEER 1 */}
            <div className="relative rounded-2xl overflow-hidden bg-[#1E293B]/50 border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-gray-500">
                <Users size={40} className="mb-2 opacity-50" />
                <span>Waiting for participant...</span>
            </div>

            {/* 3. WAITING FOR PEER 2 */}
            <div className="relative rounded-2xl overflow-hidden bg-[#1E293B]/50 border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-gray-500">
                <Users size={40} className="mb-2 opacity-50" />
                <span>Waiting for participant...</span>
            </div>

            {/* 4. WAITING FOR PEER 3 */}
            <div className="relative rounded-2xl overflow-hidden bg-[#1E293B]/50 border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-gray-500">
                <Users size={40} className="mb-2 opacity-50" />
                <span>Waiting for participant...</span>
            </div>

        </div>
      </div>

      {/* BOTTOM CONTROLS */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-[#0F172A] border-t border-white/10 px-6 flex items-center justify-center z-20">
        <div className="flex items-center gap-4">
            <button onClick={() => setIsMuted(!isMuted)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${isMuted ? 'bg-danger text-white hover:bg-red-600' : 'bg-[#334155] text-white hover:bg-[#475569]'}`}>
                {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
            </button>
            <button onClick={() => setIsVideoOff(!isVideoOff)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${isVideoOff ? 'bg-danger text-white hover:bg-red-600' : 'bg-[#334155] text-white hover:bg-[#475569]'}`}>
                {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
            </button>
            <button className="hidden sm:flex w-14 h-14 rounded-full bg-[#334155] text-white hover:bg-[#475569] items-center justify-center transition-all shadow-lg">
                <MonitorUp size={22} />
            </button>
            
            {/* End Call / Leave Room */}
            <button onClick={() => navigate('/gd')} className="w-20 h-14 rounded-full bg-danger text-white hover:bg-red-600 flex items-center justify-center transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] ml-4">
                <Phone size={24} className="rotate-[135deg]" />
            </button>
        </div>
      </div>
    </div>
  );
}
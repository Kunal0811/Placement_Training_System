// placement-trainer/src/pages/auth/Register.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE from "../../api";
import { FiUser, FiMail, FiLock, FiBook, FiBriefcase, FiArrowRight, FiEye, FiEyeOff, FiAlertTriangle, FiShield, FiCheckCircle } from "react-icons/fi";

export default function Register() {
  const navigate = useNavigate();
  
  // --- FORM & OTP STATE ---
  const [step, setStep] = useState(1); // 1 = Details, 2 = OTP Verification
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    year: "",
    field: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // --- MASCOT & INTERACTION STATE ---
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("none"); 
  const [isGreeting, setIsGreeting] = useState(true);

  // Trigger greeting bubble on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGreeting(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- STEP 1: SEND OTP ---
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      setFocusedField("error");
      return setError("Passwords do not match!");
    }
    if (formData.password.length < 8) {
      setFocusedField("error");
      return setError("Password must be at least 8 characters.");
    }
    
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/send-registration-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || "Failed to send OTP.");
      }

      setStep(2);
      setFocusedField("otp");
    } catch (err) {
      setFocusedField("error"); 
      setError(err.message || "Server error. Could not send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: VERIFY & REGISTER ---
  const handleFinalRegister = async (e) => {
    e.preventDefault();
    if (!otp) return setError("Please enter the OTP.");
    
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...formData,
            year: parseInt(formData.year) || 0,
            otp: otp
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Registration failed. Invalid OTP.");

      setFocusedField("success"); 
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setFocusedField("error"); 
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  // --- MASCOT ANIMATION LOGIC ---
  const trackingX = Math.min((formData.fname.length + formData.email.length + otp.length) * 1.5, 15); 

  // Default Idle State
  let leftHandStyle = "bottom-[-10px] left-[-15px] rotate-12";
  let rightHandStyle = "bottom-[-10px] right-[-15px] -rotate-12";
  let leftEyeStyle = "scale-y-100 translate-y-0 translate-x-0 bg-neon-blue shadow-[0_0_10px_#2DD4BF]";
  let rightEyeStyle = "scale-y-100 translate-y-0 translate-x-0 bg-neon-blue shadow-[0_0_10px_#2DD4BF]";
  let robotTransform = "";
  
  let bubbleText = "Ready to onboard? 👋";
  let showBubble = isGreeting;

  // Eye Tracking & Reactions
  if (step === 2) {
      if (focusedField === "otp") {
          showBubble = true; bubbleText = "Verifying code... 🔢";
          leftEyeStyle = `translate-y-2 translate-x-[${trackingX - 5}px] bg-neon-blue shadow-[0_0_10px_#2DD4BF]`;
          rightEyeStyle = `translate-y-2 translate-x-[${trackingX - 5}px] bg-neon-blue shadow-[0_0_10px_#2DD4BF]`;
      }
      else if (focusedField === "error") {
          showBubble = true; bubbleText = "Invalid Code! ❌";
          leftEyeStyle = "scale-y-[0.5] rotate-[-15deg] bg-red-500 shadow-[0_0_20px_#EF4444]";
          rightEyeStyle = "scale-y-[0.5] rotate-[15deg] bg-red-500 shadow-[0_0_20px_#EF4444]";
      }
      else if (focusedField === "success") {
          showBubble = true; bubbleText = "Identity Confirmed! ✅";
          leftEyeStyle = "scale-y-[1.5] scale-x-[1.2] bg-green-400 shadow-[0_0_20px_#4ADE80]";
          rightEyeStyle = "scale-y-[1.5] scale-x-[1.2] bg-green-400 shadow-[0_0_20px_#4ADE80]";
          robotTransform = "animate-[spin_1s_ease-in-out]";
      }
      else if (!isGreeting) {
          showBubble = true; bubbleText = "Check your inbox! 📧";
      }
  } else {
      if (["fname", "lname"].includes(focusedField)) {
          showBubble = true; bubbleText = "Scanning Identity... 👤";
          leftEyeStyle = `translate-y-2 translate-x-[${trackingX - 5}px] bg-neon-blue shadow-[0_0_10px_#2DD4BF]`;
          rightEyeStyle = `translate-y-2 translate-x-[${trackingX - 5}px] bg-neon-blue shadow-[0_0_10px_#2DD4BF]`;
      }
      else if (focusedField === "email") {
          showBubble = true; bubbleText = "Linking comms... 📧";
          leftEyeStyle = `translate-y-2 translate-x-[${trackingX - 5}px] bg-neon-blue shadow-[0_0_10px_#2DD4BF]`;
          rightEyeStyle = `translate-y-2 translate-x-[${trackingX - 5}px] bg-neon-blue shadow-[0_0_10px_#2DD4BF]`;
      }
      else if (["year", "field"].includes(focusedField)) {
          showBubble = true; bubbleText = "Verifying academics... 🎓";
          leftEyeStyle = `translate-y-2 translate-x-[${trackingX - 5}px] bg-neon-blue shadow-[0_0_10px_#2DD4BF]`;
          rightEyeStyle = `translate-y-2 translate-x-[${trackingX - 5}px] bg-neon-blue shadow-[0_0_10px_#2DD4BF]`;
      }
      else if ((focusedField === "password" && !showPassword) || (focusedField === "confirmPassword" && !showConfirmPassword)) {
          showBubble = true; bubbleText = "Securing password! 🙈";
          leftHandStyle = "bottom-[40px] left-[5px] rotate-[45deg] scale-110";
          rightHandStyle = "bottom-[40px] right-[5px] -rotate-[45deg] scale-110";
          leftEyeStyle = "scale-y-0 bg-neon-blue"; 
          rightEyeStyle = "scale-y-0 bg-neon-blue"; 
      }
      else if ((focusedField === "password" && showPassword) || (focusedField === "confirmPassword" && showConfirmPassword)) {
          showBubble = true; bubbleText = "Visual override! 👀";
          leftHandStyle = "bottom-[-10px] left-[-15px] rotate-12"; 
          rightHandStyle = "bottom-[40px] right-[15px] -rotate-[30deg] scale-110"; 
          leftEyeStyle = "translate-x-2 bg-neon-blue shadow-[0_0_10px_#2DD4BF]";
          rightEyeStyle = "scale-y-[0.2] bg-neon-blue shadow-[0_0_10px_#2DD4BF]";
      }
      else if (focusedField === "error") {
          showBubble = true; bubbleText = "Error detected! ❌";
          leftEyeStyle = "scale-y-[0.5] rotate-[-15deg] bg-red-500 shadow-[0_0_20px_#EF4444]";
          rightEyeStyle = "scale-y-[0.5] rotate-[15deg] bg-red-500 shadow-[0_0_20px_#EF4444]";
      }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-game-bg relative overflow-x-hidden overflow-y-auto p-4 py-24 font-sans select-none">
      
      {/* Ambient Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-neon-purple/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-fast pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-neon-blue/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>

      {/* Main Wrapper */}
      <div className="relative w-full max-w-xl z-10 flex flex-col items-center mt-12">
        
        {/* --- PLACIFY ROBOT MASCOT --- */}
        <div className={`relative w-32 h-32 mb-[-40px] z-20 animate-[bounce_3s_ease-in-out_infinite] ${robotTransform}`}>
            
            {/* Speech Bubble */}
            <div className={`absolute -top-12 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-2xl shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all duration-500 whitespace-nowrap ${showBubble ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                {bubbleText}
            </div>

            {/* Robot Head */}
            <div className="absolute inset-0 bg-dark-card border-2 border-white/10 rounded-[40px] shadow-[0_0_30px_rgba(168,85,247,0.3)] flex items-center justify-center overflow-hidden z-10 transition-transform duration-300">
                <div className="w-24 h-12 bg-black rounded-2xl relative flex justify-center items-center gap-4 overflow-hidden border border-white/5 shadow-inner">
                    {/* Left Eye */}
                    <div className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${leftEyeStyle}`} />
                    {/* Right Eye */}
                    <div className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${rightEyeStyle}`} />
                </div>
            </div>

            {/* Left Hand */}
            <div className={`absolute w-8 h-12 bg-dark-card border-2 border-white/10 rounded-full z-20 transition-all duration-500 shadow-lg ${leftHandStyle}`} />
            {/* Right Hand */}
            <div className={`absolute w-8 h-12 bg-dark-card border-2 border-white/10 rounded-full z-20 transition-all duration-500 shadow-lg ${rightHandStyle}`} />
        </div>

        {/* --- REGISTRATION CARD --- */}
        <div className="relative w-full p-8 md:p-10 rounded-[2rem] border border-white/10 shadow-2xl bg-black/60 backdrop-blur-2xl pt-16 animate-fade-in-up">
          
          <div className="absolute -inset-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-[2rem] pointer-events-none z-[-1]"></div>

          <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-display font-black text-white mb-2 tracking-tight">
                {step === 1 ? (
                    <>New <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">Recruit</span></>
                ) : (
                    <>Verify <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-green">Email</span></>
                )}
              </h2>
              <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">
                 {step === 1 ? "Create Your Profile" : `Code sent to ${formData.email}`}
              </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-center text-sm font-bold flex items-center justify-center gap-2 animate-shake">
              <FiAlertTriangle className="animate-pulse flex-shrink-0" /> {error}
            </div>
          )}
          
          {/* ================= STEP 1: REGISTRATION DETAILS ================= */}
          {step === 1 && (
              <form onSubmit={handleSendOTP} className="space-y-5 relative z-10 animate-fade-in">
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                      <div className="relative group/input">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within/input:text-neon-blue transition-colors z-10">
                              <FiUser size={18} />
                          </div>
                          <input type="text" name="fname" required className="relative w-full bg-black/50 border border-white/10 text-white rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all duration-300 placeholder:text-gray-600 focus:shadow-[0_0_20px_rgba(45,212,191,0.15)]"
                            value={formData.fname} onChange={handleChange} onFocus={() => setFocusedField("fname")} onBlur={() => setFocusedField("none")} placeholder="John" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                      <div className="relative group/input">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within/input:text-neon-blue transition-colors z-10">
                              <FiUser size={18} />
                          </div>
                          <input type="text" name="lname" required className="relative w-full bg-black/50 border border-white/10 text-white rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all duration-300 placeholder:text-gray-600 focus:shadow-[0_0_20px_rgba(45,212,191,0.15)]"
                            value={formData.lname} onChange={handleChange} onFocus={() => setFocusedField("lname")} onBlur={() => setFocusedField("none")} placeholder="Doe" />
                      </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within/input:text-neon-purple transition-colors z-10">
                          <FiMail size={18} />
                      </div>
                      <input type="email" name="email" required className="relative w-full bg-black/50 border border-white/10 text-white rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all duration-300 placeholder:text-gray-600 focus:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                        value={formData.email} onChange={handleChange} onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField("none")} placeholder="kunal@placify.com" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Year</label>
                      <div className="relative group/input">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within/input:text-neon-green transition-colors z-10">
                              <FiBook size={18} />
                          </div>
                          <input type="number" name="year" min="1" max="4" required className="relative w-full bg-black/50 border border-white/10 text-white rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-all duration-300 placeholder:text-gray-600 focus:shadow-[0_0_20px_rgba(74,222,128,0.15)]"
                            value={formData.year} onChange={handleChange} onFocus={() => setFocusedField("year")} onBlur={() => setFocusedField("none")} placeholder="e.g. 3" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Branch</label>
                      <div className="relative group/input">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within/input:text-neon-green transition-colors z-10">
                              <FiBriefcase size={18} />
                          </div>
                          <input type="text" name="field" required className="relative w-full bg-black/50 border border-white/10 text-white rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-all duration-300 placeholder:text-gray-600 focus:shadow-[0_0_20px_rgba(74,222,128,0.15)]"
                            value={formData.field} onChange={handleChange} onFocus={() => setFocusedField("field")} onBlur={() => setFocusedField("none")} placeholder="CS / IT" />
                      </div>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                      <div className="relative group/input">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within/input:text-neon-blue transition-colors z-10">
                              <FiLock size={18} />
                          </div>
                          <input type={showPassword ? "text" : "password"} name="password" required className="relative w-full bg-black/50 border border-white/10 text-white rounded-xl py-3.5 pl-11 pr-10 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all duration-300 placeholder:text-gray-600"
                            value={formData.password} onChange={handleChange} onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField("none")} placeholder="••••••••" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors z-10">
                            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                          </button>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                      <div className="relative group/input">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within/input:text-neon-purple transition-colors z-10">
                              <FiLock size={18} />
                          </div>
                          <input type={showConfirmPassword ? "text" : "password"} required className="relative w-full bg-black/50 border border-white/10 text-white rounded-xl py-3.5 pl-11 pr-10 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all duration-300 placeholder:text-gray-600"
                            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onFocus={() => setFocusedField("confirmPassword")} onBlur={() => setFocusedField("none")} placeholder="••••••••" />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors z-10">
                            {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                          </button>
                      </div>
                    </div>
                </div>

                <button type="submit" disabled={loading} className="relative w-full py-4 rounded-xl overflow-hidden group shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-70 mt-4 bg-gradient-to-r from-neon-blue to-neon-purple">
                  <span className="relative z-10 flex items-center justify-center gap-2 text-white font-black uppercase tracking-widest text-sm">
                    {loading ? (
                        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Sending OTP...</>
                    ) : (
                        <>Verify Email <FiArrowRight className="group-hover:translate-x-1.5 transition-transform duration-300" size={18} /></>
                    )}
                  </span>
                </button>
              </form>
          )}

          {/* ================= STEP 2: OTP VERIFICATION ================= */}
          {step === 2 && (
              <form onSubmit={handleFinalRegister} className="space-y-6 relative z-10 animate-fade-in-up">
                 <div className="bg-neon-blue/10 border border-neon-blue/20 rounded-2xl p-5 text-center shadow-[0_0_15px_rgba(45,212,191,0.1)]">
                     <p className="text-gray-300 text-sm leading-relaxed">
                         We have sent a 6-digit security code to <br/>
                         <strong className="text-white">{formData.email}</strong>
                     </p>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 text-center block">Enter Authentication Code</label>
                    <div className="relative group/input">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-neon-green">
                            <FiShield size={20} className="animate-pulse" />
                        </div>
                        <input
                            type="text" maxLength="6"
                            className="w-full bg-black/50 border-2 border-white/10 text-white rounded-xl py-4 pl-14 pr-4 focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-all duration-300 placeholder:text-gray-700 text-2xl font-mono tracking-[0.5em] text-center font-bold shadow-[0_0_20px_rgba(74,222,128,0.1)]"
                            value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} onFocus={() => setFocusedField("otp")} onBlur={() => setFocusedField("none")} placeholder="000000" required
                        />
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 rounded-xl border border-white/20 text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-bold uppercase tracking-widest text-xs">
                        Back
                    </button>
                    <button
                        type="submit" disabled={loading || otp.length < 6}
                        className="flex-[2] relative py-4 rounded-xl overflow-hidden group shadow-[0_0_20px_rgba(74,222,128,0.3)] hover:shadow-[0_0_40px_rgba(74,222,128,0.5)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-neon-blue to-neon-green"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2 text-white font-black uppercase tracking-widest text-sm">
                            {loading ? (
                                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Verifying...</>
                            ) : (
                                <>Create Account <FiCheckCircle size={18} /></>
                            )}
                        </span>
                    </button>
                 </div>
              </form>
          )}

          {step === 1 && (
              <div className="mt-8 text-center pt-6 border-t border-white/10 relative z-10">
                <p className="text-gray-400 text-sm font-medium">
                  Already a recruit?{" "}
                  <Link to="/login" className="text-white font-bold hover:text-neon-purple transition-colors duration-300 underline decoration-white/30 underline-offset-4">
                    Log In Here
                  </Link>
                </p>
              </div>
          )}

        </div>
      </div>
    </div>
  );
}
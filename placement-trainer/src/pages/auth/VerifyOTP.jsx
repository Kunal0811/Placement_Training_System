import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import API_BASE from "../../api";

export default function VerifyOTP() {
  const { email } = useParams();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!otp) {
      setError("OTP is required");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Invalid or expired OTP");
      }

      setMessage("OTP verified! Redirecting...");
      setTimeout(() => navigate(`/reset-password-otp/${data.user_id}`), 1500);
    } catch (err) {
      console.error(err);
      setError(err.message || "Server error, try again later");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full bg-dark-bg border border-gray-600 rounded-lg px-4 py-3 text-white text-center text-2xl tracking-[1em] focus:outline-none focus:border-neon-blue transition-colors";
  const labelStyles = "block mb-2 font-medium text-gray-400 text-center";

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4">
      <div className="max-w-md w-full bg-dark-card p-8 rounded-xl shadow-2xl border border-neon-blue/20">
        <h2 className="text-4xl font-bold mb-4 text-center text-white text-glow bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-pink">
          Verify OTP
        </h2>
        <p className="text-gray-400 text-center mb-8">An OTP has been sent to {email}</p>
        
        {message && <p className="bg-green-500/20 text-green-300 border border-green-500/50 p-3 rounded-lg mb-6 text-center font-semibold">{message}</p>}
        {error && <p className="bg-red-500/20 text-red-400 border border-red-500/50 p-3 rounded-lg mb-6 text-center font-semibold">{error}</p>}

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className={labelStyles}>Enter 6-Digit OTP</label>
            <input
              type="text"
              maxLength="6"
              className={inputStyles}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="· · · · · ·"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neon-blue text-black font-bold py-3 rounded-lg hover:scale-105 transition-transform animate-glow disabled:bg-gray-600 disabled:animate-none"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="text-gray-400 hover:text-neon-blue hover:underline">
            ← Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_BASE from "../../api";

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
      setError("Email is required");
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

      if (!res.ok) {
        throw new Error(data.detail || "Something went wrong");
      }

      setMessage(data.message);
      setTimeout(() => navigate(`/verify-otp/${email}`), 2000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Server error, try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4">
      <div className="max-w-md w-full bg-dark-card p-8 rounded-xl shadow-2xl border border-neon-blue/20">
        <h2 className="text-4xl font-bold mb-8 text-center text-white text-glow bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-pink">
          Forgot Password
        </h2>
        
        {message && <p className="bg-green-500/20 text-green-300 border border-green-500/50 p-3 rounded-lg mb-6 text-center font-semibold">{message}</p>}
        {error && <p className="bg-red-500/20 text-red-400 border border-red-500/50 p-3 rounded-lg mb-6 text-center font-semibold">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium text-gray-400">Email Address</label>
            <input
              type="email"
              className="w-full bg-dark-bg border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-neon-blue text-black font-bold py-3 rounded-lg hover:scale-105 transition-transform animate-glow disabled:bg-gray-600 disabled:animate-none"
          >
            {loading ? "Sending..." : "Send OTP"}
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
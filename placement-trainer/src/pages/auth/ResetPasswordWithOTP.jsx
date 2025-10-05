import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import API_BASE from "../../api";

export default function ResetPasswordWithOTP() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Something went wrong");
      }

      setMessage(data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Server error, try again later");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full bg-dark-bg border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors";
  const labelStyles = "block mb-2 font-medium text-gray-400";

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4">
      <div className="max-w-md w-full bg-dark-card p-8 rounded-xl shadow-2xl border border-neon-blue/20">
        <h2 className="text-4xl font-bold mb-8 text-center text-white text-glow bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-pink">
          Reset Password
        </h2>
        
        {message && <p className="bg-green-500/20 text-green-300 border border-green-500/50 p-3 rounded-lg mb-6 text-center font-semibold">{message}</p>}
        {error && <p className="bg-red-500/20 text-red-400 border border-red-500/50 p-3 rounded-lg mb-6 text-center font-semibold">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={labelStyles}>New Password</label>
            <input
              type="password"
              className={inputStyles}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>
          <div>
            <label className={labelStyles}>Confirm New Password</label>
            <input
              type="password"
              className={inputStyles}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neon-blue text-black font-bold py-3 rounded-lg hover:scale-105 transition-transform animate-glow disabled:bg-gray-600 disabled:animate-none"
          >
            {loading ? "Resetting..." : "Reset Password"}
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
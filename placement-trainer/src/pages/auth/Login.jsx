import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API_BASE from "../../api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Invalid credentials");
      }

      login(data.user);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message || "Server error, please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4">
      <div className="max-w-md w-full bg-dark-card p-8 rounded-xl shadow-2xl border border-neon-blue/20">
        <h2 className="text-4xl font-bold mb-8 text-center text-white text-glow bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-pink">
          Login to Placify
        </h2>
        {error && <p className="bg-red-500/20 text-red-400 border border-red-500/50 p-3 rounded-lg mb-6 text-center font-semibold">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium text-gray-400">Email</label>
            <input
              type="email"
              className="w-full bg-dark-bg border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium text-gray-400">Password</label>
            <input
              type="password"
              className="w-full bg-dark-bg border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neon-blue text-black font-bold py-3 rounded-lg hover:scale-105 transition-transform animate-glow disabled:bg-gray-600 disabled:animate-none"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="text-neon-blue hover:underline font-semibold">
              Register here
            </Link>
          </p>
          <p className="mt-2">
            <Link to="/forgot-password" className="text-neon-blue hover:underline font-semibold">
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE from "../../api";

export default function Register() {
  const navigate = useNavigate();
  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [year, setYear] = useState("");
  const [field, setField] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fname || !lname || !email || !year || !field || !password || !confirmPwd) {
      setError("All fields are required");
      return;
    }
    if (password !== confirmPwd) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fname, lname, email, year, field, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Registration failed");
      }

      navigate("/login");
    } catch (err) {
      setError(err.message || "Server error, try again later");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full bg-dark-bg border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors";
  const labelStyles = "block mb-2 font-medium text-gray-400";

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4">
      <div className="max-w-lg w-full bg-dark-card p-8 rounded-xl shadow-2xl border border-neon-blue/20">
        <h2 className="text-4xl font-bold mb-8 text-center text-white text-glow bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-pink">
          Create an Account
        </h2>
        {error && (
          <p className="bg-red-500/20 text-red-400 border border-red-500/50 p-3 rounded-lg mb-6 text-center font-semibold">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyles}>First Name</label>
              <input type="text" className={inputStyles} value={fname} onChange={(e) => setFName(e.target.value)} required />
            </div>
            <div>
              <label className={labelStyles}>Last Name</label>
              <input type="text" className={inputStyles} value={lname} onChange={(e) => setLName(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className={labelStyles}>Email</label>
            <input type="email" className={inputStyles} value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className={labelStyles}>Year of Study</label>
                <select className={inputStyles} value={year} onChange={(e) => setYear(e.target.value)} required>
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                </select>
            </div>
            <div>
                <label className={labelStyles}>Field of Study</label>
                <select className={inputStyles} value={field} onChange={(e) => setField(e.target.value)} required>
                <option value="">Select Field</option>
                <option value="CSE">Computer Science (CSE)</option>
                <option value="IT">Information Technology (IT)</option>
                <option value="DS">Data Science (DS)</option>
                <option value="AIML">AI & ML</option>
                <option value="AIDS">AI & Data Science (AIDS)</option>
                <option value="ECE">Electronics & Communication (ECE)</option>
                </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyles}>Password</label>
              <input type="password" className={inputStyles} value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div>
              <label className={labelStyles}>Confirm Password</label>
              <input type="password" className={inputStyles} value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} required />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-neon-blue text-black font-bold py-3 rounded-lg hover:scale-105 transition-transform animate-glow disabled:bg-gray-600 disabled:animate-none">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-neon-blue hover:underline font-semibold">Login here</Link>
        </p>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE from "../../api"; // ✅ assuming you have api.js

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fname || !lname || !email || !year || !field || !password || !confirmPwd) {
      setError("All fields are required");
      return;
    }
    if (password !== confirmPwd) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fname, lname, email, year, field, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.detail || "Registration failed");
        return;
      }

      navigate("/login");
    } catch (err) {
      setError("Server error, try again later");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>
        {error && (
          <p className="text-red-600 mb-4 text-center font-semibold">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">First Name</label>
            <input type="text" className="w-full border px-3 py-2" value={fname} onChange={(e) => setFName(e.target.value)} />

            <label className="block mb-1 font-medium">Last Name</label>
            <input type="text" className="w-full border px-3 py-2" value={lname} onChange={(e) => setLName(e.target.value)} />

            <label className="block mb-1 font-medium">Email</label>
            <input type="email" className="w-full border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />

            <label className="block mb-1 font-medium">Year of Study</label>
            <select className="w-full border px-3 py-2" value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>

            <label className="block mb-1 font-medium">Field of Study</label>
            <select className="w-full border px-3 py-2" value={field} onChange={(e) => setField(e.target.value)}>
              <option value="">Select Field</option>
              <option value="CSE">Computer Science (CSE)</option>
              <option value="IT">Information Technology (IT)</option>
              <option value="DS">Data Science (DS)</option>
              <option value="AIML">AI & ML</option>
              <option value="AIDS">AI & Data Science (AIDS)</option>
              <option value="ECE">Electronics & Communication (ECE)</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input type="password" className="w-full border px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input type="password" className="w-full border px-3 py-2" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} />
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}

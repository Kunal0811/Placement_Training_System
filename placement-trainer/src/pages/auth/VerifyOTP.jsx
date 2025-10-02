import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API_BASE from "../../api";

export default function VerifyOTP() {
  const { email } = useParams();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault(); setError(""); setMessage("");
    if (!otp) { setError("OTP is required"); return; }

    try {
      const res = await fetch(`${API_BASE}/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (!res.ok) { setError(data.detail || "Invalid OTP"); return; }

      setMessage("OTP verified! Redirecting...");
      setTimeout(() => navigate(`/reset-password-otp/${data.user_id}`), 1000);
    } catch (err) {
      console.error(err); setError("Server error, try again later");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-3xl font-bold mb-6 text-center">Verify OTP</h2>
        {message && <p className="text-green-600 mb-4 text-center">{message}</p>}
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Enter OTP</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit OTP"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}

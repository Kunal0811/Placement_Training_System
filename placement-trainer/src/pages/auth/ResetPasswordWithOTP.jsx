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

      try {
        const res = await fetch(`${API_BASE}/api/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.detail || "Something went wrong");
          return;
        }

        setMessage(data.message);
        setTimeout(() => navigate("/login"), 2000);
      } catch (err) {
        console.error(err);
        setError("Server error, try again later");
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded shadow">
          <h2 className="text-3xl font-bold mb-6 text-center">Reset Password</h2>
          {message && <p className="text-green-600 mb-4 text-center">{message}</p>}
          {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium">New Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Confirm Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="********"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Reset Password
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            <Link to="/login" className="text-blue-600 hover:underline">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    );
  }

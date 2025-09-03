import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ isLoggedIn, children }) {
  const { user } = useAuth();
  if (!user) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h2>Access Denied</h2>
        <p>You must be logged in to view this page.</p>
      </div>
      
    );
    return <Navigate to="/login" replace />; // Redirect to home if not logged in
  }
  return children;
}

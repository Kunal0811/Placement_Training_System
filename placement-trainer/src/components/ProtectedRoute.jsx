// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // If no user in context, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

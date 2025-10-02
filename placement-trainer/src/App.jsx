import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Aptitude from "./pages/Aptitude.jsx";
import Technical from "./pages/Technical.jsx";
import GD from "./pages/GD.jsx";
import Interview from "./pages/Interview.jsx";
import AptitudeNotes from "./pages/Aptitude/AptitudeNotes.jsx";
import TestPage from "./pages/Aptitude/TestPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CNotes from "./pages/Technical/CNotes.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPasswordWithOTP from "./pages/auth/ResetPasswordWithOTP.jsx";
import VerifyOTP from "./pages/auth/VerifyOTP.jsx";


// Wrapper to extract :section param
function AptitudeNotesWrapper() {
  const { section } = useParams();
  return <AptitudeNotes section={section} />;
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router>
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-screen transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-0"
          } overflow-hidden`}
        >
          <Sidebar isOpen={sidebarOpen} />
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          <div className="flex-1 overflow-y-auto p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp/:email" element={<VerifyOTP />} />
              <Route path="/reset-password-otp/:userId" element={<ResetPasswordWithOTP />} />

              {/* Protected Routes */}
              <Route
                path="/aptitude"
                element={
                  <ProtectedRoute>
                    <Aptitude />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/technical"
                element={
                  <ProtectedRoute>
                    <Technical />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gd"
                element={
                  <ProtectedRoute>
                    <GD />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview"
                element={
                  <ProtectedRoute>
                    <Interview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/aptitude/notes/:section"
                element={
                  <ProtectedRoute>
                    <AptitudeNotesWrapper />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/aptitude/test/:topic"
                element={
                  <ProtectedRoute>
                    <TestPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/technical/cnotes"
                element={
                  <ProtectedRoute>
                    <CNotes />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;

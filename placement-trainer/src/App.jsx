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
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPasswordWithOTP from "./pages/auth/ResetPasswordWithOTP.jsx";
import VerifyOTP from "./pages/auth/VerifyOTP.jsx";
import ModeSelection from "./pages/Aptitude/ModeSelection.jsx";

// Technical Notes Components
import CNotes from "./pages/Technical/CNotes.jsx";
import CppNotes from "./pages/Technical/CppNotes.jsx";
import JavaNotes from "./pages/Technical/JavaNotes.jsx";
import PythonNotes from "./pages/Technical/PythonNotes.jsx";
import DSANotes from "./pages/Technical/DSANotes.jsx";
import DBMSNotes from "./pages/Technical/DBMSNotes.jsx";
import OSNotes from "./pages/Technical/OSNotes.jsx";
import CNNotes from "./pages/Technical/CNNotes.jsx";
import CodingPlatform from "./pages/Technical/CodingPlatform.jsx";
import CodingLevels from "./pages/Technical/CodingLevels.jsx"; // Import the new component

import ResumeAnalyzer from "./pages/ResumeAnalyzer.jsx";



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
        <div
          className={`fixed top-0 left-0 h-screen transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-0"
          } overflow-hidden`}
        >
          <Sidebar isOpen={sidebarOpen} />
        </div>

        <div
          className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          <div className="flex-1 overflow-y-auto p-4">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp/:email" element={<VerifyOTP />} />
              <Route path="/reset-password-otp/:userId" element={<ResetPasswordWithOTP />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

              {/* Aptitude Section */}
              <Route path="/aptitude" element={<ProtectedRoute><Aptitude /></ProtectedRoute>} />
              <Route path="/aptitude/notes/:section" element={<ProtectedRoute><AptitudeNotesWrapper /></ProtectedRoute>} />
              <Route path="/aptitude/modes/:topic" element={<ProtectedRoute><ModeSelection /></ProtectedRoute>} />
              <Route path="/aptitude/test/:topic/:mode" element={<ProtectedRoute><TestPage /></ProtectedRoute>} />

              {/* Technical Section */}
              <Route path="/technical" element={<ProtectedRoute><Technical /></ProtectedRoute>} />
              <Route path="/technical/cnotes" element={<ProtectedRoute><CNotes /></ProtectedRoute>} />
              <Route path="/technical/cpp" element={<ProtectedRoute><CppNotes /></ProtectedRoute>} />
              <Route path="/technical/java" element={<ProtectedRoute><JavaNotes /></ProtectedRoute>} />
              <Route path="/technical/python" element={<ProtectedRoute><PythonNotes /></ProtectedRoute>} />
              <Route path="/technical/dsa" element={<ProtectedRoute><DSANotes /></ProtectedRoute>} />
              <Route path="/technical/dbms" element={<ProtectedRoute><DBMSNotes /></ProtectedRoute>} />
              <Route path="/technical/os" element={<ProtectedRoute><OSNotes /></ProtectedRoute>} />
              <Route path="/technical/cn" element={<ProtectedRoute><CNNotes /></ProtectedRoute>} />
              <Route path="/technical/coding-test" element={<ProtectedRoute><CodingPlatform /></ProtectedRoute>} />
              
              {/* --- ADDED TECHNICAL TEST ROUTES --- */}
               <Route path="/technical/coding-levels" element={<ProtectedRoute><CodingLevels /></ProtectedRoute>} />
                <Route path="/technical/coding-test/:difficulty" element={<ProtectedRoute><CodingPlatform /></ProtectedRoute>} />

              <Route path="/technical/modes/:topic" element={<ProtectedRoute><ModeSelection /></ProtectedRoute>} />
              <Route path="/technical/test/:topic/:mode" element={<ProtectedRoute><TestPage /></ProtectedRoute>} />

              {/* Other Main Sections */}
              <Route path="/gd" element={<ProtectedRoute><GD /></ProtectedRoute>} />
              <Route path="/interview" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
              <Route path="/resume-analyzer" element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
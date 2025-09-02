import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Aptitude from "./pages/Aptitude";
import Technical from "./pages/Technical";
import GD from "./pages/GD";
import Interview from "./pages/Interview";
import AptitudeNotes from "./pages/Aptitude/AptitudeNotes";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import TestPage from "./pages/Aptitude/TestPage";
import Dashboard from "./pages/Dashboard";

function AptitudeNotesWrapper() {
  const { section } = useParams();
  return <AptitudeNotes section={section} />;
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isLoggedIn = false;

  return (
    <Router>
      <div className="flex">
        {/* Sidebar - fixed, hidden when closed */}
        <div
          className={`fixed top-0 left-0 h-screen transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-0"
          } overflow-hidden`}
        >
          <Sidebar isOpen={sidebarOpen} />
        </div>

        {/* Main content with dynamic margin */}
        <div
          className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-61"
          }`}
        >
          <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/aptitude"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Aptitude />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/technical"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Technical />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gd"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <GD />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Interview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/aptitude/notes/:section"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <AptitudeNotesWrapper />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/aptitude/test/:topic"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <TestPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Dashboard />
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

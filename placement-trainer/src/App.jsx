import { useState, useEffect, createContext } from "react";
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
import CNotes from "./pages/Technical/CNotes";

// ---- Auth Context ----
export const AuthContext = createContext();

function AptitudeNotesWrapper() {
  const { section } = useParams();
  return <AptitudeNotes section={section} />;
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);

  // Load auth state from localStorage (persist login)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
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

          {/* Main content */}
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

                {/* Protected Routes */}
                <Route
                  path="/aptitude"
                  element={
                    <ProtectedRoute isLoggedIn={!!user}>
                      <Aptitude />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/technical"
                  element={
                    <ProtectedRoute isLoggedIn={!!user}>
                      <Technical />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/gd"
                  element={
                    <ProtectedRoute isLoggedIn={!!user}>
                      <GD />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/interview"
                  element={
                    <ProtectedRoute isLoggedIn={!!user}>
                      <Interview />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/aptitude/notes/:section"
                  element={
                    <ProtectedRoute isLoggedIn={!!user}>
                      <AptitudeNotesWrapper />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/aptitude/test/:topic"
                  element={
                    <ProtectedRoute isLoggedIn={!!user}>
                      <TestPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute isLoggedIn={!!user}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/technical/cnotes"
                  element={
                    <ProtectedRoute isLoggedIn={!!user}>
                      <CNotes />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;

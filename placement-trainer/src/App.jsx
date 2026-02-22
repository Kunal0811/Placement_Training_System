// src/App.jsx
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Aptitude from "./pages/Aptitude.jsx";
import Technical from "./pages/Technical.jsx";
import GD from "./pages/GD.jsx";
import Interview from "./pages/Interview.jsx";
import TestPage from "./pages/Aptitude/TestPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ModuleLock from "./components/ModuleLock.jsx"; // ✅ IMPORTED MODULE LOCK
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPasswordWithOTP from "./pages/auth/ResetPasswordWithOTP.jsx";
import VerifyOTP from "./pages/auth/VerifyOTP.jsx";
import ModeSelection from "./pages/Aptitude/ModeSelection.jsx";
import ResumeAnalyzer from "./pages/ResumeAnalyzer.jsx";
import GDRoom from "./pages/GDRoom.jsx";

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
import CodingLevels from "./pages/Technical/CodingLevels.jsx"; 

// Aptitude Hub Pages
import QuantitativePage from "./pages/Aptitude/QuantitativePage.jsx";
import LogicalPage from "./pages/Aptitude/LogicalPage.jsx";
import VerbalPage from "./pages/Aptitude/VerbalPage.jsx";

// Aptitude Note Pages
import NumberSystemNotes from "./pages/Aptitude/Quant/NumberSystemNotes.jsx";
import PercentagesNotes from "./pages/Aptitude/Quant/PercentagesNotes.jsx";
import ProfitLossNotes from "./pages/Aptitude/Quant/ProfitLossNotes.jsx";
import InterestNotes from "./pages/Aptitude/Quant/InterestNotes.jsx";
import TSDNotes from "./pages/Aptitude/Quant/TSDNotes.jsx";
import RatioNotes from "./pages/Aptitude/Quant/RatioNotes.jsx";
import PermutationNotes from "./pages/Aptitude/Quant/PermutationNotes.jsx";
import GeometryNotes from "./pages/Aptitude/Quant/GeometryNotes.jsx";
import SeriesNotes from "./pages/Aptitude/Logical/SeriesNotes.jsx";
import CodingNotes from "./pages/Aptitude/Logical/CodingNotes.jsx";
import BloodRelationsNotes from "./pages/Aptitude/Logical/BloodRelationsNotes.jsx";
import DirectionSenseNotes from "./pages/Aptitude/Logical/DirectionSenseNotes.jsx";
import GrammarNotes from "./pages/Aptitude/Verbal/GrammarNotes.jsx";
import VocabularyNotes from "./pages/Aptitude/Verbal/VocabularyNotes.jsx";
import ComprehensionNotes from "./pages/Aptitude/Verbal/ComprehensionNotes.jsx";
import Leaderboard from "./pages/Leaderboard.jsx"; // fixed typo here

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router>
      <div className="flex bg-game-bg min-h-screen text-gray-200 font-sans overflow-x-hidden">
        <div
          className={`fixed top-0 left-0 h-screen transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-0"
          } overflow-hidden z-40`}
        >
          <Sidebar isOpen={sidebarOpen} />
        </div>

        <div
          className={`flex-1 min-h-screen flex flex-col min-w-0 transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp/:email" element={<VerifyOTP />} />
              <Route path="/reset-password-otp/:userId" element={<ResetPasswordWithOTP />} />

              {/* Protected Routes - LEVEL 1 (Open to all) */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
              <Route path="/resume-analyzer" element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>} />

              {/* Aptitude Section - LEVEL 1 (Open to all) */}
              <Route path="/aptitude" element={<ProtectedRoute><Aptitude /></ProtectedRoute>} />
              <Route path="/aptitude/quantitative" element={<ProtectedRoute><QuantitativePage /></ProtectedRoute>} />
              <Route path="/aptitude/logical" element={<ProtectedRoute><LogicalPage /></ProtectedRoute>} />
              <Route path="/aptitude/verbal" element={<ProtectedRoute><VerbalPage /></ProtectedRoute>} />
              
              {/* Quant Note Pages */}
              <Route path="/aptitude/quantitative/number-system" element={<ProtectedRoute><NumberSystemNotes /></ProtectedRoute>} />
              <Route path="/aptitude/quantitative/percentages" element={<ProtectedRoute><PercentagesNotes /></ProtectedRoute>} />
              <Route path="/aptitude/quantitative/profit-loss" element={<ProtectedRoute><ProfitLossNotes /></ProtectedRoute>} />
              <Route path="/aptitude/quantitative/interest" element={<ProtectedRoute><InterestNotes /></ProtectedRoute>} />
              <Route path="/aptitude/quantitative/time-speed-distance" element={<ProtectedRoute><TSDNotes /></ProtectedRoute>} />
              <Route path="/aptitude/quantitative/ratio-proportion" element={<ProtectedRoute><RatioNotes /></ProtectedRoute>} />
              <Route path="/aptitude/quantitative/permutation-combination" element={<ProtectedRoute><PermutationNotes /></ProtectedRoute>} />
              <Route path="/aptitude/quantitative/geometry" element={<ProtectedRoute><GeometryNotes /></ProtectedRoute>} />
              
              {/* Logical Note Pages */}
              <Route path="/aptitude/logical/series-patterns" element={<ProtectedRoute><SeriesNotes /></ProtectedRoute>} />
              <Route path="/aptitude/logical/coding-decoding" element={<ProtectedRoute><CodingNotes /></ProtectedRoute>} />
              <Route path="/aptitude/logical/blood-relations" element={<ProtectedRoute><BloodRelationsNotes /></ProtectedRoute>} />
              <Route path="/aptitude/logical/direction-sense" element={<ProtectedRoute><DirectionSenseNotes /></ProtectedRoute>} />

              {/* Verbal Note Pages */}
              <Route path="/aptitude/verbal/grammar" element={<ProtectedRoute><GrammarNotes /></ProtectedRoute>} />
              <Route path="/aptitude/verbal/vocabulary" element={<ProtectedRoute><VocabularyNotes /></ProtectedRoute>} />
              <Route path="/aptitude/verbal/reading-comprehension" element={<ProtectedRoute><ComprehensionNotes /></ProtectedRoute>} />
              
              <Route path="/aptitude/modes/:topic" element={<ProtectedRoute><ModeSelection /></ProtectedRoute>} />
              <Route path="/aptitude/test/:topic/:mode" element={<ProtectedRoute><TestPage /></ProtectedRoute>} />
              
              {/* Technical Section - LEVEL 2 (Requires Level 2) */}
              <Route path="/technical" element={<ProtectedRoute><ModuleLock reqLevel={2} feature="Technical Hub"><Technical /></ModuleLock></ProtectedRoute>} />
              <Route path="/technical/cnotes" element={<ProtectedRoute><ModuleLock reqLevel={2} feature="Technical Hub"><CNotes /></ModuleLock></ProtectedRoute>} />
              <Route path="/technical/cpp" element={<ProtectedRoute><ModuleLock reqLevel={2} feature="Technical Hub"><CppNotes /></ModuleLock></ProtectedRoute>} />
              <Route path="/technical/java" element={<ProtectedRoute><ModuleLock reqLevel={2} feature="Technical Hub"><JavaNotes /></ModuleLock></ProtectedRoute>} />
              <Route path="/technical/python" element={<ProtectedRoute><ModuleLock reqLevel={2} feature="Technical Hub"><PythonNotes /></ModuleLock></ProtectedRoute>} />
              <Route path="/technical/dsa" element={<ProtectedRoute><ModuleLock reqLevel={2} feature="Technical Hub"><DSANotes /></ModuleLock></ProtectedRoute>} />
              <Route path="/technical/dbms" element={<ProtectedRoute><ModuleLock reqLevel={2} feature="Technical Hub"><DBMSNotes /></ModuleLock></ProtectedRoute>} />
              <Route path="/technical/os" element={<ProtectedRoute><ModuleLock reqLevel={2} feature="Technical Hub"><OSNotes /></ModuleLock></ProtectedRoute>} />
              <Route path="/technical/cn" element={<ProtectedRoute><ModuleLock reqLevel={2} feature="Technical Hub"><CNNotes /></ModuleLock></ProtectedRoute>} />
              <Route path="/technical/modes/:topic" element={<ProtectedRoute><ModuleLock reqLevel={2} feature="Technical Hub"><ModeSelection /></ModuleLock></ProtectedRoute>} />
              <Route path="/technical/test/:topic/:mode" element={<ProtectedRoute><ModuleLock reqLevel={2} feature="Technical Hub"><TestPage /></ModuleLock></ProtectedRoute>} />

              {/* Coding Section - LEVEL 3 (Requires Level 3) */}
              <Route path="/coding" element={<ProtectedRoute><ModuleLock reqLevel={3} feature="Coding Arena"><CodingLevels /></ModuleLock></ProtectedRoute>} />
              <Route path="/technical/coding-levels" element={<ProtectedRoute><ModuleLock reqLevel={3} feature="Coding Arena"><CodingLevels /></ModuleLock></ProtectedRoute>} />
              <Route path="/technical/coding-test" element={<ProtectedRoute><ModuleLock reqLevel={3} feature="Coding Arena"><CodingPlatform /></ModuleLock></ProtectedRoute>} />
              <Route path="/technical/coding-test/:difficulty" element={<ProtectedRoute><ModuleLock reqLevel={3} feature="Coding Arena"><CodingPlatform /></ModuleLock></ProtectedRoute>} />

              {/* Interview & GD - LEVEL 4 (Requires Level 4 & Has attempt limits) */}
              <Route path="/interview" element={<ProtectedRoute><ModuleLock reqLevel={4} feature="Mock Interview" limitType="interview"><Interview /></ModuleLock></ProtectedRoute>} />
              <Route path="/gd" element={<ProtectedRoute><ModuleLock reqLevel={4} feature="Group Discussion" limitType="gd"><GD /></ModuleLock></ProtectedRoute>} />
              <Route path="/gd/room/:id" element={<ProtectedRoute><ModuleLock reqLevel={4} feature="Group Discussion" limitType="gd"><GDRoom /></ModuleLock></ProtectedRoute>} />
              
            </Routes>
          </div>
          
          <Footer />

        </div>
      </div>
    </Router>
  );
}

export default App;
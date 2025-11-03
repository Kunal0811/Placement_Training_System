// src/App.jsx
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx"; // <--- 1. IMPORT FOOTER
import Home from "./pages/Home.jsx";
import Aptitude from "./pages/Aptitude.jsx";
import Technical from "./pages/Technical.jsx";
import GD from "./pages/GD.jsx";
import Interview from "./pages/Interview.jsx";
import TestPage from "./pages/Aptitude/TestPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPasswordWithOTP from "./pages/auth/ResetPasswordWithOTP.jsx";
import VerifyOTP from "./pages/auth/VerifyOTP.jsx";
import ModeSelection from "./pages/Aptitude/ModeSelection.jsx";
import ResumeAnalyzer from "./pages/ResumeAnalyzer.jsx";

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

        {/* --- 2. MAKE THIS A FLEX COLUMN --- */}
        <div
          className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          {/* --- 3. THIS DIV NOW HOLDS THE PAGE CONTENT --- */}
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
          
          {/* --- 4. ADD THE FOOTER COMPONENT --- */}
          <Footer />

        </div>
      </div>
    </Router>
  );
}

export default App;
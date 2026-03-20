// src/App.jsx
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Components
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
import ModuleLock from "./components/ModuleLock.jsx"; 
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPasswordWithOTP from "./pages/auth/ResetPasswordWithOTP.jsx";
import VerifyOTP from "./pages/auth/VerifyOTP.jsx";
import ModeSelection from "./pages/Aptitude/ModeSelection.jsx";
import ResumeAnalyzer from "./pages/ResumeAnalyzer.jsx";
import GDRoom from "./pages/GDRoom.jsx";

// NEW: Admin & Test Components
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ScheduledTests from "./pages/ScheduledTests.jsx";

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
import Leaderboard from "./pages/Leaderboard.jsx"; 
import ResourceHub from "./pages/ResourceHub.jsx";

// 🚀 IMPORT ANIMATION COMPONENT
import AnimatedPage from "./animations/AnimatedPage.jsx";
import ScheduledCodingTest from "./pages/ScheduledCodingTest.jsx";

// Create a new inner component to handle the routing and animations
function AnimatedRoutes() {
  const location = useLocation();

  return (
    // AnimatePresence tells React to wait for the exit animation before unmounting the old page
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AnimatedPage><AdminLogin /></AnimatedPage>} />
        <Route path="/admin/dashboard" element={<AnimatedPage><AdminDashboard /></AnimatedPage>} />

        {/* Public Routes */}
        <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
        <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
        <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />
        <Route path="/forgot-password" element={<AnimatedPage><ForgotPassword /></AnimatedPage>} />
        <Route path="/verify-otp/:email" element={<AnimatedPage><VerifyOTP /></AnimatedPage>} />
        <Route path="/reset-password-otp/:userId" element={<AnimatedPage><ResetPasswordWithOTP /></AnimatedPage>} />

        {/* Protected Routes - LEVEL 1 (Open to all) */}
        <Route path="/dashboard" element={<AnimatedPage><ProtectedRoute><Dashboard /></ProtectedRoute></AnimatedPage>} />
        <Route path="/leaderboard" element={<AnimatedPage><ProtectedRoute><Leaderboard /></ProtectedRoute></AnimatedPage>} />
        <Route path="/resume-analyzer" element={<AnimatedPage><ProtectedRoute><ResumeAnalyzer /></ProtectedRoute></AnimatedPage>} />
        <Route path="/tests" element={<AnimatedPage><ProtectedRoute><ScheduledTests /></ProtectedRoute></AnimatedPage>} />

        {/* Aptitude Section - LEVEL 1 (Open to all) */}
        <Route path="/aptitude" element={<AnimatedPage><ProtectedRoute><Aptitude /></ProtectedRoute></AnimatedPage>} />
        <Route path="/aptitude/quantitative" element={<AnimatedPage><ProtectedRoute><QuantitativePage /></ProtectedRoute></AnimatedPage>} />
        <Route path="/aptitude/logical" element={<AnimatedPage><ProtectedRoute><LogicalPage /></ProtectedRoute></AnimatedPage>} />
        <Route path="/aptitude/verbal" element={<AnimatedPage><ProtectedRoute><VerbalPage /></ProtectedRoute></AnimatedPage>} />
        
        {/* Quant Note Pages */}
        <Route path="/aptitude/quantitative/number-system" element={<AnimatedPage><ProtectedRoute><NumberSystemNotes /></ProtectedRoute></AnimatedPage>} />
        <Route path="/aptitude/quantitative/percentages" element={<AnimatedPage><ProtectedRoute><PercentagesNotes /></ProtectedRoute></AnimatedPage>} />
        <Route path="/aptitude/quantitative/profit-loss" element={<AnimatedPage><ProtectedRoute><ProfitLossNotes /></ProtectedRoute></AnimatedPage>} />
        <Route path="/aptitude/quantitative/interest" element={<AnimatedPage><ProtectedRoute><InterestNotes /></ProtectedRoute></AnimatedPage>} />
        <Route path="/aptitude/quantitative/time-speed-distance" element={<AnimatedPage><ProtectedRoute><TSDNotes /></ProtectedRoute></AnimatedPage>} />
        <Route path="/aptitude/quantitative/ratio-proportion" element={<AnimatedPage><ProtectedRoute><RatioNotes /></ProtectedRoute></AnimatedPage>} />
        <Route path="/aptitude/quantitative/permutation-combination" element={<AnimatedPage><ProtectedRoute><PermutationNotes /></ProtectedRoute></AnimatedPage>} />
        <Route path="/aptitude/quantitative/geometry" element={<AnimatedPage><ProtectedRoute><GeometryNotes /></ProtectedRoute></AnimatedPage>} />
        
        {/* Logical Note Pages */}
        <Route path="/aptitude/logical/series-patterns" element={<AnimatedPage><ProtectedRoute><SeriesNotes /></ProtectedRoute></AnimatedPage>} />
        <Route path="/aptitude/logical/coding-decoding" element={<AnimatedPage><ProtectedRoute><CodingNotes /></ProtectedRoute></AnimatedPage>} />
        <Route path="/aptitude/logical/blood-relations" element={<AnimatedPage><ProtectedRoute><BloodRelationsNotes /></ProtectedRoute></AnimatedPage>} />
        <Route path="/aptitude/logical/direction-sense" element={<AnimatedPage><ProtectedRoute><DirectionSenseNotes /></ProtectedRoute></AnimatedPage>} />

        {/* Verbal Note Pages */}
        <Route path="/aptitude/verbal/grammar" element={<AnimatedPage><ProtectedRoute><GrammarNotes /></ProtectedRoute></AnimatedPage>} />
        <Route path="/aptitude/verbal/vocabulary" element={<AnimatedPage><ProtectedRoute><VocabularyNotes /></ProtectedRoute></AnimatedPage>} />
        <Route path="/aptitude/verbal/reading-comprehension" element={<AnimatedPage><ProtectedRoute><ComprehensionNotes /></ProtectedRoute></AnimatedPage>} />
        <Route path="/resources" element={<AnimatedPage><ProtectedRoute><ResourceHub /></ProtectedRoute></AnimatedPage>} />
        
        <Route path="/aptitude/modes/:topic" element={<AnimatedPage><ProtectedRoute><ModeSelection /></ProtectedRoute></AnimatedPage>} />
        <Route path="/aptitude/test/:topic/:mode" element={<AnimatedPage><ProtectedRoute><TestPage /></ProtectedRoute></AnimatedPage>} />
        <Route path="/scheduled-test/:testId" element={<AnimatedPage><ProtectedRoute><TestPage /></ProtectedRoute></AnimatedPage>} />
        
        {/* Technical Section - LEVEL 2 (Requires Level 2) */}
        <Route path="/technical" element={<AnimatedPage><ProtectedRoute><ModuleLock reqLevel={1} feature="Technical Hub"><Technical /></ModuleLock></ProtectedRoute></AnimatedPage>} />
        <Route path="/technical/cnotes" element={<AnimatedPage><ProtectedRoute><ModuleLock reqLevel={1} feature="Technical Hub"><CNotes /></ModuleLock></ProtectedRoute></AnimatedPage>} />
        <Route path="/technical/cpp" element={<AnimatedPage><ProtectedRoute><ModuleLock reqLevel={1} feature="Technical Hub"><CppNotes /></ModuleLock></ProtectedRoute></AnimatedPage>} />
        <Route path="/technical/java" element={<AnimatedPage><ProtectedRoute><ModuleLock reqLevel={1} feature="Technical Hub"><JavaNotes /></ModuleLock></ProtectedRoute></AnimatedPage>} />
        <Route path="/technical/python" element={<AnimatedPage><ProtectedRoute><ModuleLock reqLevel={1} feature="Technical Hub"><PythonNotes /></ModuleLock></ProtectedRoute></AnimatedPage>} />
        <Route path="/technical/dsa" element={<AnimatedPage><ProtectedRoute><ModuleLock reqLevel={1} feature="Technical Hub"><DSANotes /></ModuleLock></ProtectedRoute></AnimatedPage>} />
        <Route path="/technical/dbms" element={<AnimatedPage><ProtectedRoute><ModuleLock reqLevel={1} feature="Technical Hub"><DBMSNotes /></ModuleLock></ProtectedRoute></AnimatedPage>} />
        <Route path="/technical/os" element={<AnimatedPage><ProtectedRoute><ModuleLock reqLevel={1} feature="Technical Hub"><OSNotes /></ModuleLock></ProtectedRoute></AnimatedPage>} />
        <Route path="/technical/cn" element={<AnimatedPage><ProtectedRoute><ModuleLock reqLevel={1} feature="Technical Hub"><CNNotes /></ModuleLock></ProtectedRoute></AnimatedPage>} />
        <Route path="/technical/modes/:topic" element={<AnimatedPage><ProtectedRoute><ModuleLock reqLevel={1} feature="Technical Hub"><ModeSelection /></ModuleLock></ProtectedRoute></AnimatedPage>} />
        <Route path="/technical/test/:topic/:mode" element={<AnimatedPage><ProtectedRoute><ModuleLock reqLevel={1} feature="Technical Hub"><TestPage /></ModuleLock></ProtectedRoute></AnimatedPage>} />

        {/* Coding Section - LEVEL 3 (Requires Level 3) */}
        <Route path="/coding" element={<AnimatedPage><ProtectedRoute><ModuleLock reqLevel={1} feature="Coding Arena"><CodingLevels /></ModuleLock></ProtectedRoute></AnimatedPage>} />
        <Route path="/technical/coding-levels" element={<AnimatedPage><ProtectedRoute><ModuleLock reqLevel={1} feature="Coding Arena"><CodingLevels /></ModuleLock></ProtectedRoute></AnimatedPage>} />
        <Route path="/technical/coding-test" element={<AnimatedPage><ProtectedRoute><ModuleLock reqLevel={1} feature="Coding Arena"><CodingPlatform /></ModuleLock></ProtectedRoute></AnimatedPage>} />
        <Route path="/technical/coding-test/:difficulty" element={<AnimatedPage><ProtectedRoute><ModuleLock reqLevel={1} feature="Coding Arena"><CodingPlatform /></ModuleLock></ProtectedRoute></AnimatedPage>} />
        <Route path="/scheduled-test/:testId" element={<AnimatedPage><ProtectedRoute><TestPage /></ProtectedRoute></AnimatedPage>} />
{/* Add this line: */}
<Route path="/scheduled-coding-test/:testId" element={<AnimatedPage><ProtectedRoute><ScheduledCodingTest /></ProtectedRoute></AnimatedPage>} />

        {/* Interview & GD - LEVEL 4 (Requires Level 4 & Has attempt limits) */}
        <Route path="/interview" element={<AnimatedPage><ProtectedRoute><ModuleLock reqLevel={1} feature="Mock Interview" limitType="interview"><Interview /></ModuleLock></ProtectedRoute></AnimatedPage>} />
        <Route path="/gd" element={<AnimatedPage><ProtectedRoute><ModuleLock reqLevel={1} feature="Group Discussion" limitType="gd"><GD /></ModuleLock></ProtectedRoute></AnimatedPage>} />
        <Route path="/gd/room/:id" element={<AnimatedPage><ProtectedRoute><ModuleLock reqLevel={1} feature="Group Discussion" limitType="gd"><GDRoom /></ModuleLock></ProtectedRoute></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
}

// ----------------------------------------------------
// THE FIX: AppLayout conditionally removes the student sidebar!
// ----------------------------------------------------
function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  
  // Check if we are currently on an admin page
  const isAdminRoute = location.pathname.startsWith('/admin');
  const showSidebar = !isAdminRoute && sidebarOpen;

  return (
    <div className="flex bg-game-bg min-h-screen text-gray-200 font-sans overflow-x-hidden">
      
      {/* Hide the student sidebar entirely if on admin route */}
      {!isAdminRoute && (
        <div className={`fixed top-0 left-0 h-screen transition-all duration-300 ${showSidebar ? "w-64" : "w-0"} overflow-hidden z-40`}>
          <Sidebar isOpen={showSidebar} />
        </div>
      )}

      {/* Remove the left margin if on an admin route so it takes full width */}
      <div className={`flex-1 min-h-screen flex flex-col min-w-0 transition-all duration-300 ${showSidebar ? "ml-64" : "ml-0"}`}>
        
        {/* FIX: Only show the global Navbar for Students, NOT Admins! */}
        {!isAdminRoute && <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />}

        <div className={`flex-1 overflow-y-auto overflow-x-hidden ${isAdminRoute ? "p-0" : "p-4"}`}>
          <AnimatedRoutes />
        </div>
        
        {!isAdminRoute && <Footer />}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
// src/App.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {
  FiX,
  FiUser,
  FiUsers,
  FiSettings,
  FiMenu,
  FiChevronLeft,
  FiChevronRight,
  FiHome,
  FiBell,
  FiAward,
  FiCalendar,

} from "react-icons/fi";
import { motion } from "framer-motion";

import Login from "./pages/Login";
import Register from "./pages/Register";
import DonorPage from "./pages/DonorPage";
import VolunteerPage from "./pages/VolunteerPage";
import AdminPage from "./pages/AdminPage";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DonationDetails from "./pages/DonationDetails";
import { logout } from "./components/logout";
import Footer from "./pages/Footer";

// ---------------- Dummy News Data ----------------
const newsItems = [
  "🚀 NGO Portal launched successfully!",
  "💉 Blood Donation Camp on Oct 15th.",
  "🙌 50+ Volunteers joined this week!",
  "🎉 Thanks to our Supporters for making a difference!",
];

// ---------------- Sidebar ----------------
function Sidebar({
  menuOpen,
  setMenuOpen,
  user,
  handleLogout,
  sidebarCollapsed,
}) {
  const navigate = useNavigate();

  // Close sidebar when clicking outside (only matters for mobile overlay)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && !e.target.closest(".sidebar-content")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, setMenuOpen]);

  // helper to close mobile menu when navigating
  const handleNavClick = (to) => {
    navigate(to);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 ${
          sidebarCollapsed ? "md:w-20" : "md:w-64"
        } bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-lg shadow-2xl border-r border-blue-700/30 z-50 transform transition-all duration-300 ease-in-out
                    ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:flex md:flex-col md:h-screen md:flex-shrink-0`}
      >
        <div className="flex flex-col h-full overflow-hidden sidebar-content">
          {/* Close button for mobile */}
          <div className="flex justify-between items-center p-4 md:hidden flex-shrink-0 border-b border-blue-700/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg">
                N
              </div>
              <span className="font-bold text-cyan-300">NGO Portal</span>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-gray-300 hover:text-cyan-300 text-xl transition-colors p-2 hover:bg-blue-700/30 rounded-lg"
              aria-label="Close menu"
            >
              <FiX />
            </button>
          </div>

          {/* Branding for desktop */}
          <div
            className={`hidden md:flex items-center gap-3 p-4 border-b border-blue-700/30 ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
              N
            </div>
            <div
              className={`transition-all duration-300 overflow-hidden ${
                sidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              }`}
            >
              <h1 className="font-bold text-white text-lg">NGO Portal</h1>
              <p className="text-xs text-cyan-200/80">Making a difference</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-grow p-4 flex flex-col gap-2 mt-2 overflow-y-auto">
            <Link
              to="/"
              title="Home"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group hover:bg-blue-700/30 hover:border-cyan-400/30 border border-transparent ${
                sidebarCollapsed ? "justify-center" : "justify-start"
              }`}
              onClick={() => handleNavClick("/")}
            >
              <FiHome className="text-cyan-200 group-hover:text-cyan-300 text-xl transition-colors" />
              <span
                className={`font-medium text-cyan-100 group-hover:text-cyan-300 transition-all duration-300 ${
                  sidebarCollapsed ? "hidden" : "block"
                }`}
              >
                Home
              </span>
            </Link>

            <Link
              to="/donor"
              title="Donor"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group hover:bg-blue-700/30 hover:border-cyan-400/30 border border-transparent ${
                sidebarCollapsed ? "justify-center" : "justify-start"
              }`}
              onClick={() => handleNavClick("/donor")}
            >
              <FiUser className="text-cyan-200 group-hover:text-cyan-300 text-xl transition-colors" />
              <span
                className={`font-medium text-cyan-100 group-hover:text-cyan-300 transition-all duration-300 ${
                  sidebarCollapsed ? "hidden" : "block"
                }`}
              >
                Donor
              </span>
            </Link>

            <Link
              to="/volunteer"
              title="Volunteer"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group hover:bg-blue-700/30 hover:border-cyan-400/30 border border-transparent ${
                sidebarCollapsed ? "justify-center" : "justify-start"
              }`}
              onClick={() => handleNavClick("/volunteer")}
            >
              <FiUsers className="text-cyan-200 group-hover:text-cyan-300 text-xl transition-colors" />
              <span
                className={`font-medium text-cyan-100 group-hover:text-cyan-300 transition-all duration-300 ${
                  sidebarCollapsed ? "hidden" : "block"
                }`}
              >
                Volunteer
              </span>
            </Link>

            <Link
              to="/admin"
              title="Admin"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group hover:bg-blue-700/30 hover:border-cyan-400/30 border border-transparent ${
                sidebarCollapsed ? "justify-center" : "justify-start"
              }`}
              onClick={() => handleNavClick("/admin")}
            >
              <FiSettings className="text-cyan-200 group-hover:text-cyan-300 text-xl transition-colors" />
              <span
                className={`font-medium text-cyan-100 group-hover:text-cyan-300 transition-all duration-300 ${
                  sidebarCollapsed ? "hidden" : "block"
                }`}
              >
                Admin
              </span>
            </Link>

            {/* Events */}
            <Link
              to="/events"
              title="Events"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group hover:bg-blue-700/30 hover:border-cyan-400/30 border border-transparent ${
                sidebarCollapsed ? "justify-center" : "justify-start"
              }`}
              onClick={() => handleNavClick("/events")}
            >
              <FiCalendar className="text-cyan-200 group-hover:text-cyan-300 text-xl transition-colors" />
              <span
                className={`font-medium text-cyan-100 group-hover:text-cyan-300 transition-all duration-300 ${
                  sidebarCollapsed ? "hidden" : "block"
                }`}
              >
                Events
              </span>
            </Link>

            {/* Achievements */}
            <Link
              to="/achievements"
              title="Achievements"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group hover:bg-blue-700/30 hover:border-cyan-400/30 border border-transparent ${
                sidebarCollapsed ? "justify-center" : "justify-start"
              }`}
              onClick={() => handleNavClick("/achievements")}
            >
              <FiAward className="text-cyan-200 group-hover:text-cyan-300 text-xl transition-colors" />
              <span
                className={`font-medium text-cyan-100 group-hover:text-cyan-300 transition-all duration-300 ${
                  sidebarCollapsed ? "hidden" : "block"
                }`}
              >
                Achievements
              </span>
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="p-4 border-t border-blue-700/30 mt-auto flex-shrink-0 bg-blue-900/30">
            {user ? (
              <div className={`${sidebarCollapsed ? "text-center" : ""}`}>
                <div
                  className={`flex items-center gap-3 mb-3 ${
                    sidebarCollapsed ? "justify-center" : ""
                  }`}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      sidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                    }`}
                  >
                    <p className="font-semibold text-white text-sm">
                      {user.name}
                    </p>
                    <p className="text-xs text-cyan-200/80">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium text-sm hover:scale-105 transform"
                >
                  {sidebarCollapsed ? "Logout" : "Sign Out"}
                </button>
              </div>
            ) : (
              <div
                className={`flex flex-col gap-2 ${
                  sidebarCollapsed ? "items-center" : ""
                }`}
              >
                <button
                  onClick={() => {
                    navigate("/login");
                    setMenuOpen(false);
                  }}
                  className={`text-cyan-300 font-medium border border-cyan-400/50 py-2.5 rounded-xl hover:bg-cyan-400/10 transition-all duration-300 text-sm ${
                    sidebarCollapsed ? "px-3" : "w-full"
                  }`}
                >
                  {sidebarCollapsed ? "Login" : "Sign In"}
                </button>
                <button
                  onClick={() => {
                    navigate("/signup");
                    setMenuOpen(false);
                  }}
                  className={`bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium text-sm hover:scale-105 transform ${
                    sidebarCollapsed ? "px-3" : "w-full"
                  }`}
                >
                  {sidebarCollapsed ? "Join" : "Sign Up"}
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

// ---------------- Layout ----------------
function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      const val = localStorage.getItem("sidebarCollapsed");
      return val ? JSON.parse(val) : false;
    } catch {
      return false;
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed));
    } catch {}
  }, [sidebarCollapsed]);

  const handleLogout = () => {
    logout(navigate);
    setUser(null);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50/30">
      <div className="flex flex-col md:flex-row min-h-screen w-full">
        {/* Sidebar */}
        <div
          className={`${
            sidebarCollapsed ? "md:w-20" : "md:w-64"
          } flex-shrink-0 transition-all duration-300`}
        >
          <Sidebar
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            user={user}
            handleLogout={handleLogout}
            sidebarCollapsed={sidebarCollapsed}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 w-full h-screen overflow-hidden">
          {/* Header - No extra margins */}
          <header
            className={`fixed top-0 right-0 left-0 bg-white/95 backdrop-blur-lg shadow-lg z-40 flex items-center px-6 py-3 border-b border-blue-200 transition-all duration-300 ${
              sidebarCollapsed ? "md:left-20" : "md:left-64"
            }`}
          >
            {/* Mobile Menu */}
            <button
              onClick={() => setMenuOpen(true)}
              className="text-2xl text-blue-600 md:hidden mr-4 p-2 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <FiMenu />
            </button>

            {/* Desktop Toggle */}
            <button
              onClick={() => setSidebarCollapsed((s) => !s)}
              className="hidden md:flex items-center justify-center p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors mr-4"
              aria-label={sidebarCollapsed ? "Open sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
            </button>

            {/* Page Title Section */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
              >
                <div className="relative">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Welcome{user ? `, ${user.name}` : ""}
                  </h1>
                  <p className="text-slate-600 text-sm mt-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></span>
                    Making a positive impact together
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Announcements & User Info */}
            <div className="flex items-center gap-4">
              {/* Enhanced Announcements Badge */}
              <motion.div 
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-white to-blue-50/80 border border-blue-200/60 rounded-xl px-3 py-2 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group backdrop-blur-sm"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative">
                  <FiBell className="text-blue-600 text-base" />
                  <motion.span 
                    className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-cyan-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-blue-700 group-hover:text-blue-800 transition-colors">
                    Updates
                  </span>
                </div>
              </motion.div>

              {/* Enhanced User Info */}
              <motion.div 
                className="flex items-center gap-3 group cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                {user && (
                  <motion.div 
                    className="text-right hidden sm:block"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <p className="font-bold text-slate-800 text-sm group-hover:text-slate-900">
                      {user.name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        user.role === 'admin' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                        user.role === 'donor' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                        'bg-gradient-to-r from-blue-500 to-cyan-500'
                      }`} />
                      <p className="text-xs text-slate-500 capitalize font-medium">
                        {user.role}
                      </p>
                    </div>
                  </motion.div>
                )}
                
                {/* Enhanced Avatar */}
                <motion.div 
                  className="relative group"
                  whileHover={{ rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/25 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all duration-300">
                    {user ? user.name?.charAt(0).toUpperCase() : 'G'}
                  </div>
                  
                  {/* Online indicator */}
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
                </motion.div>
              </motion.div>
            </div>
          </header>

          {/* Announcements Section - Reduced height */}
          <div
            className={`fixed top-12 md:top-12 right-0 left-0 bg-gradient-to-r from-blue-50/90 to-cyan-50/90 border-b border-blue-100 backdrop-blur-sm z-30 transition-all duration-300 ${
              sidebarCollapsed ? "md:left-20" : "md:left-64"
            }`}
          >
            <div className="px-6 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-x-auto">
                  {newsItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-xs text-blue-700 whitespace-nowrap"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="hidden md:flex items-center gap-1 text-xs text-blue-600">
                  <FiBell className="text-blue-500 text-xs" />
                  <span>Announcements</span>
                </div>
              </div>
            </div>
          </div>

          {/* Page Content - Adjusted padding to remove extra space */}
          <main className="flex-1 p-4 pt-20 md:pt-16 overflow-y-auto w-full">
            <div className="w-full max-w-full">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Register />} />
                <Route
                  path="/donor"
                  element={
                    <ProtectedRoute allowedRoles={["donor"]}>
                      <DonorPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/volunteer"
                  element={
                    <ProtectedRoute allowedRoles={["volunteer"]}>
                      <VolunteerPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Footer />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// ---------------- APP ----------------
export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import { logOut } from "../firebase/auth";
import { useState } from "react";
import {
  Home,
  MapPin,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  HelpCircle,
  Settings,
  Shield,
  TrendingUp,
  Globe,
  MessageSquare,
  BookOpen,
} from "lucide-react";

const Navbar = () => {
  const { currentUser, userRole } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: "Home", icon: Home, path: "/", isScroll: false },
    { name: "Campus Map", icon: MapPin, path: "/map", isScroll: false },
    { name: "Dashboard", icon: User, path: "/dashboard", isScroll: false },
  ];

  return (
    <>
      <nav
        className={`backdrop-blur-lg border-b sticky top-0 z-50 transition-colors duration-300 ${
          isDark
            ? "bg-gray-900/90 border-gray-800/50"
            : "bg-white/90 border-gray-200/50"
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div
                className="cursor-pointer flex items-center space-x-3 group"
                onClick={() => navigate("/")}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <h1
                    className={`text-2xl font-bold transition-colors duration-300 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    CivicFlow
                  </h1>
                  <div
                    className={`text-xs -mt-1 transition-colors duration-300 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Campus Management Platform
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() =>
                    item.isScroll
                      ? scrollToSection(item.path)
                      : navigate(item.path)
                  }
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    location.pathname === item.path
                      ? isDark
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30"
                        : "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-gray-900 border border-blue-500/20"
                      : isDark
                      ? "text-gray-300 hover:text-white hover:bg-gray-800/50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>

            {/* Right side - User Actions */}
            <div className="flex items-center space-x-3">
              {/* User Profile / Auth Buttons */}
              {currentUser ? (
                <div className="flex items-center space-x-3">
                  <div
                    className={`flex items-center space-x-3 px-4 py-2 rounded-xl border transition-all duration-300 ${
                      isDark
                        ? "bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700"
                        : "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300"
                    }`}
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="text-left hidden lg:block">
                      <div className="text-sm font-medium text-white">
                        {currentUser.email?.split("@")[0] || "User"}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            userRole === "admin"
                              ? "bg-purple-600/20 text-purple-300"
                              : "bg-blue-600/20 text-blue-300"
                          }`}
                        >
                          {userRole === "admin" ? "Administrator" : "Student"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className={`p-2 rounded-lg transition-colors duration-300 ${
                      isDark
                        ? "hover:bg-red-500/10 text-red-400 hover:text-red-300"
                        : "hover:bg-red-500/10 text-red-500 hover:text-red-600"
                    }`}
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => navigate("/login")}
                    className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 border border-gray-700 transition-all duration-300"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-6 py-2.5 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-all duration-300"
                  >
                    Get Started
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-400" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed inset-x-0 top-20 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 transition-all duration-300 ${
            isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  item.isScroll
                    ? scrollToSection(item.path)
                    : navigate(item.path);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}

            {!currentUser && (
              <>
                <div className="border-t border-gray-800 my-2"></div>
                <button
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-center px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate("/signup");
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-center px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium"
                >
                  Sign Up Free
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Status Bar */}
      <div className="bg-gray-900/60 backdrop-blur-sm border-b border-gray-800/50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-8 text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-gray-400">System Status: </span>
                <span className="text-green-400 font-medium">
                  All Systems Operational
                </span>
              </div>
              <span className="text-gray-600 hidden md:inline">|</span>
              <div className="hidden md:flex items-center space-x-2">
                <Globe className="w-3 h-3 text-gray-400" />
                <span className="text-gray-400">24/7 Campus Support</span>
              </div>
            </div>
            <div className="text-gray-500">Last updated: Just now</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

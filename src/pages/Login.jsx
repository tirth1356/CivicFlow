import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../firebase/auth";
import { getTotalUserCount } from "../firebase/firestore";
import { motion } from "framer-motion";
import {
  LogIn,
  Mail,
  Lock,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  University,
  UserCheck,
  Sparkles,
} from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userCount, setUserCount] = useState("0");
  const navigate = useNavigate();

  // Clear form fields and fetch user count when component mounts
  useEffect(() => {
    setEmail("");
    setPassword("");
    setError("");
    
    // Fetch total user count
    const fetchUserCount = async () => {
      try {
        const count = await getTotalUserCount();
        setUserCount(count > 0 ? `${count}` : "0");
      } catch (error) {
        console.error('Error fetching user count:', error);
        setUserCount("0");
      }
    };
    
    fetchUserCount();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { user } = await signIn(email, password);
      
      // Check if email is verified
      if (!user.emailVerified) {
        navigate("/verify-email");
        return;
      }
      
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full bg-blue-400/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
        
        {/* Gradient orbs */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className={`absolute rounded-full blur-3xl ${
              i === 0 ? 'bg-blue-500/20 w-96 h-96' :
              i === 1 ? 'bg-purple-500/20 w-80 h-80' :
              'bg-cyan-500/20 w-72 h-72'
            }`}
            style={{
              left: `${20 + i * 30}%`,
              top: `${10 + i * 25}%`,
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400">
            Sign in to your Nirma University account
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl p-8"
        >
          {/* Campus Badge */}
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30">
            <University className="w-4 h-4 mr-2 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">
              Nirma University Access Only
            </span>
          </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4"
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-300 text-sm font-medium">
                <Mail className="w-4 h-4 mr-2" />
                Nirma University Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-12 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  placeholder="username@nirmauni.ac.in"
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>
              <div className="mt-2">
                <span className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 inline-flex items-center">
                  <Shield className="w-3 h-3 mr-1.5" />
                  Only @nirmauni.ac.in emails accepted
                </span>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-300 text-sm font-medium">
                <Lock className="w-4 h-4 mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-12 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-semibold text-lg shadow-lg shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-3" />
                  Sign In
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900/60 text-gray-500">
                  Secure Campus Access
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { value: userCount, label: "Total Users", icon: UserCheck },
                { value: "24/7", label: "Support", icon: Sparkles },
                { value: "99%", label: "Uptime", icon: Shield },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-gray-800/30 border border-gray-700/30"
                >
                  <div className="text-lg font-bold text-blue-400">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </form>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-gray-800/50">
            <p className="text-center text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors"
              >
                Create Nirma University account
              </Link>
            </p>
            <p className="text-center text-gray-500 text-xs mt-3">
              Restricted to verified @nirmauni.ac.in email addresses only
            </p>
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 flex items-center justify-center space-x-2 text-gray-500 text-sm"
        >
          <Shield className="w-4 h-4" />
          <span>Protected by end-to-end encryption</span>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

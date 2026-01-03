import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllIssues } from "../firebase/firestore";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useState, useEffect } from "react";
import {
  MapPin,
  Users,
  Shield,
  Zap,
  BarChart,
  Smartphone,
  Navigation,
  CheckCircle,
} from "lucide-react";

import LightRays from '../components/LightRays';

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [activeMapPoint, setActiveMapPoint] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);

  // Fetch resolved issues count
  useEffect(() => {
    const unsubscribe = getAllIssues(
      (snapshot) => {
        if (!snapshot.empty) {
          const issues = snapshot.docs.map(doc => doc.data());
          const resolved = issues.filter(issue => issue.status === "Resolved").length;
          setResolvedCount(resolved);
        }
      },
      (error) => {
        console.error("Error fetching issues:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const mapPoints = [
    { id: 1, label: "Library", issues: 3, x: 20, y: 30, color: "bg-blue-500" },
    {
      id: 2,
      label: "Main Hall",
      issues: 1,
      x: 60,
      y: 45,
      color: "bg-green-500",
    },
    {
      id: 3,
      label: "Science Block",
      issues: 5,
      x: 40,
      y: 70,
      color: "bg-yellow-500",
    },
    {
      id: 4,
      label: "Sports Complex",
      issues: 2,
      x: 75,
      y: 60,
      color: "bg-purple-500",
    },
    { id: 5, label: "Cafeteria", issues: 4, x: 30, y: 55, color: "bg-red-500" },
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure Authentication",
      desc: "Campus email verification ensures authorized access only",
    },
    {
      icon: MapPin,
      title: "Location-Based Reporting",
      desc: "Precise mapping across all campus facilities",
    },
    {
      icon: Zap,
      title: "Real-Time Tracking",
      desc: "Instant updates and status notifications",
    },
    {
      icon: Users,
      title: "Role-Based Access",
      desc: "Separate dashboards for students and admins",
    },
    {
      icon: Smartphone,
      title: "Responsive Design",
      desc: "Seamless experience across all devices",
    },
    {
      icon: BarChart,
      title: "Analytics Dashboard",
      desc: "Comprehensive insights and reporting",
    },
  ];

  const steps = [
    {
      number: 1,
      title: "Sign Up",
      desc: "Verify with campus email",
      color: "bg-blue-500",
    },
    {
      number: 2,
      title: "Report Issue",
      desc: "Submit detailed reports with photos",
      color: "bg-green-500",
    },
    {
      number: 3,
      title: "Track Progress",
      desc: "Real-time status updates",
      color: "bg-purple-500",
    },
    {
      number: 4,
      title: "Resolution",
      desc: "Get notified when resolved",
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white overflow-hidden">
      {/* HERO SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900/20 via-gray-900 to-purple-900/20 py-20 md:py-32">
        <div className="absolute inset-0 z-0">
          <LightRays
            raysOrigin="top-center"
            raysColor="#00ffff"
            raysSpeed={1.5}
            lightSpread={0.8}
            rayLength={1.2}
            followMouse={true}
            mouseInfluence={0.3}
            noiseAmount={0.1}
            distortion={0.05}
            className="custom-rays"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-6">
                  <Navigation className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">
                    Campus Issue Reporting System
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 text-blue-400">
                  CivicFlow
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                  Transforming campus management through intelligent issue
                  reporting, real-time tracking, and data-driven insights for a
                  better campus experience.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      currentUser ? navigate("/dashboard") : navigate("/signup")
                    }
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base lg:text-lg font-semibold shadow-lg transition-all duration-300"
                  >
                    {currentUser ? "Go to Dashboard" : "Get Started Free"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (currentUser) {
                        navigate("/map");
                      } else {
                        navigate("/auth");
                      }
                    }}
                    className="w-full sm:w-auto border-2 border-gray-600 hover:border-blue-500 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base lg:text-lg font-semibold hover:bg-gray-800/50 backdrop-blur-sm transition-all duration-300"
                  >
                    <span className="flex items-center justify-center">
                      <MapPin className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                      {currentUser ? "View Campus Map" : "Login to View Map"}
                    </span>
                  </motion.button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mt-12 max-w-md mx-auto">
                  {[
                    { value: resolvedCount > 0 ? `${resolvedCount}` : "0", label: "Issues Resolved" },
                    { value: "24/7", label: "Support" },
                    { value: "99%", label: "Satisfaction" },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="text-center"
                    >
                      <div className="text-2xl font-bold text-blue-400">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Designed to streamline campus issue management with cutting-edge
              technology
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => {
              const [isHovered, setIsHovered] = useState(false);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                  className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-4 sm:p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                    isHovered
                      ? "border-blue-500/50 shadow-lg shadow-blue-500/10 scale-[1.02]"
                      : "border-gray-700/50"
                  } backdrop-blur-sm`}
                  animate={{
                    scale: isHovered ? [1.02, 1.05, 1.02] : [1],
                    y: isHovered ? [0, -5, 0] : [0],
                    rotateY: isHovered ? [0, 2, -2, 0] : [0],
                  }}
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <motion.div
                      className={`p-2 sm:p-3 rounded-lg transition-all duration-300 ${
                        isHovered
                          ? "bg-blue-500/20"
                          : "bg-gray-800"
                      }`}
                      animate={{
                        scale: isHovered ? [1, 1.2, 1.1] : [1],
                        rotate: isHovered ? [0, 10, -10, 0] : [0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <feature.icon
                        className={`w-5 sm:w-6 h-5 sm:h-6 transition-colors duration-300 ${
                          isHovered
                            ? "text-blue-400"
                            : "text-gray-400"
                        }`}
                      />
                    </motion.div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-400">{feature.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div
        id="how-it-works"
        className="py-20 bg-gradient-to-b from-gray-900 to-gray-950"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 text-lg">
              Four simple steps to resolve campus issues
            </p>
          </motion.div>

          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-700 to-transparent hidden md:block" />

            <div className="grid md:grid-cols-4 gap-8 relative">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="text-center relative"
                >
                  <div className="relative inline-block">
                    <div
                      className={`${step.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold relative z-10`}
                    >
                      {step.number}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-10 left-full w-12 h-0.5 bg-gradient-to-r from-gray-600 to-transparent" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900/50 border-t border-gray-800 py-12 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="text-center lg:text-left mb-8 lg:mb-0">
              <h3 className="text-2xl font-bold text-blue-400 mb-4">
                CivicFlow
              </h3>
              <p className="text-gray-400 max-w-md">
                The intelligent campus management platform connecting students,
                faculty, and administration through seamless issue reporting and
                resolution.
              </p>
            </div>

            <div className="text-center lg:text-right">
              <p className="text-gray-400 mb-4">
                Made with ❤️ by Team Catalyst
              </p>
              <div className="flex flex-wrap justify-center lg:justify-end gap-4 text-gray-500 mb-4">
                <span className="text-gray-300">Divy Mevada</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-300">Tirth Patel</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-300">Yatri Patel</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-300">Kushal Vanjara</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>
              © 2025 CivicFlow  | Designed for educational
              institutions worldwide 
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

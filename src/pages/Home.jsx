import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [activeMapPoint, setActiveMapPoint] = useState(0);

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

  const AnimatedMapBackground = () => {
    const rotateX = useTransform(mouseY, [-300, 300], [8, -8]);
    const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);
    const dotX = useTransform(mouseX, [-300, 300], [0, 100]);
    const dotY = useTransform(mouseY, [-300, 300], [0, 100]);

    return (
      <motion.div
        style={{ rotateX, rotateY }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        {/* Animated Grid */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`grid-v-${i}`}
              className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-400/20 to-transparent"
              style={{ left: `${i * 7}%` }}
              animate={{
                opacity: [0.1, 0.4, 0.1],
                scaleY: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`grid-h-${i}`}
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent"
              style={{ top: `${i * 8}%` }}
              animate={{
                opacity: [0.1, 0.4, 0.1],
                scaleX: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>

        {/* Floating Icons */}
        {[
          { Icon: MapPin, x: 15, y: 20, color: "text-blue-400", delay: 0 },
          { Icon: Users, x: 75, y: 25, color: "text-green-400", delay: 0.5 },
          { Icon: Shield, x: 25, y: 70, color: "text-purple-400", delay: 1 },
          { Icon: Zap, x: 80, y: 75, color: "text-yellow-400", delay: 1.5 },
          { Icon: BarChart, x: 60, y: 15, color: "text-pink-400", delay: 2 },
          { Icon: CheckCircle, x: 10, y: 50, color: "text-emerald-400", delay: 2.5 },
        ].map(({ Icon, x, y, color, delay }, i) => (
          <motion.div
            key={`icon-${i}`}
            className={`absolute ${color} cursor-pointer`}
            style={{ left: `${x}%`, top: `${y}%` }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8],
              opacity: [0.3, 0.8, 0.3],
            }}
            whileHover={{
              rotate: 360,
              scale: 1.5,
              transition: { duration: 0.6 }
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay,
              ease: "easeInOut",
            }}
          >
            <Icon className="w-6 h-6" />
          </motion.div>
        ))}

        {/* Interactive Connection Lines */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Dynamic Connection Paths */}
          {mapPoints.map((point, index) => {
            const nextPoint = mapPoints[(index + 1) % mapPoints.length];
            return (
              <motion.path
                key={`path-${index}`}
                d={`M ${point.x * 5} ${point.y * 4} Q ${
                  ((point.x + nextPoint.x) / 2) * 5
                } ${point.y * 4 - 30}, ${nextPoint.x * 5} ${nextPoint.y * 4}`}
                fill="none"
                stroke="url(#pathGradient)"
                strokeWidth="2"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: [0, 1, 0], 
                  opacity: [0, 0.8, 0] 
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  delay: index * 0.5 
                }}
              />
            );
          })}
        </svg>

        {/* Interactive Map Points */}
        {mapPoints.map((point) => (
          <motion.div
            key={point.id}
            className={`absolute ${point.color} w-4 h-4 rounded-full cursor-pointer z-20 shadow-lg`}
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
            }}
            animate={{
              scale: [1, 1.8, 1],
              boxShadow: [
                `0 0 0 0 ${point.color.replace("bg-", "rgba(").replace("-500", ", 0.4)")}`,
                `0 0 0 15px ${point.color.replace("bg-", "rgba(").replace("-500", ", 0)")}`,
              ],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: point.id * 0.4,
            }}
            onMouseEnter={() => setActiveMapPoint(point.id)}
            onMouseLeave={() => setActiveMapPoint(0)}
          >
            <AnimatePresence>
              {activeMapPoint === point.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-xl whitespace-nowrap border border-gray-700/50 shadow-xl"
                >
                  <p className="text-sm font-semibold text-white">{point.label}</p>
                  <p className="text-xs text-gray-300">
                    {point.issues} active issues
                  </p>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45 border-r border-b border-gray-700/50"></div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {/* Floating Geometric Shapes */}
        {[
          { shape: "circle", x: 20, y: 30, size: 60, color: "bg-blue-500/10", delay: 0 },
          { shape: "square", x: 70, y: 20, size: 40, color: "bg-purple-500/10", delay: 1 },
          { shape: "triangle", x: 30, y: 80, size: 50, color: "bg-green-500/10", delay: 2 },
          { shape: "circle", x: 85, y: 60, size: 35, color: "bg-yellow-500/10", delay: 3 },
        ].map((shape, i) => (
          <motion.div
            key={`shape-${i}`}
            className={`absolute ${shape.color} backdrop-blur-sm border border-white/10 cursor-pointer`}
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              borderRadius: shape.shape === "circle" ? "50%" : shape.shape === "triangle" ? "0" : "12px",
              clipPath: shape.shape === "triangle" ? "polygon(50% 0%, 0% 100%, 100% 100%)" : "none",
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
              scale: [0.8, 1.1, 0.8],
              opacity: [0.2, 0.6, 0.2],
            }}
            whileHover={{
              rotate: 720,
              scale: 1.3,
              transition: { duration: 0.8 }
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: shape.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Mouse-Following Interactive Dots */}
        {[...Array(8)].map((_, i) => {
          const delay = i * 0.1;
          const offsetX = useTransform(dotX, [0, 100], [i * 15, 100 - i * 10]);
          const offsetY = useTransform(dotY, [0, 100], [i * 12, 100 - i * 8]);
          
          return (
            <motion.div
              key={`mouse-dot-${i}`}
              className={`absolute w-2 h-2 rounded-full ${
                i % 3 === 0 ? 'bg-blue-400/70' : 
                i % 3 === 1 ? 'bg-purple-400/70' : 'bg-cyan-400/70'
              } shadow-lg`}
              style={{
                left: offsetX,
                top: offsetY,
                filter: 'blur(0.5px)',
              }}
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2 + i * 0.2,
                repeat: Infinity,
                delay,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Particle System */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-blue-400/60 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    );
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white overflow-hidden">
      {/* HERO SECTION */}
      <div
        className="relative overflow-hidden bg-gradient-to-br from-blue-900/20 via-gray-900 to-purple-900/20 py-20 md:py-32"
        onMouseMove={(e) => {
          const { clientX, clientY, currentTarget } = e;
          const rect = currentTarget.getBoundingClientRect();
          mouseX.set(clientX - rect.width / 2);
          mouseY.set(clientY - rect.height / 2);
        }}
      >
        {/* Animated Background */}
        <AnimatedMapBackground />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
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
                <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl leading-relaxed">
                  Transforming campus management through intelligent issue
                  reporting, real-time tracking, and data-driven insights for a
                  better campus experience.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      currentUser ? navigate("/dashboard") : navigate("/auth")
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
                <div className="grid grid-cols-3 gap-6 mt-12 max-w-md">
                  {[
                    { value: "1K+", label: "Issues Resolved" },
                    { value: "24/7", label: "Support" },
                    { value: "99%", label: "Satisfaction" },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="text-center lg:text-left"
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

            {/* Hero Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-96 lg:h-auto"
            >
              <div className="relative h-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl border border-gray-700/50 overflow-hidden">
                {/* Mini Map Preview */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {mapPoints.map((point) => (
                    <motion.div
                      key={`preview-${point.id}`}
                      className={`absolute ${point.color} w-3 h-3 rounded-full`}
                      style={{ left: `${point.x}%`, top: `${point.y}%` }}
                      animate={{ y: [0, -10, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: point.id * 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
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
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-4 sm:p-6 rounded-xl border ${
                  hoveredFeature === index
                    ? "border-blue-500/50 shadow-lg shadow-blue-500/10"
                    : "border-gray-700/50"
                } backdrop-blur-sm hover:scale-[1.02] transition-all duration-300`}
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div
                    className={`p-2 sm:p-3 rounded-lg ${
                      hoveredFeature === index
                        ? "bg-blue-500/20"
                        : "bg-gray-800"
                    }`}
                  >
                    <feature.icon
                      className={`w-5 sm:w-6 h-5 sm:h-6 ${
                        hoveredFeature === index
                          ? "text-blue-400"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-400">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
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
              <div className="flex justify-center lg:justify-end space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>
              © 2024 CivicFlow. All rights reserved. | Designed for educational
              institutions worldwide
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

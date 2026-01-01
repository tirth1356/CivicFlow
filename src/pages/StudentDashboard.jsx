import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { logOut } from "../firebase/auth";
import {
  createIssue,
  getUserIssues,
  submitFeedback,
  addIssueComment,
} from "../firebase/firestore";
import { uploadIssueImage } from "../supabase/storage";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import { getBlockCoordinates, CAMPUS_BLOCK_NAMES } from "../config/campusMap";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../components/Modal";
import LoadingSkeleton from "../components/LoadingSkeleton";
import CameraCapture from "../components/CameraCapture";
import CommentsSection from "../components/CommentsSection";
import {
  PlusCircle,
  MapPin,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  ChevronDown,
  Image as ImageIcon,
  Building,
  Layers,
  Hash,
  X,
  Eye,
  MessageSquare,
  BarChart3,
  TrendingUp,
  Calendar,
  FileText,
  Wifi,
  Droplets,
  Zap,
  Shield,
  Home,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronRight,
  ArrowUpRight,
  Download,
  Share2,
  Camera,
  MoreVertical,
} from "lucide-react";

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showReportForm, setShowReportForm] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackIssue, setFeedbackIssue] = useState(null);
  const [viewingImage, setViewingImage] = useState(null);
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [feedbackData, setFeedbackData] = useState({
    rating: 5,
    comment: "",
  });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Water",
    block: "A Block", // Use first block from campus blocks
    floor: "",
    room: "",
    image: null,
    imagePreview: null,
  });

  // Categories with icons
  const categories = [
    {
      value: "Water",
      icon: Droplets,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    {
      value: "Electricity",
      icon: Zap,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
    },
    {
      value: "WiFi",
      icon: Wifi,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
    },
    {
      value: "Cleanliness",
      icon: Shield,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
    },
    {
      value: "Infrastructure",
      icon: Building,
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
    },
    {
      value: "Safety",
      icon: Shield,
      color: "text-red-400",
      bgColor: "bg-red-500/20",
    },
  ];

  // Calculate stats
  const totalIssues = issues.length;
  const pendingIssues = issues.filter(
    (issue) => issue.status === "Reported" || issue.status === "In Progress"
  ).length;
  const resolvedIssues = issues.filter(
    (issue) => issue.status === "Resolved"
  ).length;
  const urgentIssues = issues.filter(
    (issue) => issue.priority === "high"
  ).length;

  // Filter and sort issues
  const filteredIssues = issues
    .filter((issue) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "pending") return issue.status !== "Resolved";
      if (activeFilter === "resolved") return issue.status === "Resolved";
      if (activeFilter === "urgent") return issue.priority === "high";
      return issue.category === activeFilter;
    })
    .filter(
      (issue) =>
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.block.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    switch (sortBy) {
      case "status":
        const statusOrder = { Reported: 0, "In Progress": 1, Resolved: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      case "category":
        return a.category.localeCompare(b.category);
      case "priority":
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return (
          (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3)
        );
      case "latest":
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Fetch user's issues
  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);

    const unsubscribe = getUserIssues(
      currentUser.uid,
      (snapshot) => {
        if (snapshot.empty) {
          setIssues([]);
        } else {
          const issuesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setIssues(issuesData);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching issues:", error);
        setIssues([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files?.[0]) {
      const file = files[0];
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCameraCapture = (imageBlob) => {
    setFormData({
      ...formData,
      image: imageBlob,
      imagePreview: URL.createObjectURL(imageBlob),
    });
    setShowCamera(false);
    toast.success('Photo captured successfully!');
  };

  const handleAddComment = async (issueId, commentData) => {
    try {
      await addIssueComment(issueId, commentData);
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser?.emailVerified) {
      setModal({
        isOpen: true,
        title: "Email Verification Required",
        message:
          "Please verify your email before reporting issues. Check your inbox for the verification link.",
        type: "warning",
      });
      return;
    }

    setSubmitting(true);

    try {
      const blockCoords = getBlockCoordinates(formData.block);
      
      // Provide default coordinates if block not found
      const coordinates = blockCoords || { x: 50, y: 50 };

      const issueData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        block: formData.block,
        floor: formData.floor,
        room: formData.room,
        reportedBy: currentUser.uid,
        reportedByEmail: currentUser.email,
        imageUrl: null,
        mapX: coordinates.x,
        mapY: coordinates.y,
        status: "Reported",
        createdAt: new Date().toISOString(),
        priority:
          formData.category === "Safety"
            ? "high"
            : formData.category === "Electricity"
            ? "high"
            : "medium",
      };

      const issueId = await createIssue(issueData);

      if (formData.image) {
        try {
          const imageUrl = await uploadIssueImage(formData.image, issueId);
          if (imageUrl) {
            await updateDoc(doc(db, "issues", issueId), { imageUrl });
          }
        } catch (error) {
          console.error("Image upload error:", error);
        }
      }

      setFormData({
        title: "",
        description: "",
        category: "Water",
        block: "A Block", // Use first block from campus blocks
        floor: "",
        room: "",
        image: null,
        imagePreview: null,
      });
      setShowReportForm(false);
      toast.success('Issue reported successfully!', {
        title: 'Success!',
        duration: 5000
      });
    } catch (error) {
      console.error("Error reporting issue:", error);
      toast.error(error.message || 'Failed to report issue. Please try again.', {
        title: 'Error',
        duration: 5000
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Reported":
        return {
          bg: "bg-yellow-500/20",
          text: "text-yellow-400",
          border: "border-yellow-500/30",
          icon: AlertCircle,
        };
      case "In Progress":
        return {
          bg: "bg-blue-500/20",
          text: "text-blue-400",
          border: "border-blue-500/30",
          icon: Clock,
        };
      case "Resolved":
        return {
          bg: "bg-green-500/20",
          text: "text-green-400",
          border: "border-green-500/30",
          icon: CheckCircle,
        };
      default:
        return {
          bg: "bg-gray-500/20",
          text: "text-gray-400",
          border: "border-gray-500/30",
          icon: AlertCircle,
        };
    }
  };

  const getCategoryIcon = (category) => {
    return categories.find((c) => c.value === category)?.icon || AlertCircle;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSubmittingFeedback(true);

    try {
      await submitFeedback({
        issueId: feedbackIssue.id,
        issueTitle: feedbackIssue.title,
        rating: Number(feedbackData.rating), // Ensure it's a number
        comment: feedbackData.comment,
        submittedBy: currentUser.uid,
        submittedByEmail: currentUser.email,
      });

      toast.success('Feedback submitted successfully!', {
        title: 'Thank You!',
        duration: 5000
      });

      setFeedbackIssue(null);
      setFeedbackData({ rating: 5, comment: "" });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error('Failed to submit feedback. Please try again.', {
        title: 'Error',
        duration: 5000
      });
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full bg-blue-400/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -15, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
        
        {/* Gradient orbs */}
        {[...Array(2)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className={`absolute rounded-full blur-3xl ${
              i === 0 ? 'bg-blue-500/10 w-96 h-96' : 'bg-purple-500/10 w-80 h-80'
            }`}
            style={{
              left: `${10 + i * 60}%`,
              top: `${20 + i * 40}%`,
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      {/* Header */}
      <div className="border-b backdrop-blur-sm bg-gray-900/60 border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Student Dashboard
                </h1>
                <p className="text-sm text-gray-400">
                  {currentUser?.email?.split("@")[0] || "Student"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <Home className="w-5 h-5 text-gray-400" />
              </Link>

              <Link
                to="/map"
                className="px-4 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 transition-colors flex items-center space-x-2"
              >
                <MapPin className="w-4 h-4" />
                <span>Campus Map</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome & Stats */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8"
          >
            <div>
              <h2 className="text-3xl font-bold mb-2 text-white">
                Welcome back!
              </h2>
              <p className="text-gray-400">
                Track and report campus issues in real-time
              </p>
            </div>

            <button
              onClick={() => setShowReportForm(!showReportForm)}
              className="mt-4 lg:mt-0 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>
                {showReportForm ? "Cancel Report" : "Report New Issue"}
              </span>
            </button>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="backdrop-blur-sm rounded-2xl border p-6 bg-gray-900/40 border-gray-800/50"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-2xl font-bold text-white">
                  {totalIssues}
                </span>
              </div>
              <h3 className="text-gray-400 text-sm">Total Issues</h3>
            </motion.div>

          {/* Pending Issues Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-sm rounded-2xl border p-6 bg-gray-900/40 border-gray-800/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-yellow-500/20">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-2xl font-bold text-yellow-400">
                {pendingIssues}
              </span>
            </div>
            <h3 className="text-gray-400 text-sm">Pending Issues</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-sm rounded-2xl border p-6 bg-gray-900/40 border-gray-800/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-500/20">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-2xl font-bold text-green-400">
                {resolvedIssues}
              </span>
            </div>
            <h3 className="text-gray-400 text-sm">Resolved Issues</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="backdrop-blur-sm rounded-2xl border p-6 bg-gray-900/40 border-gray-800/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-red-500/20">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <span className="text-2xl font-bold text-red-400">
                {urgentIssues}
              </span>
            </div>
            <h3 className="text-gray-400 text-sm">Urgent Issues</h3>
          </motion.div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Report Form */}
          <AnimatePresence>
            {showReportForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:col-span-3 bg-gray-900/40 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-800/50 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8"
              >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Report New Issue
                  </h2>
                  <button
                    onClick={() => setShowReportForm(false)}
                    className="p-2 rounded-lg hover:bg-gray-800/50 touch-manipulation"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* Title */}
                    <div className="space-y-2">
                      <label className="flex items-center text-gray-300 text-sm font-medium">
                        <FileText className="w-4 h-4 mr-2" />
                        Issue Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                        placeholder="Brief description of the issue"
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <label className="flex items-center text-gray-300 text-sm font-medium">
                        <Filter className="w-4 h-4 mr-2" />
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      >
                        {categories.map((category) => (
                          <option
                            key={category.value}
                            value={category.value}
                            className="bg-gray-800 text-white"
                          >
                            {category.value}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Block */}
                    <div className="space-y-2">
                      <label className="flex items-center text-gray-300 text-sm font-medium">
                        <Building className="w-4 h-4 mr-2" />
                        Campus Block
                      </label>
                      <select
                        name="block"
                        value={formData.block}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      >
                        {CAMPUS_BLOCK_NAMES.map((block) => (
                          <option
                            key={block}
                            value={block}
                            className="bg-gray-800 text-white"
                          >
                            {block}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Floor */}
                    <div className="space-y-2">
                      <label className="flex items-center text-gray-300 text-sm font-medium">
                        <Layers className="w-4 h-4 mr-2" />
                        Floor
                      </label>
                      <input
                        type="text"
                        name="floor"
                        value={formData.floor}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                        placeholder="e.g., Ground Floor, 2nd Floor"
                      />
                    </div>

                    {/* Room */}
                    <div className="space-y-2">
                      <label className="flex items-center text-gray-300 text-sm font-medium">
                        <Hash className="w-4 h-4 mr-2" />
                        Room / Location
                      </label>
                      <input
                        type="text"
                        name="room"
                        value={formData.room}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                        placeholder="e.g., Room 201, Cafeteria"
                      />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2 sm:col-span-2">
                      <label className="flex items-center text-gray-300 text-sm font-medium">
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Upload Image (Optional)
                      </label>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <input
                          type="file"
                          name="image"
                          accept="image/*"
                          onChange={handleInputChange}
                          className="flex-1 w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCamera(true)}
                          className="px-4 py-3 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-600/30 transition-colors flex items-center space-x-2"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Take Photo</span>
                        </button>
                        {formData.imagePreview && (
                          <div className="relative w-20 h-20 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-gray-700/50 mx-auto sm:mx-0">
                            <img
                              src={formData.imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  image: null,
                                  imagePreview: null,
                                })
                              }
                              className="absolute top-1 right-1 w-6 h-6 bg-gray-900/80 rounded-full flex items-center justify-center touch-manipulation"
                            >
                              <X className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="flex items-center text-gray-300 text-sm font-medium">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Detailed Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      placeholder="Provide detailed description of the issue..."
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                        Submitting Issue...
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-5 h-5 mr-3" />
                        Submit Issue Report
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right Column - Issues List */}
          <div className="lg:col-span-3">
            {/* Filters and Search */}
            <div className="bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    My Issues
                  </h2>
                  <p className="text-gray-400">
                    Track all your reported issues
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search issues..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    />
                  </div>

                  {/* Sort */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="pl-4 pr-10 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 appearance-none"
                    >
                      <option value="latest" className="bg-gray-800">
                        Sort by: Latest
                      </option>
                      <option value="status" className="bg-gray-800">
                        Sort by: Status
                      </option>
                      <option value="category" className="bg-gray-800">
                        Sort by: Category
                      </option>
                      <option value="priority" className="bg-gray-800">
                        Sort by: Priority
                      </option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Filter Chips */}
              <div className="flex flex-wrap gap-2 mt-6">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeFilter === "all"
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600"
                  }`}
                >
                  All Issues ({issues.length})
                </button>
                <button
                  onClick={() => setActiveFilter("pending")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeFilter === "pending"
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      : "bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600"
                  }`}
                >
                  Pending ({pendingIssues})
                </button>
                <button
                  onClick={() => setActiveFilter("resolved")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeFilter === "resolved"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600"
                  }`}
                >
                  Resolved ({resolvedIssues})
                </button>
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setActiveFilter(category.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                      activeFilter === category.value
                        ? `${category.bgColor} ${
                            category.color
                          } border border-${
                            category.color.split("-")[1]
                          }-500/30`
                        : "bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600"
                    }`}
                  >
                    <category.icon className="w-4 h-4" />
                    <span>{category.value}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Issues Grid */}
            {loading ? (
              <LoadingSkeleton type="card" count={3} />
            ) : sortedIssues.length === 0 ? (
              <div className="bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No issues found
                </h3>
                <p className="text-gray-400 mb-6">
                  {searchQuery || activeFilter !== "all"
                    ? "No issues match your search criteria"
                    : "You haven't reported any issues yet"}
                </p>
                <button
                  onClick={() => setShowReportForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-blue-400 transition-all duration-300"
                >
                  Report Your First Issue
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedIssues.map((issue) => {
                  const StatusIcon = getStatusColor(issue.status).icon;
                  const CategoryIcon = getCategoryIcon(issue.category);
                  const categoryInfo = categories.find(
                    (c) => c.value === issue.category
                  );

                  return (
                    <motion.div
                      key={issue.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800/50 overflow-hidden hover:border-gray-700 transition-all duration-300 hover:scale-[1.02]"
                    >
                      {/* Issue Image */}
                      {issue.imageUrl && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={issue.imageUrl}
                            alt={issue.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                            onClick={() =>
                              setViewingImage({
                                url: issue.imageUrl,
                                title: issue.title,
                              })
                            }
                          />
                          <button
                            onClick={() =>
                              setViewingImage({
                                url: issue.imageUrl,
                                title: issue.title,
                              })
                            }
                            className="absolute top-3 right-3 bg-gray-900/80 hover:bg-gray-900 text-white p-2 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-2">
                              {issue.title}
                            </h3>
                            <p className="text-gray-400 text-sm line-clamp-2">
                              {issue.description}
                            </p>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1.5 ${
                              getStatusColor(issue.status).bg
                            } ${getStatusColor(issue.status).text} ${
                              getStatusColor(issue.status).border
                            }`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            <span>{issue.status}</span>
                          </span>
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1.5 ${
                              categoryInfo?.bgColor || "bg-gray-800/50"
                            } ${
                              categoryInfo?.color || "text-gray-400"
                            } border border-gray-700/50`}
                          >
                            <CategoryIcon className="w-3 h-3" />
                            <span>{issue.category}</span>
                          </span>
                          <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-800/50 text-gray-400 border border-gray-700/50">
                            {issue.block}
                          </span>
                        </div>

                        {/* Location Info */}
                        {(issue.floor || issue.room) && (
                          <div className="flex items-center space-x-3 text-sm text-gray-500 mb-4">
                            {issue.floor && (
                              <span className="flex items-center">
                                <Layers className="w-4 h-4 mr-1" />
                                {issue.floor}
                              </span>
                            )}
                            {issue.room && (
                              <span className="flex items-center">
                                <Hash className="w-4 h-4 mr-1" />
                                {issue.room}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
                          <div className="text-xs text-gray-500">
                            Reported {formatDate(issue.createdAt)}
                          </div>
                          {issue.status === "Resolved" ? (
                            <button
                              onClick={() => setFeedbackIssue(issue)}
                              className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors flex items-center space-x-2 text-sm"
                            >
                              <MessageSquare className="w-4 h-4" />
                              <span>Feedback</span>
                            </button>
                          ) : (
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span>Awaiting resolution</span>
                            </div>
                          )}
                        </div>

                        {/* Comments Section */}
                        <CommentsSection
                          issueId={issue.id}
                          comments={issue.comments || []}
                          onAddComment={(commentData) => handleAddComment(issue.id, commentData)}
                          isOptional={true}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Camera Capture Modal */}
      <AnimatePresence>
        {showCamera && (
          <CameraCapture
            onCapture={handleCameraCapture}
            onClose={() => setShowCamera(false)}
          />
        )}
      </AnimatePresence>

      {/* Image Viewer Modal */}
      {viewingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-2xl max-w-4xl w-full overflow-hidden"
          >
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                {viewingImage.title}
              </h3>
              <button
                onClick={() => setViewingImage(null)}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              <img
                src={viewingImage.url}
                alt={viewingImage.title}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* Feedback Modal */}
      <AnimatePresence>
        {feedbackIssue && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => {
              setFeedbackIssue(null);
              setFeedbackData({ rating: 5, comment: "" });
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-md w-full overflow-hidden border border-gray-800/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-800/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">
                    Rate Resolution
                  </h3>
                  <button
                    onClick={() => {
                      setFeedbackIssue(null);
                      setFeedbackData({ rating: 5, comment: "" });
                    }}
                    className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-medium text-white mb-2">
                    {feedbackIssue.title}
                  </h4>
                  <p className="text-sm text-gray-400">
                    How satisfied are you with the resolution?
                  </p>
                </div>

                <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Rating
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setFeedbackData({ ...feedbackData, rating: Number(star) })
                          }
                          className={`text-2xl transition-colors ${
                            star <= feedbackData.rating
                              ? "text-yellow-400"
                              : "text-gray-600 hover:text-yellow-400"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Additional Comments (Optional)
                    </label>
                    <textarea
                      value={feedbackData.comment}
                      onChange={(e) =>
                        setFeedbackData({
                          ...feedbackData,
                          comment: e.target.value,
                        })
                      }
                      rows="3"
                      className="w-full px-4 py-3 bg-gray-800/30 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all duration-300"
                      placeholder="Share your experience..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setFeedbackIssue(null);
                        setFeedbackData({ rating: 5, comment: "" });
                      }}
                      className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingFeedback}
                      className="px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {submittingFeedback ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-4 h-4" />
                          <span>Submit Feedback</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </div>
  );
};

export default StudentDashboard;

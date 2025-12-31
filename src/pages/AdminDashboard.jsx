import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getAllIssues,
  updateIssueStatus,
  deleteIssue,
} from "../firebase/firestore";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmModal from "../components/ConfirmModal";
import Modal from "../components/Modal";
import {
  BarChart3,
  Users,
  Settings,
  Filter,
  Search,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  MoreVertical,
  X,
  TrendingUp,
  Calendar,
  FileText,
  Wifi,
  Droplets,
  Zap,
  Shield,
  Building,
  Home,
  User,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ChevronRight,
  ArrowUpRight,
  Edit,
  Trash2,
  MessageSquare,
  BarChart,
  PieChart,
  Activity,
} from "lucide-react";

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [statusUpdate, setStatusUpdate] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteIssueId, setDeleteIssueId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    reported: 0,
    inProgress: 0,
    resolved: 0,
    urgent: 0,
    users: 0,
  });

  // Categories
  const categories = [
    {
      value: "Water",
      icon: Droplets,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      value: "Electricity",
      icon: Zap,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
    },
    {
      value: "WiFi",
      icon: Wifi,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      value: "Cleanliness",
      icon: Shield,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      value: "Infrastructure",
      icon: Building,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
    {
      value: "Safety",
      icon: Shield,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
    },
  ];

  // Fetch all issues
  useEffect(() => {
    setLoading(true);

    const unsubscribe = getAllIssues(
      (snapshot) => {
        if (snapshot.empty) {
          setIssues([]);
        } else {
          const issuesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setIssues(issuesData);

          // Calculate stats
          const total = issuesData.length;
          const reported = issuesData.filter(
            (issue) => issue.status === "Reported"
          ).length;
          const inProgress = issuesData.filter(
            (issue) => issue.status === "In Progress"
          ).length;
          const resolved = issuesData.filter(
            (issue) => issue.status === "Resolved"
          ).length;
          const urgent = issuesData.filter(
            (issue) => issue.priority === "high"
          ).length;

          setStats({
            total,
            reported,
            inProgress,
            resolved,
            urgent,
            users: new Set(issuesData.map((issue) => issue.reportedBy)).size,
          });
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
  }, []);

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
        (issue.reportedByEmail &&
          issue.reportedByEmail
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        issue.block.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    switch (sortBy) {
      case "status":
        const statusOrder = { Reported: 0, "In Progress": 1, Resolved: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      case "priority":
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return (
          (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3)
        );
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "latest":
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const getStatusConfig = (status) => {
    switch (status) {
      case "Reported":
        return {
          color: "text-yellow-500",
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/20",
          icon: AlertCircle,
        };
      case "In Progress":
        return {
          color: "text-blue-500",
          bg: "bg-blue-500/10",
          border: "border-blue-500/20",
          icon: Clock,
        };
      case "Resolved":
        return {
          color: "text-green-500",
          bg: "bg-green-500/10",
          border: "border-green-500/20",
          icon: CheckCircle,
        };
      default:
        return {
          color: "text-gray-500",
          bg: "bg-gray-500/10",
          border: "border-gray-500/20",
          icon: AlertCircle,
        };
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedIssue || !statusUpdate) return;

    setUpdatingStatus(true);
    try {
      await updateIssueStatus(selectedIssue.id, statusUpdate);
      setIssues(
        issues.map((issue) =>
          issue.id === selectedIssue.id
            ? { ...issue, status: statusUpdate }
            : issue
        )
      );
      setSelectedIssue(null);
      setStatusUpdate("");
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteIssue = async (issueId) => {
    setDeleteIssueId(issueId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteIssue(deleteIssueId);
      setIssues(issues.filter((issue) => issue.id !== deleteIssueId));
      setSuccessMessage("Issue deleted successfully!");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error deleting issue:", error);
      setSuccessMessage("Failed to delete issue. Please try again.");
      setShowSuccessModal(true);
    } finally {
      setShowDeleteConfirm(false);
      setDeleteIssueId(null);
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

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-lg border-b bg-gray-900/80 border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  Admin Dashboard
                </h1>
                <p className="text-xs text-gray-400">
                  Campus Management System
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 px-3 py-2 rounded-xl border bg-purple-500/10 border-purple-500/20">
                <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">
                    Administrator
                  </p>
                  <p className="text-xs text-gray-400">Admin Access</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Overview */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">
              System Overview
            </h2>
            <p className="text-gray-400">
              Monitor and manage all campus issues
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="backdrop-blur-sm rounded-2xl border p-5 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-800/50"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                  <p className="text-sm text-gray-400">Total Issues</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="backdrop-blur-sm rounded-2xl border p-5 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-800/50"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-yellow-500/10">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-400">
                    {stats.reported}
                  </p>
                  <p className="text-sm text-gray-400">Reported</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="backdrop-blur-sm rounded-2xl border p-5 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-800/50"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-400">
                    {stats.inProgress}
                  </p>
                  <p className="text-sm text-gray-400">In Progress</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="backdrop-blur-sm rounded-2xl border p-5 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-800/50"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-green-500/10">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-400">
                    {stats.resolved}
                  </p>
                  <p className="text-sm text-gray-400">Resolved</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="backdrop-blur-sm rounded-2xl border p-5 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-800/50"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-red-500/10">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-400">
                    {stats.urgent}
                  </p>
                  <p className="text-sm text-gray-400">Urgent</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="backdrop-blur-sm rounded-2xl border p-5 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-800/50"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-400">
                    {stats.users}
                  </p>
                  <p className="text-sm text-gray-400">Users</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Link
              to="/map"
              className="flex items-center space-x-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg transition-all duration-300"
            >
              <MapPin className="w-5 h-5" />
              <span>Campus Map</span>
            </Link>

            <Link
              to="/analytics"
              className="flex items-center space-x-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 border bg-gray-800/50 border-gray-700/50 hover:border-gray-600 text-gray-300 hover:text-white"
            >
              <BarChart className="w-5 h-5" />
              <span>Analytics</span>
            </Link>

            <Link
              to="/admin/feedback"
              className="flex items-center space-x-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 border bg-gray-800/50 border-gray-700/50 hover:border-gray-600 text-gray-300 hover:text-white"
            >
              <MessageSquare className="w-5 h-5" />
              <span>View Feedback</span>
            </Link>
          </div>
        </div>

        {/* Issues Management */}
        <div className={`backdrop-blur-sm rounded-2xl border p-6 mb-6 ${
          isDark 
            ? "bg-gradient-to-br from-gray-900/60 to-gray-800/30 border-gray-800/50" 
            : "bg-white border-gray-200 shadow-sm"
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className={`text-2xl font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                Issues Management
              </h2>
              <p className={isDark ? "text-gray-400" : "text-gray-600"}>Manage all reported campus issues</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search issues, users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 w-full text-base border ${
                    isDark 
                      ? "bg-gray-800/30 border-gray-700/50 text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-blue-500/10" 
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`pl-4 pr-10 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 appearance-none w-full border ${
                    isDark 
                      ? "bg-gray-800/30 border-gray-700/50 text-white focus:border-blue-500/50 focus:ring-blue-500/10" 
                      : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                >
                  <option value="latest" className={isDark ? "bg-gray-800" : "bg-white"}>
                    Latest First
                  </option>
                  <option value="oldest" className={isDark ? "bg-gray-800" : "bg-white"}>
                    Oldest First
                  </option>
                  <option value="status" className={isDark ? "bg-gray-800" : "bg-white"}>
                    By Status
                  </option>
                  <option value="priority" className={isDark ? "bg-gray-800" : "bg-white"}>
                    By Priority
                  </option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              "all",
              "pending",
              "resolved",
              "urgent",
              ...categories.map((c) => c.value),
            ].map((filter) => {
              const isActive = activeFilter === filter;
              let label = filter.charAt(0).toUpperCase() + filter.slice(1);
              let bgColor = isDark ? "bg-gray-800/30" : "bg-gray-100";
              let textColor = isDark ? "text-gray-400" : "text-gray-600";
              let borderColor = isDark ? "border-gray-700/50" : "border-gray-200";
              let Icon = null;

              if (filter === "all") {
                label = "All Issues";
                if (isActive) {
                  bgColor = isDark ? "bg-blue-500/10" : "bg-blue-50";
                  textColor = isDark ? "text-blue-400" : "text-blue-600";
                  borderColor = isDark ? "border-blue-500/20" : "border-blue-200";
                }
              } else if (filter === "pending") {
                label = "Pending";
                if (isActive) {
                  bgColor = isDark ? "bg-yellow-500/10" : "bg-yellow-50";
                  textColor = isDark ? "text-yellow-400" : "text-yellow-600";
                  borderColor = isDark ? "border-yellow-500/20" : "border-yellow-200";
                }
              } else if (filter === "resolved") {
                label = "Resolved";
                if (isActive) {
                  bgColor = isDark ? "bg-green-500/10" : "bg-green-50";
                  textColor = isDark ? "text-green-400" : "text-green-600";
                  borderColor = isDark ? "border-green-500/20" : "border-green-200";
                }
              } else if (filter === "urgent") {
                label = "Urgent";
                if (isActive) {
                  bgColor = isDark ? "bg-red-500/10" : "bg-red-50";
                  textColor = isDark ? "text-red-400" : "text-red-600";
                  borderColor = isDark ? "border-red-500/20" : "border-red-200";
                }
              } else {
                const category = categories.find((c) => c.value === filter);
                if (category) {
                  Icon = category.icon;
                  if (isActive) {
                    bgColor = isDark ? category.bgColor : "bg-gray-100"; // You might want specific light colors for categories
                    textColor = isDark ? category.color : "text-gray-900";
                    borderColor = isDark ? category.borderColor : "border-gray-200";
                  }
                }
              }

              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 border ${bgColor} ${textColor} ${borderColor} hover:opacity-80`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Issues Table */}
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className={isDark ? "text-gray-400" : "text-gray-600"}>Loading issues...</p>
            </div>
          ) : sortedIssues.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-gray-600" : "text-gray-400"}`} />
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                No issues found
              </h3>
              <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                {searchQuery || activeFilter !== "all"
                  ? "No issues match your search criteria"
                  : "No issues have been reported yet"}
              </p>
            </div>
          ) : (
            <div className={`overflow-x-auto rounded-xl border ${isDark ? "border-gray-800/50" : "border-gray-200"}`}>
              <table className="w-full">
                <thead className={`border-b ${isDark ? "bg-gray-900/50 border-gray-800/50" : "bg-gray-50 border-gray-200"}`}>
                  <tr>
                    <th className={`py-4 px-6 text-left text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      Issue Details
                    </th>
                    <th className={`py-4 px-6 text-left text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      Category
                    </th>
                    <th className={`py-4 px-6 text-left text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      Location
                    </th>
                    <th className={`py-4 px-6 text-left text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      Reporter
                    </th>
                    <th className={`py-4 px-6 text-left text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      Status
                    </th>
                    <th className={`py-4 px-6 text-left text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      Date
                    </th>
                    <th className={`py-4 px-6 text-left text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-gray-800/50" : "divide-gray-200"}`}>
                  {sortedIssues.map((issue) => {
                    const statusConfig = getStatusConfig(issue.status);
                    const StatusIcon = statusConfig.icon;
                    const CategoryIcon = getCategoryIcon(issue.category);

                    return (
                      <tr
                        key={issue.id}
                        className={`transition-colors ${isDark ? "hover:bg-gray-900/30" : "hover:bg-gray-50"}`}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-start space-x-4">
                            {issue.imageUrl && (
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={issue.imageUrl}
                                  alt={issue.title}
                                  className="w-full h-full object-cover cursor-pointer"
                                  onClick={() => setSelectedIssue(issue)}
                                />
                                <button
                                  onClick={() => setSelectedIssue(issue)}
                                  className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center"
                                >
                                  <Eye className="w-4 h-4 text-white opacity-0 hover:opacity-100" />
                                </button>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className={`text-sm font-medium mb-1 truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                                {issue.title}
                              </h3>
                              <p className={`text-xs line-clamp-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                {issue.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <CategoryIcon className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                              {issue.category}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className={`text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                              {issue.block}
                            </div>
                            <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                              {issue.floor &&
                                issue.floor !== "Not specified" && (
                                  <span className="mr-2">{issue.floor}</span>
                                )}
                              {issue.room && issue.room !== "Not specified" && (
                                <span>{issue.room}</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className={`text-sm truncate max-w-[150px] ${isDark ? "text-white" : "text-gray-900"}`}>
                              {issue.reportedByEmail?.split("@")[0] ||
                                "Anonymous"}
                            </div>
                            <div className={`text-xs truncate max-w-[150px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                              {issue.reportedByEmail}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div
                            className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            <span>{issue.status}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                              {formatDate(issue.createdAt)}
                            </div>
                            <div className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                              {getTimeAgo(issue.createdAt)}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedIssue(issue)}
                              className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-100"}`}
                              title="Update Status"
                            >
                              <Edit className="w-4 h-4 text-blue-400" />
                            </button>
                            <button
                              onClick={() => handleDeleteIssue(issue.id)}
                              className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-100"}`}
                              title="Delete Issue"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Status Update Modal */}
        <AnimatePresence>
          {selectedIssue && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
              onClick={() => {
                setSelectedIssue(null);
                setStatusUpdate("");
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className={`rounded-2xl max-w-md w-full overflow-hidden border ${
                  isDark 
                    ? "bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800/50" 
                    : "bg-white border-gray-200"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={`p-6 border-b ${isDark ? "border-gray-800/50" : "border-gray-200"}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                      Update Issue Status
                    </h3>
                    <button
                      onClick={() => {
                        setSelectedIssue(null);
                        setStatusUpdate("");
                      }}
                      className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-100"}`}
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="mb-6">
                    <h4 className={`text-lg font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                      {selectedIssue.title}
                    </h4>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {selectedIssue.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                        Update Status
                      </label>
                      <select
                        value={statusUpdate}
                        onChange={(e) => setStatusUpdate(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 border ${
                          isDark 
                            ? "bg-gray-800/30 border-gray-700/50 text-white focus:border-blue-500/50 focus:ring-blue-500/10" 
                            : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20"
                        }`}
                      >
                        <option value="" className={isDark ? "bg-gray-800" : "bg-white"}>
                          Select new status
                        </option>
                        <option value="Reported" className={isDark ? "bg-gray-800" : "bg-white"}>
                          Reported
                        </option>
                        <option value="In Progress" className={isDark ? "bg-gray-800" : "bg-white"}>
                          In Progress
                        </option>
                        <option value="Resolved" className={isDark ? "bg-gray-800" : "bg-white"}>
                          Resolved
                        </option>
                      </select>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          setSelectedIssue(null);
                          setStatusUpdate("");
                        }}
                        className={`px-4 py-2 transition-colors ${isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleStatusUpdate}
                        disabled={!statusUpdate || updatingStatus}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {updatingStatus ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Updating...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>Update Status</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeleteIssueId(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Issue"
        message="Are you sure you want to delete this issue? This action cannot be undone."
        type="danger"
      />

      {/* Success/Error Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={successMessage.includes("Failed") ? "Error" : "Success"}
        message={successMessage}
        type={successMessage.includes("Failed") ? "error" : "success"}
      />
    </div>
  );
};

export default AdminDashboard;

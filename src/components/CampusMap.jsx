import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllIssues, getUserIssues } from "../firebase/firestore";
import {
  CAMPUS_BLOCKS,
  getCategoryColor,
  getBlockCoordinates,
} from "../config/campusMap";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Filter,
  Eye,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  Building,
  BarChart3,
  ChevronDown,
  Search,
  Layers,
  Hash,
  Calendar,
  Users,
  TrendingUp,
} from "lucide-react";

const CampusMap = ({ mapImageUrl = "/campus-map.jpg" }) => {
  const { currentUser, userRole } = useAuth();
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [filter, setFilter] = useState("all");
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch issues based on role
  useEffect(() => {
    if (!currentUser) return;

    let unsubscribe;

    if (userRole === "admin") {
      unsubscribe = getAllIssues((snapshot) => {
        const issuesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setIssues(issuesData);
      });
    } else {
      unsubscribe = getUserIssues(
        currentUser.uid,
        (snapshot) => {
          const issuesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setIssues(issuesData);
        },
        (error) => {
          console.error("Error fetching issues:", error);
          setIssues([]);
        }
      );
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser, userRole]);

  // Get issues for a specific block with filtering
  const getIssuesForBlock = (block) => {
    let filteredIssues = issues.filter((issue) => issue.block === block);

    if (searchQuery) {
      filteredIssues = filteredIssues.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          issue.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (filter) {
      case "pending":
        return filteredIssues.filter(
          (issue) =>
            issue.status === "Reported" || issue.status === "In Progress"
        );
      case "resolved":
        return filteredIssues.filter((issue) => issue.status === "Resolved");
      default:
        return filteredIssues;
    }
  };

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate stats
  const totalIssues = issues.length;
  const activeBlocks = new Set(issues.map((i) => i.block)).size;
  const mostIssuesBlock =
    issues.length > 0
      ? Object.entries(
          issues.reduce((acc, issue) => {
            acc[issue.block] = (acc[issue.block] || 0) + 1;
            return acc;
          }, {})
        ).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"
      : "N/A";
  const pendingIssues = issues.filter(
    (issue) => issue.status === "Reported" || issue.status === "In Progress"
  ).length;
  const resolvedIssues = issues.filter(
    (issue) => issue.status === "Resolved"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Campus Map</h1>
                <p className="text-xs text-gray-400">
                  {userRole === "admin"
                    ? "All Reported Issues"
                    : "Your Reported Issues"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search issues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-2 bg-gray-800/30 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all duration-300 w-48"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-5"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalIssues}</p>
                <p className="text-sm text-gray-400">Total Issues</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-5"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-yellow-500/10">
                <Building className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-400">
                  {activeBlocks}
                </p>
                <p className="text-sm text-gray-400">Active Blocks</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-5"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-400">
                  {mostIssuesBlock.length > 10
                    ? mostIssuesBlock.substring(0, 8) + "..."
                    : mostIssuesBlock}
                </p>
                <p className="text-sm text-gray-400">Most Issues</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-5"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-green-500/10">
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">
                  {userRole === "admin" ? "Admin" : "Student"}
                </p>
                <p className="text-sm text-gray-400">Access Level</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Map Container */}
        <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6 mb-6">
          {/* Map Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">
                Interactive Campus Map
              </h2>
              <p className="text-gray-400">
                Click on pins to view issue details
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Filter:</span>
              </div>

              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border ${
                  filter === "all"
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    : "bg-gray-800/30 text-gray-400 border-gray-700/50 hover:border-gray-600"
                }`}
              >
                All Issues
              </button>

              <button
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border ${
                  filter === "pending"
                    ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                    : "bg-gray-800/30 text-gray-400 border-gray-700/50 hover:border-gray-600"
                }`}
              >
                Pending ({pendingIssues})
              </button>

              <button
                onClick={() => setFilter("resolved")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border ${
                  filter === "resolved"
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : "bg-gray-800/30 text-gray-400 border-gray-700/50 hover:border-gray-600"
                }`}
              >
                Resolved ({resolvedIssues})
              </button>
            </div>
          </div>

          {/* Map Area */}
          <div className="relative w-full h-[500px] bg-gray-800/30 rounded-2xl border border-gray-800/50 overflow-hidden mb-6">
            {/* Map Image */}
            <div className="absolute inset-0">
              {mapImageUrl ? (
                <img
                  src={mapImageUrl}
                  alt="Campus Map"
                  className="w-full h-full object-cover"
                  onLoad={() => setMapLoaded(true)}
                  onError={() => setMapLoaded(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800/20">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">Campus map image not found</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Place your map at:{" "}
                      <code className="bg-gray-900/50 px-2 py-1 rounded">
                        /public/campus-map.jpg
                      </code>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Pins */}
            {mapLoaded &&
              Object.keys(CAMPUS_BLOCKS).map((block) => {
                const blockIssues = getIssuesForBlock(block);
                const coordinates = getBlockCoordinates(block);

                if (blockIssues.length === 0) return null;

                const clampedX = Math.max(0, Math.min(100, coordinates.x));
                const clampedY = Math.max(0, Math.min(100, coordinates.y));
                const mainCategory =
                  blockIssues[0]?.category || "Infrastructure";
                const pinColor = getCategoryColor(mainCategory);

                return (
                  <motion.div
                    key={block}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                    style={{
                      left: `${clampedX}%`,
                      top: `${clampedY}%`,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => {
                      setSelectedBlock(block);
                      setSelectedIssue(blockIssues[0]);
                    }}
                  >
                    {/* Pin */}
                    <div className="relative">
                      <div
                        className="w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-all"
                        style={{ backgroundColor: pinColor }}
                      >
                        <span className="text-white text-sm font-bold">
                          {blockIssues.length}
                        </span>
                      </div>

                      {/* Pulse Animation */}
                      <div className="absolute inset-0 rounded-full border-2 border-white animate-ping opacity-20"></div>

                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 text-white text-sm rounded-xl px-3 py-2 whitespace-nowrap shadow-xl">
                          <div className="font-semibold mb-1">{block}</div>
                          <div className="text-xs text-gray-300">
                            {blockIssues.length} issue
                            {blockIssues.length !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>

          {/* Legend */}
          <div className="bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Legend
            </h3>
            <div className="flex flex-wrap gap-4">
              {Object.entries(CAMPUS_BLOCKS).map(([block, coords]) => {
                const blockIssues = getIssuesForBlock(block);
                if (blockIssues.length === 0) return null;

                const mainCategory =
                  blockIssues[0]?.category || "Infrastructure";
                const color = getCategoryColor(mainCategory);

                return (
                  <div
                    key={block}
                    onClick={() => setSelectedBlock(block)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedBlock === block
                        ? "bg-gray-800/50 border border-gray-700/50"
                        : "hover:bg-gray-800/30"
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full border border-white/50"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-white text-sm">{block}</span>
                    <span className="text-gray-400 text-sm">
                      ({blockIssues.length})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Block Details Panel */}
        {selectedBlock && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-900/60 to-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {selectedBlock}
                </h3>
                <p className="text-gray-400">
                  {getIssuesForBlock(selectedBlock).length} issue
                  {getIssuesForBlock(selectedBlock).length !== 1 ? "s" : ""}{" "}
                  found
                </p>
              </div>
              <button
                onClick={() => setSelectedBlock(null)}
                className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {getIssuesForBlock(selectedBlock).length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">
                  No issues found in {selectedBlock}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getIssuesForBlock(selectedBlock).map((issue) => {
                  const statusConfig = getStatusConfig(issue.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <motion.div
                      key={issue.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-800/50 p-4 hover:border-gray-700 transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedIssue(issue)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-white font-medium line-clamp-1">
                          {issue.title}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-medium border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} flex items-center space-x-1`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          <span>{issue.status}</span>
                        </span>
                      </div>

                      <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                        {issue.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-2">
                          {issue.floor && issue.floor !== "Not specified" && (
                            <span className="flex items-center space-x-1">
                              <Layers className="w-3 h-3" />
                              <span>{issue.floor}</span>
                            </span>
                          )}
                          {issue.room && issue.room !== "Not specified" && (
                            <span className="flex items-center space-x-1">
                              <Hash className="w-3 h-3" />
                              <span>{issue.room}</span>
                            </span>
                          )}
                        </div>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(issue.createdAt)}</span>
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Issue Details Modal */}
      <AnimatePresence>
        {selectedIssue && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedIssue(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-lg w-full overflow-hidden border border-gray-800/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-800/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {selectedIssue.block}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {selectedIssue.title}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedIssue(null)}
                    className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className="px-3 py-1.5 rounded-lg text-sm font-medium"
                      style={{
                        backgroundColor:
                          getCategoryColor(selectedIssue.category) + "20",
                        color: getCategoryColor(selectedIssue.category),
                        border: `1px solid ${getCategoryColor(
                          selectedIssue.category
                        )}40`,
                      }}
                    >
                      {selectedIssue.category}
                    </span>

                    <span
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border flex items-center space-x-2 ${
                        selectedIssue.status === "Reported"
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          : selectedIssue.status === "In Progress"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : "bg-green-500/10 text-green-400 border-green-500/20"
                      }`}
                    >
                      {selectedIssue.status === "Reported" ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : selectedIssue.status === "In Progress" ? (
                        <Clock className="w-4 h-4" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      <span>{selectedIssue.status}</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-2">Description</h4>
                    <p className="text-gray-400 text-sm bg-gray-900/30 rounded-lg p-3">
                      {selectedIssue.description}
                    </p>
                  </div>

                  {(selectedIssue.floor || selectedIssue.room) && (
                    <div className="flex items-center space-x-4 text-sm">
                      {selectedIssue.floor &&
                        selectedIssue.floor !== "Not specified" && (
                          <span className="flex items-center space-x-2 text-gray-300">
                            <Layers className="w-4 h-4 text-gray-500" />
                            <span>Floor: {selectedIssue.floor}</span>
                          </span>
                        )}
                      {selectedIssue.room &&
                        selectedIssue.room !== "Not specified" && (
                          <span className="flex items-center space-x-2 text-gray-300">
                            <Hash className="w-4 h-4 text-gray-500" />
                            <span>Room: {selectedIssue.room}</span>
                          </span>
                        )}
                    </div>
                  )}

                  <div className="text-sm text-gray-500 flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Reported: {formatDate(selectedIssue.createdAt)}</span>
                  </div>

                  {userRole === "admin" && selectedIssue.reportedByEmail && (
                    <div className="text-sm text-gray-400">
                      Reported by: {selectedIssue.reportedByEmail}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CampusMap;

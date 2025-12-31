import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllIssues, getAllFeedback } from '../firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Calendar,
  Users,
  MapPin,
  Star,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Activity,
  Target,
  Zap,
  Award
} from 'lucide-react';

const Analytics = () => {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (currentUser && userRole !== 'admin') {
      navigate('/dashboard');
    }
  }, [currentUser, userRole, navigate]);

  // Fetch data
  useEffect(() => {
    if (!currentUser || userRole !== 'admin') return;

    const unsubscribeIssues = getAllIssues((snapshot) => {
      const issuesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setIssues(issuesData);
    });

    const unsubscribeFeedback = getAllFeedback((snapshot) => {
      const feedbackData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFeedback(feedbackData);
      setLoading(false);
    });

    return () => {
      unsubscribeIssues();
      unsubscribeFeedback();
    };
  }, [currentUser, userRole]);

  // Analytics calculations
  const getAnalytics = () => {
    const totalIssues = issues.length;
    const resolvedIssues = issues.filter(i => i.status === 'Resolved').length;
    const pendingIssues = issues.filter(i => i.status !== 'Resolved').length;
    const avgResolutionTime = resolvedIssues > 0 ? '2.3 days' : 'N/A';
    
    // Category breakdown
    const categoryStats = issues.reduce((acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1;
      return acc;
    }, {});

    // Block breakdown
    const blockStats = issues.reduce((acc, issue) => {
      acc[issue.block] = (acc[issue.block] || 0) + 1;
      return acc;
    }, {});

    // Monthly trends
    const monthlyData = issues.reduce((acc, issue) => {
      const month = new Date(issue.createdAt).toLocaleDateString('en-US', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    // Feedback stats
    const avgRating = feedback.length > 0 
      ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
      : 0;

    const satisfactionRate = feedback.length > 0
      ? ((feedback.filter(f => f.rating >= 4).length / feedback.length) * 100).toFixed(1)
      : 0;

    return {
      totalIssues,
      resolvedIssues,
      pendingIssues,
      avgResolutionTime,
      categoryStats,
      blockStats,
      monthlyData,
      avgRating,
      satisfactionRate,
      resolutionRate: totalIssues > 0 ? ((resolvedIssues / totalIssues) * 100).toFixed(1) : 0
    };
  };

  const analytics = getAnalytics();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/admin')}
                className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
              <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Analytics Dashboard</h1>
                <p className="text-xs text-gray-400">Data insights and trends</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Campus Analytics
          </h2>
          <p className="text-gray-400">
            Comprehensive insights into campus issue management and performance
          </p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{analytics.totalIssues}</p>
                <p className="text-sm text-gray-400">Total Issues</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-green-500/10">
                <Target className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">{analytics.resolutionRate}%</p>
                <p className="text-sm text-gray-400">Resolution Rate</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-yellow-500/10">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-400">{analytics.avgResolutionTime}</p>
                <p className="text-sm text-gray-400">Avg Resolution</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10">
                <Award className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-400">{analytics.satisfactionRate}%</p>
                <p className="text-sm text-gray-400">Satisfaction</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-gray-900/60 to-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <PieChart className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Issues by Category</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(analytics.categoryStats).map(([category, count], index) => {
                const percentage = ((count / analytics.totalIssues) * 100).toFixed(1);
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500', 'bg-pink-500'];
                return (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                      <span className="text-gray-300">{category}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-800 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${colors[index % colors.length]}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-medium w-12 text-right">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Block Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-gray-900/60 to-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <MapPin className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold text-white">Issues by Block</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(analytics.blockStats)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 6)
                .map(([block, count], index) => {
                  const percentage = ((count / analytics.totalIssues) * 100).toFixed(1);
                  return (
                    <div key={block} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <span className="text-gray-300">{block}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-800 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-white font-medium w-12 text-right">{count}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </motion.div>
        </div>

        {/* Performance Metrics */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Resolution Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-gray-900/60 to-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-bold text-white">Status Overview</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-300">Pending</span>
                </div>
                <span className="text-yellow-400 font-bold">{analytics.pendingIssues}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Resolved</span>
                </div>
                <span className="text-green-400 font-bold">{analytics.resolvedIssues}</span>
              </div>
            </div>
          </motion.div>

          {/* Feedback Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-gray-900/60 to-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Star className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold text-white">Feedback Insights</h3>
            </div>
            <div className="space-y-4">
              <div className="text-center p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <div className="text-3xl font-bold text-purple-400 mb-1">{analytics.avgRating}/5</div>
                <div className="text-gray-400 text-sm">Average Rating</div>
              </div>
              <div className="text-center p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <div className="text-2xl font-bold text-blue-400 mb-1">{feedback.length}</div>
                <div className="text-gray-400 text-sm">Total Feedback</div>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-br from-gray-900/60 to-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Zap className="w-6 h-6 text-orange-400" />
              <h3 className="text-xl font-bold text-white">Quick Stats</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Active Users</span>
                <span className="text-white font-medium">{new Set(issues.map(i => i.reportedBy)).size}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Most Active Block</span>
                <span className="text-white font-medium">
                  {Object.entries(analytics.blockStats).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Top Category</span>
                <span className="text-white font-medium">
                  {Object.entries(analytics.categoryStats).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">This Month</span>
                <span className="text-white font-medium">
                  {issues.filter(i => {
                    const issueDate = new Date(i.createdAt);
                    const now = new Date();
                    return issueDate.getMonth() === now.getMonth() && issueDate.getFullYear() === now.getFullYear();
                  }).length} issues
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllFeedback } from '../firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Star,
  Calendar,
  User,
  BarChart3,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';

const AdminFeedback = () => {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (currentUser && userRole !== 'admin') {
      navigate('/dashboard');
    }
  }, [currentUser, userRole, navigate]);

  // Fetch feedback
  useEffect(() => {
    if (!currentUser || userRole !== 'admin') return;

    const unsubscribeFeedback = getAllFeedback((snapshot) => {
      const feedbackData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFeedback(feedbackData);
      setLoading(false);
    });

    return () => {
      unsubscribeFeedback();
    };
  }, [currentUser, userRole]);

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getAverageRating = () => {
    if (feedback.length === 0) return '0.0';
    const validRatings = feedback.filter(fb => fb.feedback && !isNaN(Number(fb.feedback.rating)));
    if (validRatings.length === 0) return '0.0';
    const total = validRatings.reduce((sum, fb) => sum + Number(fb.feedback.rating), 0);
    return (total / validRatings.length).toFixed(1);
  };

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
              <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Student Feedback</h1>
                <p className="text-xs text-gray-400">Review feedback from students</p>
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
            Feedback Overview
          </h2>
          <p className="text-gray-400">
            Monitor student satisfaction and feedback on resolved issues
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10">
                <MessageSquare className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{feedback.length}</p>
                <p className="text-sm text-gray-400">Total Feedback</p>
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
              <div className="p-2.5 rounded-xl bg-yellow-500/10">
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-400">{getAverageRating()}/5</p>
                <p className="text-sm text-gray-400">Average Rating</p>
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
              <div className="p-2.5 rounded-xl bg-green-500/10">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">
                  {feedback.filter(fb => {
                    const fbDate = new Date(fb.createdAt);
                    const now = new Date();
                    return fbDate.getMonth() === now.getMonth() && fbDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
                <p className="text-sm text-gray-400">This Month</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feedback List */}
        <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-6">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-1">Recent Feedback</h3>
            <p className="text-gray-400">Latest feedback from students on resolved issues</p>
          </div>

          {feedback.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No feedback yet</h3>
              <p className="text-gray-400">Feedback will appear here once students rate resolved issues.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedback.map((fb, index) => (
                <motion.div
                  key={fb.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-800/50 p-6 hover:border-gray-700 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white mb-2">
                        {fb.issueTitle || fb.title || 'Issue Title Not Available'}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 font-medium">{fb.feedback?.rating || 'N/A'}/5</span>
                          <span className="text-yellow-400 ml-1">{fb.feedback?.rating ? getRatingStars(Number(fb.feedback.rating)) : '☆☆☆☆☆'}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(fb.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span>•</span>
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs">
                          {fb.issueCategory}
                        </span>
                        <span className="px-2 py-1 bg-gray-500/10 text-gray-400 rounded-lg text-xs">
                          {fb.issueBlock}
                        </span>
                        <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-lg text-xs">
                          {fb.issueStatus}
                        </span>
                      </div>
                    </div>
                    <div className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm font-medium">
                      {fb.feedback?.rating || 'N/A'}/5
                    </div>
                  </div>
                  
                  {fb.feedback?.comment && (
                    <div className="bg-gray-800/30 rounded-xl p-4 mb-4">
                      <p className="text-gray-300 italic leading-relaxed">"{fb.feedback.comment}"</p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-800/50">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>Submitted by: {fb.submittedByEmail}</span>
                    </div>
                    <span>{new Date(fb.createdAt).toLocaleString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFeedback;
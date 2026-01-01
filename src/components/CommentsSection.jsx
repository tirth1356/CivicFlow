import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, User, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CommentsSection = ({ issueId, comments = [], onAddComment, isOptional = true }) => {
  const [newComment, setNewComment] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser, userRole } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddComment({
        text: newComment.trim(),
        authorId: currentUser.uid,
        authorEmail: currentUser.email,
        authorRole: userRole,
        timestamp: new Date().toISOString(),
      });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="border-t border-gray-700/50 pt-4">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-4"
      >
        <MessageSquare className="w-4 h-4" />
        <span className="text-sm">
          Comments {comments.length > 0 && `(${comments.length})`}
          {isOptional && ' (Optional)'}
        </span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Comments List */}
            {comments.length > 0 && (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {comments.map((comment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800/30 rounded-lg p-3"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        comment.authorRole === 'admin' 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'bg-gray-600/50 text-gray-400'
                      }`}>
                        {comment.authorRole === 'admin' ? (
                          <Shield className="w-4 h-4" />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-white">
                            {comment.authorRole === 'admin' ? 'Admin' : 'Student'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(comment.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300">{comment.text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Add Comment Form */}
            {userRole === 'admin' && (
              <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a progress update or comment..."
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none"
                  rows={3}
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!newComment.trim() || isSubmitting}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span className="text-sm">
                      {isSubmitting ? 'Sending...' : 'Send'}
                    </span>
                  </button>
                </div>
              </form>
            )}

            {comments.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">
                No comments yet. {userRole === 'admin' && 'Add the first update!'}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommentsSection;
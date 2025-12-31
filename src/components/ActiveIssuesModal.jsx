import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getIssuesByBlock } from '../firebase/firestore';
import { 
  X, 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  Calendar,
  User,
  MapPin,
  Hash,
  Layers,
  Eye
} from 'lucide-react';

const ActiveIssuesModal = ({ isOpen, onClose, blockName }) => {
  const { isDark } = useTheme();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!isOpen || !blockName) return;

    setLoading(true);
    const unsubscribe = getIssuesByBlock(blockName, (snapshot) => {
      const issuesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setIssues(issuesData.filter(issue => issue.status !== 'Resolved'));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isOpen, blockName]);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Reported':
        return {
          color: 'text-yellow-400',
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/20',
          icon: AlertCircle
        };
      case 'In Progress':
        return {
          color: 'text-blue-400',
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20',
          icon: Clock
        };
      case 'Resolved':
        return {
          color: 'text-green-400',
          bg: 'bg-green-500/10',
          border: 'border-green-500/20',
          icon: CheckCircle
        };
      default:
        return {
          color: 'text-gray-400',
          bg: 'bg-gray-500/10',
          border: 'border-gray-500/20',
          icon: AlertCircle
        };
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Water': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      'Electricity': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
      'WiFi': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      'Cleanliness': 'text-green-400 bg-green-500/10 border-green-500/20',
      'Infrastructure': 'text-red-400 bg-red-500/10 border-red-500/20',
      'Safety': 'text-orange-400 bg-orange-500/10 border-orange-500/20'
    };
    return colors[category] || 'text-gray-400 bg-gray-500/10 border-gray-500/20';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Modal Content */}
        <div 
          className="fixed inset-4 md:inset-8 lg:inset-16 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`h-full rounded-2xl border transition-all duration-300 ${
            isDark 
              ? 'bg-gray-900 border-gray-800/50' 
              : 'bg-white border-gray-200'
          }`}>
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b transition-colors duration-300 ${
              isDark ? 'border-gray-800/50' : 'border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className={`text-xl font-bold transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Active Issues - {blockName}
                  </h2>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {loading ? 'Loading...' : `${issues.length} active issues`}
                  </p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100'
                }`}
              >
                <X className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : issues.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    No Active Issues
                  </h3>
                  <p className={`transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    All issues in {blockName} have been resolved!
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {issues.map((issue) => {
                    const statusConfig = getStatusConfig(issue.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <div
                        key={issue.id}
                        className={`rounded-xl border p-4 transition-all duration-300 ${
                          isDark 
                            ? 'bg-gray-800/30 border-gray-800/50 hover:border-gray-700' 
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          {/* Issue Image */}
                          {issue.imageUrl && (
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={issue.imageUrl}
                                alt={issue.title}
                                className="w-full h-full object-cover cursor-pointer"
                                onClick={() => setSelectedImage({
                                  url: issue.imageUrl,
                                  title: issue.title
                                })}
                              />
                              <button
                                onClick={() => setSelectedImage({
                                  url: issue.imageUrl,
                                  title: issue.title
                                })}
                                className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center"
                              >
                                <Eye className="w-4 h-4 text-white opacity-0 hover:opacity-100" />
                              </button>
                            </div>
                          )}

                          {/* Issue Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className={`font-semibold transition-colors duration-300 ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}>
                                {issue.title}
                              </h3>
                              <div className="flex items-center space-x-2 ml-4">
                                <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} flex items-center space-x-1`}>
                                  <StatusIcon className="w-3 h-3" />
                                  <span>{issue.status}</span>
                                </span>
                              </div>
                            </div>

                            <p className={`text-sm mb-3 transition-colors duration-300 ${
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {issue.description}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getCategoryColor(issue.category)}`}>
                                {issue.category}
                              </span>
                              {issue.priority && (
                                <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${
                                  issue.priority === 'high' 
                                    ? 'text-red-400 bg-red-500/10 border-red-500/20'
                                    : issue.priority === 'medium'
                                    ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
                                    : 'text-green-400 bg-green-500/10 border-green-500/20'
                                }`}>
                                  {issue.priority} priority
                                </span>
                              )}
                            </div>

                            {/* Location & Reporter Info */}
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center space-x-4">
                                {issue.floor && issue.floor !== 'Not specified' && (
                                  <span className={`flex items-center space-x-1 transition-colors duration-300 ${
                                    isDark ? 'text-gray-500' : 'text-gray-500'
                                  }`}>
                                    <Layers className="w-3 h-3" />
                                    <span>{issue.floor}</span>
                                  </span>
                                )}
                                {issue.room && issue.room !== 'Not specified' && (
                                  <span className={`flex items-center space-x-1 transition-colors duration-300 ${
                                    isDark ? 'text-gray-500' : 'text-gray-500'
                                  }`}>
                                    <Hash className="w-3 h-3" />
                                    <span>{issue.room}</span>
                                  </span>
                                )}
                                {issue.reportedByEmail && (
                                  <span className={`flex items-center space-x-1 transition-colors duration-300 ${
                                    isDark ? 'text-gray-500' : 'text-gray-500'
                                  }`}>
                                    <User className="w-3 h-3" />
                                    <span>{issue.reportedByEmail.split('@')[0]}</span>
                                  </span>
                                )}
                              </div>
                              
                              <span className={`flex items-center space-x-1 transition-colors duration-300 ${
                                isDark ? 'text-gray-500' : 'text-gray-500'
                              }`}>
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(issue.createdAt)}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="max-w-4xl w-full bg-gray-900 rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">{selectedImage.title}</h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActiveIssuesModal;
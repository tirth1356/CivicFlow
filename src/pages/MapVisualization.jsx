import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getAllIssues } from '../firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, BarChart3, TrendingUp, AlertCircle } from 'lucide-react';

const MapVisualization = () => {
  const { currentUser, userRole } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (currentUser && userRole !== 'admin') {
      navigate('/dashboard');
    }
  }, [currentUser, userRole, navigate]);

  // Fetch issues
  useEffect(() => {
    if (!currentUser || userRole !== 'admin') return;

    const unsubscribe = getAllIssues((snapshot) => {
      const issuesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setIssues(issuesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, userRole]);

  // Calculate block statistics
  const getBlockStats = () => {
    const blockStats = {};
    
    issues.forEach(issue => {
      if (!blockStats[issue.block]) {
        blockStats[issue.block] = {
          total: 0,
          resolved: 0,
          pending: 0,
          categories: {}
        };
      }
      
      blockStats[issue.block].total++;
      
      if (issue.status === 'Resolved') {
        blockStats[issue.block].resolved++;
      } else {
        blockStats[issue.block].pending++;
      }
      
      if (!blockStats[issue.block].categories[issue.category]) {
        blockStats[issue.block].categories[issue.category] = 0;
      }
      blockStats[issue.block].categories[issue.category]++;
    });
    
    return blockStats;
  };

  const blockStats = getBlockStats();

  const getBlockColor = (block) => {
    const stats = blockStats[block];
    if (!stats) return 'bg-gray-500';
    
    const pendingRatio = stats.pending / stats.total;
    
    if (pendingRatio > 0.7) return 'bg-red-500';
    if (pendingRatio > 0.4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className={`border-b backdrop-blur-sm transition-colors duration-300 ${
        isDark ? 'border-gray-800/50 bg-gray-900/60' : 'border-gray-200/50 bg-white/60'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/admin')}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100/50'
                }`}
              >
                <ArrowLeft className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className={`text-lg font-bold transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Map Visualization
                </h1>
                <p className={`text-xs transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Campus issue heatmap
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="mb-8">
          <h2 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Campus Issue Heatmap
          </h2>
          <p className={`transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Visual representation of issues across campus blocks
          </p>
        </div>

        {/* Legend */}
        <div className="mb-8">
          <div className={`rounded-2xl border p-6 transition-all duration-300 ${
            isDark 
              ? 'bg-gray-900/60 border-gray-800/50' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <BarChart3 className="w-5 h-5 mr-2" />
              Issue Density Legend
            </h3>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Low Issues (&lt;40%)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Medium Issues (40-70%)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  High Issues (&gt;70%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Campus Map Visualization */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Area */}
          <div className="lg:col-span-2">
            <div className={`rounded-2xl border p-6 transition-all duration-300 ${
              isDark 
                ? 'bg-gray-900/60 border-gray-800/50' 
                : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-6 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Campus Blocks
              </h3>
              
              {/* Simplified Campus Layout */}
              <div className={`relative rounded-xl p-8 min-h-[400px] transition-colors duration-300 ${
                isDark ? 'bg-gray-800/50' : 'bg-gray-100'
              }`}>
                {Object.entries(blockStats).map(([blockName, stats], index) => (
                  <div
                    key={blockName}
                    className={`absolute rounded-lg p-4 border-2 cursor-pointer hover:scale-105 transition-transform ${
                      isDark ? 'border-gray-600' : 'border-gray-400'
                    } ${getBlockColor(blockName)}/20`}
                    style={{
                      left: `${(index % 3) * 30 + 10}%`,
                      top: `${Math.floor(index / 3) * 25 + 10}%`,
                      width: '25%',
                      height: '20%'
                    }}
                  >
                    <div className={`w-3 h-3 ${getBlockColor(blockName)} rounded-full mb-2`}></div>
                    <div className={`font-semibold text-sm transition-colors duration-300 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {blockName}
                    </div>
                    <div className={`text-xs transition-colors duration-300 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {stats.total} issues
                    </div>
                    <div className={`text-xs transition-colors duration-300 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {stats.pending} pending
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Statistics Panel */}
          <div className="space-y-6">
            {/* Overall Stats */}
            <div className={`rounded-2xl border p-6 transition-all duration-300 ${
              isDark 
                ? 'bg-gray-900/60 border-gray-800/50' 
                : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 flex items-center transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <TrendingUp className="w-5 h-5 mr-2" />
                Overall Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className={`transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Total Issues:
                  </span>
                  <span className={`font-semibold transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {issues.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Resolved:
                  </span>
                  <span className="text-green-400 font-semibold">
                    {issues.filter(i => i.status === 'Resolved').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Pending:
                  </span>
                  <span className="text-yellow-400 font-semibold">
                    {issues.filter(i => i.status !== 'Resolved').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Block Details */}
            <div className={`rounded-2xl border p-6 transition-all duration-300 ${
              isDark 
                ? 'bg-gray-900/60 border-gray-800/50' 
                : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 flex items-center transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <AlertCircle className="w-5 h-5 mr-2" />
                Block Details
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {Object.entries(blockStats).map(([blockName, stats]) => (
                  <div key={blockName} className={`rounded-lg p-3 transition-colors duration-300 ${
                    isDark ? 'bg-gray-800/50' : 'bg-gray-100'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium transition-colors duration-300 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {blockName}
                      </span>
                      <div className={`w-3 h-3 ${getBlockColor(blockName)} rounded-full`}></div>
                    </div>
                    <div className={`text-xs space-y-1 transition-colors duration-300 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <div>Total: {stats.total}</div>
                      <div>Pending: {stats.pending}</div>
                      <div>Resolved: {stats.resolved}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Breakdown */}
            <div className={`rounded-2xl border p-6 transition-all duration-300 ${
              isDark 
                ? 'bg-gray-900/60 border-gray-800/50' 
                : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Category Breakdown
              </h3>
              <div className="space-y-2">
                {['Water', 'Electricity', 'WiFi', 'Cleanliness', 'Infrastructure'].map(category => {
                  const count = issues.filter(i => i.category === category).length;
                  const percentage = issues.length > 0 ? (count / issues.length * 100).toFixed(1) : 0;
                  
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <span className={`text-sm transition-colors duration-300 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {category}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs transition-colors duration-300 ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {count} ({percentage}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapVisualization;
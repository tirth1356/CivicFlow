import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  AlertTriangle, 
  X, 
  ExternalLink, 
  Settings, 
  Database,
  Shield,
  Cloud
} from 'lucide-react';

const FirebaseWarning = ({ isVisible, onClose }) => {
  const { isDark } = useTheme();
  const [dismissed, setDismissed] = useState(false);

  if (!isVisible || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    if (onClose) onClose();
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className={`rounded-2xl border p-6 shadow-2xl transition-all duration-300 ${
        isDark 
          ? 'bg-yellow-900/20 border-yellow-500/30 backdrop-blur-sm' 
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isDark ? 'bg-yellow-500/20' : 'bg-yellow-100'
            }`}>
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <h3 className={`font-semibold transition-colors duration-300 ${
                isDark ? 'text-yellow-400' : 'text-yellow-800'
              }`}>
                Firebase Configuration Required
              </h3>
              <p className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-yellow-300/80' : 'text-yellow-700'
              }`}>
                Setup needed for full functionality
              </p>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className={`p-1 rounded-lg transition-colors ${
              isDark 
                ? 'hover:bg-yellow-500/20 text-yellow-400' 
                : 'hover:bg-yellow-200 text-yellow-600'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <p className={`text-sm transition-colors duration-300 ${
            isDark ? 'text-yellow-200/90' : 'text-yellow-800'
          }`}>
            Firebase is not configured yet. The UI will work but authentication and data operations will not function.
          </p>

          {/* Setup Steps */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-200 text-yellow-800'
              }`}>
                1
              </div>
              <span className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-yellow-200/90' : 'text-yellow-800'
              }`}>
                Create Firebase project
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-200 text-yellow-800'
              }`}>
                2
              </div>
              <span className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-yellow-200/90' : 'text-yellow-800'
              }`}>
                Enable Authentication & Firestore
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-200 text-yellow-800'
              }`}>
                3
              </div>
              <span className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-yellow-200/90' : 'text-yellow-800'
              }`}>
                Update src/firebase/config.js
              </span>
            </div>
          </div>

          {/* Services Status */}
          <div className="space-y-2">
            <h4 className={`text-sm font-medium transition-colors duration-300 ${
              isDark ? 'text-yellow-300' : 'text-yellow-800'
            }`}>
              Required Services:
            </h4>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-red-400" />
                <span className={`text-xs transition-colors duration-300 ${
                  isDark ? 'text-yellow-200/80' : 'text-yellow-700'
                }`}>
                  Authentication
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-red-400" />
                <span className={`text-xs transition-colors duration-300 ${
                  isDark ? 'text-yellow-200/80' : 'text-yellow-700'
                }`}>
                  Firestore
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Cloud className="w-4 h-4 text-red-400" />
                <span className={`text-xs transition-colors duration-300 ${
                  isDark ? 'text-yellow-200/80' : 'text-yellow-700'
                }`}>
                  Storage
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4 text-red-400" />
                <span className={`text-xs transition-colors duration-300 ${
                  isDark ? 'text-yellow-200/80' : 'text-yellow-700'
                }`}>
                  Rules
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-2 pt-2">
            <a
              href="https://console.firebase.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isDark
                  ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30'
                  : 'bg-yellow-200 hover:bg-yellow-300 text-yellow-800 border border-yellow-300'
              }`}
            >
              <span>Open Firebase Console</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            
            <button
              onClick={handleDismiss}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDark
                  ? 'text-yellow-400/80 hover:text-yellow-400'
                  : 'text-yellow-700 hover:text-yellow-800'
              }`}
            >
              I'll configure this later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseWarning;
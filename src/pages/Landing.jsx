import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  ArrowRight, 
  CheckCircle, 
  Shield, 
  Zap, 
  Users, 
  MapPin,
  AlertCircle,
  Clock,
  BarChart3,
  Smartphone,
  Globe,
  Star
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { isDark } = useTheme();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: AlertCircle,
      title: 'Report Issues Instantly',
      description: 'Quickly report campus issues with photos and detailed descriptions',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: MapPin,
      title: 'Interactive Campus Map',
      description: 'Visual map showing issue locations and campus blocks',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      icon: Clock,
      title: 'Real-time Tracking',
      description: 'Track issue status from reported to resolved in real-time',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Comprehensive analytics for administrators to track trends',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10'
    }
  ];

  const stats = [
    { label: 'Issues Resolved', value: '500+', icon: CheckCircle },
    { label: 'Active Users', value: '200+', icon: Users },
    { label: 'Campus Blocks', value: '22', icon: MapPin },
    { label: 'Response Time', value: '<24h', icon: Clock }
  ];

  const handleGetStarted = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Campus Issue
              <span className="block text-blue-600">Management</span>
            </h1>
            
            <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto transition-colors duration-300 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Report, track, and resolve campus issues efficiently with our comprehensive management platform
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => navigate('/map')}
                className={`px-8 py-4 rounded-xl font-semibold text-lg border transition-all duration-300 ${
                  isDark 
                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                View Campus Map
              </button>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Stats Section */}
      <div className={`py-16 border-y transition-colors duration-300 ${
        isDark ? 'border-gray-800 bg-gray-800/50' : 'border-gray-200 bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                  isDark ? 'bg-blue-500/10' : 'bg-blue-100'
                }`}>
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {stat.value}
                </div>
                <div className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Powerful Features
            </h2>
            <p className={`text-xl transition-colors duration-300 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Everything you need to manage campus issues effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                onMouseEnter={() => setActiveFeature(index)}
                className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  activeFeature === index
                    ? isDark
                      ? 'bg-gray-800/50 border-gray-700'
                      : 'bg-white border-gray-300 shadow-lg'
                    : isDark
                      ? 'bg-gray-800/30 border-gray-800'
                      : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${feature.bgColor}`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={`transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className={`py-20 transition-colors duration-300 ${
        isDark ? 'bg-gray-800/50' : 'bg-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              How It Works
            </h2>
            <p className={`text-xl transition-colors duration-300 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Simple steps to report and resolve campus issues
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Report Issue',
                description: 'Take a photo and describe the issue with location details',
                icon: AlertCircle
              },
              {
                step: '02',
                title: 'Track Progress',
                description: 'Monitor the status as it moves from reported to in-progress',
                icon: Clock
              },
              {
                step: '03',
                title: 'Issue Resolved',
                description: 'Get notified when the issue is resolved and provide feedback',
                icon: CheckCircle
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                  isDark ? 'bg-blue-500/10' : 'bg-blue-100'
                }`}>
                  <item.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-sm font-bold text-blue-600 mb-2">{item.step}</div>
                <h3 className={`text-xl font-semibold mb-4 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {item.title}
                </h3>
                <p className={`transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-4xl font-bold mb-6 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Ready to Get Started?
          </h2>
          <p className={`text-xl mb-8 transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Join hundreds of students and staff making campus better every day
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-lg shadow-lg transition-all duration-300"
            >
              {currentUser ? 'Go to Dashboard' : 'Sign Up Free'}
            </button>
            
            {!currentUser && (
              <button
                onClick={() => navigate('/login')}
                className={`px-8 py-4 rounded-xl font-semibold text-lg border transition-all duration-300 ${
                  isDark 
                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Already have an account?
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`py-12 border-t transition-colors duration-300 ${
        isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xl font-bold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                CivicFlow
              </span>
            </div>
            <p className={`transition-colors duration-300 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Built with ❤️ by Team Catalyst
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <span className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Divy Mevada • Tirth Patel • Yatri Patel • Kushal Vanjara
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, AlertCircle, Mail, ArrowRight } from 'lucide-react';

const VerifyAdmin = () => {
  const { currentUser, userRole } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Check if user is admin and email is verified
    const checkAdminStatus = () => {
      const isAdmin = currentUser.email?.toLowerCase().includes('admin');
      const emailVerified = currentUser.emailVerified;
      
      setIsVerified(isAdmin && emailVerified);
      setLoading(false);

      // Redirect if verified admin
      if (isAdmin && emailVerified) {
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
      }
    };

    checkAdminStatus();
  }, [currentUser, navigate]);

  const handleResendVerification = async () => {
    try {
      await currentUser.sendEmailVerification();
      alert('Verification email sent! Please check your inbox.');
    } catch (error) {
      console.error('Error sending verification email:', error);
      alert('Failed to send verification email. Please try again.');
    }
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
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
            isVerified 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            {isVerified ? (
              <CheckCircle className="w-8 h-8" />
            ) : (
              <Shield className="w-8 h-8" />
            )}
          </div>
          
          <h2 className={`text-3xl font-bold transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {isVerified ? 'Admin Verified!' : 'Admin Verification Required'}
          </h2>
          
          <p className={`mt-2 text-sm transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {isVerified 
              ? 'Redirecting to admin dashboard...'
              : 'Please verify your admin email to continue'
            }
          </p>
        </div>

        {!isVerified && (
          <div className={`rounded-2xl border p-8 transition-all duration-300 ${
            isDark 
              ? 'bg-gray-800/50 border-gray-700/50' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <span className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Admin access requires email verification
                </span>
              </div>

              <div className={`p-4 rounded-lg transition-colors duration-300 ${
                isDark ? 'bg-gray-700/50' : 'bg-gray-100'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span className={`text-sm font-medium transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Email: {currentUser?.email}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    currentUser?.emailVerified ? 'bg-green-400' : 'bg-red-400'
                  }`}></div>
                  <span className={`text-xs transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {currentUser?.emailVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
              </div>

              {!currentUser?.emailVerified && (
                <div className="space-y-4">
                  <p className={`text-sm transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    We've sent a verification email to your address. Please check your inbox and click the verification link.
                  </p>
                  
                  <button
                    onClick={handleResendVerification}
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Resend Verification Email</span>
                  </button>
                </div>
              )}

              <div className="pt-4 border-t border-gray-700/50">
                <button
                  onClick={() => navigate('/login')}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isDark 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>Back to Login</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {isVerified && (
          <div className={`rounded-2xl border p-8 text-center transition-all duration-300 ${
            isDark 
              ? 'bg-green-500/10 border-green-500/20' 
              : 'bg-green-50 border-green-200'
          }`}>
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Admin Access Granted
            </h3>
            <p className={`text-sm transition-colors duration-300 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              You will be redirected to the admin dashboard shortly...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyAdmin;
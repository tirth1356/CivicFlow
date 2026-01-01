import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { sendEmailVerification } from 'firebase/auth';
import { Mail, CheckCircle, RefreshCw, ArrowLeft } from 'lucide-react';

const VerifyEmail = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [checkingVerification, setCheckingVerification] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (currentUser.emailVerified) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleResendVerification = async () => {
    if (!currentUser) return;

    setIsResending(true);
    setResendMessage('');

    try {
      await sendEmailVerification(currentUser);
      setResendMessage('Verification email sent! Please check your inbox.');
    } catch (error) {
      console.error('Error sending verification email:', error);
      setResendMessage('Failed to send verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!currentUser) return;

    setCheckingVerification(true);
    
    try {
      await currentUser.reload();
      if (currentUser.emailVerified) {
        navigate('/dashboard');
      } else {
        setResendMessage('Email not verified yet. Please check your inbox and click the verification link.');
      }
    } catch (error) {
      console.error('Error checking verification:', error);
      setResendMessage('Error checking verification status. Please try again.');
    } finally {
      setCheckingVerification(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 text-center">
          {/* Header */}
          <div className="mb-8">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Verify Your Email</h1>
            <p className="text-gray-400">
              We've automatically sent a verification link to
            </p>
            <p className="text-blue-400 font-medium mt-1">
              {currentUser.email}
            </p>
          </div>

          {/* Instructions */}
          <div className="mb-8 text-left">
            <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                Next Steps:
              </h3>
              <ol className="text-gray-300 text-sm space-y-2">
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">1</span>
                  Check your email inbox (and spam folder)
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">2</span>
                  Click the verification link in the email
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">3</span>
                  Return here and click "I've Verified My Email"
                </li>
              </ol>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleCheckVerification}
              disabled={checkingVerification}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2"
            >
              {checkingVerification ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>I've Verified My Email</span>
                </>
              )}
            </button>

            <button
              onClick={handleResendVerification}
              disabled={isResending}
              className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700/50 text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  <span>Resend Verification Email</span>
                </>
              )}
            </button>
          </div>

          {/* Status Message */}
          {resendMessage && (
            <div className={`mt-4 p-3 rounded-xl text-sm ${
              resendMessage.includes('sent') || resendMessage.includes('Verification email sent')
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {resendMessage}
            </div>
          )}

          {/* Back to Login */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <button
              onClick={() => navigate('/login')}
              className="text-gray-400 hover:text-white transition-colors flex items-center justify-center space-x-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
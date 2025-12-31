import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyResetCode, confirmReset } from '../firebase/auth';
import Modal from '../components/Modal';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [email, setEmail] = useState('');
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  const code = searchParams.get('oobCode');

  useEffect(() => {
    const verifyCode = async () => {
      if (!code) {
        setModal({
          isOpen: true,
          title: 'Invalid Link',
          message: 'This password reset link is invalid or has expired.',
          type: 'error'
        });
        setVerifying(false);
        return;
      }

      try {
        const userEmail = await verifyResetCode(code);
        setEmail(userEmail);
        setVerifying(false);
      } catch (error) {
        console.error('Code verification error:', error);
        setModal({
          isOpen: true,
          title: 'Invalid Link',
          message: 'This password reset link is invalid or has expired.',
          type: 'error'
        });
        setVerifying(false);
      }
    };

    verifyCode();
  }, [code]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwords.password !== passwords.confirmPassword) {
      setModal({
        isOpen: true,
        title: 'Password Mismatch',
        message: 'Passwords do not match. Please try again.',
        type: 'error'
      });
      return;
    }

    if (passwords.password.length < 6) {
      setModal({
        isOpen: true,
        title: 'Weak Password',
        message: 'Password must be at least 6 characters long.',
        type: 'error'
      });
      return;
    }

    setLoading(true);

    try {
      await confirmReset(code, passwords.password);
      setModal({
        isOpen: true,
        title: 'Password Reset Successful!',
        message: 'Your password has been successfully reset. You can now sign in with your new password.',
        type: 'success'
      });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Password reset error:', error);
      setModal({
        isOpen: true,
        title: 'Reset Failed',
        message: 'Failed to reset password. The link may have expired. Please request a new reset link.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Verifying reset link...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white">
            Set New Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Enter your new password for {email}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={passwords.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter new password"
              minLength="6"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={passwords.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm new password"
              minLength="6"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>

        <Modal
          isOpen={modal.isOpen}
          onClose={() => setModal({ ...modal, isOpen: false })}
          title={modal.title}
          message={modal.message}
          type={modal.type}
        />
      </div>
    </div>
  );
};

export default ResetPassword;
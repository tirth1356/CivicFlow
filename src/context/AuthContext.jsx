import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChange, getUserRole, logout as firebaseLogout } from '../firebase/auth';
import { isAdminEmail } from '../config/adminConfig';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Force role detection on every auth state change
          const role = isAdminEmail(user.email) ? 'admin' : 'student';
          
          console.log('Role detected:', role, 'for email:', user.email);
          setUserRole(role);
          localStorage.setItem('userRole', role);
        } catch (error) {
          console.error('Error getting user role:', error);
          // Fallback to cached role or default
          const cachedRole = localStorage.getItem('userRole') || 'student';
          setUserRole(cachedRole);
        }
      } else {
        setUserRole(null);
        localStorage.removeItem('userRole');
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Force role refresh function
  const refreshRole = () => {
    if (currentUser) {
      const role = isAdminEmail(currentUser.email) ? 'admin' : 'student';
      
      console.log('Force role refresh:', role, 'for email:', currentUser.email);
      setUserRole(role);
      localStorage.setItem('userRole', role);
    }
  };

  const logout = async () => {
    try {
      await firebaseLogout();
      setCurrentUser(null);
      setUserRole(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userRole,
    loading,
    logout,
    refreshRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  updateProfile,
  onAuthStateChanged,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { isAdminEmail } from '../config/adminConfig';

// Check if Firebase is available
const isFirebaseAvailable = auth !== null && db !== null;

/**
 * Sign up a new user
 */
export const signUp = async (email, password, additionalData = {}) => {
  if (!isFirebaseAvailable) {
    throw new Error('Firebase is not configured. Please set up Firebase first.');
  }

  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send email verification immediately
    await sendEmailVerification(user);

    // Determine user role based on email
    const role = isAdminEmail(email) ? 'admin' : 'student';

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      role: role,
      createdAt: new Date().toISOString(),
      ...additionalData
    });

    // Cache role in localStorage
    localStorage.setItem('userRole', role);

    return { user, role };
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

/**
 * Alias for signUp
 */
export const signup = signUp;

/**
 * Sign in existing user
 */
export const signIn = async (email, password) => {
  if (!isFirebaseAvailable) {
    throw new Error('Firebase is not configured. Please set up Firebase first.');
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Determine role based on email
    const role = isAdminEmail(email) ? 'admin' : 'student';

    // Cache role in localStorage
    localStorage.setItem('userRole', role);

    return { user, role };
  } catch (error) {
    console.error('Login error:', error);
    
    // Convert Firebase error codes to user-friendly messages
    let errorMessage = 'Login failed. Please try again.';
    
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        errorMessage = 'Email or password is incorrect';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your connection';
        break;
      default:
        errorMessage = 'Email or password is incorrect';
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Alias for signIn
 */
export const login = signIn;

/**
 * Sign out current user
 */
export const logOut = async () => {
  if (!isFirebaseAvailable) {
    return;
  }

  try {
    await signOut(auth);
    // Clear cached role
    localStorage.removeItem('userRole');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Alias for logOut
 */
export const logout = logOut;

/**
 * Send password reset email (alias)
 */
export const resetPassword = async (email) => {
  if (!isFirebaseAvailable) {
    throw new Error('Firebase is not configured. Please set up Firebase first.');
  }

  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Password reset error:', error);
    
    let errorMessage = 'Failed to send reset email. Please try again.';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email address';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many requests. Please try again later';
        break;
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Send password reset email
 */
export const sendPasswordReset = async (email) => {
  return await resetPassword(email);
};

/**
 * Verify password reset code
 */
export const verifyResetCode = async (code) => {
  if (!isFirebaseAvailable) {
    throw new Error('Firebase is not configured. Please set up Firebase first.');
  }

  try {
    const email = await verifyPasswordResetCode(auth, code);
    return email;
  } catch (error) {
    console.error('Reset code verification error:', error);
    
    let errorMessage = 'Invalid or expired reset code.';
    
    switch (error.code) {
      case 'auth/expired-action-code':
        errorMessage = 'Reset code has expired. Please request a new one.';
        break;
      case 'auth/invalid-action-code':
        errorMessage = 'Invalid reset code. Please check and try again.';
        break;
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Confirm password reset with code
 */
export const confirmReset = async (code, newPassword) => {
  if (!isFirebaseAvailable) {
    throw new Error('Firebase is not configured. Please set up Firebase first.');
  }

  try {
    await confirmPasswordReset(auth, code, newPassword);
  } catch (error) {
    console.error('Password reset confirmation error:', error);
    
    let errorMessage = 'Failed to reset password. Please try again.';
    
    switch (error.code) {
      case 'auth/expired-action-code':
        errorMessage = 'Reset code has expired. Please request a new one.';
        break;
      case 'auth/invalid-action-code':
        errorMessage = 'Invalid reset code. Please check and try again.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password is too weak. Please choose a stronger password.';
        break;
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Get user role from Firestore
 */
export const getUserRole = async (userId) => {
  // Always use localStorage for role to avoid Firestore permission issues
  const cachedRole = localStorage.getItem('userRole');
  if (cachedRole) {
    return cachedRole;
  }

  // Default to student if no cached role
  const defaultRole = 'student';
  localStorage.setItem('userRole', defaultRole);
  return defaultRole;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (updates) => {
  if (!isFirebaseAvailable) {
    throw new Error('Firebase is not configured. Please set up Firebase first.');
  }

  try {
    const user = auth.currentUser;
    if (user) {
      await updateProfile(user, updates);
      
      // Update Firestore document if needed
      if (updates.role) {
        await setDoc(doc(db, 'users', user.uid), {
          role: updates.role,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        
        localStorage.setItem('userRole', updates.role);
      }
    }
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
};

/**
 * Auth state observer
 */
export const onAuthStateChange = (callback) => {
  if (!isFirebaseAvailable) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
};
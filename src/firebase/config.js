// Firebase Configuration
// Environment variables are loaded from .env file
// For production, set these in your hosting platform (Vercel, Netlify, etc.)

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration using environment variables with fallbacks
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBdiktNOvHBkJeNStBZ7QQzbANXcAFLs3g",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "catalyst-10.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "catalyst-10",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "catalyst-10.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "4281423121561:428142312156:web:ee270894a6869725661219",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:4281423121561:web:ee270894a6869725661219",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-SHLRJBM5XZ"
};

// Check if Firebase is configured
const isFirebaseConfigured = firebaseConfig.apiKey && firebaseConfig.projectId;

// Initialize Firebase only if configured
let app, auth, db, storage;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
} else {
  console.warn('⚠️ Firebase not configured yet. UI will work but authentication and data operations will not function.');
  console.warn('Please configure Firebase in src/firebase/config.js');
  
  // Create mock objects to prevent crashes
  auth = null;
  db = null;
  storage = null;
  app = null;
}

export { auth, db, storage };
export default app;


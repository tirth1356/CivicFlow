// Firebase Configuration
// Replace these values with your Firebase project configuration
// Get these from: Firebase Console > Project Settings > General > Your apps > Web app

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Replace with your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdiktNOvHBkJeNStBZ7QQzbANXcAFLs3g",
  authDomain: "catalyst-10.firebaseapp.com",
  projectId: "catalyst-10",
  storageBucket: "catalyst-10.firebasestorage.app",
  messagingSenderId: "4281423121561:428142312156:web:ee270894a6869725661219",
  appId: "1:4281423121561:web:ee270894a6869725661219",
  measurementId: "G-SHLRJBM5XZ"
};

// Check if Firebase is configured
const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY" && 
                              firebaseConfig.projectId !== "YOUR_PROJECT_ID";

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


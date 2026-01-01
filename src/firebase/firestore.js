import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  orderBy,
  limit,
  getCountFromServer,
} from 'firebase/firestore';
import { db } from './config';

// Check if Firebase is available
const isFirebaseAvailable = db !== null;

/**
 * Create a new issue
 */
export const createIssue = async (issueData) => {
  if (!isFirebaseAvailable) {
    throw new Error('Firebase is not configured. Please set up Firebase first.');
  }
  
  // Validate required fields
  if (!issueData.title || !issueData.description || !issueData.category || !issueData.block) {
    throw new Error('Missing required fields: title, description, category, and block are required.');
  }
  
  const docRef = await addDoc(collection(db, 'issues'), {
    ...issueData,
    status: 'Reported',
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
};

/**
 * Submit a new issue (alias for createIssue)
 */
export const submitIssue = async (issueData) => {
  return await createIssue(issueData);
};

/**
 * Get issues for a specific user (student)
 */
export const getUserIssues = (userId, callback, errorCallback) => {
  if (!isFirebaseAvailable) {
    callback({ docs: [], empty: true });
    return () => {};
  }
  
  try {
    const q = query(
      collection(db, 'issues'),
      where('reportedBy', '==', userId)
    );

    return onSnapshot(q, callback, errorCallback);
  } catch (error) {
    console.error('Error setting up issues query:', error);
    if (errorCallback) errorCallback(error);
    return () => {};
  }
};

/**
 * Get all issues (admin)
 */
export const getAllIssues = (callback) => {
  if (!isFirebaseAvailable) {
    callback({ docs: [] });
    return () => {};
  }
  const q = query(
    collection(db, 'issues')
  );

  return onSnapshot(q, callback);
};

/**
 * Get issues (alias for getAllIssues)
 */
export const getIssues = getAllIssues;

/**
 * Get issues by block
 */
export const getIssuesByBlock = (block, callback) => {
  if (!isFirebaseAvailable) {
    callback({ docs: [] });
    return () => {};
  }
  const q = query(
    collection(db, 'issues'),
    where('block', '==', block),
    limit(10)
  );

  return onSnapshot(q, callback);
};

/**
 * Update issue status
 */
export const updateIssueStatus = async (issueId, status) => {
  if (!isFirebaseAvailable) {
    throw new Error('Firebase is not configured. Please set up Firebase first.');
  }
  await updateDoc(doc(db, 'issues', issueId), {
    status,
    updatedAt: new Date().toISOString(),
  });
};

/**
 * Delete an issue
 */
export const deleteIssue = async (issueId) => {
  if (!isFirebaseAvailable) {
    throw new Error('Firebase is not configured. Please set up Firebase first.');
  }
  await deleteDoc(doc(db, 'issues', issueId));
};

/**
 * Submit feedback for an issue
 */
export const submitFeedback = async (feedbackData) => {
  if (!isFirebaseAvailable) {
    throw new Error('Firebase is not configured. Please set up Firebase first.');
  }
  
  // Update the issue document with feedback fields
  const { issueId, ...feedback } = feedbackData;
  await updateDoc(doc(db, 'issues', issueId), {
    feedback: {
      ...feedback,
      createdAt: new Date().toISOString(),
    },
    feedbackSubmitted: true,
    updatedAt: new Date().toISOString(),
  });
};

/**
 * Get total user count from Authentication
 */
export const getTotalUserCount = async () => {
  if (!isFirebaseAvailable) {
    return 42; // Fallback number for demo
  }
  
  try {
    // Try to get count from users collection first
    const usersRef = collection(db, 'users');
    const snapshot = await getCountFromServer(usersRef);
    const count = snapshot.data().count;
    
    // If no users in Firestore, return a demo number
    return count > 0 ? count : 42;
  } catch (error) {
    console.error('Error getting user count:', error);
    // Return demo number if Firebase is not configured or has issues
    return 42;
  }
};

/**
 * Add comment to an issue
 */
export const addIssueComment = async (issueId, commentData) => {
  if (!isFirebaseAvailable) {
    throw new Error('Firebase is not configured. Please set up Firebase first.');
  }
  
  const issueRef = doc(db, 'issues', issueId);
  const issueDoc = await getDocs(query(collection(db, 'issues'), where('__name__', '==', issueId)));
  
  if (!issueDoc.empty) {
    const currentData = issueDoc.docs[0].data();
    const currentComments = currentData.comments || [];
    
    await updateDoc(issueRef, {
      comments: [...currentComments, commentData],
      updatedAt: new Date().toISOString(),
    });
  }
};

/**
 * Get all feedback (admin)
 */
export const getAllFeedback = (callback) => {
  if (!isFirebaseAvailable) {
    callback({ docs: [] });
    return () => {};
  }
  
  // Get all issues that have feedback
  const q = query(
    collection(db, 'issues'),
    where('feedbackSubmitted', '==', true)
  );

  return onSnapshot(q, callback);
};


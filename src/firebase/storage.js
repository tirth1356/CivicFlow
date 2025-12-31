import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

// Check if Firebase Storage is available
const isStorageAvailable = storage !== null;

/**
 * Upload an issue image to Firebase Storage
 */
export const uploadIssueImage = async (file, issueId) => {
  if (!isStorageAvailable) {
    throw new Error('Firebase Storage is not configured. Please set up Firebase first.');
  }

  if (!file) {
    throw new Error('No file provided for upload');
  }

  try {
    // Create a reference to the file location
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `issues/${issueId}/${fileName}`);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image to Firebase Storage:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
};

/**
 * Upload a user profile image to Firebase Storage
 */
export const uploadProfileImage = async (file, userId) => {
  if (!isStorageAvailable) {
    throw new Error('Firebase Storage is not configured. Please set up Firebase first.');
  }

  if (!file) {
    throw new Error('No file provided for upload');
  }

  try {
    const fileName = `profile_${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `profiles/${userId}/${fileName}`);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw new Error('Failed to upload profile image. Please try again.');
  }
};

/**
 * Delete an image from Firebase Storage
 */
export const deleteImage = async (imageUrl) => {
  if (!isStorageAvailable) {
    throw new Error('Firebase Storage is not configured. Please set up Firebase first.');
  }

  if (!imageUrl) {
    return;
  }

  try {
    // Create a reference from the URL
    const imageRef = ref(storage, imageUrl);
    
    // Delete the file
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image from Firebase Storage:', error);
    // Don't throw error for delete operations to avoid blocking other operations
  }
};

/**
 * Upload multiple images for an issue
 */
export const uploadMultipleImages = async (files, issueId) => {
  if (!isStorageAvailable) {
    throw new Error('Firebase Storage is not configured. Please set up Firebase first.');
  }

  if (!files || files.length === 0) {
    return [];
  }

  try {
    const uploadPromises = Array.from(files).map(async (file, index) => {
      const fileName = `${Date.now()}_${index}_${file.name}`;
      const storageRef = ref(storage, `issues/${issueId}/${fileName}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    });

    const downloadURLs = await Promise.all(uploadPromises);
    return downloadURLs;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw new Error('Failed to upload images. Please try again.');
  }
};

/**
 * Get image metadata
 */
export const getImageMetadata = async (imageUrl) => {
  if (!isStorageAvailable) {
    throw new Error('Firebase Storage is not configured. Please set up Firebase first.');
  }

  try {
    const imageRef = ref(storage, imageUrl);
    const metadata = await getMetadata(imageRef);
    return metadata;
  } catch (error) {
    console.error('Error getting image metadata:', error);
    return null;
  }
};

/**
 * Validate file before upload
 */
export const validateImageFile = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (!file) {
    throw new Error('No file selected');
  }

  if (file.size > maxSize) {
    throw new Error('File size must be less than 5MB');
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only JPEG, PNG, GIF, and WebP images are allowed');
  }

  return true;
};

/**
 * Compress image before upload (basic client-side compression)
 */
export const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      // Draw and compress
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(resolve, file.type, quality);
    };

    img.src = URL.createObjectURL(file);
  });
};
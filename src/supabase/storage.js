import { supabase } from './config';

/**
 * Upload issue image to Supabase Storage
 * @param {File} file - Image file to upload
 * @param {string} issueId - Issue ID for filename
 * @returns {Promise<string|null>} - Public URL of uploaded image or null
 */
export const uploadIssueImage = async (file, issueId) => {
  if (!supabase) {
    console.warn('Supabase not configured. Skipping image upload.');
    return null;
  }

  console.log('🔄 Starting image upload:', { fileName: file.name, fileSize: file.size, issueId });

  // Try simple upload first (no subfolder)
  const simpleResult = await uploadImageSimple(file, issueId);
  if (simpleResult) {
    return simpleResult;
  }

  // Fallback to original method
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${issueId}-${Date.now()}.${fileExt}`;
    const filePath = `issues/${fileName}`;

    console.log('📁 Fallback upload path:', filePath);

    const { data, error } = await supabase.storage
      .from('issue-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });

    if (error) {
      console.error('❌ Fallback upload error:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('issue-images')
      .getPublicUrl(filePath);

    console.log('✅ Fallback upload successful:', publicUrl);
    return publicUrl;

  } catch (error) {
    console.error('💥 All upload methods failed:', error);
    return null;
  }
};

/**
 * Alternative upload method for RLS issues
 */
const uploadWithPublicAccess = async (file, filePath) => {
  console.log('🔄 Alternative upload method for:', filePath);
  
  try {
    const { data, error } = await supabase.storage
      .from('issue-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Allow overwrite
      });

    if (error) {
      console.error('❌ Alternative upload failed:', error);
      return null;
    }

    console.log('✅ Alternative upload successful:', data);

    const { data: { publicUrl } } = supabase.storage
      .from('issue-images')
      .getPublicUrl(filePath);

    console.log('🔗 Alternative method public URL:', publicUrl);
    return publicUrl;
    
  } catch (error) {
    console.error('💥 Alternative upload error:', error);
    return null;
  }
};

/**
 * Simple upload method that bypasses some RLS issues
 */
export const uploadImageSimple = async (file, issueId) => {
  if (!supabase) {
    console.warn('Supabase not configured.');
    return null;
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${issueId}-${Date.now()}.${fileExt}`;
    const filePath = fileName; // No subfolder to avoid RLS issues

    console.log('🔄 Simple upload:', filePath);

    // Try direct upload without subfolder
    const { data, error } = await supabase.storage
      .from('issue-images')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type
      });

    if (error) {
      console.error('❌ Simple upload error:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('issue-images')
      .getPublicUrl(filePath);

    console.log('✅ Simple upload successful:', publicUrl);
    return publicUrl;

  } catch (error) {
    console.error('💥 Simple upload failed:', error);
    return null;
  }
};

export const deleteIssueImage = async (imageUrl) => {
  if (!supabase || !imageUrl) {
    return false;
  }

  try {
    // Extract file path from URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `issues/${fileName}`;

    const { error } = await supabase.storage
      .from('issue-images')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    console.log('✅ Image deleted successfully');
    return true;

  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};
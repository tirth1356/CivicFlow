
export const ADMIN_EMAILS = [
  '24bce288@nirmauni.ac.in',      // Replace with your actual admin emails 
];

// Function to check if an email is admin
export const isAdminEmail = (email) => {
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

// Campus email domain configuration
export const CAMPUS_EMAIL_DOMAIN = '@nirmauni.ac.in'; // Update this with your campus domain
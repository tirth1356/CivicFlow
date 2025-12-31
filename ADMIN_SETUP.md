# 🔧 Admin Access Setup Guide

## Quick Fix for Admin Access

### Step 1: Add Your Admin Emails

1. **Open** `src/config/adminConfig.js`
2. **Replace** the example emails with your actual admin emails:

```javascript
export const ADMIN_EMAILS = [
  'your-actual-email@domain.com',    // Replace with your email
  'admin@yourcampus.edu',            // Add your admin emails here
  'supervisor@yourcampus.edu',       // Add more as needed
];
```

### Step 2: Test Admin Access

1. **Save** the file
2. **Refresh** your browser or restart the dev server
3. **Login** with one of the admin emails
4. You should now see **Admin Dashboard** instead of Student Dashboard

### Step 3: Verify Admin Features

✅ **Admin Dashboard** should be accessible  
✅ **View All Issues** (not just your own)  
✅ **Update Issue Status**  
✅ **Admin Analytics**  
✅ **Campus Map** with all issues  

## 🚨 Important Notes

- **No Firebase changes needed** - this works with email-based role detection
- **Instant effect** - changes apply immediately after saving the config file
- **Case insensitive** - emails are automatically converted to lowercase
- **Secure** - admin status is determined by email, not user input

## 🐛 Still Not Working?

1. **Clear browser cache** and localStorage
2. **Logout and login again**
3. **Check console** for any error messages
4. **Verify email spelling** in the config file

The admin access should work immediately after updating the email list!
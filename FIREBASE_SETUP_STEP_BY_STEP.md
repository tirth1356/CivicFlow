# 🔥 Firebase Setup - Step by Step Guide

Follow these steps in order to set up Firebase for CivicFlow.

---

## 📋 Prerequisites

- Google account (Gmail)
- 10-15 minutes
- Your campus email domain (e.g., `@campus.edu`)

---

## Step 1: Create Firebase Project

1. **Go to Firebase Console**

   - Visit: https://console.firebase.google.com/
   - Sign in with your Google account

2. **Create New Project**

   - Click **"Add project"** or **"Create a project"** button
   - Enter project name: `civicflow` (or any name you prefer)
   - Click **Continue**

3. **Configure Google Analytics** (Optional)

   - You can disable it for now (toggle OFF)
   - Or enable it if you want analytics
   - Click **Continue**

4. **Wait for Project Creation**
   - Firebase will create your project (takes ~30 seconds)
   - Click **Continue** when done

✅ **You now have a Firebase project!**

---

## Step 2: Enable Authentication

1. **Navigate to Authentication**

   - In the left sidebar, click **Build** > **Authentication**
   - Or click **Authentication** directly

2. **Get Started**

   - Click the **"Get started"** button

3. **Enable Email/Password**
   - Click on the **"Sign-in method"** tab (at the top)
   - Find **"Email/Password"** in the list
   - Click on it
   - Toggle **"Enable"** to ON
   - Click **Save**

✅ **Authentication is now enabled! Email verification works automatically.**

---

## Step 3: Create Firestore Database

1. **Navigate to Firestore**

   - In the left sidebar, click **Build** > **Firestore Database**
   - Or click **Firestore Database** directly

2. **Create Database**

   - Click **"Create database"** button

3. **Choose Security Rules**

   - Select **"Start in production mode"** (we'll add rules next)
   - Click **Next**

4. **Choose Location**

   - Select a location closest to you (e.g., `us-central`, `asia-south1`)
   - Click **Enable**
   - Wait for database creation (~30 seconds)

5. **Set Security Rules**
   - Once database is created, click on the **"Rules"** tab
   - You'll see default rules - **delete them**
   - Open `firestore.rules` file from your project
   - **Copy ALL the content** from that file
   - **Paste** it into the Firebase Console rules editor
   - Click **"Publish"** button
   - You should see: "Rules published successfully"

✅ **Firestore database is ready with security rules!**

---

## Step 4: Enable Firebase Storage (OPTIONAL - Skip if you don't want image uploads)

> ⚠️ **Note:** Storage requires Blaze (pay-as-you-go) plan, but has a generous free tier (5GB storage, 1GB/day downloads).
> **You can skip this step** - your app works perfectly without Storage! Image uploads are optional.

### Option A: Skip Storage (Recommended for now)

- ✅ Your app will work fine without images
- ✅ Users can still report issues
- ✅ Continue to Step 5

### Option B: Enable Storage (If you want image uploads)

1. **Upgrade to Blaze Plan** (if not already)

   - Go to **Usage and billing** in Firebase Console
   - Click **"Modify plan"** or **"Upgrade"**
   - Select **Blaze plan** (free tier: 5GB storage, 1GB/day downloads)
   - Add billing info (you won't be charged unless you exceed free limits)

2. **Navigate to Storage**

   - In the left sidebar, click **Build** > **Storage**
   - Or click **Storage** directly

3. **Get Started**

   - Click **"Get started"** button

4. **Configure Storage**

   - Click **Next** (use default settings)
   - Choose a location (same as Firestore or closest to you)
   - Click **Done**
   - Wait for setup (~30 seconds)

5. **Set Security Rules**
   - Click on the **"Rules"** tab
   - Delete the default rules
   - Open `storage.rules` file from your project
   - **Copy ALL the content** from that file
   - **Paste** it into the Firebase Console rules editor
   - Click **"Publish"** button

✅ **Storage is ready with security rules!**

> 💡 **Tip:** See `FIREBASE_STORAGE_OPTIONAL.md` for more details about Storage setup.

---

## Step 5: Get Firebase Configuration

This is the most important step - you'll get the config to connect your app to Firebase.

1. **Go to Project Settings**

   - Click the **gear icon** (⚙️) next to "Project Overview" in the left sidebar
   - Click **"Project settings"**

2. **Scroll to "Your apps"**

   - Scroll down until you see **"Your apps"** section
   - You'll see icons for different platforms (iOS, Android, Web)

3. **Add Web App**

   - Click the **Web icon** (`</>`)
   - Enter app nickname: `CivicFlow Web`
   - **DO NOT** check "Also set up Firebase Hosting" (we'll do that later)
   - Click **"Register app"**

4. **Copy Firebase Config**
   - You'll see a code snippet with `firebaseConfig`
   - **Copy the entire config object** - it looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "swach-campus-xxxxx.firebaseapp.com",
  projectId: "swach-campus-xxxxx",
  storageBucket: "swach-campus-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
};
```

5. **Keep this tab open** - you'll need to paste it into your code next!

✅ **You have your Firebase configuration!**

---

## Step 6: Configure Your App

1. **Open your project**

   - Open `swach-campus/src/firebase/config.js` in your code editor

2. **Replace the config**

   - Find the `firebaseConfig` object (lines 11-18)
   - **Replace** the placeholder values with your actual config from Step 5
   - Make sure to keep the quotes and commas

3. **Save the file**

Example:

```javascript
// BEFORE (placeholder)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  // ...
};

// AFTER (your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "swach-campus-xxxxx.firebaseapp.com",
  projectId: "swach-campus-xxxxx",
  storageBucket: "swach-campus-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
};
```

✅ **Your app is now connected to Firebase!**

---

## Step 7: Configure Campus Email Domain

1. **Open** `swach-campus/src/firebase/auth.js`

2. **Find line 6** (or search for `CAMPUS_EMAIL_DOMAIN`)

3. **Replace** with your campus email domain:

```javascript
// Example: If your campus emails are like student@campus.edu
export const CAMPUS_EMAIL_DOMAIN = "@campus.edu";

// Example: If your campus emails are like student@university.ac.in
export const CAMPUS_EMAIL_DOMAIN = "@university.ac.in";
```

4. **Save the file**

✅ **Campus email restriction is configured!**

---

## Step 8: Test Your Setup

1. **Start the development server**

   ```bash
   cd swach-campus
   npm run dev
   ```

2. **Open the app**

   - Go to http://localhost:5173
   - The warning banner should be gone! ✅

3. **Test Sign Up**

   - Click "Sign Up"
   - Enter:
     - Name: Your Name
     - Email: `test@yourcampus.edu` (use your configured domain)
     - Password: (at least 6 characters)
   - Click "Sign Up"
   - You should see a success message
   - ⚠️ **If you see "Missing or insufficient permissions" error:**
     - Go to Firebase Console > Firestore Database > Rules
     - Make sure you've copied the latest `firestore.rules` from the project
     - Click **Publish** to update the rules
     - Try signing up again

4. **Check Your Email**

   - Go to your email inbox (check spam folder too!)
   - Look for verification email from Firebase
   - **If link is clickable:** Click on the verification link
   - **If link is NOT clickable (common in spam):** Copy the link and paste it in your browser
   - 💡 **Tip:** Move the email from spam to inbox first - links in spam are often disabled for security
   - Email should be verified ✅

5. **Test Login**

   - Go back to the app
   - Click "Login"
   - Enter your email and password
   - You should be redirected to Student Dashboard ✅

6. **Test Issue Reporting**
   - Click "Report New Issue"
   - Fill out the form
   - Submit
   - You should see your issue in "My Issues" ✅

✅ **Everything is working!**

---

## Step 9: Create Admin User (Optional)

To access the Admin Dashboard:

1. **Sign up** with an email you want to make admin
2. **Go to Firebase Console** > **Firestore Database**
3. **Click on "users" collection**
4. **Find your user document** (click on it)
5. **Edit the document:**
   - Find the `role` field
   - Change value from `"student"` to `"admin"`
   - Click **Update**
6. **Log out and log back in** from the app
7. **You should now see Admin Dashboard!** ✅

---

## 🎉 You're Done!

Your Firebase setup is complete! The app should now work fully.

### Quick Checklist:

- ✅ Firebase project created
- ✅ Authentication enabled
- ✅ Firestore database created with security rules
- ✅ Storage enabled with security rules
- ✅ Firebase config added to `config.js`
- ✅ Campus email domain configured
- ✅ Tested sign up and login

---

## 🐛 Troubleshooting

### "Firebase not configured" warning still shows

- Make sure you saved `config.js` after adding your config
- Restart the dev server: Stop (Ctrl+C) and run `npm run dev` again
- Check browser console for errors

### "Missing or insufficient permissions" error during signup

- **This is the most common issue!** The Firestore rules need to allow users to create their own document during signup
- Go to Firebase Console > Firestore Database > Rules tab
- Make sure you've copied the **latest** `firestore.rules` file from the project
- The rule should allow: `allow create: if request.auth != null && request.auth.uid == userId;`
- Click **Publish** to save the rules
- Try signing up again
- If still not working, check browser console for the exact error message

### Email verification not working

- Check spam folder (emails often go there)
- **Link not clickable in spam?** This is normal! Copy the link and paste it in your browser
- **Better solution:** Move the email from spam to inbox - links work better there
- Wait a few minutes (emails can be delayed)
- Go to Firebase Console > Authentication > Settings > Authorized domains
- Make sure your email domain is authorized
- Try clicking "Resend Verification Email" if needed

### Can't sign up

- Make sure email ends with your configured campus domain
- Password must be at least 6 characters
- Check browser console for specific error messages

### Image upload fails

- Make sure Storage rules are published
- File must be under 5MB
- File must be an image (jpg, png, etc.)

---

## 📚 Next Steps

- Deploy to Firebase Hosting (see `DEPLOYMENT.md`)
- Customize email templates in Firebase Console
- Add more categories or blocks as needed
- Set up custom domain (optional)

---

**Need help?** Check the browser console for error messages - they usually tell you what's wrong!

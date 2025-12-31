# Firebase Setup Guide for CivicFlow

This guide will walk you through setting up Firebase for the CivicFlow application.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `civicflow` (or your preferred name)
4. Click **Continue**
5. Disable Google Analytics (optional) or enable if you want it
6. Click **Create project**
7. Wait for project creation, then click **Continue**

## Step 2: Enable Authentication

1. In Firebase Console, go to **Build** > **Authentication**
2. Click **Get started**
3. Click on **Sign-in method** tab
4. Click on **Email/Password**
5. Enable **Email/Password** (toggle ON)
6. Click **Save**

### Enable Email Verification

Email verification is automatically enabled when you enable Email/Password authentication. Users will receive verification emails when they sign up.

## Step 3: Create Firestore Database

1. In Firebase Console, go to **Build** > **Firestore Database**
2. Click **Create database**
3. Select **Production mode** (we'll add security rules)
4. Choose a location (select closest to your users)
5. Click **Enable**

### Set Firestore Security Rules

1. In Firestore Database, go to **Rules** tab
2. Copy the contents from `firestore.rules` file in this project
3. Paste into the rules editor
4. Click **Publish**

## Step 4: Enable Firebase Storage

1. In Firebase Console, go to **Build** > **Storage**
2. Click **Get started**
3. Click **Next** (use default settings)
4. Choose a location (same as Firestore or closest to users)
5. Click **Done**

### Set Storage Security Rules

1. In Storage, go to **Rules** tab
2. Copy the contents from `storage.rules` file in this project
3. Paste into the rules editor
4. Click **Publish**

## Step 5: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click on **Web** icon (`</>`)
4. Register app with nickname: `CivicFlow Web`
5. Click **Register app**
6. Copy the `firebaseConfig` object

## Step 6: Configure Your App

1. Open `src/firebase/config.js` in your project
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 7: Configure Campus Email Domain

1. Open `src/firebase/auth.js`
2. Update the `CAMPUS_EMAIL_DOMAIN` constant:

```javascript
export const CAMPUS_EMAIL_DOMAIN = '@yourcampus.edu'; // Change to your campus domain
```

## Step 8: Create Admin User (Optional)

To create an admin user:

1. Sign up normally through the app with an admin email
2. Go to Firebase Console > Firestore Database
3. Find the user document in `users` collection
4. Edit the document and change `role` field from `"student"` to `"admin"`
5. Save the document

Alternatively, you can create a script to set admin role programmatically.

## Step 9: Test Your Setup

1. Run the app: `npm run dev`
2. Try signing up with a campus email
3. Check your email for verification link
4. Verify email and login
5. Test creating an issue
6. Test admin dashboard (if you set up admin user)

## Troubleshooting

### Email Verification Not Working
- Check spam folder
- Verify email sending is enabled in Firebase Console
- Check Firebase Authentication > Settings > Authorized domains

### Permission Denied Errors
- Verify Firestore security rules are published
- Check Storage security rules are published
- Ensure user email is verified

### Image Upload Fails
- Check Storage rules allow authenticated users
- Verify file size is under 5MB
- Check file is an image type

## Next Steps

Once Firebase is configured, you can:
- Deploy to Firebase Hosting (see DEPLOYMENT.md)
- Customize email templates in Firebase Console
- Set up custom domain (optional)
- Configure additional Firebase features as needed


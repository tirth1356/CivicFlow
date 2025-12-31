# Quick Start Guide

Get CivicFlow up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Firebase account (free tier works)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Firebase Setup (5 minutes)

### 2.1 Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name it `swach-campus`
4. Disable Analytics (optional)
5. Click "Create project"

### 2.2 Enable Authentication
1. Go to **Authentication** > **Get started**
2. Click **Sign-in method** tab
3. Enable **Email/Password**
4. Click **Save**

### 2.3 Create Firestore Database
1. Go to **Firestore Database** > **Create database**
2. Select **Production mode**
3. Choose location (closest to you)
4. Click **Enable**

### 2.4 Enable Storage
1. Go to **Storage** > **Get started**
2. Click **Next** (default settings)
3. Choose location
4. Click **Done**

### 2.5 Get Firebase Config
1. Go to **Project Settings** (gear icon)
2. Scroll to **Your apps**
3. Click **Web** icon (`</>`)
4. Register app: `Swach Campus`
5. **Copy the config object**

### 2.6 Configure App
1. Open `src/firebase/config.js`
2. Replace the config with your copied values:

```javascript
const firebaseConfig = {
  apiKey: "AIza...", // Your actual key
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 2.7 Set Security Rules

**Firestore Rules:**
1. Go to **Firestore Database** > **Rules** tab
2. Copy contents from `firestore.rules` file
3. Paste and click **Publish**

**Storage Rules:**
1. Go to **Storage** > **Rules** tab
2. Copy contents from `storage.rules` file
3. Paste and click **Publish**

### 2.8 Configure Campus Email
1. Open `src/firebase/auth.js`
2. Change line 6:
```javascript
export const CAMPUS_EMAIL_DOMAIN = '@yourcampus.edu'; // Your campus domain
```

## Step 3: Run the App

```bash
npm run dev
```

Open http://localhost:5173

## Step 4: Test It!

1. **Sign Up** with a campus email (e.g., `test@yourcampus.edu`)
2. **Check email** for verification link
3. **Verify email** and login
4. **Report an issue** from dashboard
5. **View your issues**

## Create Admin User (Optional)

1. Sign up with admin email
2. Go to Firebase Console > Firestore
3. Find user in `users` collection
4. Change `role` field to `"admin"`
5. Login again - you'll see Admin Dashboard!

## Troubleshooting

**"Permission denied" errors:**
- Make sure security rules are published
- Verify email is verified
- Check user is authenticated

**Email not sending:**
- Check spam folder
- Verify email domain is authorized in Firebase Console
- Go to Authentication > Settings > Authorized domains

**Build errors:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## Next Steps

- Deploy to Firebase Hosting (see DEPLOYMENT.md)
- Customize campus email domain
- Add more categories/blocks as needed
- Customize UI colors in `tailwind.config.js`

---

**That's it! You're ready to go! 🚀**


# Vercel Deployment Guide

## Environment Variables Setup

### 1. Local Development
- Copy `.env.example` to `.env`
- Fill in your Firebase configuration values

### 2. Vercel Deployment

#### Option A: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and login
2. Import your GitHub repository
3. Go to Project Settings → Environment Variables
4. Add these variables:

```
VITE_FIREBASE_API_KEY=AIzaSyBdiktNOvHBkJeNStBZ7QQzbANXcAFLs3g
VITE_FIREBASE_AUTH_DOMAIN=catalyst-10.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=catalyst-10
VITE_FIREBASE_STORAGE_BUCKET=catalyst-10.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=4281423121561:428142312156:web:ee270894a6869725661219
VITE_FIREBASE_APP_ID=1:4281423121561:web:ee270894a6869725661219
VITE_FIREBASE_MEASUREMENT_ID=G-SHLRJBM5XZ
```

#### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_STORAGE_BUCKET
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
vercel env add VITE_FIREBASE_APP_ID
vercel env add VITE_FIREBASE_MEASUREMENT_ID

# Redeploy with environment variables
vercel --prod
```

## Security Notes
- Never commit `.env` files to version control
- Environment variables in Vite must be prefixed with `VITE_`
- Firebase config values are not secret (they're exposed in client-side code)
- Real security comes from Firebase Security Rules, not hiding config
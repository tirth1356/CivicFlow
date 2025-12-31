# Deployment Guide - Firebase Hosting

This guide will help you deploy CivicFlow to Firebase Hosting.

## Prerequisites

1. Firebase project set up (see FIREBASE_SETUP.md)
2. Firebase CLI installed globally
3. Project built and tested locally

## Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

## Step 2: Login to Firebase

```bash
firebase login
```

This will open a browser window for authentication.

## Step 3: Initialize Firebase Hosting

1. Navigate to your project directory:
```bash
cd swach-campus
```

2. Initialize Firebase:
```bash
firebase init hosting
```

3. Follow the prompts:
   - **Select existing project** or create new
   - **Public directory**: `dist` (Vite's build output)
   - **Single-page app**: `Yes`
   - **Overwrite index.html**: `No` (we already have one)
   - **Set up automatic builds**: `No` (optional)

## Step 4: Build Your App

```bash
npm run build
```

This creates a `dist` folder with production-ready files.

## Step 5: Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

## Step 6: Verify Deployment

1. After deployment, Firebase will provide a URL like:
   `https://your-project-id.web.app`
2. Visit the URL to verify your app is live

## Step 7: Set Up Custom Domain (Optional)

1. In Firebase Console, go to **Hosting**
2. Click **Add custom domain**
3. Follow the instructions to verify domain ownership
4. Update DNS records as instructed

## Continuous Deployment (Optional)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

## Environment Variables

For production, you may want to use environment variables:

1. Create `.env.production`:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_PROJECT_ID=your-project-id
# ... other config
```

2. Update `src/firebase/config.js` to use environment variables:
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // ... etc
};
```

## Updating Deployment

To update your deployment:

1. Make changes to your code
2. Build: `npm run build`
3. Deploy: `firebase deploy --only hosting`

## Rollback

To rollback to previous version:

1. Go to Firebase Console > Hosting
2. Click on your site
3. Find previous deployment
4. Click **Rollback**

## Performance Optimization

Firebase Hosting automatically:
- Serves files via CDN
- Enables gzip compression
- Caches static assets

For additional optimization:
- Enable Firebase Hosting rewrites for SPA routing
- Configure cache headers in `firebase.json`

## Monitoring

Monitor your deployment:
- Firebase Console > Hosting > Usage tab
- Check error logs in Firebase Console
- Use Firebase Performance Monitoring (optional)

## Troubleshooting

### Build Fails
- Check for TypeScript/ESLint errors
- Verify all dependencies are installed
- Check Node.js version compatibility

### Deployment Fails
- Verify Firebase CLI is logged in
- Check project ID matches
- Ensure build completed successfully

### App Not Loading
- Check browser console for errors
- Verify Firebase config is correct
- Check Firestore/Storage rules are published


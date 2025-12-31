# CivicFlow

**by Team Catalyst**

🔗 **Repository**: [https://github.com/divy-mevada/civicFlow_demo](https://github.com/divy-mevada/civicFlow_demo)

A campus-restricted issue reporting web application built with React, Tailwind CSS, and Firebase.

## Features

- 🔐 **Secure Authentication**: Email/password authentication with mandatory email verification
- 🎓 **Campus-Restricted**: Only campus email addresses can sign up
- 👨‍🎓 **Student Dashboard**: Report issues, track status, view your complaints
- 👨‍💼 **Admin Dashboard**: View all issues, update status, filter by block/category/status, analytics
- 📸 **Image Upload**: Upload images with issue reports
- 🎨 **Glassmorphism UI**: Beautiful blue-purple gradient design with glassmorphism effects
- 📱 **Fully Responsive**: Works on all devices
- ⚡ **Real-time Updates**: Firestore real-time listeners for instant updates

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Routing**: React Router DOM
- **UI Design**: Glassmorphism with blue-purple gradient

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd CivicFlow
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase (see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)):
   - Create Firebase project
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Enable Storage
   - Get Firebase configuration

4. Configure Firebase:
   - Open `src/firebase/config.js`
   - Replace placeholder values with your Firebase config

5. Configure campus email domain:
   - Open `src/firebase/auth.js`
   - Update `CAMPUS_EMAIL_DOMAIN` constant

6. Deploy Firestore and Storage rules:
   - Copy `firestore.rules` to Firebase Console > Firestore > Rules
   - Copy `storage.rules` to Firebase Console > Storage > Rules

7. Run the development server:
```bash
npm run dev
```

8. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
CivicFlow/
├── src/
│   ├── components/          # Reusable components
│   │   ├── GlassCard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/             # React Context
│   │   └── AuthContext.jsx
│   ├── firebase/           # Firebase configuration
│   │   ├── config.js
│   │   ├── auth.js
│   │   ├── firestore.js
│   │   └── storage.js
│   ├── pages/              # Page components
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── VerifyEmail.jsx
│   │   ├── StudentDashboard.jsx
│   │   └── AdminDashboard.jsx
│   ├── App.jsx             # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── firestore.rules        # Firestore security rules
├── storage.rules          # Storage security rules
├── firebase.json          # Firebase configuration
├── FIREBASE_SETUP.md      # Firebase setup guide
└── DEPLOYMENT.md          # Deployment guide
```

## User Roles

### Student
- Sign up with campus email
- Verify email
- Report issues with images
- View only their own issues
- Track issue status

### Admin
- All student features
- View all issues
- Filter issues by block, category, status
- Update issue status
- View analytics (total issues, pending, most problematic block)

## Issue Categories

- Water
- Electricity
- WiFi
- Cleanliness
- Infrastructure

## Blocks

- Block A
- Block B
- Block C
- Hostel
- Library
- Academic Block

## Issue Status Flow

1. **Reported** - Issue has been submitted
2. **In Progress** - Issue is being worked on
3. **Resolved** - Issue has been fixed

## Security

- Email verification required before accessing dashboards
- Campus email domain restriction
- Firestore security rules enforce data access
- Storage rules restrict file uploads
- Only authenticated and verified users can access the app

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Firebase Hosting.

Quick deploy:
```bash
npm run build
firebase deploy --only hosting
```

## Configuration

### Campus Email Domain

Edit `src/firebase/auth.js`:
```javascript
export const CAMPUS_EMAIL_DOMAIN = '@yourcampus.edu';
```

### Firebase Config

Edit `src/firebase/config.js` with your Firebase project credentials.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is created for hackathon purposes.

## Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ by Team Catalyst**


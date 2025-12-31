

# 🚀 **CivicFlow – Smart Campus Issue Reporting System**

**by Team Catalyst**

🔗 **Live Demo:** *[https://civic-flow067.vercel.app](https://civic-flow067.vercel.app/)*
📁 **Repository:** [https://github.com/tirth1356/CivicFlow](https://github.com/tirth1356/CivicFlow)

---

## 🔑 ** Login Credentials or Use your own for students**

| Role        | Email                                                     | Password |
| ----------- | --------------------------------------------------------- | -------- |
| **Admin**   | [24bce288@nirmauni.ac.in](mailto:24bce288@nirmauni.ac.in) | 123456   |
| **Student** | [24bce282@nirmauni.ac.in](mailto:24bce282@nirmauni.ac.in) | Divy1234 |

> ⚠️ *Use these accounts to explore both dashboards.*

---

## 🧩 **What is CivicFlow?**

CivicFlow is a campus-focused issue reporting platform where students can submit complaints (with images & location) and administrators can manage, track, and resolve them in real-time.
It centralizes campus maintenance, improves transparency, and ensures accountability between students and authorities.

---

## ✨ **Core Features**

* 🔐 Campus email-only signups + email verification
* 🎓 Student dashboard to submit & track issues
* 🛠️ Admin dashboard to manage, filter, & update status (Reported → In Progress → Resolved)
* 📍 Block-based location tagging
* 📸 Image upload support
* 📊 Basic analytics for admins
* ⚡ Real-time updates via Firestore
* 🪟 Glassmorphism UI + responsive design

---

## 🛠️ **Tech Stack**

| Area       | Tools Used                              |
| ---------- | --------------------------------------- |
| Frontend   | React + Vite + Tailwind CSS             |
| Backend    | Firebase (Auth, Firestore, Storage)     |
| Storage    | Firebase Storage / Supabase  |
| Deployment | Firebase Hosting                        |



## 🧭 **User Roles**

| Role    | Permissions                                       |
| ------- | ------------------------------------------------- |
| Student | Report issues, upload photos, track status        |
| Admin   | View all issues, update status, filter, analytics |

---

## 📂 **Project Structure**

```
CivicFlow/
├── src/
│   ├── components/       # Reusable UI components
│   ├── context/          # Authentication context
│   ├── firebase/         # Auth, Firestore, Storage configs
│   ├── pages/            # Views (Login, Signup, Dashboards)
│   ├── App.jsx           # Main routing
│   └── index.css         # Global styles
├── firestore.rules
├── storage.rules
└── firebase.json
```

---

## 🔒 Security Highlights

* Campus domain restriction
* Email verification required
* Protected routes & dashboard access
* Firestore read/write access rules
* Verified user-only uploads

---


## ❤️ Team Credits

**Built with passion by Team Catalyst**
For feedback or demo queries — contact team members directly.



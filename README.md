

# 🚀 **CivicFlow – Smart Campus Issue Reporting System**

**by Team Catalyst**

🔗 **Live Demo:** *[https://civic-flow067.vercel.app](https://civic-flow067.vercel.app/)* or *[https://civic-flow068.vercel.app](https://civic-flow068.vercel.app/)* <br>
📁 **Youtube:** [Youtube link](https://youtu.be/R_smyGgCpfA)

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

Here’s an expanded list with more impactful points while keeping the existing style and tone:

---

## ✨ **Core Features**

* 🔐 Campus email-only signups + email verification
* 🎓 Student dashboard to submit, view & track issues
* 🛠️ Admin dashboard to manage, filter, prioritize & resolve issues (Reported → In Progress → Resolved)
* 📍 Block-based location tagging for accurate issue mapping
* 🖼️ Image upload support for clear visual evidence
* 📊 Basic analytics & issue insights for admins
* ⚡ Real-time updates synced via Firestore
* 🪟 Glassmorphism UI with modern responsive interface
* 🧭 Role-based access control (Student / Admin)
* 🚫 Restricted access to unauthorized users with security rules
* 🔁 Issue timeline/history to maintain transparency
* 📨 Automated status feedback for students after updates
* 🧹 Reporting categories for maintenance, WiFi, water, hostel, security & more
* 📱 Mobile-friendly interface for quick reporting on the go
* 🔄 Scalable structure for expansion to other universities/campuses

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



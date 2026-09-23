# 🎓 EduAI Predict – AI Student Performance Predictor & Smart Academic Planner

**EduAI Predict** is a modern, commercial-grade AI-powered Student Academic Management Web Application built for college students. It combines Machine Learning predictive performance evaluation, a Smart Attendance Tracker with Subject Management, an interactive Study Planner (To-Do list), dynamic Analytics, downloadable PDF Academic Reports, real-time password security validation, and a Floating AI Tutor Chatbot assistant.

---

## ✨ Features & Modules

### 1. 🔐 Complete Authentication & Live Security Validator
- **Landing Page**: Public introduction page with product hero banner, feature highlights, and quick sign-in triggers.
- **Sign In Page**: SaaS authentication card with email validation, password eye-icon toggle, "Remember Me", and SSO simulation.
- **Create Account Page with Live Security Rule Validator**: Real-time password strength panel validating:
  - 🟢 Minimum 8 characters
  - 🟢 At least 1 uppercase letter (`A-Z`)
  - 🟢 At least 1 lowercase letter (`a-z`)
  - 🟢 At least 1 number (`0-9`)
  - 🟢 At least 1 special character (`@, #, $, !`)

### 2. 🤖 AI Student Performance Predictor
- Evaluates Attendance %, Internal Marks (/50), Assignment Score (/20), and Daily Study Hours.
- Dynamically categorizes performance into **Excellent** (Green), **Pass** (Blue), or **At Risk** (Orange/Red).
- Calculates confidence percentages, risk levels, target study hours, attendance goals, and dynamic AI Study Recommendations.

### 3. 📅 Smart Attendance Tracker & Subject Management
- **Manage Subjects**: Create custom subjects with Subject Name, Code, and Faculty details.
- **Lecture Status Controls**: Mark ✅ **Present**, ❌ **Absent**, or 📴 **Off** (Faculty leave / Holiday).
- **Attendance History Log**: Searchable and filterable history table with **Edit** (Pencil) and **Delete** (Trash) controls featuring a Delete Confirmation Modal.
- **Monthly Attendance Log**: Interactive calendar with color indicators (Green=Present, Red=Absent, Gray=Off) and date logging modal.
- **Attendance Goal Calculator**: Computes needed continuous lectures to reach target percentage (75%, 80%, 85%, 90%) or max missable lectures.

### 4. ✅ Smart Study Planner (To-Do List)
- Manage tasks with priority tags (*High*, *Medium*, *Low*), due dates, and completion status.
- Features live progress bar calculation (`X / Y Tasks Completed`) and **Canvas Confetti** celebrations upon completion.

### 5. 🤖 Floating AI Assistant Chatbot Widget
- Bottom-right floating bot bubble providing interactive answers to student questions regarding attendance goals, prediction scores, and revision tips.

### 6. 📄 Official Academic PDF Report Exporter
- Exports an official **A4 Student Academic Performance Report & Marksheet** from **Pillai College of Engineering**.
- Rendered with `html2pdf.js` (`html2canvas` `scale: 2` + `jsPDF`) featuring purple headers (`#5B5FEF`), bordered tables, numbered AI recommendations, final evaluation box, and Student & Faculty signature lines.

---

## 🛠️ Technology Stack

- **Core Structure**: HTML5 Semantic Markup
- **Styling**: Vanilla CSS3 (Custom Design System, Glassmorphism, CSS Custom Properties, Responsive Layouts)
- **Logic & State**: Vanilla JavaScript (ES Modules, Event-driven State Management)
- **Charts & Data Visualization**: Chart.js
- **PDF Generation**: HTML2PDF.js (`html2canvas` + `jsPDF`)
- **Animations & Effects**: Canvas Confetti
- **Icons**: FontAwesome 6 (CDN)
- **Typography**: Google Fonts (*Outfit*, *Plus Jakarta Sans*)

---

## 📁 Repository Directory Structure

```text
AI/
├── index.html          # Main Application HTML Shell (15 Integrated Views)
├── README.md           # Project Documentation & GitHub Overview
├── css/
│   └── styles.css      # Custom SaaS Design Tokens, Animations & Component CSS
└── js/
    ├── app.js          # Main Application Router & Event Controller
    ├── auth.js         # Authentication State & Live Password Validator
    ├── attendance.js   # Smart Attendance Calculator & Subject CRUD
    ├── chatbot.js      # Floating AI Assistant Bot Widget
    ├── charts.js       # Chart.js Analytics Configuration (7 Charts)
    ├── dataset.js      # Student Database & Search Engine
    ├── planner.js      # To-Do Study Planner & Confetti Engine
    ├── predictor.js    # AI Performance Evaluation Engine
    ├── reports.js      # Dynamic Reports & HTML2PDF Exporter
    └── toast.js        # Real-time Toast Notifications System
```

---

## 🚀 How to Run Locally or Deploy to GitHub Pages

### Running Locally
1. Clone or download this repository.
2. Open `index.html` directly in any standard web browser (Chrome, Edge, Firefox, Safari).

### Deploying to GitHub Pages
1. Push this project folder to your GitHub repository.
2. Go to **Settings** > **Pages** in your GitHub repository.
3. Select `main` branch as the source and click **Save**.
4. Your EduAI Predict dashboard will be live at `https://<your-username>.github.io/<repository-name>/`!

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

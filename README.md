# 📈 Profit Plus

> A modern, interactive business platform built with React and TypeScript, combining polished UI, data-driven experiences, authentication, lead management, and a responsive PWA-ready architecture.

## ✨ Overview

Profit Plus is a modern web application focused on creating a premium digital experience for business and financial-oriented content.

The project combines a responsive interface with interactive animations, data visualization, authentication, backend integration, lead collection, and an internal administration interface.

The goal was to build more than a static landing page — the application is structured as a complete modern web experience with reusable components and backend-powered functionality.

---

## 🚀 Features

### 🎨 Interactive User Experience
- Modern responsive interface
- Motion-driven page transitions and interactions
- Animated typography and UI elements
- Interactive cards and visual effects
- Smooth scrolling
- Progressive image loading
- Responsive experience across desktop and mobile

### 📊 Data & Visualization
- Interactive charts with Recharts
- Data-driven UI components
- Dynamic portfolio/campaign content
- Dashboard-oriented visual presentation

### 🔐 Authentication
- User login interface
- Authentication flows powered by Supabase
- Protected application functionality

### 🧑‍💼 Admin Dashboard
- Internal administration interface
- Lead management
- Profile/content management
- Message and communication management
- Centralized business data handling

### 📩 Lead & Contact System
- Contact/lead submission workflow
- Server-side email handling
- Automated email notifications using Resend

### 📱 Progressive Web App
- PWA-ready architecture
- Installable web experience
- Web app manifest
- Service worker support
- Adaptive quality handling for different devices

### ⚡ Performance & UX
- Vite-powered development and production builds
- Lazy/progressive image loading
- Adaptive visual quality
- Responsive layouts
- Component-based architecture

---

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### UI / Animation
- Framer Motion
- GSAP
- React Spring
- Lenis
- Lucide React

### 3D & Visualization
- Three.js
- React Three Fiber
- React Three Drei
- Recharts

### Backend & Services
- Supabase
- Resend
- Vercel Serverless Functions

### Tooling
- ESLint
- PostCSS
- Tailwind CSS
- Git
- GitHub

---

## 🏗️ Project Structure

```text
profit-plus/
│
├── api/
│   └── sendEmail.js
│
├── public/
│   ├── images/
│   ├── videos/
│   ├── manifest.json
│   └── ...
│
├── src/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── App.tsx
│   └── main.tsx
│
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.js
├── tsconfig.app.json
├── vite.config.ts
└── README.md

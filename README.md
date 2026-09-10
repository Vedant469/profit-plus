# 📈 Profit Plus

> A modern, interactive business platform built with React and TypeScript, combining premium UI, data visualization, authentication, lead management, and PWA-ready functionality.

## 🖥️ Product Preview

<p align="center">
  <img src="./public/screenshots/home.png" width="900" alt="Profit Plus homepage" />
</p>

---

## ✨ Overview

Profit Plus is a full-stack web experience designed for modern business and financial-focused applications.

It combines an interactive frontend with backend-powered features including authentication, data management, lead collection, email notifications, and an internal administration dashboard.

Built with a focus on **visual design, reusable components, responsive UX, and production-oriented architecture**.

---

## 🚀 Features

### 🎨 Interactive User Experience

- Modern responsive interface
- Motion-driven page transitions
- Animated typography and visual effects
- Interactive cards and hover interactions
- Smooth scrolling
- Progressive image loading
- Desktop and mobile optimized layouts

### 📊 Data Visualization

- Interactive charts with Recharts
- Data-driven UI components
- Dynamic portfolio and campaign content
- Visual presentation of business-oriented data

### 🔐 Authentication

- User authentication flow
- Supabase-powered authentication
- Login and protected application functionality

### 🧑‍💼 Admin Dashboard

- Internal administration interface
- Lead management
- Profile and content management
- Message management
- Centralized business data

### 📩 Lead & Contact System

- Contact and lead submission
- Server-side email handling
- Automated email notifications
- Resend integration

### 📱 Progressive Web App

- PWA-ready architecture
- Installable web application
- Web app manifest
- Service worker support
- Adaptive quality handling

### ⚡ Performance & UX

- Vite-powered development and production builds
- Progressive image loading
- Adaptive rendering quality
- Responsive layouts
- Reusable React components

---

## 🛠️ Tech Stack

### Frontend

`React` `TypeScript` `Vite` `Tailwind CSS`

### UI & Animation

`Framer Motion` `GSAP` `React Spring` `Lenis` `Lucide React`

### 3D & Visualization

`Three.js` `React Three Fiber` `Drei` `Recharts`

### Backend & Services

`Supabase` `Resend` `Vercel Serverless Functions`

### Tooling

`ESLint` `PostCSS` `Git` `GitHub` `Vercel`

---

## 🏗️ Architecture

```text
                    ┌────────────────────┐
                    │    React Frontend  │
                    └──────────┬─────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        UI Components      Supabase         Client Hooks
              │                │                │
              │                ▼                │
              │          Application Data      │
              │                                 │
              ▼                                 ▼
       Animations / Charts               Authentication
              │
              ▼
        Vercel API Layer
              │
              ▼
<<<<<<< Updated upstream
            Resend
=======
            Resend
>>>>>>> Stashed changes

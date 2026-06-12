import { Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import DashboardLayout from './components/layout/DashboardLayout'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'
import CookieBanner from './components/CookieBanner'
import ScrollProgressBar from './components/ScrollProgressBar'
import BackToTop from './components/BackToTop'
import WhatsAppButton from './components/WhatsAppButton'
import PageTransition from './components/PageTransition'
import MobileBottomNav from './components/MobileBottomNav'

const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const DashboardOverview = lazy(() => import('./pages/dashboard/DashboardOverview'))
const CampaignsPage = lazy(() => import('./pages/dashboard/CampaignsPage'))
const AnalyticsPage = lazy(() => import('./pages/dashboard/AnalyticsPage'))
const ReportsPage = lazy(() => import('./pages/dashboard/ReportsPage'))

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 pb-16 md:pb-0">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

function Loader() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PublicLayout><PageTransition><HomePage /></PageTransition></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><PageTransition><AboutPage /></PageTransition></PublicLayout>} />
        <Route path="/services" element={<PublicLayout><PageTransition><ServicesPage /></PageTransition></PublicLayout>} />
        <Route path="/portfolio" element={<PublicLayout><PageTransition><PortfolioPage /></PageTransition></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><PageTransition><ContactPage /></PageTransition></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout><PageTransition><BlogPage /></PageTransition></PublicLayout>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><PageTransition><DashboardOverview /></PageTransition></DashboardLayout></ProtectedRoute>} />
        <Route path="/dashboard/campaigns" element={<ProtectedRoute><DashboardLayout><PageTransition><CampaignsPage /></PageTransition></DashboardLayout></ProtectedRoute>} />
        <Route path="/dashboard/analytics" element={<ProtectedRoute><DashboardLayout><PageTransition><AnalyticsPage /></PageTransition></DashboardLayout></ProtectedRoute>} />
        <Route path="/dashboard/reports" element={<ProtectedRoute><DashboardLayout><PageTransition><ReportsPage /></PageTransition></DashboardLayout></ProtectedRoute>} />
        <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <ScrollProgressBar />
      <CookieBanner />
      <BackToTop />
      <WhatsAppButton />
      <MobileBottomNav />
      <Suspense fallback={<Loader />}>
        <AnimatedRoutes />
      </Suspense>
    </>
  )
}
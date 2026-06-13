import { Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useState } from 'react'
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
import CustomCursor from './components/CustomCursor'
import PullToRefresh from './components/PullToRefresh'
import useSmoothScroll from './hooks/useSmoothScroll'
import { useAdaptiveQuality } from './hooks/useAdaptiveQuality'
import { SkeletonPage } from './components/Skeleton'
import IntroAnimation from './components/IntroAnimation'
import ExitIntentPopup from './components/ExitIntentPopup'
import SocialProofTicker from './components/SocialProofTicker'
import LiveChat from './components/LiveChat'

const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const PendingApprovalPage = lazy(() => import('./pages/PendingApprovalPage'))
const DashboardOverview = lazy(() => import('./pages/dashboard/DashboardOverview'))
const CampaignsPage = lazy(() => import('./pages/dashboard/CampaignsPage'))
const AnalyticsPage = lazy(() => import('./pages/dashboard/AnalyticsPage'))
const ReportsPage = lazy(() => import('./pages/dashboard/ReportsPage'))
const LeadsPage = lazy(() => import('./pages/dashboard/LeadsPage'))
const ReferralPage = lazy(() => import('./pages/dashboard/ReferralPage'))

function DashboardLoader() {
  return (
    <div className="min-h-screen bg-slate-950">
      <SkeletonPage />
    </div>
  )
}

function PublicLoader() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'rgba(0,255,136,0.2)', borderTopColor: '#00ff88' }}
        />
        <p className="text-gray-500 text-sm animate-pulse">Loading...</p>
      </div>
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
        <Route path="/services" element={<PageTransition><ServicesPage /></PageTransition>} />
        <Route path="/portfolio" element={<PageTransition><PortfolioPage /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
        <Route path="/blog" element={<PageTransition><BlogPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/pending-approval" element={<PageTransition><PendingApprovalPage /></PageTransition>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><PageTransition><DashboardOverview /></PageTransition></DashboardLayout></ProtectedRoute>} />
        <Route path="/dashboard/campaigns" element={<ProtectedRoute><DashboardLayout><PageTransition><CampaignsPage /></PageTransition></DashboardLayout></ProtectedRoute>} />
        <Route path="/dashboard/analytics" element={<ProtectedRoute><DashboardLayout><PageTransition><AnalyticsPage /></PageTransition></DashboardLayout></ProtectedRoute>} />
        <Route path="/dashboard/reports" element={<ProtectedRoute><DashboardLayout><PageTransition><ReportsPage /></PageTransition></DashboardLayout></ProtectedRoute>} />
        <Route path="/dashboard/leads" element={<ProtectedRoute><DashboardLayout><PageTransition><LeadsPage /></PageTransition></DashboardLayout></ProtectedRoute>} />
        <Route path="/dashboard/referral" element={<ProtectedRoute><DashboardLayout><PageTransition><ReferralPage /></PageTransition></DashboardLayout></ProtectedRoute>} />
        <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

function AppContent() {
  useSmoothScroll()
  const location = useLocation()
  const { shouldReduceMotion, shouldDisable3D } = useAdaptiveQuality()
  const isSpecialPage = ['/login', '/pending-approval'].includes(location.pathname)
  const isDashboard = location.pathname.startsWith('/dashboard')
  const isPublic = !isDashboard && !isSpecialPage

  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem('pp-intro-shown')
  })

  const handleIntroComplete = () => {
    sessionStorage.setItem('pp-intro-shown', 'true')
    setShowIntro(false)
  }

  return (
    <>
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
      {!shouldDisable3D && <CustomCursor />}
      <ScrollToTop />
      <ScrollProgressBar />
      <CookieBanner />
      <LiveChat />
      <MobileBottomNav />
      <PullToRefresh />

      {isPublic && <Navbar />}

      <div className={isPublic ? 'min-h-screen bg-slate-950 pb-20 md:pb-0' : ''}>
        <Suspense fallback={isDashboard ? <DashboardLoader /> : <PublicLoader />}>
          <AnimatedRoutes />
        </Suspense>
        {isPublic && <Footer />}
      </div>

      {isPublic && !shouldReduceMotion && <BackToTop />}
      {isPublic && <WhatsAppButton />}
      {isPublic && !shouldReduceMotion && <SocialProofTicker />}
      {isPublic && <ExitIntentPopup />}
    </>
  )
}

export default function App() {
  return <AppContent />
}
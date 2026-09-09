import { Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Analytics } from '@vercel/analytics/react'
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
const GodmodePage = lazy(() => import('./pages/GodmodePage'))
const DashboardOverview = lazy(() => import('./pages/dashboard/DashboardOverview'))
const CampaignsPage = lazy(() => import('./pages/dashboard/CampaignsPage'))
const AnalyticsPage = lazy(() => import('./pages/dashboard/AnalyticsPage'))
const ReportsPage = lazy(() => import('./pages/dashboard/ReportsPage'))
const LeadsPage = lazy(() => import('./pages/dashboard/LeadsPage'))

const PURPLE_BG = 'linear-gradient(160deg, #0d0520 0%, #1a0a35 25%, #0a0d20 60%, #020617 100%)'

function PageLoader() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: PURPLE_BG }}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'rgba(139,92,246,0.2)', borderTopColor: '#8b5cf6' }}
        />
        <p className="text-gray-600 text-xs">Loading...</p>
      </div>
    </div>
  )
}

function DashboardLoader() {
  return (
    <div className="min-h-screen bg-slate-950">
      <SkeletonPage />
    </div>
  )
}

// Each route wraps its own Suspense to prevent blank screens
function PublicPage({ component: Component }: { component: React.ComponentType }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <PageTransition>
        <Component />
      </PageTransition>
    </Suspense>
  )
}

function DashPage({ component: Component }: { component: React.ComponentType }) {
  return (
    <Suspense fallback={<DashboardLoader />}>
      <PageTransition>
        <Component />
      </PageTransition>
    </Suspense>
  )
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="sync" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/" element={<PublicPage component={HomePage} />} />
        <Route path="/about" element={<PublicPage component={AboutPage} />} />
        <Route path="/services" element={<PublicPage component={ServicesPage} />} />
        <Route path="/portfolio" element={<PublicPage component={PortfolioPage} />} />
        <Route path="/contact" element={<PublicPage component={ContactPage} />} />
        <Route path="/blog" element={<PublicPage component={BlogPage} />} />
        <Route path="/login" element={<PublicPage component={LoginPage} />} />
        <Route path="/pending-approval" element={<PublicPage component={PendingApprovalPage} />} />
        <Route path="/godmode" element={<PublicPage component={GodmodePage} />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashPage component={DashboardOverview} />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/campaigns" element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashPage component={CampaignsPage} />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/analytics" element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashPage component={AnalyticsPage} />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/reports" element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashPage component={ReportsPage} />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/leads" element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashPage component={LeadsPage} />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<PublicPage component={NotFoundPage} />} />
      </Routes>
    </AnimatePresence>
  )
}

function AppContent() {
  useSmoothScroll()
  const location = useLocation()
  const { shouldReduceMotion, shouldDisable3D } = useAdaptiveQuality()

  const isSpecialPage = ['/login', '/pending-approval', '/godmode'].includes(location.pathname)
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

      {/* Public wrapper with purple bg */}
      {isPublic ? (
        <div className="min-h-screen pb-20 md:pb-0" style={{ background: PURPLE_BG }}>
          <AnimatedRoutes />
          <Footer />
        </div>
      ) : (
        <AnimatedRoutes />
      )}

      {isPublic && !shouldReduceMotion && <BackToTop />}
      {isPublic && <WhatsAppButton />}
      {isPublic && <ExitIntentPopup />}
    </>
  )
}

export default function App() {
  return (
    <>
      <AppContent />
      <Analytics />
    </>
  )
}
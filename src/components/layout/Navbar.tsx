import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { Menu, X, TrendingUp, ChevronRight } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const sectionToNav: Record<string, string> = {
  hero: '/',
  services: '/services',
  portfolio: '/portfolio',
  testimonials: '/portfolio',
  pricing: '/services',
  faq: '/',
}

const sectionIds = ['hero', 'services', 'portfolio', 'testimonials', 'pricing', 'faq']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('/')
  const location = useLocation()

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Update active based on current route
  useEffect(() => {
    setActiveSection(location.pathname === '/' ? '/' : location.pathname)
  }, [location.pathname])

  // Scroll-based tracking ONLY on homepage
  const updateActive = useCallback(() => {
    if (location.pathname !== '/') return
    const scrollY = window.scrollY + window.innerHeight / 3

    let current = 'hero'
    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (!el) continue
      const top = el.getBoundingClientRect().top + window.scrollY
      if (scrollY >= top) current = id
    }

    const nav = sectionToNav[current] ?? '/'
    setActiveSection(nav)
  }, [location.pathname])

  useEffect(() => {
    if (location.pathname !== '/') return
    updateActive()
    window.addEventListener('scroll', updateActive, { passive: true })
    return () => window.removeEventListener('scroll', updateActive)
  }, [location.pathname, updateActive])

  const isActive = useCallback((href: string) => {
    if (location.pathname === '/') return activeSection === href
    if (href === '/') return location.pathname === '/'
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }, [location.pathname, activeSection])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(13,5,32,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(139,92,246,0.15)' : 'none',
          padding: scrolled ? '12px 0' : '20px 0',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
                boxShadow: '0 0 15px rgba(0,255,136,0.3)',
              }}
            >
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg">
              Profit<span style={{ color: '#00ff88' }}>Plus</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <LayoutGroup>
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href)
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="relative px-4 py-2 group"
                  >
                    <span
                      className="text-sm font-medium transition-colors duration-200"
                      style={{ color: active ? 'white' : 'rgba(255,255,255,0.5)' }}
                    >
                      {link.label}
                    </span>

                    {active && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                        style={{ background: 'linear-gradient(to right, #00ff88, #00cc6a)' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      />
                    )}

                    {!active && (
                      <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full opacity-0 group-hover:opacity-50 transition-opacity"
                        style={{ background: '#00ff88' }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          </LayoutGroup>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2 text-sm font-medium rounded-full transition-all"
              style={{
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.75)',
                background: 'transparent',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(139,92,246,0.5)'
                el.style.color = 'white'
                el.style.boxShadow = '0 0 15px rgba(139,92,246,0.2)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(255,255,255,0.15)'
                el.style.color = 'rgba(255,255,255,0.75)'
                el.style.boxShadow = 'none'
              }}
            >
              Log In
            </Link>
            <Link
              to="/contact"
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-bold text-white rounded-full transition-all"
              style={{
                background: 'rgba(10,5,20,0.9)',
                border: '1px solid rgba(139,92,246,0.6)',
                boxShadow: '0 0 20px rgba(139,92,246,0.3)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.boxShadow = '0 0 30px rgba(139,92,246,0.5)'
                el.style.borderColor = 'rgba(167,139,250,0.8)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.boxShadow = '0 0 20px rgba(139,92,246,0.3)'
                el.style.borderColor = 'rgba(139,92,246,0.6)'
              }}
            >
              Get Started <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <button
            className="md:hidden p-1 transition-colors"
            style={{ color: 'rgba(255,255,255,0.6)' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 p-4 md:hidden"
            style={{
              background: 'rgba(13,5,32,0.98)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(139,92,246,0.15)',
            }}
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href)
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-center justify-between py-3 px-4 rounded-xl font-medium transition-all text-sm"
                    style={{
                      background: active ? 'rgba(0,255,136,0.08)' : 'transparent',
                      border: active ? '1px solid rgba(0,255,136,0.15)' : '1px solid transparent',
                      color: active ? '#00ff88' : 'rgba(255,255,255,0.7)',
                    }}
                  >
                    {link.label}
                    {active && <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00ff88' }} />}
                  </Link>
                )
              })}
              <div className="pt-3 mt-1 flex flex-col gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <Link
                  to="/login"
                  className="text-sm font-medium text-center py-2.5 rounded-full"
                  style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}
                >
                  Log In
                </Link>
                <Link
                  to="/contact"
                  className="text-sm font-bold text-white text-center py-2.5 rounded-full"
                  style={{
                    background: 'rgba(10,5,20,0.9)',
                    border: '1px solid rgba(139,92,246,0.6)',
                    boxShadow: '0 0 20px rgba(139,92,246,0.3)',
                  }}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
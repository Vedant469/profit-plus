import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { Menu, X, TrendingUp, ChevronRight } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '/', sectionId: 'hero' },
  { label: 'Services', href: '/services', sectionId: 'services' },
  { label: 'Portfolio', href: '/portfolio', sectionId: 'portfolio' },
  { label: 'Blog', href: '/blog', sectionId: null },
  { label: 'About', href: '/about', sectionId: null },
  { label: 'Contact', href: '/contact', sectionId: null },
]

const sectionToNav: Record<string, string> = {
  hero: '/',
  services: '/services',
  portfolio: '/portfolio',
  testimonials: '/portfolio',
  pricing: '/services',
  faq: '/',
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('/')
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [location])

  // Reset active section when navigating away from home
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection(location.pathname)
    } else {
      setActiveSection('/')
    }
  }, [location.pathname])

  // Intersection observer for homepage sections
  useEffect(() => {
    if (location.pathname !== '/') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const nav = sectionToNav[entry.target.id]
            if (nav) setActiveSection(nav)
          }
        })
      },
      { threshold: 0.3, rootMargin: '-80px 0px -30% 0px' }
    )

    const ids = ['hero', 'services', 'portfolio', 'testimonials', 'pricing', 'faq']
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [location.pathname])

  const isActive = (href: string) => {
    if (location.pathname === '/') return activeSection === href
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-slate-950/95 backdrop-blur-md border-b border-white/5 py-3'
            : 'py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg">
              Profit<span className="text-emerald-400">Plus</span>
            </span>
          </Link>

          {/* Desktop nav — LayoutGroup ensures smooth sliding */}
          <LayoutGroup>
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="relative px-4 py-2 group"
                >
                  <span className={`text-sm font-medium transition-colors duration-200 ${
                    isActive(link.href)
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}>
                    {link.label}
                  </span>

                  {/* Sliding underbar with layoutId */}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                      style={{
                        background: 'linear-gradient(to right, #34d399, #059669)',
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 35,
                        mass: 0.8,
                      }}
                    />
                  )}

                  {/* Glow under active */}
                  {isActive(link.href) && (
                    <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-400 blur-sm opacity-70 rounded-full" />
                  )}

                  {/* Hover dot */}
                  {!isActive(link.href) && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-60 transition-opacity" />
                  )}
                </Link>
              ))}
            </div>
          </LayoutGroup>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              Client Login
            </Link>
            <Link
              to="/contact"
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold rounded-lg transition-all hover:shadow-lg hover:shadow-emerald-500/25"
            >
              Get Started <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-gray-400 hover:text-white p-1 transition-colors"
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-x-0 top-16 z-40 bg-slate-950/98 backdrop-blur-md border-b border-white/5 p-6 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center justify-between py-3 px-4 rounded-xl font-medium transition-all ${
                    isActive(link.href)
                      ? 'text-white bg-emerald-500/10 border border-emerald-500/20'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50" />
                  )}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-3">
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-white text-sm text-center py-2 transition-colors"
                >
                  Client Login
                </Link>
                <Link
                  to="/contact"
                  className="px-4 py-3 bg-emerald-500 text-white text-sm font-bold rounded-lg text-center hover:bg-emerald-400 transition-colors"
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
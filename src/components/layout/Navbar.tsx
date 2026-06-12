import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, TrendingUp, ChevronRight } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '/', sectionId: 'hero' },
  { label: 'Services', href: '/services', sectionId: 'services' },
  { label: 'Portfolio', href: '/portfolio', sectionId: 'portfolio' },
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
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [location])

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
      {
        threshold: 0.3,
        rootMargin: '-80px 0px -30% 0px',
      }
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
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-slate-950/95 backdrop-blur-md border-b border-white/5 py-3' : 'py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg">Profit<span className="text-amber-400">Plus</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="relative px-4 py-2 group"
              >
                <span className={`text-sm font-medium transition-all duration-200 ${
                  isActive(link.href) ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}>
                  {link.label}
                </span>

                {isActive(link.href) && (
                  <>
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                    <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-amber-400 blur-sm opacity-80 rounded-full" />
                  </>
                )}

                {!isActive(link.href) && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full opacity-0 group-hover:opacity-60 transition-opacity" />
                )}
              </Link>
            ))}
          </div>

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
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold rounded-lg transition-all hover:shadow-lg hover:shadow-amber-500/25"
            >
              Get Started <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <button
            className="md:hidden text-gray-400 hover:text-white p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-40 bg-slate-950/98 backdrop-blur-md border-b border-white/5 p-6 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center justify-between py-3 px-4 rounded-xl font-medium transition-all ${
                    isActive(link.href)
                      ? 'text-white bg-amber-500/10 border border-amber-500/20'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50" />
                  )}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-3">
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-white text-sm text-center py-2"
                >
                  Client Login
                </Link>
                <Link
                  to="/contact"
                  className="px-4 py-3 bg-amber-500 text-slate-950 text-sm font-bold rounded-lg text-center"
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
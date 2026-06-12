import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Briefcase, BookOpen, Mail, User } from 'lucide-react'

const navItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Services', href: '/services', icon: Briefcase },
  { label: 'Blog', href: '/blog', icon: BookOpen },
  { label: 'About', href: '/about', icon: User },
  { label: 'Contact', href: '/contact', icon: Mail },
]

export default function MobileBottomNav() {
  const location = useLocation()

  // Hide on dashboard and login pages
  if (location.pathname.startsWith('/dashboard') || location.pathname === '/login') {
    return null
  }

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-900/95 backdrop-blur-md border-t border-white/5 pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            to={href}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl relative"
          >
            {isActive(href) && (
              <motion.div
                layoutId="mobileNav"
                className="absolute inset-0 bg-amber-500/10 border border-amber-500/20 rounded-xl"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <Icon className={`w-5 h-5 relative z-10 transition-colors ${
              isActive(href) ? 'text-amber-400' : 'text-gray-500'
            }`} />
            <span className={`text-xs relative z-10 transition-colors ${
              isActive(href) ? 'text-amber-400 font-medium' : 'text-gray-500'
            }`}>
              {label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
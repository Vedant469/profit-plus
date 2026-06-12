import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

declare global {
  interface Window {
    $crisp: any[]
    CRISP_WEBSITE_ID: string
  }
}

export default function LiveChat() {
  const location = useLocation()

  useEffect(() => {
    window.$crisp = []
    window.CRISP_WEBSITE_ID = '8092ad39-cc75-481f-a9ce-3be9b9039546'

    const script = document.createElement('script')
    script.src = 'https://client.crisp.chat/l.js'
    script.async = true
    document.head.appendChild(script)

    script.onload = () => {
      // Hide on mobile — WhatsApp handles mobile chat
      if (window.innerWidth < 768) {
        window.$crisp.push(['do', 'chat:hide'])
      }
    }

    window.addEventListener('resize', () => {
      if (!window.$crisp) return
      if (window.innerWidth < 768) {
        window.$crisp.push(['do', 'chat:hide'])
      } else {
        window.$crisp.push(['do', 'chat:show'])
      }
    })

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  useEffect(() => {
    if (!window.$crisp) return

    const isMobile = window.innerWidth < 768
    const isRestricted =
      location.pathname.startsWith('/dashboard') ||
      location.pathname === '/login'

    if (isRestricted || isMobile) {
      window.$crisp.push(['do', 'chat:hide'])
    } else {
      window.$crisp.push(['do', 'chat:show'])
    }
  }, [location.pathname])

  return null
}
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
    // Load Crisp
    window.$crisp = []
window.CRISP_WEBSITE_ID = '8092ad39-cc75-481f-a9ce-3be9b9039546'
window.$crisp.push(['config', 'position:reverse', [true]])

    const script = document.createElement('script')
    script.src = 'https://client.crisp.chat/l.js'
    script.async = true
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (!window.$crisp) return
    if (location.pathname.startsWith('/dashboard') || location.pathname === '/login') {
      window.$crisp.push(['do', 'chat:hide'])
    } else {
      window.$crisp.push(['do', 'chat:show'])
    }
  }, [location.pathname])

  return null
}   
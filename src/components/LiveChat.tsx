import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

declare global {
  interface Window {
    $crisp: any[]
    CRISP_WEBSITE_ID: string
  }
}

function adjustCrispPosition() {
  if (window.innerWidth >= 768) return
  const crispBox = document.getElementById('crisp-chatbox')
  if (crispBox) {
    crispBox.style.setProperty('bottom', '80px', 'important')
    crispBox.style.setProperty('right', '8px', 'important')
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

    // Watch for Crisp to load and adjust position
    const observer = new MutationObserver(() => {
      adjustCrispPosition()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    })

    // Also adjust on resize
    window.addEventListener('resize', adjustCrispPosition)

    // Keep adjusting every 500ms for first 5 seconds
    const intervals = [500, 1000, 1500, 2000, 3000, 5000].map((delay) =>
      setTimeout(adjustCrispPosition, delay)
    )

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', adjustCrispPosition)
      intervals.forEach(clearTimeout)
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  useEffect(() => {
    if (!window.$crisp) return
    if (
      location.pathname.startsWith('/dashboard') ||
      location.pathname === '/login'
    ) {
      window.$crisp.push(['do', 'chat:hide'])
    } else {
      window.$crisp.push(['do', 'chat:show'])
      setTimeout(adjustCrispPosition, 300)
    }
  }, [location.pathname])

  return null
}
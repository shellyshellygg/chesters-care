import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    setTimeout(() => {
      try {
        window.scroll(0, 0)
        window.scrollTo(0, 0)
        document.querySelector('.page')?.scrollIntoView()
        document.querySelector('.home')?.scrollIntoView()
      } catch (e) {}
    }, 50)
  }, [pathname])

  return null
}
import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import WeightTracker from './pages/WeightTracker'
import SafeFoods from './pages/SafeFoods'
import Calendar from './pages/Calendar'
import CareSummary from './pages/CareSummary'
import Passcode from './pages/Passcode'
import ScrollToTop from './ScrollToTop'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/weight" element={<WeightTracker />} />
      <Route path="/foods" element={<SafeFoods />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/care-summary/:date" element={<CareSummary />} />
    </Routes>
  )
}

function App() {
  const [unlocked, setUnlocked] = useState(
    localStorage.getItem('chester-unlocked') === 'true'
  )

  if (!unlocked) {
    return <Passcode onUnlock={() => setUnlocked(true)} />
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default App
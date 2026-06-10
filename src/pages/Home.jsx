import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const SNACK_BY_DAY = {
  0: { name: 'Snack', emoji: '⭐', description: 'Free choice treat' },
  1: { name: 'Protein Pellets', emoji: '🫙', description: '4-6 lab blocks' },
  2: { name: 'Fruit', emoji: '🍓', description: 'Small piece of fruit' },
  3: { name: 'Tofu', emoji: '🟨', description: 'Small cube of tofu' },
  4: { name: 'Peanut', emoji: '🥜', description: '1 peanut' },
  5: { name: 'Snack', emoji: '⭐', description: 'Free choice treat' },
  6: { name: 'Snack', emoji: '⭐', description: 'Free choice treat' },
}

const FEEDING_START = new Date('2026-06-07T12:00:00')

function isFeedingDay(date) {
  const diffDays = Math.floor((date - FEEDING_START) / (1000 * 60 * 60 * 24))
  return diffDays % 2 !== 0
}

function getDateKey(date) {
  return date.toLocaleDateString('en-CA')
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

function addDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export default function Home() {
  const [offset, setOffset] = useState(0)

  const activeDate = addDays(new Date(), offset)
  const dateKey = getDateKey(activeDate)
  const feedingDay = isFeedingDay(activeDate)
  const snack = SNACK_BY_DAY[activeDate.getDay()]

  const saved = JSON.parse(localStorage.getItem(`checklist-${dateKey}`) || '{}')

  const [checked, setChecked] = useState({
    food: saved.food || false,
    veggie: saved.veggie || false,
    water: saved.water || false,
    clean: saved.clean || false,
    snack: saved.snack || false,
    playtime: saved.playtime || false,
  })

  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`checklist-${dateKey}`) || '{}')
    setChecked({
      food: saved.food || false,
      veggie: saved.veggie || false,
      water: saved.water || false,
      clean: saved.clean || false,
      snack: saved.snack || false,
      playtime: saved.playtime || false,
    })
  }, [dateKey])

  useEffect(() => {
    localStorage.setItem(`checklist-${dateKey}`, JSON.stringify(checked))
  }, [checked])

  useEffect(() => {
    const lastWeigh = localStorage.getItem('last-weigh-date')
    if (!lastWeigh) { setShowNotification(true); return }
    const diff = Math.floor((new Date() - new Date(lastWeigh)) / (1000 * 60 * 60 * 24))
    if (diff >= 30) setShowNotification(true)
  }, [])

  const toggle = (key) => {
    if (key === 'food' && !feedingDay) return
    setChecked(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const isToday = offset === 0

  return (
    <div className="home">
      {showNotification && (
        <div className="notification">
          <p>⚖️ It's been 30 days — time to weigh Chester!</p>
          <div className="notification-buttons">
            <button className="notif-btn primary" onClick={() => setShowNotification(false)}>
              Ok, let's weigh him
            </button>
            <button className="notif-btn secondary" onClick={() => {
              localStorage.setItem('last-weigh-date', new Date(Date.now() - 29 * 86400000).toISOString())
              setShowNotification(false)
            }}>
              Remind me tomorrow
            </button>
          </div>
        </div>
      )}

      <div className="home-header">
        <Link to="/profile">
          <span className="hamster-emoji">🐹</span>
        </Link>
        <div>
          <h1>Chester's Daily Checklist</h1>
          <p className="page-date">{formatDate(activeDate)}</p>
        </div>
      </div>

      <div className="date-nav">
        <button className="date-nav-btn" onClick={() => setOffset(o => o - 1)}>‹ prev</button>
        <span className="date-nav-label">{isToday ? 'today' : offset === -1 ? 'yesterday' : formatDate(activeDate)}</span>
        <button
          className={`date-nav-btn ${offset >= 0 ? 'disabled-nav' : ''}`}
          onClick={() => { if (offset < 0) setOffset(o => o + 1) }}
        >
          next ›
        </button>
      </div>

      <div className="cards">
        <CheckCard
          emoji="🍽️"
          label={feedingDay ? 'Food' : 'No Food'}
          sublabel={feedingDay ? '2 scoops' : null}
          checked={checked.food}
          disabled={!feedingDay}
          onToggle={() => toggle('food')}
        />
        <CheckCard emoji="🥦" label="Veggie" checked={checked.veggie} onToggle={() => toggle('veggie')} />
        <CheckCard emoji="💧" label="Change Water" checked={checked.water} onToggle={() => toggle('water')} />
        <CheckCard emoji="🚽" label="Clean" checked={checked.clean} onToggle={() => toggle('clean')} />
        <CheckCard
          emoji={snack.emoji}
          label={snack.name}
          sublabel={snack.description}
          checked={checked.snack}
          onToggle={() => toggle('snack')}
        />
        <CheckCard emoji="🎡" label="Play Time" checked={checked.playtime} onToggle={() => toggle('playtime')} />
      </div>

      <div className="links home">
        <p>more stuff:</p>
        <Link to="/foods">&gt; safe hamster foods</Link>
        <Link to="/calendar">&gt; chester's calendar tracker</Link>
        <Link to="/profile">&gt; chester's profile</Link>
      </div>
    </div>
  )
}

function CheckCard({ emoji, label, sublabel, checked, disabled, onToggle }) {
  return (
    <div
      className={`card ${checked ? 'complete' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={onToggle}
    >
      <span className="card-emoji">{emoji}</span>
      <div className="card-text">
        <span className="card-label">{label}</span>
        {sublabel && <span className="card-sublabel">{sublabel}</span>}
      </div>
      <div className="checkbox">{checked ? '✓' : ''}</div>
    </div>
  )
}
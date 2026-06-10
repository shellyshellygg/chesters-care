import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

const FEEDING_START = new Date('2026-06-07T12:00:00')

function isFeedingDay(date) {
  const diffDays = Math.floor((date - FEEDING_START) / (1000 * 60 * 60 * 24))
  return diffDays % 2 !== 0
}

const SNACK_BY_DAY = {
  0: { name: 'Snack', emoji: '⭐' },
  1: { name: 'Protein Pellets', emoji: '🫙' },
  2: { name: 'Fruit', emoji: '🍓' },
  3: { name: 'Tofu', emoji: '🟨' },
  4: { name: 'Peanut', emoji: '🥜' },
  5: { name: 'Snack', emoji: '⭐' },
  6: { name: 'Snack', emoji: '⭐' },
}

export default function CareSummary() {
  const { date } = useParams()
  const parsedDate = new Date(date + 'T12:00:00')
  const feeding = isFeedingDay(parsedDate)
  const snack = SNACK_BY_DAY[parsedDate.getDay()]

  const stored = JSON.parse(localStorage.getItem(`checklist-${date}`) || '{}')

  const [checked, setChecked] = useState({
    food: stored.food || false,
    veggie: stored.veggie || false,
    water: stored.water || false,
    clean: stored.clean || false,
    snack: stored.snack || false,
    playtime: stored.playtime || false,
  })

  const [saved, setSaved] = useState(false)

  const toggle = (key) => {
    if (key === 'food' && !feeding) return
    setChecked(prev => ({ ...prev, [key]: !prev[key] }))
    setSaved(false)
  }

  const handleSave = () => {
    localStorage.setItem(`checklist-${date}`, JSON.stringify(checked))
    setSaved(true)
  }

  const formatted = parsedDate.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  })

  const ITEMS = [
    { key: 'food', emoji: '🍽️', label: feeding ? 'Food' : 'No Food', sublabel: feeding ? '2 scoops' : null, disabled: !feeding },
    { key: 'veggie', emoji: '🥦', label: 'Veggie' },
    { key: 'water', emoji: '💧', label: 'Change Water' },
    { key: 'clean', emoji: '🚽', label: 'Clean' },
    { key: 'snack', emoji: snack.emoji, label: snack.name },
    { key: 'playtime', emoji: '🎡', label: 'Play Time' },
  ]

  return (
    <div className="page">
      <Link to="/calendar" className="back">&lt; Back to Calendar</Link>
      <h1 className="page-title">Care Summary</h1>
      <p className="page-date">{formatted}</p>

      <div className="summary-cards">
        {ITEMS.map(item => (
          <div
            key={item.key}
            className={`card ${checked[item.key] ? 'complete' : ''} ${item.disabled ? 'disabled' : ''}`}
            onClick={() => toggle(item.key)}
          >
            <span className="card-emoji">{item.emoji}</span>
            <div className="card-text">
              <span className="card-label">{item.label}</span>
              {item.sublabel && <span className="card-sublabel">{item.sublabel}</span>}
            </div>
            <div className="checkbox">{checked[item.key] ? '✓' : ''}</div>
          </div>
        ))}
      </div>

      <button className="save-btn" onClick={handleSave}>
        {saved ? '✓ Saved!' : 'Save changes'}
      </button>
    </div>
  )
}
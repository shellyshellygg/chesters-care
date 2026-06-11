import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

const FEEDING_START = '2026-06-10'

function isFeedingDay(date) {
  const start = new Date(FEEDING_START + 'T12:00:00')
  const target = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12, 0, 0
  )
  const diffDays = Math.round((target - start) / (1000 * 60 * 60 * 24))
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

function addDays(dateStr, days) {
  const date = new Date(dateStr + 'T12:00:00')
  date.setDate(date.getDate() + days)
  return date.toLocaleDateString('en-CA')
}

export default function CareSummary() {
  const { date } = useParams()
  const navigate = useNavigate()
  const parsedDate = new Date(date + 'T12:00:00')
  const feeding = isFeedingDay(parsedDate)
  const snack = SNACK_BY_DAY[parsedDate.getDay()]
  const todayKey = new Date().toLocaleDateString('en-CA')
  const isFuture = date > todayKey

  const [checked, setChecked] = useState({
    food: false, veggie: false, water: false,
    clean: false, snack: false, playtime: false, cageclean: false,
  })
  const [notes, setNotes] = useState('')
  const [showNotes, setShowNotes] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [date])

  const loadData = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('checklist')
      .select('*')
      .eq('date', date)
      .single()
    if (data) {
      setChecked({
        food: data.food || false,
        veggie: data.veggie || false,
        water: data.water || false,
        clean: data.clean || false,
        snack: data.snack || false,
        playtime: data.playtime || false,
        cageclean: data.cageclean || false,
      })
      if (data.notes) {
        setNotes(data.notes)
        setShowNotes(true)
      }
    } else {
      setChecked({ food: false, veggie: false, water: false, clean: false, snack: false, playtime: false, cageclean: false })
    }
    setSaved(false)
    setLoading(false)
  }

  const toggle = (key) => {
    if (key === 'food' && !feeding) return
    if (isFuture) return
    setChecked(prev => ({ ...prev, [key]: !prev[key] }))
    setSaved(false)
  }

  const handleSave = async () => {
    await supabase
      .from('checklist')
      .upsert(
        { date, ...checked, notes, updated_at: new Date().toISOString() },
        { onConflict: 'date' }
      )
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
    { key: 'cageclean', emoji: '🧹', label: 'Cage Clean' },
  ]

  return (
    <div className="page">
      <Link to="/calendar" className="back">&lt; Back to Calendar</Link>
      <h1 className="page-title">Care Summary</h1>

      <div className="date-nav">
        <button className="date-nav-btn" onClick={() => navigate(`/care-summary/${addDays(date, -1)}`)}>‹ prev</button>
        <span className="date-nav-label">{formatted}</span>
        <button
          className={`date-nav-btn ${date >= todayKey ? 'disabled-nav' : ''}`}
          onClick={() => { if (date < todayKey) navigate(`/care-summary/${addDays(date, 1)}`) }}
        >
          next ›
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
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
      )}

      <div className="notes-section">
        {!showNotes ? (
          <button className="add-notes-btn" onClick={() => setShowNotes(true)}>
            + add note
          </button>
        ) : (
          <div className="notes-box">
            <p className="notes-label">Notes</p>
            {isFuture ? (
              <p className="notes-empty">{notes || 'No notes added.'}</p>
            ) : (
              <textarea
                className="notes-input"
                placeholder="Add a note about today..."
                value={notes}
                onChange={e => { setNotes(e.target.value); setSaved(false) }}
              />
            )}
          </div>
        )}
      </div>

      {!isFuture && (
        <button className="save-btn" onClick={handleSave}>
          {saved ? '✓ Saved!' : 'Save changes'}
        </button>
      )}
    </div>
  )
}
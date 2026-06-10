import { Link, useParams } from 'react-router-dom'

const ITEMS = [
  { key: 'food', emoji: '🍽️', label: 'Food', sublabel: '2 scoops' },
  { key: 'veggie', emoji: '🥦', label: 'Veggie' },
  { key: 'water', emoji: '💧', label: 'Change Water' },
  { key: 'clean', emoji: '🚽', label: 'Clean' },
  { key: 'snack', emoji: '🌰', label: 'Snack' },
  { key: 'playtime', emoji: '🎡', label: 'Play Time' },
]

export default function CareSummary() {
  const { date } = useParams()
  const data = JSON.parse(localStorage.getItem(`checklist-${date}`) || '{}')
  const hasData = Object.keys(data).length > 0
  const formatted = new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  })

  return (
    <div className="page">
      <Link to="/calendar" className="back">&lt; Back to Calendar</Link>
      <h1 className="page-title">Care Summary</h1>
      <p className="page-date">{formatted}</p>

      {!hasData
        ? <div className="no-data">No data recorded for this day.</div>
        : <div className="summary-cards">
            {ITEMS.map(item => (
              <div key={item.key} className={`summary-card ${data[item.key] ? 'done' : 'not-done'}`}>
                <span className="s-emoji">{item.emoji}</span>
                <div className="s-text">
                  <span className="s-label">{item.label}</span>
                  {item.sublabel && <span className="s-sublabel">{item.sublabel}</span>}
                </div>
                <span className="s-check">{data[item.key] ? '✓' : '✕'}</span>
              </div>
            ))}
          </div>
      }
    </div>
  )
}
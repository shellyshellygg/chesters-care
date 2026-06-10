import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

const FEEDING_START = new Date('2026-06-07T12:00:00')

function isFeedingDay(date) {
  const diffDays = Math.floor((date - FEEDING_START) / (1000 * 60 * 60 * 24))
  return diffDays % 2 !== 0
}

export default function Calendar() {
  const navigate = useNavigate()
  const today = new Date()
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [checklistData, setChecklistData] = useState({})

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  useEffect(() => { loadMonth() }, [viewDate])

  const loadMonth = async () => {
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`
    const { data } = await supabase
      .from('checklist')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
    if (data) {
      const map = {}
      data.forEach(row => { map[row.date] = row })
      setChecklistData(map)
    }
  }

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const todayKey = today.toLocaleDateString('en-CA')

  return (
    <div className="page">
      <Link to="/" className="back">&lt; Back to Checklist</Link>
      <h1 className="page-title">Calendar Tracker 📅</h1>

      <div className="cal-nav">
        <button className="cal-arrow" onClick={() => setViewDate(new Date(year, month - 1, 1))}>‹</button>
        <span className="cal-nav-month">{monthName}</span>
        <button className="cal-arrow" onClick={() => setViewDate(new Date(year, month + 1, 1))}>›</button>
      </div>

      <div className="cal-grid">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="cal-header-cell">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />
          const date = new Date(year, month, day)
          const dateKey = date.toLocaleDateString('en-CA')
          const isToday = dateKey === todayKey
          const data = checklistData[dateKey] || {}
          const hasData = Object.keys(data).length > 0
          const feeding = isFeedingDay(date)
          const foodChecked = data.food === true
          const emojis = [data.snack && '🌰', data.playtime && '🎡', data.cageclean && '🧹'].filter(Boolean).join('')

          let cellClass = feeding ? 'feeding-day' : 'no-feed-day'
          if (feeding && foodChecked) cellClass = 'all-done'
          else if (feeding && hasData && !foodChecked) cellClass = 'feeding-pending'

          return (
            <div
              key={day}
              className={`cal-cell ${cellClass} ${isToday ? 'is-today' : ''}`}
              onClick={() => navigate(`/care-summary/${dateKey}`)}
            >
              <span className="cal-day">{day}</span>
              <span className="cal-emojis">{emojis}</span>
            </div>
          )
        })}
      </div>

      <div className="cal-legend">
        <div className="legend-item"><span className="legend-dot green" />Fed</div>
        <div className="legend-item"><span className="legend-dot red" />Not fed</div>
        <div className="legend-item"><span className="legend-dot grey" />No food day</div>
        <div className="legend-item">🌰 treat &nbsp; 🎡 playtime</div>
      </div>

      <div className="links">
        <p>more stuff:</p>
        <Link to="/foods">&gt; safe hamster foods</Link>
        <Link to="/profile">&gt; chester's profile</Link>
      </div>
    </div>
  )
}
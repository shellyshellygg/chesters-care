import { useState } from 'react'
import { Link } from 'react-router-dom'
import confetti from 'canvas-confetti'

export default function WeightTracker() {
  const [weights, setWeights] = useState(JSON.parse(localStorage.getItem('chester-weights') || '[]'))
  const [input, setInput] = useState('')

  const handleSubmit = () => {
    if (!input || isNaN(input)) return
    const entry = { date: new Date().toISOString(), weight: parseFloat(input) }
    const updated = [entry, ...weights]
    setWeights(updated)
    localStorage.setItem('chester-weights', JSON.stringify(updated))
    localStorage.setItem('last-weigh-date', new Date().toISOString())
    setInput('')
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#e8735a', '#f28b7d', '#7bc67e', '#fde8e4']
    })
  }

  const handleDelete = (index) => {
    const updated = weights.filter((_, i) => i !== index)
    setWeights(updated)
    localStorage.setItem('chester-weights', JSON.stringify(updated))
  }

  return (
    <div className="page">
      <Link to="/profile" className="back">&lt; Back to Profile</Link>
      <h1 className="page-title">Weight Tracker ⚖️</h1>
      <p className="page-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>

      <div className="weight-input-row">
        <input
          type="number"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="enter weight"
          className="weight-input"
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
        <span className="grams-label">grams</span>
        <button onClick={handleSubmit} className="enter-btn">enter</button>
      </div>

      <h3 style={{ marginBottom: '10px', fontSize: '16px' }}>Chester's Record:</h3>
      <div className="weight-log">
        {weights.length === 0
          ? <p className="empty-log">No entries yet.</p>
          : weights.map((entry, i) => (
            <div key={i} className="weight-row">
              <span className="wlog-date">
                {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="wlog-weight">{entry.weight}g</span>
              <button onClick={() => handleDelete(i)} className="delete-btn">✕</button>
            </div>
          ))
        }
      </div>
    </div>
  )
}
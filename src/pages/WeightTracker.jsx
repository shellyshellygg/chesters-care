import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { supabase } from '../supabase'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Dot } from 'recharts'

export default function WeightTracker() {
  const [weights, setWeights] = useState([])
  const [input, setInput] = useState('')

  useEffect(() => { loadWeights() }, [])

  const loadWeights = async () => {
    const { data } = await supabase
      .from('weights')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setWeights(data)
  }

  const handleSubmit = async () => {
    if (!input || isNaN(input)) return
    await supabase.from('weights').insert({
      date: new Date().toLocaleDateString('en-CA'),
      weight: parseFloat(input),
    })
    localStorage.setItem('last-weigh-date', new Date().toISOString())
    setInput('')
    loadWeights()
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#e8735a', '#f28b7d', '#7bc67e', '#fde8e4']
    })
  }

  const handleDelete = async (id) => {
    await supabase.from('weights').delete().eq('id', id)
    loadWeights()
  }

  const chartData = [...weights]
    .reverse()
    .map(w => ({
      date: new Date(w.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: w.weight
    }))

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

      {chartData.length > 1 && (
        <div className="weight-chart">
          <p className="chart-label">Weight over time</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
              <Tooltip
                formatter={(value) => [`${value}g`, 'Weight']}
                contentStyle={{ borderRadius: '10px', border: '1px solid #f0e0d8', fontSize: '13px' }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#e8735a"
                strokeWidth={2.5}
                dot={{ fill: '#e8735a', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <h3 style={{ marginBottom: '10px', fontSize: '16px' }}>Chester's Record:</h3>
      <div className="weight-log">
        {weights.length === 0
          ? <p className="empty-log">No entries yet.</p>
          : weights.map((entry) => (
            <div key={entry.id} className="weight-row">
              <span className="wlog-date">{new Date(entry.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span className="wlog-weight">{entry.weight}g</span>
              <button onClick={() => handleDelete(entry.id)} className="delete-btn">✕</button>
            </div>
          ))
        }
      </div>
    </div>
  )
}
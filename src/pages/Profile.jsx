import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase'

const BIRTH_DATE = new Date('2025-02-14')

function getAge() {
  const now = new Date()
  let years = now.getFullYear() - BIRTH_DATE.getFullYear()
  let months = now.getMonth() - BIRTH_DATE.getMonth()
  if (months < 0) { years--; months += 12 }
  if (years === 0) return `${months} month${months !== 1 ? 's' : ''} old`
  if (months === 0) return `${years} year${years !== 1 ? 's' : ''} old`
  return `${years} year${years !== 1 ? 's' : ''} and ${months} month${months !== 1 ? 's' : ''} old`
}

export default function Profile() {
  const [latest, setLatest] = useState(null)

  useEffect(() => {
    const loadLatest = async () => {
      const { data } = await supabase
        .from('weights')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      if (data) setLatest(data)
    }
    loadLatest()
  }, [])

  return (
    <div className="page">
      <Link to="/" className="back">&lt; Back to Checklist</Link>
      <h1 className="page-title">About Chester 🐹</h1>
      <div className="gotcha-badge">🎉 Gotcha Day: August 14, 2025</div>

      <div className="info-card">
        <p>Chester is around</p>
        <h2>{getAge()}</h2>
      </div>

      <div className="info-card">
        {latest ? (
          <>
            <p>On <strong>{new Date(latest.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</strong>, he weighed</p>
            <h2>{latest.weight} grams</h2>
          </>
        ) : (
          <p>No weight recorded yet.</p>
        )}
        <Link to="/weight">&gt; see his weight tracker</Link>
      </div>

      <div className="other-info">
        <h3>Other Info:</h3>
        <ul>
          <li>He is a chocolate sable long-haired syrian ham.</li>
          <li>He was adopted from Hamsters Home Rescue in New Jersey.</li>
          <li>He is a grumpy old man, but we love him very much!</li>
        </ul>
      </div>

      <div className="links">
        <p>more stuff:</p>
        <Link to="/foods">&gt; safe hamster foods</Link>
        <Link to="/calendar">&gt; chester's calendar tracker</Link>
      </div>
    </div>
  )
}
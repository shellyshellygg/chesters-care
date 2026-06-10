import { useState, useEffect, useRef } from 'react'
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
  const [photoUrl, setPhotoUrl] = useState(null)
  const [jiggling, setJiggling] = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    loadLatest()
    loadPhoto()
  }, [])

  const loadLatest = async () => {
    const { data } = await supabase
      .from('weights')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    if (data) setLatest(data)
  }

  const loadPhoto = async () => {
    const { data } = await supabase.storage
      .from('chester-photos')
      .list('', { limit: 1 })
    if (data && data.length > 0) {
      const { data: urlData } = supabase.storage
        .from('chester-photos')
        .getPublicUrl(data[0].name)
      setPhotoUrl(urlData.publicUrl)
    }
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const { error } = await supabase.storage
      .from('chester-photos')
      .upload('chester-profile.jpg', file, { upsert: true })
    if (!error) loadPhoto()
  }

  const handleJiggle = () => {
    setJiggling(true)
    setTimeout(() => setJiggling(false), 600)
  }

  return (
    <div className="page">
      <Link to="/" className="back">&lt; Back to Checklist</Link>
      <h1 className="page-title">About Chester 🐹</h1>
      <div className="gotcha-badge">🎉 Gotcha Day: August 14, 2025</div>

      <div className="profile-photo-section">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Chester"
            className={`profile-photo ${jiggling ? 'jiggle' : ''}`}
            onClick={handleJiggle}
          />
        ) : (
          <div className="profile-photo-placeholder" onClick={() => fileRef.current.click()}>
            <span>🐹</span>
            <p>tap to add chester's photo</p>
          </div>
        )}
        {photoUrl && (
          <button className="change-photo-btn" onClick={() => fileRef.current.click()}>
            change photo
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handlePhotoUpload}
        />
      </div>

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
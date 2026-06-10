import { useState } from 'react'

const CORRECT_CODE = '1022'

export default function Passcode({ onUnlock }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = () => {
    if (input === CORRECT_CODE) {
      localStorage.setItem('chester-unlocked', 'true')
      onUnlock()
    } else {
      setError(true)
      setInput('')
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div className="passcode-screen">
      <span className="passcode-emoji">🐹</span>
      <h1>Chester's Care</h1>
      <p>Enter the passcode to continue</p>
      <input
        type="password"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        placeholder="••••"
        className={`passcode-input ${error ? 'passcode-error' : ''}`}
        maxLength={6}
        autoFocus
      />
      {error && <p className="passcode-error-msg">Incorrect code — try again</p>}
      <button onClick={handleSubmit} className="enter-btn">Unlock</button>
    </div>
  )
}
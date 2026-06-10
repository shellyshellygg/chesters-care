import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase'

function fuzzyMatch(item, search) {
  const s = search.toLowerCase()
  const n = item.toLowerCase()
  if (n.includes(s)) return true
  for (let i = 0; i < s.length; i++) {
    if (n.includes(s.slice(0, i) + s.slice(i + 1))) return true
  }
  return false
}

export default function SafeFoods() {
  const [foods, setFoods] = useState({ veggies: [], fruits: [], snacks: [] })
  const [search, setSearch] = useState('')
  const [newItem, setNewItem] = useState({ veggies: '', fruits: '', snacks: '' })

  useEffect(() => { loadFoods() }, [])

  const loadFoods = async () => {
    const { data } = await supabase.from('safe_foods').select('*').order('name')
    if (data) {
      setFoods({
        veggies: data.filter(f => f.category === 'veggies').map(f => ({ id: f.id, name: f.name })),
        fruits: data.filter(f => f.category === 'fruits').map(f => ({ id: f.id, name: f.name })),
        snacks: data.filter(f => f.category === 'snacks').map(f => ({ id: f.id, name: f.name })),
      })
    }
  }

  const addItem = async (category) => {
    const val = newItem[category].trim()
    if (!val) return
    await supabase.from('safe_foods').insert({ category, name: val })
    setNewItem(prev => ({ ...prev, [category]: '' }))
    loadFoods()
  }

  const removeItem = async (id) => {
    await supabase.from('safe_foods').delete().eq('id', id)
    loadFoods()
  }

  const filtered = {
    veggies: foods.veggies.filter(f => fuzzyMatch(f.name, search)),
    fruits: foods.fruits.filter(f => fuzzyMatch(f.name, search)),
    snacks: foods.snacks.filter(f => fuzzyMatch(f.name, search)),
  }

  const noResults = search && Object.values(filtered).every(arr => arr.length === 0)

  return (
    <div className="page">
      <Link to="/" className="back">&lt; Back to Checklist</Link>
      <h1 className="page-title">Safe Hamster Food 🥦</h1>

      <input
        className="search-input"
        placeholder="Search foods..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {noResults && (
        <div className="no-results">
          <p>No results for "<strong>{search}</strong>"</p>
          <p className="hint">Did you mean something else? This item may not be on the approved food list.</p>
        </div>
      )}

      {['veggies', 'fruits', 'snacks'].map(category => (
        <div key={category} className="food-section">
          <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
          <ul>
            {filtered[category].map(item => (
              <li key={item.id}>
                {item.name}
                <button className="remove-btn" onClick={() => removeItem(item.id)}>✕</button>
              </li>
            ))}
          </ul>
          {!search && (
            <div className="add-row">
              <input
                className="add-input"
                placeholder={`Add a ${category.slice(0, -1)}...`}
                value={newItem[category]}
                onChange={e => setNewItem(prev => ({ ...prev, [category]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && addItem(category)}
              />
              <button className="add-btn" onClick={() => addItem(category)}>+ Add</button>
            </div>
          )}
        </div>
      ))}

      <div className="links">
        <p>more stuff:</p>
        <Link to="/profile">&gt; chester's profile</Link>
        <Link to="/calendar">&gt; chester's calendar tracker</Link>
      </div>
    </div>
  )
}
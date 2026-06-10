import { useState } from 'react'
import { Link } from 'react-router-dom'

const DEFAULT_FOODS = {
  veggies: ['Broccoli', 'Carrot', 'Cucumber', 'Zucchini', 'Bell pepper', 'Spinach', 'Kale', 'Cabbage'],
  fruits: ['Blueberry', 'Strawberry', 'Apple (no seeds)', 'Pear', 'Watermelon', 'Banana', 'Mango'],
  snacks: ['Plain tofu', 'Pumpkin seed', 'Sunflower seed', 'Plain cooked chicken', 'Hard boiled egg', 'Lab blocks', 'Peanut (unsalted)'],
}

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
  const [foods, setFoods] = useState(
    JSON.parse(localStorage.getItem('safe-foods') || JSON.stringify(DEFAULT_FOODS))
  )
  const [search, setSearch] = useState('')
  const [newItem, setNewItem] = useState({ veggies: '', fruits: '', snacks: '' })

  const save = (updated) => {
    setFoods(updated)
    localStorage.setItem('safe-foods', JSON.stringify(updated))
  }

  const addItem = (category) => {
    const val = newItem[category].trim()
    if (!val) return
    save({ ...foods, [category]: [...foods[category], val] })
    setNewItem(prev => ({ ...prev, [category]: '' }))
  }

  const removeItem = (category, index) => {
    save({ ...foods, [category]: foods[category].filter((_, i) => i !== index) })
  }

  const filtered = {
    veggies: foods.veggies.filter(i => fuzzyMatch(i, search)),
    fruits: foods.fruits.filter(i => fuzzyMatch(i, search)),
    snacks: foods.snacks.filter(i => fuzzyMatch(i, search)),
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
            {filtered[category].map((item, i) => (
              <li key={i}>
                {item}
                <button className="remove-btn" onClick={() => removeItem(category, foods[category].indexOf(item))}>✕</button>
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
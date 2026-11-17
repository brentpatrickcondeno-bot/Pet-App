import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { usePets } from '../context/PetContext'

const CARE_CATEGORIES = [
  { id: 'health', label: 'Health & Vet', icon: 'heart-pulse' },
  { id: 'nutrition', label: 'Nutrition', icon: 'apple' },
  { id: 'grooming', label: 'Grooming', icon: 'scissors' },
  { id: 'training', label: 'Training', icon: 'graduation-cap' },
  { id: 'exercise', label: 'Exercise', icon: 'activity' },
  { id: 'notes', label: 'My Notes', icon: 'notebook-pen' }
]

const ICONS = {
  'heart-pulse': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/><path d="M15.23 17.23 12 20.46 8.77 17.23"/><path d="M14 14.76V3.5a2.5 2.5 0 1 1 5 0v11.26"/><path d="M7 14.76V3.5a2.5 2.5 0 1 0-5 0v11.26"/></svg>,
  'apple': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4H4a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h8z"/><path d="M12 2v4"/><path d="M8 6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2z"/></svg>,
  'scissors': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88"/><path d="M14.47 14.48 20 20M8.12 8.12 12 12"/></svg>,
  'graduation-cap': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.92 3.24a1 1 0 0 0-1.821-.02L3.24 9.72a1 1 0 0 0-.019 1.838l8.5 6.69a1 1 0 0 0 1.821.02l8.5-6.69z"/><path d="M22 10.92v5.08a2 2 0 0 1-2 1.995L12 18l-8-6.085a2 2 0 0 1-2-1.995V10.92"/></svg>,
  'activity': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  'notebook-pen': <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
}

const CARE_TEMPLATES = {
  health: [
    { type: 'Vaccination', label: 'Vaccination', icon: 'heart-pulse' },
    { type: 'Checkup', label: 'Vet Checkup', icon: 'heart-pulse' },
    { type: 'Medication', label: 'Medication', icon: 'heart-pulse' },
    { type: 'Dental', label: 'Dental Cleaning', icon: 'heart-pulse' }
  ],
  nutrition: [
    { type: 'Food', label: 'Food Change', icon: 'apple' },
    { type: 'Supplement', label: 'Supplement', icon: 'apple' },
    { type: 'Feeding', label: 'Feeding Schedule', icon: 'apple' }
  ],
  grooming: [
    { type: 'Bath', label: 'Bath', icon: 'scissors' },
    { type: 'Brushing', label: 'Brushing', icon: 'scissors' },
    { type: 'Nails', label: 'Nail Trim', icon: 'scissors' },
    { type: 'Haircut', label: 'Haircut', icon: 'scissors' }
  ],
  training: [
    { type: 'Command', label: 'New Command', icon: 'graduation-cap' },
    { type: 'Behavior', label: 'Behavior Note', icon: 'graduation-cap' },
    { type: 'Class', label: 'Training Class', icon: 'graduation-cap' }
  ],
  exercise: [
    { type: 'Walk', label: 'Walk', icon: 'activity' },
    { type: 'Play', label: 'Play Session', icon: 'activity' },
    { type: 'Activity', label: 'Activity', icon: 'activity' }
  ],
  notes: [
    { type: 'Note', label: 'General Note', icon: 'notebook-pen' },
    { type: 'Milestone', label: 'Milestone', icon: 'notebook-pen' },
    { type: 'Reminder', label: 'Reminder', icon: 'notebook-pen' }
  ]
}

export default function PetCare() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { pets, myPets, careRecords, getCareRecords, addCareRecord } = usePets()
  const [activeTab, setActiveTab] = useState('health')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ type: '', date: '', notes: '' })

  const pet = [...pets, ...myPets].find(p => p.id === parseInt(id))

  if (!pet) {
    navigate('/my-pets')
    return null
  }

  const records = getCareRecords(pet.id)
  const filteredRecords = records.filter(r => r.category === activeTab).sort((a, b) => new Date(b.date) - new Date(a.date))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.type || !formData.date) return

    addCareRecord(pet.id, {
      category: activeTab,
      type: formData.type,
      date: formData.date,
      notes: formData.notes
    })
    setFormData({ type: '', date: '', notes: '' })
    setShowForm(false)
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="pet-care">
      <div className="container">
        {/* Header */}
        <div className="pet-care-header mb-8">
          <Link to="/my-pets" className="btn btn-ghost mb-4" style={{display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back
          </Link>
          <div className="flex items-center gap-4">
            <img src={pet.image} alt={pet.name} style={{width: '80px', height: '80px', borderRadius: 'var(--radius-xl)', objectFit: 'cover'}} />
            <div>
              <h1 className="text-3xl font-bold">{pet.name}</h1>
              <p className="text-neutral-600">{pet.breed} {pet.type} • {pet.age} year{pet.age !== 1 ? 's' : ''} old</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <nav className="pet-care-tabs" aria-label="Care categories" role="tablist">
          {CARE_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeTab === cat.id}
              aria-controls={`${cat.id}-panel`}
              id={`${cat.id}-tab`}
              className={`pet-care-tab ${activeTab === cat.id ? 'active' : ''}`}
              onClick={() => setActiveTab(cat.id)}
            >
              {ICONS[cat.icon]}
              <span className="ml-2">{cat.label}</span>
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="pet-care-content">
          <div className="pet-care-section" role="tabpanel" id={`${activeTab}-panel`} aria-labelledby={`${activeTab}-tab`}>
            <div className="flex justify-between items-center mb-6">
              <h3>{CARE_CATEGORIES.find(c => c.id === activeTab).label} Records</h3>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => { setFormData({ type: '', date: new Date().toISOString().split('T')[0], notes: '' }); setShowForm(true) }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Record
              </button>
            </div>

            {/* Add Record Form */}
            {showForm && (
              <form onSubmit={handleSubmit} className="care-record-form mb-6" style={{background: 'var(--color-neutral-50)', padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)'}}>
                <div className="add-pet-row">
                  <div className="form-group">
                    <label htmlFor="care-type" className="form-label">Type *</label>
                    <select
                      id="care-type"
                      name="type"
                      className="form-select"
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      required
                    >
                      <option value="">Select type</option>
                      {CARE_TEMPLATES[activeTab].map(t => (
                        <option key={t.type} value={t.type}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="care-date" className="form-label">Date *</label>
                    <input
                      type="date"
                      id="care-date"
                      name="date"
                      className="form-input"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      required
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="care-notes" className="form-label">Notes</label>
                  <textarea
                    id="care-notes"
                    name="notes"
                    className="form-textarea"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    placeholder="Optional notes about this care event..."
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Record</button>
                </div>
              </form>
            )}

            {/* Records List */}
            <div className="care-record-list">
              {filteredRecords.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  <p>No {CARE_CATEGORIES.find(c => c.id === activeTab).label.toLowerCase()} records yet</p>
                  <p className="text-sm mt-1">Click "Add Record" to start tracking</p>
                </div>
              ) : (
                filteredRecords.map(record => (
                  <div key={record.id} className="care-record-item">
                    <div className="care-record-icon">
                      {ICONS[CARE_CATEGORIES.find(c => c.id === activeTab).icon]}
                    </div>
                    <div className="care-record-info">
                      <div className="care-record-type">{record.type}</div>
                      <div className="care-record-date">{formatDate(record.date)}</div>
                      {record.notes && <div className="care-record-notes">{record.notes}</div>}
                    </div>
                    <button
                      className="care-record-delete"
                      onClick={() => { if (confirm('Delete this record?')) { /* TODO: add delete function */ }}}
                      aria-label="Delete record"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Summary Sidebar */}
          <aside>
            <div className="pet-care-section">
              <h3>Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                {CARE_CATEGORIES.map(cat => {
                  const count = records.filter(r => r.category === cat.id).length
                  return (
                    <div key={cat.id} className="text-center p-4 bg-neutral-50 rounded-lg">
                      <div className="text-3xl font-bold text-primary-600">{count}</div>
                      <div className="text-xs text-neutral-600">{cat.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="pet-care-section mt-6">
              <h3>Pet Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Name</span>
                  <span className="font-medium">{pet.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Breed</span>
                  <span className="font-medium">{pet.breed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Type</span>
                  <span className="font-medium">{pet.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Age</span>
                  <span className="font-medium">{pet.age} year{pet.age !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Size</span>
                  <span className="font-medium">{pet.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Vaccinated</span>
                  <span className="font-medium">{pet.vaccinated ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Spayed/Neutered</span>
                  <span className="font-medium">{pet.neutered ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>

            <div className="pet-care-section mt-6">
              <h3>Quick Actions</h3>
              <div className="space-y-3">
                <Link to={`/pets/${pet.id}`} className="btn btn-outline btn-full">View Profile</Link>
                <Link to="/pets" className="btn btn-secondary btn-full">Browse More Pets</Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
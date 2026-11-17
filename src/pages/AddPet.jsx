import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePets } from '../context/PetContext'

const PET_TYPES = ['Dog', 'Cat', 'Rabbit', 'Bird', 'Other']
const GENDERS = ['Male', 'Female']
const SIZES = ['Small', 'Medium', 'Large']

const PERSONALITY_TRAITS = [
  'Friendly', 'Energetic', 'Calm', 'Affectionate', 'Playful',
  'Shy', 'Independent', 'Social', 'Protective', 'Gentle',
  'Smart', 'Trainable', 'Good with kids', 'Good with dogs',
  'Good with cats', 'Litter trained', 'House trained',
  'Loves fetch', 'Loves cuddles', 'High energy', 'Low energy'
]

export default function AddPet() {
  const navigate = useNavigate()
  const { addPet } = usePets()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [imagePreview, setImagePreview] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    gender: '',
    size: '',
    description: '',
    location: '',
    adoptionFee: '',
    vaccinated: false,
    neutered: false,
    personality: []
  })

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Pet name is required'
    if (!formData.type) newErrors.type = 'Pet type is required'
    if (!formData.breed.trim()) newErrors.breed = 'Breed is required'
    if (!formData.age || formData.age < 0 || formData.age > 30) newErrors.age = 'Valid age (0-30) is required'
    if (!formData.gender) newErrors.gender = 'Gender is required'
    if (!formData.size) newErrors.size = 'Size is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (!formData.adoptionFee || formData.adoptionFee < 0) newErrors.adoptionFee = 'Valid adoption fee is required'
    if (!imagePreview) newErrors.image = 'Please upload a photo'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox' && name === 'personality') {
      setFormData(prev => ({
        ...prev,
        personality: checked
          ? [...prev.personality, value]
          : prev.personality.filter(t => t !== value)
      }))
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleImageUpload = (file) => {
    if (!file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files[0]) handleImageUpload(e.dataTransfer.files[0])
  }

  const removeImage = () => {
    setImagePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const petData = {
        ...formData,
        age: parseInt(formData.age),
        adoptionFee: parseInt(formData.adoptionFee),
        image: imagePreview || 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop'
      }
      addPet(petData)
      navigate('/pets')
    } catch (error) {
      console.error('Error adding pet:', error)
      alert('Failed to add pet. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="add-pet">
      <div className="container">
        <div className="add-pet-header mb-8">
          <h1 className="text-4xl font-bold mb-2">List a Pet for Adoption</h1>
          <p className="text-lg text-neutral-600">Help a pet find their forever home by creating a listing</p>
        </div>

        <form onSubmit={handleSubmit} className="add-pet-form" noValidate>
          {/* Basic Info Section */}
          <section className="add-pet-section" aria-labelledby="basic-info-heading">
            <h3 id="basic-info-heading">Basic Information</h3>
            <div className="add-pet-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Pet Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`form-input ${errors.name ? 'border-error-500' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Buddy"
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p id="name-error" className="form-error">{errors.name}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="type" className="form-label">Pet Type *</label>
                <select
                  id="type"
                  name="type"
                  className={`form-select ${errors.type ? 'border-error-500' : ''}`}
                  value={formData.type}
                  onChange={handleChange}
                  aria-describedby={errors.type ? 'type-error' : undefined}
                  aria-invalid={!!errors.type}
                >
                  <option value="">Select type</option>
                  {PET_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.type && <p id="type-error" className="form-error">{errors.type}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="breed" className="form-label">Breed *</label>
                <input
                  type="text"
                  id="breed"
                  name="breed"
                  className={`form-input ${errors.breed ? 'border-error-500' : ''}`}
                  value={formData.breed}
                  onChange={handleChange}
                  placeholder="e.g., Golden Retriever"
                  aria-describedby={errors.breed ? 'breed-error' : undefined}
                  aria-invalid={!!errors.breed}
                />
                {errors.breed && <p id="breed-error" className="form-error">{errors.breed}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="age" className="form-label">Age (years) *</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  className={`form-input ${errors.age ? 'border-error-500' : ''}`}
                  value={formData.age}
                  onChange={handleChange}
                  min="0"
                  max="30"
                  placeholder="0"
                  aria-describedby={errors.age ? 'age-error' : 'age-hint'}
                  aria-invalid={!!errors.age}
                />
                {errors.age ? (
                  <p id="age-error" className="form-error">{errors.age}</p>
                ) : (
                  <p id="age-hint" className="form-hint">Enter 0 for puppies/kittens under 1 year</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="gender" className="form-label">Gender *</label>
                <select
                  id="gender"
                  name="gender"
                  className={`form-select ${errors.gender ? 'border-error-500' : ''}`}
                  value={formData.gender}
                  onChange={handleChange}
                  aria-describedby={errors.gender ? 'gender-error' : undefined}
                  aria-invalid={!!errors.gender}
                >
                  <option value="">Select gender</option>
                  {GENDERS.map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
                {errors.gender && <p id="gender-error" className="form-error">{errors.gender}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="size" className="form-label">Size *</label>
                <select
                  id="size"
                  name="size"
                  className={`form-select ${errors.size ? 'border-error-500' : ''}`}
                  value={formData.size}
                  onChange={handleChange}
                  aria-describedby={errors.size ? 'size-error' : undefined}
                  aria-invalid={!!errors.size}
                >
                  <option value="">Select size</option>
                  {SIZES.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                {errors.size && <p id="size-error" className="form-error">{errors.size}</p>}
              </div>
            </div>
          </section>

          {/* Location & Fee Section */}
          <section className="add-pet-section" aria-labelledby="location-fee-heading">
            <h3 id="location-fee-heading">Location & Adoption Fee</h3>
            <div className="add-pet-row">
              <div className="form-group" style={{flex: '1 1 300px'}}>
                <label htmlFor="location" className="form-label">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className={`form-input ${errors.location ? 'border-error-500' : ''}`}
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Quezon City, Metro Manila"
                  aria-describedby={errors.location ? 'location-error' : undefined}
                  aria-invalid={!!errors.location}
                />
                {errors.location && <p id="location-error" className="form-error">{errors.location}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="adoptionFee" className="form-label">Adoption Fee (PHP) *</label>
                <input
                  type="number"
                  id="adoptionFee"
                  name="adoptionFee"
                  className={`form-input ${errors.adoptionFee ? 'border-error-500' : ''}`}
                  value={formData.adoptionFee}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  aria-describedby={errors.adoptionFee ? 'fee-error' : undefined}
                  aria-invalid={!!errors.adoptionFee}
                />
                {errors.adoptionFee && <p id="fee-error" className="form-error">{errors.adoptionFee}</p>}
              </div>
            </div>
          </section>

          {/* Description Section */}
          <section className="add-pet-section" aria-labelledby="description-heading">
            <h3 id="description-heading">Description</h3>
            <div className="form-group">
              <label htmlFor="description" className="form-label">Tell us about this pet *</label>
              <textarea
                id="description"
                name="description"
                className={`form-textarea ${errors.description ? 'border-error-500' : ''}`}
                value={formData.description}
                onChange={handleChange}
                rows={6}
                placeholder="Describe the pet's personality, history, likes/dislikes, ideal home environment, etc."
                aria-describedby={errors.description ? 'desc-error' : 'desc-hint'}
                aria-invalid={!!errors.description}
              />
              {errors.description ? (
                <p id="desc-error" className="form-error">{errors.description}</p>
              ) : (
                <p id="desc-hint" className="form-hint">Help potential adopters get to know this pet! Minimum 50 characters recommended.</p>
              )}
            </div>
          </section>

          {/* Photo Section */}
          <section className="add-pet-section" aria-labelledby="photo-heading">
            <h3 id="photo-heading">Photo</h3>
            <div className="form-group">
              {imagePreview ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button
                    type="button"
                    className="image-preview-remove"
                    onClick={removeImage}
                    aria-label="Remove photo"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ) : (
                <div
                  className={`image-upload ${dragOver ? 'drag-over' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('photo-input').click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('photo-input').click() }}
                  aria-label="Upload pet photo"
                >
                  <input
                    id="photo-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
                    style={{display: 'none'}}
                  />
                  <svg className="image-upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <p className="image-upload-text">Drag & drop a photo here, or click to browse</p>
                  <p className="form-hint mt-2">JPG, PNG up to 5MB. Recommended aspect ratio: 4:3</p>
                </div>
              )}
              {errors.image && <p className="form-error mt-2">{errors.image}</p>}
            </div>
          </section>

          {/* Medical Info Section */}
          <section className="add-pet-section" aria-labelledby="medical-heading">
            <h3 id="medical-heading">Medical Information</h3>
            <div className="checkbox-group" style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  name="vaccinated"
                  checked={formData.vaccinated}
                  onChange={handleChange}
                />
                <span>Vaccinated</span>
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  name="neutered"
                  checked={formData.neutered}
                  onChange={handleChange}
                />
                <span>Spayed/Neutered</span>
              </label>
            </div>
          </section>

          {/* Personality Section */}
          <section className="add-pet-section" aria-labelledby="personality-heading">
            <h3 id="personality-heading">Personality Traits</h3>
            <p className="form-hint mb-4">Select all that apply (helps with matching)</p>
            <div className="checkbox-group" style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              {PERSONALITY_TRAITS.map(trait => (
                <label key={trait} className="checkbox-item">
                  <input
                    type="checkbox"
                    name="personality"
                    value={trait}
                    checked={formData.personality.includes(trait)}
                    onChange={handleChange}
                  />
                  <span>{trait}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Actions */}
          <div className="add-pet-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/pets')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg className="spinner" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="30" strokeDashoffset="15"/></svg>
                  Publishing...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Publish Listing
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
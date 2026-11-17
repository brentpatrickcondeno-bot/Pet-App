import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { usePets } from '../context/PetContext'

export default function PetDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { pets, adoptPet, myPets } = usePets()
  const [activeThumbnail, setActiveThumbnail] = useState(0)

  const pet = pets.find(p => p.id === parseInt(id))

  if (!pet) {
    return (
      <div className="not-found">
        <div className="not-found-content">
          <div className="not-found-code">404</div>
          <h1 className="not-found-title">Pet Not Found</h1>
          <p className="not-found-text">The pet you're looking for doesn't exist or has been adopted.</p>
          <Link to="/pets" className="btn btn-primary">Browse All Pets</Link>
        </div>
      </div>
    )
  }

  const isAdopted = myPets.some(p => p.id === pet.id)

  const handleAdopt = () => {
    if (window.confirm(`Are you sure you want to adopt ${pet.name}?`)) {
      adoptPet(pet.id)
      navigate('/my-pets')
    }
  }

  const images = [
    pet.image,
    `https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&fit=crop`,
    `https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=600&fit=crop`,
  ]

  return (
    <div className="pet-detail">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="pet-detail-breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="hover:underline">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/pets" className="hover:underline">Adopt</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{pet.name}</span>
        </nav>

        <div className="pet-detail-main">
          {/* Gallery */}
          <div className="pet-detail-gallery">
            <div className="pet-detail-main-image">
              <img
                src={images[activeThumbnail]}
                alt={`${pet.name}, a ${pet.breed} ${pet.type.toLowerCase()}`}
              />
              {pet.adopted && (
                <div style={{position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)'}}>
                  <span className="badge badge-warning">Adopted</span>
                </div>
              )}
            </div>
            <div className="pet-detail-thumbnails" role="group" aria-label="Pet photos">
              {images.map((img, index) => (
                <button
                  key={index}
                  className={`pet-detail-thumbnail ${activeThumbnail === index ? 'active' : ''}`}
                  onClick={() => setActiveThumbnail(index)}
                  aria-label={`View photo ${index + 1}`}
                  aria-current={activeThumbnail === index ? 'true' : 'false'}
                >
                  <img src={img} alt={`${pet.name} photo ${index + 1}`} loading={index === 0 ? 'eager' : 'lazy'} />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="pet-detail-info">
            <div className="pet-detail-title-row">
              <h1 className="pet-detail-name">{pet.name}</h1>
              <span className="pet-detail-type">{pet.type}</span>
            </div>

            <div className="pet-detail-meta">
              <div className="pet-detail-meta-item">
                <span className="pet-detail-meta-label">Breed:</span>
                <span>{pet.breed}</span>
              </div>
              <div className="pet-detail-meta-item">
                <span className="pet-detail-meta-label">Age:</span>
                <span>{pet.age} year{pet.age !== 1 ? 's' : ''}</span>
              </div>
              <div className="pet-detail-meta-item">
                <span className="pet-detail-meta-label">Gender:</span>
                <span>{pet.gender}</span>
              </div>
              <div className="pet-detail-meta-item">
                <span className="pet-detail-meta-label">Size:</span>
                <span>{pet.size}</span>
              </div>
              <div className="pet-detail-meta-item">
                <span className="pet-detail-meta-label">Location:</span>
                <span>{pet.location}</span>
              </div>
            </div>

            <div className="pet-detail-description">
              <h3>About {pet.name}</h3>
              <p>{pet.description}</p>
            </div>

            <div className="pet-detail-personality">
              <h3>Personality</h3>
              <div className="pet-detail-personality-tags">
                {pet.personality.map((trait, index) => (
                  <span key={index} className="badge badge-primary">{trait}</span>
                ))}
              </div>
            </div>

            <div className="pet-detail-actions">
              {isAdopted ? (
                <button className="btn btn-primary btn-full" disabled>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Already Adopted
                </button>
              ) : pet.adopted ? (
                <button className="btn btn-secondary btn-full" disabled>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  Adopted
                </button>
              ) : (
                <button className="btn btn-primary btn-full" onClick={handleAdopt}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Adopt {pet.name} - ${pet.adoptionFee}
                </button>
              )}
              <Link to="/pets" className="btn btn-outline btn-full">Back to Browse</Link>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="pet-detail-sidebar">
          <div className="pet-detail-card">
            <h3>Adoption Details</h3>
            <div className="pet-detail-adoption-fee">
              <span className="pet-detail-fee-label">Adoption Fee</span>
              <span className="pet-detail-fee-amount">${pet.adoptionFee}</span>
            </div>
            <div className="pet-detail-includes">
              <div className="pet-detail-include-item">
                <span className="pet-detail-include-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <span>Spay/Neuter Surgery</span>
              </div>
              <div className="pet-detail-include-item">
                <span className="pet-detail-include-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <span>Vaccinations & Deworming</span>
              </div>
              <div className="pet-detail-include-item">
                <span className="pet-detail-include-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <span>Microchip & Registration</span>
              </div>
              <div className="pet-detail-include-item">
                <span className="pet-detail-include-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <span>Health Check-up</span>
              </div>
              <div className="pet-detail-include-item">
                <span className="pet-detail-include-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <span>Starter Kit (Food, Toys)</span>
              </div>
            </div>
            <div className="pet-detail-status">
              <h4 style={{fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--space-3)'}}>
                {pet.vaccinated ? '✓ Vaccinated' : '✗ Not Vaccinated'}
              </h4>
              <h4 style={{fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--space-3)'}}>
                {pet.neutered ? '✓ Spayed/Neutered' : '✗ Not Spayed/Neutered'}
              </h4>
              <h4 style={{fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)'}}>
                {pet.adopted ? '✓ Adopted' : 'Available for Adoption'}
              </h4>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
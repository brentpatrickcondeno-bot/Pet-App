import { Link } from 'react-router-dom'
import { usePets } from '../context/PetContext'

export default function MyPets() {
  const { myPets } = usePets()

  return (
    <div className="my-pets">
      <div className="container">
        <div className="my-pets-header">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Pets</h1>
            <p className="text-lg text-neutral-600">
              {myPets.length === 0
                ? "You haven't adopted any pets yet"
                : `You have ${myPets.length} adopted pet${myPets.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <Link to="/pets" className="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Browse More Pets
          </Link>
        </div>

        {myPets.length === 0 ? (
          <div className="my-pets-empty">
            <svg className="my-pets-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <h3>No Pets Yet</h3>
            <p>Start browsing to find your new best friend!</p>
            <Link to="/pets" className="btn btn-primary mt-4">Browse Pets</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Your adopted pets">
            {myPets.map(pet => (
              <article key={pet.id} className="card" role="listitem">
                <Link to={`/pets/${pet.id}`} className="pet-card" aria-label={`View ${pet.name} details`}>
                  <div className="pet-card-image">
                    <img src={pet.image} alt={`${pet.name}, a ${pet.breed} ${pet.type.toLowerCase()}`} loading="lazy" />
                    <span className="badge badge-success" style={{position: 'absolute', top: 'var(--space-3)', left: 'var(--space-3)', zIndex: 1}}>
                      Adopted
                    </span>
                  </div>
                  <div className="pet-card-content">
                    <div className="pet-card-header">
                      <h3 className="pet-card-name">{pet.name}</h3>
                      <span className="pet-card-type">{pet.type}</span>
                    </div>
                    <div className="pet-card-details">
                      <span className="pet-card-detail">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
                        {pet.age} year{pet.age !== 1 ? 's' : ''}
                      </span>
                      <span className="pet-card-detail">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                        {pet.size}
                      </span>
                      <span className="pet-card-detail">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {pet.location}
                      </span>
                    </div>
                    {pet.adoptedDate && (
                      <p className="pet-card-body" style={{fontSize: 'var(--font-size-sm)', color: 'var(--color-primary-600)', fontWeight: 'var(--font-weight-medium)'}}>
                        Adopted on {new Date(pet.adoptedDate).toLocaleDateString()}
                      </p>
                    )}
                    <div className="pet-card-footer">
                      <span className="pet-card-location">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {pet.location}
                      </span>
                      <Link to={`/pet-care/${pet.id}`} className="btn btn-outline btn-sm">Care Guide</Link>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
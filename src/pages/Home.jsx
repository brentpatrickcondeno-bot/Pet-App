import { Link } from 'react-router-dom'
import { usePets } from '../context/PetContext'
import { formatPHP } from '../utils/currency'

export default function Home() {
  const { filteredPets } = usePets()
  const featuredPets = filteredPets.slice(0, 3)

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 id="hero-title">Find Your Perfect Companion</h1>
              <p>Discover loving pets waiting for their forever homes. Adopt, don't shop.</p>
              <div className="hero-actions">
                <Link to="/pets" className="btn btn-primary btn-lg">
                  Browse All Pets
                </Link>
                <Link to="/add-pet" className="btn btn-outline btn-lg">
                  List a Pet
                </Link>
              </div>
            </div>
            <div className="hero-image">
              <img
                src="https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&h=400&fit=crop"
                alt="Happy family with adopted dog"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section" aria-labelledby="stats-title">
        <div className="container">
          <div className="grid grid-cols-4 gap-6" role="list" aria-label="Platform statistics">
            <div className="text-center" role="listitem">
              <div className="font-bold text-4xl text-primary-600" aria-label="1,200+ pets adopted">1,200+</div>
              <div className="text-sm text-neutral-600 mt-1">Pets Adopted</div>
            </div>
            <div className="text-center" role="listitem">
              <div className="font-bold text-4xl text-primary-600" aria-label="500+ shelters">500+</div>
              <div className="text-sm text-neutral-600 mt-1">Partner Shelters</div>
            </div>
            <div className="text-center" role="listitem">
              <div className="font-bold text-4xl text-primary-600" aria-label="98% satisfaction">98%</div>
              <div className="text-sm text-neutral-600 mt-1">Happy Families</div>
            </div>
            <div className="text-center" role="listitem">
              <div className="font-bold text-4xl text-primary-600" aria-label="24/7 support">24/7</div>
              <div className="text-sm text-neutral-600 mt-1">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pets */}
      <section className="section" aria-labelledby="featured-title">
        <div className="container">
          <div className="section-header">
            <h2 id="featured-title">Featured Pets</h2>
            <p>Meet some of our wonderful animals looking for their forever homes</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPets.map(pet => (
              <article key={pet.id} className="card">
                <Link to={`/pets/${pet.id}`} className="pet-card" aria-label={`View ${pet.name} details`}>
                  <div className="pet-card-image">
                    <img src={pet.image} alt={`${pet.name}, a ${pet.breed} ${pet.type.toLowerCase()}`} loading="lazy" />
                    {pet.adopted && (
                      <span className="badge badge-warning" style={{position: 'absolute', top: 'var(--space-3)', left: 'var(--space-3)', zIndex: 1}}>
                        Adopted
                      </span>
                    )}
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
                    <div className="pet-card-footer">
                      <span className="pet-card-location">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {pet.location}
                      </span>
                      <span className="pet-card-fee">{formatPHP(pet.adoptionFee)}</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/pets" className="btn btn-primary btn-lg">View All Pets</Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section" style={{backgroundColor: 'var(--color-neutral-0)'}} aria-labelledby="how-title">
        <div className="container">
          <div className="section-header">
            <h2 id="how-title">How It Works</h2>
            <p>Finding your new best friend is easy with Pawsome</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-xl flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary-600">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Search & Discover</h3>
              <p className="text-neutral-600">Browse pets by type, size, location, and more. Filter to find your perfect match.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-xl flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary-600">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect & Meet</h3>
              <p className="text-neutral-600">Contact shelters directly, schedule visits, and meet your potential new family member.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-xl flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary-600">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Adopt & Love</h3>
              <p className="text-neutral-600">Complete the adoption process and welcome your new companion home forever.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" aria-labelledby="cta-title">
        <div className="container">
          <div className="card" style={{background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))', color: 'white', textAlign: 'center', padding: 'var(--space-16) var(--space-8)'}}>
            <h2 id="cta-title" style={{color: 'white', marginBottom: 'var(--space-4)'}}>Ready to Find Your New Best Friend?</h2>
            <p style={{color: 'rgba(255,255,255,0.9)', fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-8)', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto'}}>Thousands of pets are waiting for loving homes. Start your adoption journey today.</p>
            <Link to="/pets" className="btn btn-lg" style={{backgroundColor: 'white', color: 'var(--color-primary-600)', borderColor: 'white'}}>Start Browsing</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { usePets } from '../context/PetContext'

export default function Pets() {
  const { filteredPets, filters, setFilters } = usePets()
  const [searchParams, setSearchParams] = useSearchParams()
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid')

  // Sync URL params with filters
  useEffect(() => {
    const type = searchParams.get('type') || ''
    const size = searchParams.get('size') || ''
    const location = searchParams.get('location') || ''
    const search = searchParams.get('search') || ''

    setFilters({
      type,
      size,
      location,
      search
    })
  }, [searchParams, setFilters])

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    setSearchParams(newParams)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    handleFilterChange('search', e.target.search.value)
  }

  const clearFilters = () => {
    setSearchParams({})
    setFilters({ type: '', size: '', location: '', search: '' })
  }

  const hasActiveFilters = filters.type || filters.size || filters.location || filters.search

  const sortedPets = [...filteredPets].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.id - a.id
      case 'oldest':
        return a.id - b.id
      case 'price-low':
        return a.adoptionFee - b.adoptionFee
      case 'price-high':
        return b.adoptionFee - a.adoptionFee
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const petTypes = [...new Set(filteredPets.map(p => p.type))]
  const petSizes = [...new Set(filteredPets.map(p => p.size))]
  const locations = [...new Set(filteredPets.map(p => p.location))]

  return (
    <div className="pets">
      <div className="container">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Find Your Perfect Pet</h1>
          <p className="text-lg text-neutral-600">Browse {filteredPets.length} pet{filteredPets.length !== 1 ? 's' : ''} available for adoption</p>
        </div>

        {/* Filters */}
        <div className="filters" role="search" aria-label="Pet filters">
          <form onSubmit={handleSearch} className="filters-form">
            <div className="filter-group" style={{flex: '1 1 300px'}}>
              <label htmlFor="search" className="filter-label">Search</label>
              <input
                type="search"
                id="search"
                name="search"
                className="form-input"
                placeholder="Search by name, breed..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                aria-label="Search pets by name or breed"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="type" className="filter-label">Type</label>
              <select
                id="type"
                className="form-select"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                aria-label="Filter by pet type"
              >
                <option value="">All Types</option>
                {petTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="size" className="filter-label">Size</label>
              <select
                id="size"
                className="form-select"
                value={filters.size}
                onChange={(e) => handleFilterChange('size', e.target.value)}
                aria-label="Filter by pet size"
              >
                <option value="">All Sizes</option>
                {['Small', 'Medium', 'Large'].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="location" className="filter-label">Location</label>
              <select
                id="location"
                className="form-select"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                aria-label="Filter by location"
              >
                <option value="">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="filter-actions">
              {hasActiveFilters && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={clearFilters}
                  aria-label="Clear all filters"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Results Header */}
        <div className="results-header">
          <div className="results-count">
            Showing <strong>{sortedPets.length}</strong> of <strong>{filteredPets.length}</strong> pet{sortedPets.length !== 1 ? 's' : ''}
          </div>
          <div className="results-sort">
            <label htmlFor="sort" className="sr-only">Sort by</label>
            <select
              id="sort"
              className="form-select"
              style={{width: 'auto', padding: 'var(--space-2) var(--space-8) var(--space-2) var(--space-3)'}}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort results"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-end mb-4">
          <div className="flex bg-neutral-100 rounded-lg p-1" role="group" aria-label="View mode">
            <button
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-neutral-500 hover:text-neutral-700'}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </button>
            <button
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-neutral-500 hover:text-neutral-700'}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Results */}
        {sortedPets.length > 0 ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : ''}`} role="list" aria-label="Available pets">
            {sortedPets.map(pet => (
              <article key={pet.id} className={`card ${viewMode === 'list' ? 'flex' : ''}`} role="listitem">
                <Link to={`/pets/${pet.id}`} className="pet-card" style={{display: viewMode === 'list' ? 'flex' : 'block', width: '100%'}} aria-label={`View ${pet.name} details`}>
                  <div className="pet-card-image" style={{width: viewMode === 'list' ? '200px' : '100%', flexShrink: 0, borderRadius: viewMode === 'list' ? 'var(--radius-xl) 0 0 var(--radius-xl)' : 'var(--radius-xl) var(--radius-xl) 0 0'}}>
                    <img src={pet.image} alt={`${pet.name}, a ${pet.breed} ${pet.type.toLowerCase()}`} loading="lazy" style={{width: '100%', height: '100%', objectFit: 'cover', aspectRatio: viewMode === 'list' ? 'auto' : '4/3'}} />
                    {pet.adopted && (
                      <span className="badge badge-warning" style={{position: 'absolute', top: 'var(--space-3)', left: 'var(--space-3)', zIndex: 1}}>
                        Adopted
                      </span>
                    )}
                  </div>
                  <div className="pet-card-content" style={{flex: 1, display: 'flex', flexDirection: 'column', padding: viewMode === 'list' ? 'var(--space-5)' : 'var(--space-4)'}}>
                    <div className="pet-card-header">
                      <h3 className="pet-card-name">{pet.name}</h3>
                      <span className="pet-card-type">{pet.type}</span>
                    </div>
                    {viewMode === 'list' && (
                      <p className="pet-card-body" style={{flex: 1, marginBottom: 'var(--space-3)'}}>{pet.description.substring(0, 120)}...</p>
                    )}
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
                    <div className="pet-card-footer" style={{marginTop: viewMode === 'list' ? 'auto' : 0}}>
                      <span className="pet-card-location">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {pet.location}
                      </span>
                      <span className="pet-card-fee">${pet.adoptionFee}</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16" role="status">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-neutral-300 mb-4" aria-hidden="true">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <h3 className="text-xl font-semibold mb-2">No pets found</h3>
            <p className="text-neutral-600 mb-6">Try adjusting your filters or search terms</p>
            <button className="btn btn-primary" onClick={clearFilters}>Clear All Filters</button>
          </div>
        )}
      </div>
    </div>
  )
}
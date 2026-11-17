import { Link, useLocation } from 'react-router-dom'
import { usePets } from '../context/PetContext'

export default function Header() {
  const location = useLocation()
  const { myPets } = usePets()

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/pets', label: 'Adopt' },
    { path: '/add-pet', label: 'List a Pet' },
    { path: '/my-pets', label: 'My Pets', badge: myPets.length },
    { path: '/pet-care', label: 'Care Guide' }
  ]

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo" aria-label="Pawsome Home">
          <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" />
            <path d="M19 10C19 13.3 16.3 16 13 16C9.7 16 7 13.3 7 10C7 6.7 9.7 4 13 4C16.3 4 19 6.7 19 10Z" />
            <path d="M12 18C14.2 18 16 16.2 16 14C16 13.4 15.7 12.9 15.2 12.4" />
            <path d="M8 14C8 16.2 9.8 18 12 18C12.6 17.5 13.1 16.9 13.4 16.2" />
          </svg>
          <span className="logo-text">Pawsome</span>
        </Link>

        <nav className="nav" role="navigation" aria-label="Main navigation">
          <ul className="nav-list">
            {navLinks.map(link => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`nav-link ${location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path)) ? 'active' : ''}`}
                >
                  {link.label}
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="nav-badge">{link.badge}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <Link to="/add-pet" className="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Pet
          </Link>
        </div>

        <button className="mobile-menu-btn" aria-label="Toggle menu" aria-expanded="false">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </header>
  )
}
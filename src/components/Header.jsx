import { Link, useLocation } from 'react-router-dom'
import { usePets } from '../context/PetContext'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const location = useLocation()
  const { myPets } = usePets()
  const { user, logout, loading: authLoading } = useAuth()

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/pets', label: 'Adopt' },
    { path: '/add-pet', label: 'List a Pet' },
    { path: '/my-pets', label: 'My Pets', badge: myPets.length },
    { path: '/pet-care', label: 'Care Guide' }
  ]

  const handleLogout = async () => {
    await logout()
  }

  if (authLoading) {
    return (
      <header className="header">
        <div className="container header-content">
          <div className="logo" aria-label="Pawsome Home">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" />
              <path d="M19 10C19 13.3 16.3 16 13 16C9.7 16 7 13.3 7 10C7 6.7 9.7 4 13 4C16.3 4 19 6.7 19 10Z" />
              <path d="M12 18C14.2 18 16 16.2 16 14C16 13.4 15.7 12.9 15.2 12.4" />
              <path d="M8 14C8 16.2 9.8 18 12 18C12.6 17.5 13.1 16.9 13.4 16.2" />
            </svg>
            <span className="logo-text">Pawsome</span>
          </div>
          <div className="loading" style={{width: '20px', height: '20px'}}></div>
        </div>
      </header>
    )
  }

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
          {user ? (
            <div className="user-menu">
              <Link to="/my-pets" className="btn btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                My Pets
              </Link>
              <button
                className="btn btn-ghost"
                onClick={handleLogout}
                aria-label="Sign out"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost hidden sm:inline-flex">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Get Started
              </Link>
            </>
          )}
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
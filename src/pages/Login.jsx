import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { signIn, signInWithGoogle, error, clearError } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [formError, setFormError] = useState('')

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (formError) setFormError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setFormError('')
    try {
      await signIn(formData.email, formData.password)
      navigate('/my-pets')
    } catch (err) {
      setFormError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setFormError('')
    try {
      await signInWithGoogle()
      navigate('/my-pets')
    } catch (err) {
      setFormError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          <div className="auth-header text-center mb-8">
            <Link to="/" className="logo inline-flex mb-6" aria-label="Pawsome Home">
              <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" />
                <path d="M19 10C19 13.3 16.3 16 13 16C9.7 16 7 13.3 7 10C7 6.7 9.7 4 13 4C16.3 4 19 6.7 19 10Z" />
                <path d="M12 18C14.2 18 16 16.2 16 14C16 13.4 15.7 12.9 15.2 12.4" />
                <path d="M8 14C8 16.2 9.8 18 12 18C12.6 17.5 13.1 16.9 13.4 16.2" />
              </svg>
              <span className="logo-text">Pawsome</span>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-neutral-600">Sign in to manage your adopted pets</p>
          </div>

          {(error || formError) && (
            <div className="toast toast-error mb-6" role="alert">
              <svg className="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <div className="toast-content">
                <p className="toast-message">{formError || error}</p>
              </div>
              <button className="toast-close" onClick={clearError} aria-label="Dismiss">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete="email"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label className="checkbox-item">
                <input type="checkbox" name="remember" />
                <span>Remember me</span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="spinner" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="30" strokeDashoffset="15"/>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="divider my-6">
            <span>or continue with</span>
          </div>

          <button
            type="button"
            className="btn btn-outline btn-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <p className="text-center text-sm text-neutral-600 mt-6">
            Don't have an account? <Link to="/register" className="font-medium">Create one</Link>
          </p>

          <p className="text-center text-xs text-neutral-500 mt-4">
            <Link to="/forgot-password">Forgot password?</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
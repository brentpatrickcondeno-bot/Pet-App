import { createContext, useContext, useState, useEffect } from 'react'
import {
  signUp,
  signIn,
  signInWithGoogle,
  logout,
  resetPassword,
  onAuthStateChange,
  getCurrentUser
} from '../firebase/auth'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const handleSignUp = async (email, password, displayName) => {
    try {
      setError(null)
      await signUp(email, password, displayName)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const handleSignIn = async (email, password) => {
    try {
      setError(null)
      await signIn(email, password)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setError(null)
      await signInWithGoogle()
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const handleLogout = async () => {
    try {
      setError(null)
      await logout()
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const handleResetPassword = async (email) => {
    try {
      setError(null)
      await resetPassword(email)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      signUp: handleSignUp,
      signIn: handleSignIn,
      signInWithGoogle: handleGoogleSignIn,
      logout: handleLogout,
      resetPassword: handleResetPassword,
      clearError,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
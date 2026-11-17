// Firebase Authentication Service
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { auth } from './config'
import { createUserProfile, getUserProfile } from './firestore'

// Email/Password Sign Up
export async function signUp(email, password, displayName) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)

  // Update profile with display name
  if (displayName) {
    await updateProfile(userCredential.user, { displayName })
  }

  // Create user profile in Firestore
  await createUserProfile(userCredential.user.uid, {
    email,
    displayName: displayName || email.split('@')[0],
    role: 'user',
    createdAt: new Date().toISOString()
  })

  return userCredential.user
}

// Email/Password Sign In
export async function signIn(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

// Google Sign In
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  const userCredential = await signInWithPopup(auth, provider)

  // Check if user profile exists, create if not
  const profile = await getUserProfile(userCredential.user.uid)
  if (!profile) {
    await createUserProfile(userCredential.user.uid, {
      email: userCredential.user.email,
      displayName: userCredential.user.displayName || userCredential.user.email.split('@')[0],
      photoURL: userCredential.user.photoURL,
      role: 'user',
      createdAt: new Date().toISOString()
    })
  }

  return userCredential.user
}

// Sign Out
export async function logout() {
  await signOut(auth)
}

// Password Reset
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email)
}

// Auth State Observer
export function onAuthStateChange(callback) {
  return onAuthStateChanged(auth, callback)
}

// Get current user
export function getCurrentUser() {
  return auth.currentUser
}

// Auth provider for Google
export const googleProvider = new GoogleAuthProvider()
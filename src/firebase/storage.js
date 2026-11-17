// Firebase Storage Service
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './config'

// Upload image to Firebase Storage
export async function uploadPetImage(file, petId) {
  const fileName = `${petId}/${Date.now()}_${file.name}`
  const storageRef = ref(storage, `pet-images/${fileName}`)

  const snapshot = await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(snapshot.ref)

  return downloadURL
}

// Upload user avatar
export async function uploadAvatar(file, userId) {
  const fileName = `${userId}/avatar_${Date.now()}_${file.name}`
  const storageRef = ref(storage, `avatars/${fileName}`)

  const snapshot = await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(snapshot.ref)

  return downloadURL
}

// Delete image from Firebase Storage
export async function deleteImage(url) {
  try {
    const storageRef = ref(storage, url)
    await deleteObject(storageRef)
  } catch (error) {
    console.warn('Could not delete image:', error)
  }
}

// Generate unique filename
export function generateFileName(originalName, prefix = '') {
  const timestamp = Date.now()
  const extension = originalName.split('.').pop()
  return `${prefix}${timestamp}.${extension}`
}
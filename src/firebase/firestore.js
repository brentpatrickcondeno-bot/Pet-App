// Firestore Service Layer
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  writeBatch,
  Timestamp
} from 'firebase/firestore'
import { db } from './config'

// Collections
const PETS_COLLECTION = 'pets'
const USERS_COLLECTION = 'users'
const CARE_RECORDS_COLLECTION = 'careRecords'
const MY_PETS_COLLECTION = 'myPets'

// Helper to convert Firestore doc to plain object
const docToObj = (doc) => ({
  id: doc.id,
  ...doc.data(),
  // Convert Firestore Timestamps to ISO strings
  createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
  updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
  adoptedDate: doc.data().adoptedDate?.toDate?.()?.toISOString() || doc.data().adoptedDate,
  date: doc.data().date?.toDate?.()?.toISOString() || doc.data().date
})

// ========== PETS ==========

export async function getAllPets() {
  const snapshot = await getDocs(collection(db, PETS_COLLECTION))
  return snapshot.docs.map(docToObj)
}

export async function getPetById(id) {
  const docRef = doc(db, PETS_COLLECTION, id)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? docToObj(docSnap) : null
}

export async function addPet(petData, userId) {
  const pet = {
    ...petData,
    ownerId: userId,
    adopted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }
  const docRef = await addDoc(collection(db, PETS_COLLECTION), pet)
  return { ...pet, id: docRef.id }
}

export async function updatePet(id, updates) {
  const docRef = doc(db, PETS_COLLECTION, id)
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp()
  })
  return { id, ...updates }
}

export async function adoptPet(petId, userId) {
  const batch = writeBatch(db)

  // Update pet as adopted
  const petRef = doc(db, PETS_COLLECTION, petId)
  batch.update(petRef, {
    adopted: true,
    adoptedBy: userId,
    adoptedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })

  // Add to user's myPets
  const myPetRef = doc(collection(db, MY_PETS_COLLECTION))
  const petSnap = await getDoc(petRef)
  if (petSnap.exists()) {
    const petData = petSnap.data()
    batch.set(myPetRef, {
      ...petData,
      petId,
      adopted: true,
      adoptedAt: serverTimestamp(),
      userId
    })
  }

  await batch.commit()
  return true
}

export async function deletePet(id) {
  await deleteDoc(doc(db, PETS_COLLECTION, id))
}

export function subscribeToPets(callback) {
  const q = query(collection(db, PETS_COLLECTION), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    const pets = snapshot.docs.map(docToObj)
    callback(pets)
  })
}

// ========== USERS / MY PETS ==========

export async function getMyPets(userId) {
  const q = query(
    collection(db, MY_PETS_COLLECTION),
    where('userId', '==', userId),
    orderBy('adoptedAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(docToObj)
}

export function subscribeToMyPets(userId, callback) {
  const q = query(
    collection(db, MY_PETS_COLLECTION),
    where('userId', '==', userId),
    orderBy('adoptedAt', 'desc')
  )
  return onSnapshot(q, (snapshot) => {
    const pets = snapshot.docs.map(docToObj)
    callback(pets)
  })
}

// ========== CARE RECORDS ==========

export async function getCareRecords(petId) {
  const q = query(
    collection(db, CARE_RECORDS_COLLECTION),
    where('petId', '==', petId),
    orderBy('date', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(docToObj)
}

export async function addCareRecord(petId, recordData, userId) {
  const record = {
    ...recordData,
    petId,
    userId,
    createdAt: serverTimestamp()
  }
  const docRef = await addDoc(collection(db, CARE_RECORDS_COLLECTION), record)
  return { ...record, id: docRef.id }
}

export async function deleteCareRecord(recordId) {
  await deleteDoc(doc(db, CARE_RECORDS_COLLECTION, recordId))
}

export function subscribeToCareRecords(petId, callback) {
  const q = query(
    collection(db, CARE_RECORDS_COLLECTION),
    where('petId', '==', petId),
    orderBy('date', 'desc')
  )
  return onSnapshot(q, (snapshot) => {
    const records = snapshot.docs.map(docToObj)
    callback(records)
  })
}

// ========== USER PROFILE ==========

export async function getUserProfile(userId) {
  const docRef = doc(db, USERS_COLLECTION, userId)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? docToObj(docSnap) : null
}

export async function createUserProfile(userId, userData) {
  const docRef = doc(db, USERS_COLLECTION, userId)
  await updateDoc(docRef, {
    ...userData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
}

export async function updateUserProfile(userId, updates) {
  const docRef = doc(db, USERS_COLLECTION, userId)
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp()
  })
}
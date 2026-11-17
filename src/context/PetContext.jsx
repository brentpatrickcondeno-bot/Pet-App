import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  addPet as addPetFirebase,
  adoptPet as adoptPetFirebase,
  addCareRecord as addCareRecordFirebase,
  getCareRecords,
  subscribeToPets,
  subscribeToMyPets,
  subscribeToCareRecords
} from '../firebase/firestore'
import { useAuth } from './AuthContext'

const PetContext = createContext()

// Initial pet data for seeding
const initialPets = [
  {
    name: "Buddy",
    type: "Dog",
    breed: "Golden Retriever",
    age: 3,
    gender: "Male",
    size: "Large",
    description: "Buddy is a friendly and energetic Golden Retriever who loves playing fetch and going on long walks. He's great with kids and other dogs! Fully vaccinated and neutered.",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop&auto=format",
    vaccinated: true,
    neutered: true,
    adopted: false,
    location: "Quezon City, Metro Manila",
    adoptionFee: 12500,
    personality: ["Friendly", "Energetic", "Good with kids", "Loves fetch"]
  },
  {
    name: "Whiskers",
    type: "Cat",
    breed: "Persian",
    age: 2,
    gender: "Female",
    size: "Medium",
    description: "Whiskers is a sweet and calm Persian cat who enjoys lounging in sunny spots and getting gentle pets. She's perfect for a quiet home. Fully vaccinated and spayed.",
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop&auto=format",
    vaccinated: true,
    neutered: true,
    adopted: false,
    location: "Makati, Metro Manila",
    adoptionFee: 7500,
    personality: ["Calm", "Affectionate", "Quiet", "Indoor cat"]
  },
  {
    name: "Rocket",
    type: "Dog",
    breed: "Border Collie",
    age: 1,
    gender: "Male",
    size: "Medium",
    description: "Rocket is a smart and active Border Collie puppy who needs lots of mental stimulation and exercise. He's learning quickly! Vaccinated, not yet neutered.",
    image: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=400&h=400&fit=crop&auto=format",
    vaccinated: true,
    neutered: false,
    adopted: false,
    location: "Cebu City, Cebu",
    adoptionFee: 15000,
    personality: ["Smart", "Active", "Trainable", "High energy"]
  },
  {
    name: "Luna",
    type: "Cat",
    breed: "Maine Coon",
    age: 4,
    gender: "Female",
    size: "Large",
    description: "Luna is a majestic Maine Coon with a gentle personality. She loves to chat with her humans and follow them around the house. Fully vaccinated and spayed.",
    image: "https://images.unsplash.com/photo-1615751054241-61be6e8f44de?w=400&h=400&fit=crop&auto=format",
    vaccinated: true,
    neutered: true,
    adopted: false,
    location: "Davao City, Davao del Sur",
    adoptionFee: 10000,
    personality: ["Gentle", "Talkative", "Social", "Fluffy"]
  },
  {
    name: "Max",
    type: "Dog",
    breed: "German Shepherd",
    age: 5,
    gender: "Male",
    size: "Large",
    description: "Max is a loyal and protective German Shepherd. He's well-trained and makes an excellent companion for an experienced dog owner. Fully vaccinated and neutered.",
    image: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=400&fit=crop&auto=format",
    vaccinated: true,
    neutered: true,
    adopted: true,
    location: "Taguig, Metro Manila",
    adoptionFee: 10000,
    personality: ["Loyal", "Protective", "Trained", "Intelligent"]
  },
  {
    name: "Mochi",
    type: "Rabbit",
    breed: "Holland Lop",
    age: 1,
    gender: "Female",
    size: "Small",
    description: "Mochi is an adorable Holland Lop rabbit who loves hopping around and eating fresh vegetables. She's litter trained! Fully vaccinated and spayed.",
    image: "https://images.unsplash.com/photo-1601758005096-4c8c9b8b2d8c?w=400&h=400&fit=crop&auto=format",
    vaccinated: true,
    neutered: true,
    adopted: false,
    location: "Baguio City, Benguet",
    adoptionFee: 3500,
    personality: ["Cute", "Litter trained", "Gentle", "Vegetarian"]
  },
  {
    name: "Chico",
    type: "Dog",
    breed: "Aspin (Asong Pinoy)",
    age: 2,
    gender: "Male",
    size: "Medium",
    description: "Chico is a loving Aspin (native Filipino dog) rescued from the streets. He's resilient, loyal, and adapts well to any home. Fully vaccinated and neutered.",
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&h=400&fit=crop&auto=format",
    vaccinated: true,
    neutered: true,
    adopted: false,
    location: "Pasig, Metro Manila",
    adoptionFee: 5000,
    personality: ["Resilient", "Loyal", "Adaptable", "Street smart"]
  },
  {
    name: "Simba",
    type: "Cat",
    breed: "Puspin (Pusang Pinoy)",
    age: 3,
    gender: "Male",
    size: "Medium",
    description: "Simba is a handsome Puspin (native Filipino cat) with a big personality. He's independent but affectionate on his terms. Fully vaccinated and neutered.",
    image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=400&fit=crop&auto=format",
    vaccinated: true,
    neutered: true,
    adopted: false,
    location: "Las Piñas, Metro Manila",
    adoptionFee: 3000,
    personality: ["Independent", "Affectionate", "Low maintenance", "Hunter"]
  }
]

export function PetProvider({ children }) {
  const { user } = useAuth()
  const [pets, setPets] = useState([])
  const [myPets, setMyPets] = useState([])
  const [careRecords, setCareRecords] = useState({})
  const [filters, setFilters] = useState({
    type: '',
    size: '',
    location: '',
    search: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [useFirebase, setUseFirebase] = useState(false)

  // Initialize - try Firebase first, fallback to localStorage
  useEffect(() => {
    const initData = async () => {
      try {
        // Try to use Firebase if user is authenticated
        if (user) {
          setUseFirebase(true)
          await loadFromFirebase()
        } else {
          loadFromLocalStorage()
        }
      } catch (err) {
        console.warn('Firebase unavailable, falling back to localStorage:', err)
        loadFromLocalStorage()
      } finally {
        setLoading(false)
      }
    }

    initData()
  }, [user])

  // Load data from Firebase with real-time subscriptions
  const loadFromFirebase = async () => {
    if (!user) return

    try {
      // Subscribe to pets (real-time)
      const unsubscribePets = subscribeToPets((fetchedPets) => {
        setPets(fetchedPets)
        saveToLocalStorage('pawsome-pets', fetchedPets)
      })

      // Subscribe to myPets (real-time)
      const unsubscribeMyPets = subscribeToMyPets(user.uid, (fetchedMyPets) => {
        setMyPets(fetchedMyPets)
        saveToLocalStorage('pawsome-my-pets', fetchedMyPets)
      })

      // Care records loaded on demand per pet (not real-time for performance)

      // Cleanup subscriptions on unmount
      return () => {
        unsubscribePets()
        unsubscribeMyPets()
      }
    } catch (err) {
      console.error('Firebase load error:', err)
      throw err
    }
  }

  // Load data from localStorage (fallback/offline)
  const loadFromLocalStorage = () => {
    try {
      const savedPets = localStorage.getItem('pawsome-pets')
      const savedMyPets = localStorage.getItem('pawsome-my-pets')
      const savedCareRecords = localStorage.getItem('pawsome-care-records')

      if (savedPets) {
        setPets(JSON.parse(savedPets))
      } else {
        // First time - use initial data
        setPets(initialPets)
        saveToLocalStorage('pawsome-pets', initialPets)
      }

      if (savedMyPets) {
        setMyPets(JSON.parse(savedMyPets))
      } else {
        setMyPets([])
      }

      if (savedCareRecords) {
        setCareRecords(JSON.parse(savedCareRecords))
      } else {
        setCareRecords({})
      }
    } catch (err) {
      console.error('LocalStorage load error:', err)
      setPets(initialPets)
      setMyPets([])
      setCareRecords({})
    }
  }

  // Save to localStorage
  const saveToLocalStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (err) {
      console.warn('LocalStorage save error:', err)
    }
  }

  // Sync pets to localStorage when changed
  useEffect(() => {
    if (pets.length > 0) {
      saveToLocalStorage('pawsome-pets', pets)
    }
  }, [pets])

  // Sync myPets to localStorage when changed
  useEffect(() => {
    saveToLocalStorage('pawsome-my-pets', myPets)
  }, [myPets])

  // Sync careRecords to localStorage when changed
  useEffect(() => {
    saveToLocalStorage('pawsome-care-records', careRecords)
  }, [careRecords])

  // Add pet - works with both Firebase and localStorage
  const addPet = useCallback(async (pet) => {
    const newPet = {
      ...pet,
      id: useFirebase && user ? undefined : Date.now(), // Firebase generates ID
      adopted: false,
      vaccinated: pet.vaccinated || false,
      neutered: pet.neutered || false,
      createdAt: new Date().toISOString()
    }

    if (useFirebase && user) {
      try {
        const savedPet = await addPetFirebase(newPet, user.uid)
        setPets(prev => [savedPet, ...prev])
        return savedPet
      } catch (err) {
        console.error('Firebase addPet error:', err)
        // Fallback to localStorage
      }
    }

    // localStorage fallback
    const localPet = { ...newPet, id: Date.now() }
    setPets(prev => [localPet, ...prev])
    return localPet
  }, [useFirebase, user])

  // Adopt pet
  const adoptPet = useCallback(async (petId) => {
    const petToAdopt = pets.find(p => p.id === petId)
    if (!petToAdopt) return

    if (useFirebase && user) {
      try {
        await adoptPetFirebase(petId, user.uid)
        // Real-time subscription will update myPets
        setPets(prev => prev.map(pet =>
          pet.id === petId ? { ...pet, adopted: true } : pet
        ))
        return
      } catch (err) {
        console.error('Firebase adoptPet error:', err)
        // Fallback to localStorage
      }
    }

    // localStorage fallback
    setPets(prev => prev.map(pet =>
      pet.id === petId ? { ...pet, adopted: true } : pet
    ))
    setMyPets(prev => [{ ...petToAdopt, adopted: true, adoptedDate: new Date().toISOString() }, ...prev])
  }, [pets, useFirebase, user])

  // Add care record
  const addCareRecord = useCallback(async (petId, record) => {
    const newRecord = {
      ...record,
      id: useFirebase && user ? undefined : Date.now(),
      date: new Date().toISOString(),
      petId
    }

    if (useFirebase && user) {
      try {
        const savedRecord = await addCareRecordFirebase(petId, newRecord, user.uid)
        setCareRecords(prev => ({
          ...prev,
          [petId]: [savedRecord, ...(prev[petId] || [])]
        }))
        return savedRecord
      } catch (err) {
        console.error('Firebase addCareRecord error:', err)
        // Fallback to localStorage
      }
    }

    // localStorage fallback
    setCareRecords(prev => ({
      ...prev,
      [petId]: [newRecord, ...(prev[petId] || [])]
    }))
    return newRecord
  }, [useFirebase, user])

  // Get care records for a pet
  const getCareRecordsForPet = useCallback(async (petId) => {
    if (useFirebase && user) {
      try {
        const records = await getCareRecords(petId)
        setCareRecords(prev => ({ ...prev, [petId]: records }))
        return records
      } catch (err) {
        console.error('Firebase getCareRecords error:', err)
      }
    }
    return careRecords[petId] || []
  }, [careRecords, useFirebase, user])

  // Subscribe to care records for a pet (real-time)
  const subscribeToPetCareRecords = useCallback((petId, callback) => {
    if (!useFirebase || !user) return () => {}
    return subscribeToCareRecords(petId, callback)
  }, [useFirebase, user])

  // Filter pets locally
  const filteredPets = pets.filter(pet => {
    if (filters.type && pet.type !== filters.type) return false
    if (filters.size && pet.size !== filters.size) return false
    if (filters.location && !pet.location.toLowerCase().includes(filters.location.toLowerCase())) return false
    if (filters.search && !pet.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !pet.breed.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })

  // Seed database with initial data (admin function)
  const seedDatabase = useCallback(async () => {
    if (!useFirebase || !user) {
      setError('Must be logged in with Firebase to seed database')
      return false
    }

    try {
      for (const pet of initialPets) {
        await addPetFirebase({ ...pet, ownerId: user.uid }, user.uid)
      }
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }, [useFirebase, user])

  // Clear all data (for testing)
  const clearAllData = useCallback(() => {
    setPets(initialPets)
    setMyPets([])
    setCareRecords({})
    localStorage.removeItem('pawsome-pets')
    localStorage.removeItem('pawsome-my-pets')
    localStorage.removeItem('pawsome-care-records')
  }, [])

  return (
    <PetContext.Provider value={{
      pets,
      myPets,
      filteredPets,
      filters,
      setFilters,
      loading,
      error,
      useFirebase,
      addPet,
      adoptPet,
      addCareRecord,
      getCareRecords: getCareRecordsForPet,
      subscribeToCareRecords: subscribeToPetCareRecords,
      careRecords,
      seedDatabase,
      clearAllData
    }}>
      {children}
    </PetContext.Provider>
  )
}

export function usePets() {
  const context = useContext(PetContext)
  if (!context) {
    throw new Error('usePets must be used within a PetProvider')
  }
  return context
}
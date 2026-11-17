import { createContext, useContext, useState, useEffect } from 'react'

const PetContext = createContext()

// Sample initial pet data
const initialPets = [
  {
    id: 1,
    name: "Buddy",
    type: "Dog",
    breed: "Golden Retriever",
    age: 3,
    gender: "Male",
    size: "Large",
    description: "Buddy is a friendly and energetic Golden Retriever who loves playing fetch and going on long walks. He's great with kids and other dogs!",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop",
    vaccinated: true,
    neutered: true,
    adopted: false,
    location: "New York, NY",
    adoptionFee: 250,
    personality: ["Friendly", "Energetic", "Good with kids", "Loves fetch"]
  },
  {
    id: 2,
    name: "Whiskers",
    type: "Cat",
    breed: "Persian",
    age: 2,
    gender: "Female",
    size: "Medium",
    description: "Whiskers is a sweet and calm Persian cat who enjoys lounging in sunny spots and getting gentle pets. She's perfect for a quiet home.",
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop",
    vaccinated: true,
    neutered: true,
    adopted: false,
    location: "Los Angeles, CA",
    adoptionFee: 150,
    personality: ["Calm", "Affectionate", "Quiet", "Indoor cat"]
  },
  {
    id: 3,
    name: "Rocket",
    type: "Dog",
    breed: "Border Collie",
    age: 1,
    gender: "Male",
    size: "Medium",
    description: "Rocket is a smart and active Border Collie puppy who needs lots of mental stimulation and exercise. He's learning quickly!",
    image: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=400&h=400&fit=crop",
    vaccinated: true,
    neutered: false,
    adopted: false,
    location: "Chicago, IL",
    adoptionFee: 300,
    personality: ["Smart", "Active", "Trainable", "High energy"]
  },
  {
    id: 4,
    name: "Luna",
    type: "Cat",
    breed: "Maine Coon",
    age: 4,
    gender: "Female",
    size: "Large",
    description: "Luna is a majestic Maine Coon with a gentle personality. She loves to chat with her humans and follow them around the house.",
    image: "https://images.unsplash.com/photo-1615751054241-61be6e8f44de?w=400&h=400&fit=crop",
    vaccinated: true,
    neutered: true,
    adopted: false,
    location: "Seattle, WA",
    adoptionFee: 200,
    personality: ["Gentle", "Talkative", "Social", "Fluffy"]
  },
  {
    id: 5,
    name: "Max",
    type: "Dog",
    breed: "German Shepherd",
    age: 5,
    gender: "Male",
    size: "Large",
    description: "Max is a loyal and protective German Shepherd. He's well-trained and makes an excellent companion for an experienced dog owner.",
    image: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=400&fit=crop",
    vaccinated: true,
    neutered: true,
    adopted: true,
    location: "Austin, TX",
    adoptionFee: 200,
    personality: ["Loyal", "Protective", "Trained", "Intelligent"]
  },
  {
    id: 6,
    name: "Mochi",
    type: "Rabbit",
    breed: "Holland Lop",
    age: 1,
    gender: "Female",
    size: "Small",
    description: "Mochi is an adorable Holland Lop rabbit who loves hopping around and eating fresh vegetables. She's litter trained!",
    image: "https://images.unsplash.com/photo-1601758005096-4c8c9b8b2d8c?w=400&h=400&fit=crop",
    vaccinated: true,
    neutered: true,
    adopted: false,
    location: "Denver, CO",
    adoptionFee: 75,
    personality: ["Cute", "Litter trained", "Gentle", "Vegetarian"]
  }
]

export function PetProvider({ children }) {
  const [pets, setPets] = useState(() => {
    const saved = localStorage.getItem('pawsome-pets')
    return saved ? JSON.parse(saved) : initialPets
  })
  const [myPets, setMyPets] = useState(() => {
    const saved = localStorage.getItem('pawsome-my-pets')
    return saved ? JSON.parse(saved) : []
  })
  const [careRecords, setCareRecords] = useState(() => {
    const saved = localStorage.getItem('pawsome-care-records')
    return saved ? JSON.parse(saved) : {}
  })
  const [filters, setFilters] = useState({
    type: '',
    size: '',
    location: '',
    search: ''
  })

  useEffect(() => {
    localStorage.setItem('pawsome-pets', JSON.stringify(pets))
  }, [pets])

  useEffect(() => {
    localStorage.setItem('pawsome-my-pets', JSON.stringify(myPets))
  }, [myPets])

  useEffect(() => {
    localStorage.setItem('pawsome-care-records', JSON.stringify(careRecords))
  }, [careRecords])

  const addPet = (pet) => {
    const newPet = {
      ...pet,
      id: Date.now(),
      adopted: false,
      vaccinated: pet.vaccinated || false,
      neutered: pet.neutered || false
    }
    setPets(prev => [newPet, ...prev])
    return newPet
  }

  const adoptPet = (petId) => {
    setPets(prev => prev.map(pet =>
      pet.id === petId ? { ...pet, adopted: true } : pet
    ))
    const adoptedPet = pets.find(p => p.id === petId)
    if (adoptedPet) {
      setMyPets(prev => [{ ...adoptedPet, adopted: true, adoptedDate: new Date().toISOString() }, ...prev])
    }
  }

  const addCareRecord = (petId, record) => {
    setCareRecords(prev => ({
      ...prev,
      [petId]: [...(prev[petId] || []), { ...record, id: Date.now(), date: new Date().toISOString() }]
    }))
  }

  const getCareRecords = (petId) => {
    return careRecords[petId] || []
  }

  const filteredPets = pets.filter(pet => {
    if (filters.type && pet.type !== filters.type) return false
    if (filters.size && pet.size !== filters.size) return false
    if (filters.location && !pet.location.toLowerCase().includes(filters.location.toLowerCase())) return false
    if (filters.search && !pet.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !pet.breed.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })

  return (
    <PetContext.Provider value={{
      pets,
      myPets,
      filteredPets,
      filters,
      setFilters,
      addPet,
      adoptPet,
      addCareRecord,
      getCareRecords,
      careRecords
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
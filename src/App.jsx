import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Pets from './pages/Pets'
import PetDetail from './pages/PetDetail'
import AddPet from './pages/AddPet'
import MyPets from './pages/MyPets'
import PetCare from './pages/PetCare'
import NotFound from './pages/NotFound'
import { PetProvider } from './context/PetContext'

function App() {
  return (
    <PetProvider>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/pets/:id" element={<PetDetail />} />
            <Route path="/add-pet" element={<AddPet />} />
            <Route path="/my-pets" element={<MyPets />} />
            <Route path="/pet-care/:id" element={<PetCare />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </PetProvider>
  )
}

export default App
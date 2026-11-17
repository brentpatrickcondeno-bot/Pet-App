import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Pets from './pages/Pets'
import PetDetail from './pages/PetDetail'
import AddPet from './pages/AddPet'
import MyPets from './pages/MyPets'
import PetCare from './pages/PetCare'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Register from './pages/Register'
import { PetProvider } from './context/PetContext'
import { AuthProvider, useAuth } from './context/AuthContext'

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="app">
        <div className="loading" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

function AppContent() {
  return (
    <PetProvider>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/pets/:id" element={<PetDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/add-pet"
              element={
                <ProtectedRoute>
                  <AddPet />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-pets"
              element={
                <ProtectedRoute>
                  <MyPets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pet-care/:id"
              element={
                <ProtectedRoute>
                  <PetCare />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </PetProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
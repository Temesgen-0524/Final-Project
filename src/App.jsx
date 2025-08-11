import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Clubs from './pages/Clubs'
import ClubDetail from './pages/ClubDetail'
import Elections from './pages/Elections'
import ElectionDetail from './pages/ElectionDetail'
import Complaints from './pages/Complaints'
import LatestNews from './pages/LatestNews'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/clubs" element={<Clubs />} />
              <Route path="/clubs/:id" element={<ClubDetail />} />
              <Route path="/elections" element={<Elections />} />
              <Route path="/elections/:id" element={<ElectionDetail />} />
              <Route path="/complaints" element={
                <ProtectedRoute>
                  <Complaints />
                </ProtectedRoute>
              } />
              <Route path="/latest-news" element={<LatestNews />} />
              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
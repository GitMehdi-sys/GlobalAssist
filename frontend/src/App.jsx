import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthContext'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import History from './pages/History'
import Settings from './pages/Settings'
import Payment from './pages/Payment'
import NotFound from './pages/NotFound'
import AuthSuccess from './pages/AuthSuccess'

// Protected Route Component - Only for profile/history/settings
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="kiwi-spinner"></div>
      </div>
    )
  }
  
  if (!user) {
    // Redirect to login but remember where they wanted to go
    return <Navigate to="/login" replace state={{ returnTo: window.location.pathname }} />
  }
  
  return children
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth-success" element={<AuthSuccess />} />
          
          {/* Home - NO LOGIN REQUIRED */}
          <Route path="/" element={<Home />} />
          
          {/* Protected Routes - Login Required */}
          <Route
            path="/history/:type"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/Loader'

const AuthSuccess = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { loadUser } = useAuth()

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (token) {
      // Save token
      localStorage.setItem('access_token', token)
      localStorage.setItem('refresh_token', token)
      
      // Load user and redirect
      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
    } else {
      navigate('/login')
    }
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-bg">
      <div className="text-center">
        <Loader text="Signing in..." fullScreen={false} />
        <p className="text-text-secondary mt-4">Please wait...</p>
      </div>
    </div>
  )
}

export default AuthSuccess

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const Settings = () => {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || ''
  })
  const [message, setMessage] = useState('')

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.put('/user/profile', formData)
      updateUser(data.user)
      setMessage('Profile updated successfully')
    } catch (error) {
      setMessage('Failed to update profile')
    }
  }

  return (
    <div className="flex h-screen bg-primary-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header selectedModel={{}} onModelChange={() => {}} availableModels={[]} />
        <div className="flex-1 overflow-y-auto p-8">
          <h1 className="text-3xl font-bold text-text-primary mb-8">Settings</h1>
          
          <div className="flex gap-4 mb-8">
            <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'profile' ? 'bg-accent text-white' : 'bg-primary-secondary text-text-secondary'}`}>
              Profile
            </button>
            <button onClick={() => setActiveTab('subscription')} className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'subscription' ? 'bg-accent text-white' : 'bg-primary-secondary text-text-secondary'}`}>
              Subscription
            </button>
          </div>

          {activeTab === 'profile' && (
            <div className="card max-w-2xl">
              <h2 className="text-xl font-bold text-text-primary mb-6">Profile Information</h2>
              {message && <div className="p-4 bg-accent/10 border border-accent rounded-lg mb-6">{message}</div>}
              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Full Name</label>
                  <input type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="input-field" />
                </div>
                <button type="submit" className="btn-primary">Save Changes</button>
              </form>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="card max-w-2xl">
              <h2 className="text-xl font-bold text-text-primary mb-6">Subscription</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-primary-tertiary rounded-lg">
                  <div>
                    <p className="font-semibold text-text-primary capitalize">{user?.subscription_tier || 'Free'} Plan</p>
                    <p className="text-sm text-text-secondary">Status: {user?.subscription_status || 'Active'}</p>
                  </div>
                  <button onClick={() => navigate('/payment')} className="btn-primary">
                    {user?.subscription_tier === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings

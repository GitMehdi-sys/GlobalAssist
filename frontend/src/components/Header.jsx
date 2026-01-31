import { useState, useRef, useEffect } from 'react'
import { Settings, ChevronDown, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Header = ({ selectedModel, onModelChange, availableModels = [] }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showModelMenu, setShowModelMenu] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowModelMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleModelSelect = (model) => {
    if (model.tier === 'pro' && user?.subscription_tier === 'free') {
      navigate('/payment')
      setShowModelMenu(false)
      return
    }
    onModelChange(model)
    setShowModelMenu(false)
  }

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-primary-secondary">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-text-primary">
          {user?.full_name ? `Back at it, ${user.full_name.split(' ')[0]}` : 'GlobalAssist'}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Plan Badge */}
        {user && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-tertiary border border-border rounded-full text-sm">
            <span className="text-text-secondary">{user.subscription_tier || 'Free'} plan</span>
            {user.subscription_tier === 'free' && (
              <>
                <span className="text-text-tertiary">·</span>
                <button
                  onClick={() => navigate('/payment')}
                  className="text-accent hover:text-accent-hover font-semibold"
                >
                  Upgrade
                </button>
              </>
            )}
          </div>
        )}

        {/* Model Selector - TOP RIGHT */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowModelMenu(!showModelMenu)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-tertiary border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-primary-bg transition-all"
          >
            <span className="font-medium">{selectedModel?.name || 'Select Model'}</span>
            <ChevronDown size={16} className={`transition-transform ${showModelMenu ? 'rotate-180' : ''}`} />
          </button>

          {showModelMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-primary-secondary border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
              {availableModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelSelect(model)}
                  className={`w-full px-4 py-3 text-left hover:bg-primary-tertiary transition-all border-b border-border last:border-b-0 ${
                    selectedModel?.id === model.id ? 'bg-primary-tertiary' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text-primary text-sm">{model.name}</span>
                        {model.tier === 'pro' && (
                          <span className="px-2 py-0.5 bg-accent text-white text-xs rounded-full">Pro</span>
                        )}
                        {model.tier === 'free' && (
                          <span className="px-2 py-0.5 bg-primary-tertiary text-text-secondary text-xs rounded-full border border-border">Free</span>
                        )}
                      </div>
                      <p className="text-xs text-text-tertiary mt-0.5">{model.description}</p>
                    </div>
                    {selectedModel?.id === model.id && (
                      <span className="text-accent text-lg">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Settings Button (Parametre) */}
        <button
          onClick={() => navigate('/settings')}
          className="p-2 hover:bg-primary-tertiary rounded-lg transition-all"
          title="Settings"
        >
          <Settings size={20} className="text-text-secondary hover:text-text-primary" />
        </button>

        {/* User Profile */}
        {user && (
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2 px-3 py-2 hover:bg-primary-tertiary rounded-lg transition-all"
          >
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.full_name} className="w-7 h-7 rounded-full" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            )}
            <span className="text-sm font-medium text-text-primary">{user.full_name?.split(' ')[0] || user.email.split('@')[0]}</span>
          </button>
        )}
      </div>
    </header>
  )
}

export default Header

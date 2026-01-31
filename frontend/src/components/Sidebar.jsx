import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Plus, MessageSquare, Folder, Box, Code, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleNavClick = (path) => {
    // If not logged in and trying to access protected routes, go to login
    if (!user && (path.includes('/history') || path === '/settings')) {
      navigate('/login', { state: { returnTo: path } })
      return
    }
    navigate(path)
  }

  const navItems = [
    { path: '/', icon: Plus, label: 'New chat', isButton: true },
    { path: '/history/chat', icon: MessageSquare, label: 'Chats', protected: true },
    { path: '/history/project', icon: Folder, label: 'Projects', protected: true },
    { path: '/history/artifact', icon: Box, label: 'Artifacts', protected: true },
    { path: '/history/code', icon: Code, label: 'Code', protected: true },
  ]

  return (
    <aside className="w-64 bg-primary-secondary border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border flex items-center gap-3">
        <img src="/logo.png" alt="GlobalAssist" className="w-10 h-10" />
        <h1 className="text-xl font-bold text-text-primary">GlobalAssist</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          if (item.isButton) {
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-border text-text-secondary hover:bg-primary-tertiary hover:text-text-primary transition-all"
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          }

          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-primary-tertiary text-text-primary'
                  : 'text-text-secondary hover:bg-primary-tertiary hover:text-text-primary'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium">{item.label}</span>
              {item.protected && !user && (
                <span className="ml-auto text-xs bg-accent text-white px-2 py-0.5 rounded-full">Login</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-center text-xs text-text-tertiary mb-3">
          Created by Elmehdi Elmouate
        </div>
        {user ? (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent hover:bg-accent-hover text-white rounded-lg font-semibold transition-all"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent hover:bg-accent-hover text-white rounded-lg font-semibold transition-all"
          >
            <span>Sign In</span>
          </button>
        )}
      </div>
    </aside>
  )
}

export default Sidebar

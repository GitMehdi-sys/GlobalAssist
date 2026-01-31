import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-bg px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-accent mb-4">404</h1>
        <h2 className="text-2xl font-bold text-text-primary mb-4">Page Not Found</h2>
        <p className="text-text-secondary mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary inline-block">Go Home</Link>
      </div>
    </div>
  )
}

export default NotFound

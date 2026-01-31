import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Loader from '../components/Loader'
import { paymentService } from '../services/paymentService'
import { Check } from 'lucide-react'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const Payment = () => {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingPlan, setProcessingPlan] = useState(null)

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      const data = await paymentService.getPlans()
      setPlans(data.filter(p => p.id !== 'free'))
    } catch (error) {
      console.error('Failed to load plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (planId) => {
    setProcessingPlan(planId)
    try {
      const { url } = await paymentService.createCheckoutSession(planId)
      window.location.href = url
    } catch (error) {
      console.error('Failed to create checkout:', error)
      alert('Failed to start checkout. Please try again.')
      setProcessingPlan(null)
    }
  }

  return (
    <div className="flex h-screen bg-primary-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header selectedModel={{}} onModelChange={() => {}} availableModels={[]} />
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-text-primary text-center mb-4">Upgrade to Pro</h1>
            <p className="text-text-secondary text-center mb-12">Unlock all premium AI models and advanced features</p>
            
            {loading ? (
              <Loader />
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {plans.map(plan => (
                  <div key={plan.id} className="card hover:border-accent transition-all">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-text-primary mb-2">{plan.name}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-text-primary">${plan.price}</span>
                        <span className="text-text-secondary">/{plan.billing}</span>
                      </div>
                      {plan.savings && <p className="text-accent text-sm mt-1">{plan.savings}</p>}
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check size={20} className="text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-text-secondary">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={processingPlan === plan.id}
                      className="btn-primary w-full"
                    >
                      {processingPlan === plan.id ? 'Processing...' : 'Subscribe Now'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment

import api from './api'

export const paymentService = {
  async getPlans() {
    const { data } = await api.get('/payment/plans')
    return data.plans
  },

  async createCheckoutSession(planId) {
    const { data } = await api.post('/payment/create-checkout', {
      plan_id: planId,
    })
    return data
  },

  async getSubscription() {
    const { data } = await api.get('/payment/subscription')
    return data
  },

  async cancelSubscription() {
    const { data } = await api.post('/payment/cancel')
    return data
  },

  async getPortalSession() {
    const { data } = await api.get('/payment/portal')
    return data
  },
}

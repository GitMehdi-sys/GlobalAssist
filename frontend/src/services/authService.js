import api from './api'

export const authService = {
  async register(email, password, fullName) {
    const { data } = await api.post('/auth/register', {
      email,
      password,
      full_name: fullName,
    })
    return data
  },

  async login(email, password) {
    const { data } = await api.post('/auth/login', {
      email,
      password,
    })
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token)
    }
    return data
  },

  async getCurrentUser() {
    const { data } = await api.get('/auth/me')
    return data.user
  },

  async logout() {
    await api.post('/auth/logout')
  },
}

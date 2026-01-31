import api from './api'

export const historyService = {
  async getHistory(type = 'all', page = 1, perPage = 20) {
    const { data } = await api.get(`/history/${type}`, {
      params: { page, per_page: perPage },
    })
    return data
  },

  async getHistoryItem(id) {
    const { data } = await api.get(`/history/${id}`)
    return data.history
  },

  async createHistory(historyData) {
    const { data } = await api.post('/history', historyData)
    return data.history
  },

  async deleteHistory(id) {
    const { data } = await api.delete(`/history/${id}`)
    return data
  },

  async clearHistory(type = 'all') {
    const { data } = await api.delete(`/history/clear/${type}`)
    return data
  },
}

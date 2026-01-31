import api from './api'

export const aiService = {
  async getModels() {
    const { data } = await api.get('/ai/models')
    return data.models
  },

  async generateCode(prompt, modelId = 'kiwi-4.5') {
    const { data } = await api.post('/ai/generate', {
      prompt,
      model: modelId,
    })
    return data
  },

  async explainCode(code, modelId = 'kiwi-4.5') {
    const { data } = await api.post('/ai/explain', {
      code,
      model: modelId,
    })
    return data
  },
}

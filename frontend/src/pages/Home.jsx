import { useState, useEffect, useRef } from 'react'
import { Paperclip, Send, Sparkles, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import ChatMessage from '../components/ChatMessage'
import Loader from '../components/Loader'
import { aiService } from '../services/aiService'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState(null)
  const [availableModels, setAvailableModels] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState([])
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    loadModels()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadModels = async () => {
    try {
      const models = await aiService.getModels()
      setAvailableModels(models)
      setSelectedModel(models[0])
    } catch (error) {
      console.error('Failed to load models:', error)
    }
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    const newFiles = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }))
    setUploadedFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!prompt.trim() || loading) return

    // Check if user needs to login for premium models
    const premiumModels = ['kiwi-opus', 'gpt-4', 'gemini-pro']
    if (!user && premiumModels.includes(selectedModel?.id)) {
      navigate('/login', { state: { returnTo: '/', message: 'Please login to use premium models' } })
      return
    }

    const userMessage = { content: prompt, isUser: true }
    setMessages(prev => [...prev, userMessage])
    setPrompt('')
    setUploadedFiles([])

    setLoading(true)

    try {
      // Generate code - works with or without login
      const result = await aiService.generateCode(prompt, selectedModel.id)
      
      const aiMessage = {
        content: result.code,
        explanation: result.explanation,
        model: selectedModel.name,
        type: 'code',
        isUser: false
      }
      
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      let errorMsg = 'Failed to generate code. Please try again.'
      
      if (error.response?.status === 401) {
        errorMsg = 'Please login to continue using GlobalAssist.'
      } else if (error.response?.status === 403) {
        errorMsg = 'Please login to use premium models.'
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error
      }
      
      const errorMessage = {
        content: errorMsg,
        isUser: false
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const showWelcome = messages.length === 0

  return (
    <div className="flex h-screen bg-primary-bg">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          availableModels={availableModels}
        />

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto">
          {showWelcome && (
            <div className="flex flex-col items-center justify-center h-full px-4">
              <div className="text-center space-y-6 max-w-2xl">
                <Sparkles size={48} className="text-accent mx-auto animate-pulse" />
                <h1 className="text-4xl font-bold text-text-primary">
                  {user ? `Back at it, ${user.full_name?.split(' ')[0] || 'there'}` : 'Welcome to GlobalAssist'}
                </h1>
                <p className="text-text-secondary text-lg">
                  {user ? 'How can I help you code today?' : 'Start chatting without login, or sign in to save your history'}
                </p>
                {!user && (
                  <button
                    onClick={() => navigate('/login')}
                    className="text-accent hover:text-accent-hover font-semibold"
                  >
                    Sign in to unlock all features →
                  </button>
                )}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} isUser={message.isUser} />
          ))}

          {loading && (
            <div className="py-6 px-4 flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-primary-tertiary flex items-center justify-center text-sm font-semibold text-text-secondary">
                GA
              </div>
              <Loader text="Generating code..." />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4">
          <div className="max-w-4xl mx-auto">
            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 bg-primary-tertiary border border-border rounded-lg px-3 py-2">
                    <span className="text-sm text-text-primary truncate max-w-[200px]">{file.name}</span>
                    <button onClick={() => removeFile(index)} className="text-text-secondary hover:text-text-primary">
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-end gap-2 bg-primary-secondary border border-border rounded-xl p-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 hover:bg-primary-tertiary rounded-lg transition-all"
                  title="Attach file"
                >
                  <Paperclip size={20} className="text-text-secondary" />
                </button>

                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="How can I help you today?"
                  className="flex-1 bg-transparent text-text-primary placeholder-text-tertiary resize-none outline-none py-2 px-2 min-h-[24px] max-h-[200px]"
                  rows={1}
                  style={{
                    height: 'auto',
                    minHeight: '24px'
                  }}
                  onInput={(e) => {
                    e.target.style.height = 'auto'
                    e.target.style.height = e.target.scrollHeight + 'px'
                  }}
                />

                <button
                  type="submit"
                  disabled={!prompt.trim() || loading}
                  className="p-2 bg-accent hover:bg-accent-hover rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} className="text-white" />
                </button>
              </div>
            </form>

            <p className="text-center text-xs text-text-tertiary mt-3">
              {user ? 'Upgrade to connect your tools to GlobalAssist' : 'Sign in to save your chat history'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

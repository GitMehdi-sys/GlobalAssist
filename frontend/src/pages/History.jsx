import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Loader from '../components/Loader'
import { historyService } from '../services/historyService'
import { Trash2 } from 'lucide-react'

const History = () => {
  const { type } = useParams()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [type])

  const loadHistory = async () => {
    try {
      const data = await historyService.getHistory(type)
      setHistory(data.history)
    } catch (error) {
      console.error('Failed to load history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return
    try {
      await historyService.deleteHistory(id)
      setHistory(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  return (
    <div className="flex h-screen bg-primary-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header selectedModel={{}} onModelChange={() => {}} availableModels={[]} />
        <div className="flex-1 overflow-y-auto p-8">
          <h1 className="text-3xl font-bold text-text-primary mb-8 capitalize">
            {type === 'chat' ? 'Chats' : type === 'project' ? 'Projects' : type === 'artifact' ? 'Artifacts' : 'Code'} History
          </h1>
          {loading ? (
            <Loader />
          ) : history.length === 0 ? (
            <div className="text-center text-text-secondary py-12">
              No {type} history yet
            </div>
          ) : (
            <div className="grid gap-4">
              {history.map(item => (
                <div key={item.id} className="card flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-text-primary mb-2">{item.title}</h3>
                    <p className="text-sm text-text-secondary line-clamp-2">{item.content}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-text-tertiary">
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      {item.model_used && <span>Model: {item.model_used}</span>}
                    </div>
                  </div>
                  <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-primary-tertiary rounded-lg transition-all">
                    <Trash2 size={18} className="text-text-secondary hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default History

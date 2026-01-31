import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

const ChatMessage = ({ message, isUser }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`flex gap-4 py-6 px-4 ${isUser ? '' : 'bg-primary-secondary'}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
        isUser ? 'bg-accent text-white' : 'bg-primary-tertiary text-text-secondary'
      }`}>
        {isUser ? 'Y' : 'K'}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-3">
        <div className="prose prose-invert max-w-none">
          {message.type === 'code' ? (
            <div className="relative">
              <pre className="bg-primary-bg border border-border rounded-lg p-4 overflow-x-auto">
                <code className="text-sm text-text-primary">{message.content}</code>
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 bg-primary-tertiary hover:bg-primary-secondary rounded-lg transition-all"
                title="Copy code"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-text-secondary" />}
              </button>
            </div>
          ) : (
            <p className="text-text-primary leading-relaxed">{message.content}</p>
          )}
        </div>

        {message.explanation && (
          <div className="text-sm text-text-secondary bg-primary-tertiary border border-border rounded-lg p-4">
            <p className="font-semibold text-text-primary mb-2">Explanation:</p>
            <p>{message.explanation}</p>
          </div>
        )}

        {message.model && (
          <div className="text-xs text-text-tertiary">
            Generated with {message.model}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessage

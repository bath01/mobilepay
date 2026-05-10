import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Trash2, Loader2, Bot } from 'lucide-react'
import api from '../lib/api'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

function getSessionToken() {
  let token = localStorage.getItem('mp_chat_token')
  if (!token) {
    token = `sess-${Date.now()}-${Math.random().toString(36).slice(2)}`
    localStorage.setItem('mp_chat_token', token)
  }
  return token
}

export default function FAQChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const sessionToken = getSessionToken()

  useEffect(() => {
    if (open && messages.length === 0) {
      api.get(`/chatbot/history/${sessionToken}`)
        .then(res => {
          if (res.data.messages.length > 0) {
            setMessages(res.data.messages.map((m: any) => ({
              id: m.id.toString(),
              role: m.role,
              content: m.content,
            })))
          } else {
            setMessages([{
              id: 'welcome',
              role: 'assistant',
              content: 'Bonjour ! Je suis l\'assistant IA de MOBILE-PAY. Comment puis-je vous aider ? 😊',
            }])
          }
        })
        .catch(() => {
          setMessages([{
            id: 'welcome',
            role: 'assistant',
            content: 'Bonjour ! Je suis l\'assistant IA de MOBILE-PAY. Comment puis-je vous aider ? 😊',
          }])
        })
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await api.post('/chatbot/message', {
        message: userMsg.content,
        sessionToken,
      })
      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: res.data.reply,
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Désolé, je rencontre une difficulté. Contactez-nous au +225 05 04 92 10 96.',
      }])
    } finally {
      setLoading(false)
    }
  }

  const clearHistory = async () => {
    await api.delete(`/chatbot/history/${sessionToken}`)
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: 'Conversation effacée. Comment puis-je vous aider ? 😊',
    }])
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le chatbot IA"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 hover:scale-110 transition-all duration-300 flex items-center justify-center"
        >
          <MessageCircle size={24} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-slide-up"
          style={{ maxHeight: '520px' }}>
          {/* Header */}
          <div className="flex items-center gap-3 p-4 bg-primary-500 text-white">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Assistant MOBILE-PAY</p>
              <p className="text-xs text-white/80">Réponses instantanées 24/7</p>
            </div>
            <button onClick={clearHistory} title="Effacer" className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
              <Trash2 size={16} />
            </button>
            <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: '360px' }}>
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary-500 text-white rounded-br-sm'
                    : 'bg-gray-100 text-foreground rounded-bl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <Loader2 size={16} className="animate-spin text-primary-500" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-3 border-t border-gray-100 flex gap-2">
            <input
              type="text" value={input} onChange={e => setInput(e.target.value)}
              placeholder="Posez votre question..."
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button type="submit" disabled={!input.trim() || loading}
              className="w-9 h-9 bg-primary-500 text-white rounded-lg flex items-center justify-center hover:bg-primary-600 disabled:opacity-50 transition-colors">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}

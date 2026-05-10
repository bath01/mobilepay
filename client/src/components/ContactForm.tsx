import { useState } from 'react'
import { Send, Loader2, CheckCircle2 } from 'lucide-react'
import api from '../lib/api'
import toast from 'react-hot-toast'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/contact', form)
      setSent(true)
      toast.success('Message envoyé avec succès !')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erreur lors de l\'envoi')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="text-primary-500" size={32} />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Message envoyé !</h3>
        <p className="text-muted-foreground">Nous vous répondrons dans les 24 heures.</p>
        <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
          className="mt-6 text-primary-500 font-medium hover:underline text-sm">
          Envoyer un autre message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="aio-card p-8 space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Nom complet *</label>
          <input type="text" name="name" required value={form.name} onChange={handle}
            placeholder="Amara Koné"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
          <input type="email" name="email" required value={form.email} onChange={handle}
            placeholder="vous@exemple.com"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Sujet</label>
        <input type="text" name="subject" value={form.subject} onChange={handle}
          placeholder="Comment pouvons-nous vous aider ?"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Message *</label>
        <textarea name="message" required value={form.message} onChange={handle}
          placeholder="Décrivez votre demande..."
          rows={5}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none" />
      </div>
      <button type="submit" disabled={loading}
        className="aio-button-primary w-full justify-center">
        {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        {loading ? 'Envoi en cours...' : 'Envoyer le message'}
      </button>
    </form>
  )
}

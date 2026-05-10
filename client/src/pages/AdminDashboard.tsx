import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { BarChart3, Users, MessageSquare, Store, FileText, ArrowRight, Shield } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import api from '../lib/api'

interface Stats {
  totalSessions: number
  totalMessages: number
  totalUsers: number
  pendingMerchants: number
  totalFaq: number
  recentSessions: number
}

export default function AdminDashboard() {
  const { user, logout } = useAuth()

  const { data: stats } = useQuery<Stats>({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/admin/stats').then(r => r.data),
  })

  const cards = [
    { label: 'Utilisateurs', value: stats?.totalUsers ?? '—', icon: Users, color: 'bg-blue-100 text-blue-600', to: null },
    { label: 'Sessions chatbot', value: stats?.totalSessions ?? '—', icon: MessageSquare, color: 'bg-purple-100 text-purple-600', to: null },
    { label: 'Messages IA', value: stats?.totalMessages ?? '—', icon: BarChart3, color: 'bg-green-100 text-green-600', to: null },
    { label: 'Marchands en attente', value: stats?.pendingMerchants ?? '—', icon: Store, color: 'bg-orange-100 text-orange-600', to: '/admin/merchants' },
    { label: 'Entrées FAQ', value: stats?.totalFaq ?? '—', icon: FileText, color: 'bg-cyan-100 text-cyan-600', to: '/admin/faq' },
    { label: 'Sessions (7 jours)', value: stats?.recentSessions ?? '—', icon: BarChart3, color: 'bg-pink-100 text-pink-600', to: null },
  ]

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Admin MOBILE-PAY</h1>
              <p className="text-xs text-muted-foreground">Connecté en tant que {user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Site public</Link>
            <button onClick={logout} className="text-sm text-red-500 hover:text-red-700 transition-colors">Déconnexion</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Vue d'ensemble</h2>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {cards.map(c => (
            <div key={c.label} className={`bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow ${c.to ? 'cursor-pointer' : ''}`}
              onClick={() => c.to && window.location.assign(c.to)}>
              <div className={`w-10 h-10 rounded-lg ${c.color} flex items-center justify-center mb-3`}>
                <c.icon size={20} />
              </div>
              <div className="text-2xl font-bold text-foreground">{c.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
              {c.to && <p className="text-xs text-primary-500 mt-1 flex items-center gap-1">Gérer <ArrowRight size={10} /></p>}
            </div>
          ))}
        </div>

        {/* Quick nav */}
        <h2 className="text-lg font-bold text-foreground mb-4">Gestion</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { to: '/admin/faq', icon: FileText, title: 'Gestion FAQ', desc: 'Créer, modifier, supprimer les entrées FAQ', color: 'bg-cyan-50 border-cyan-200' },
            { to: '/admin/merchants', icon: Store, title: 'Demandes Marchands', desc: 'Traiter les demandes d\'inscription marchands', color: 'bg-orange-50 border-orange-200' },
          ].map(n => (
            <Link key={n.to} to={n.to}
              className={`aio-card p-6 ${n.color} hover:shadow-lg`}>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                  <n.icon size={22} className="text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{n.title}</h3>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-primary-500 text-sm font-medium">
                Accéder <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

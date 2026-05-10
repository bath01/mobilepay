import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart3, TrendingUp, Users, DollarSign, QrCode,
  Smartphone, CreditCard, LogOut, Bell, Menu, X, Send,
  ArrowUpRight, ArrowDownLeft, Settings, ChevronRight
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

const chartData = [
  { month: 'Jan', revenue: 420000, transactions: 38 },
  { month: 'Fév', revenue: 580000, transactions: 52 },
  { month: 'Mar', revenue: 490000, transactions: 44 },
  { month: 'Avr', revenue: 720000, transactions: 67 },
  { month: 'Mai', revenue: 850000, transactions: 78 },
  { month: 'Juin', revenue: 940000, transactions: 89 },
]

const recentTransactions = [
  { id: 'TXN001', type: 'Collecte QR', amount: '+50 000', status: 'Complétée', date: 'Auj. 14:30', icon: QrCode, color: 'text-green-600', bg: 'bg-green-100' },
  { id: 'TXN002', type: 'Vente Crédit', amount: '+10 000', status: 'Complétée', date: 'Auj. 13:15', icon: Smartphone, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 'TXN003', type: 'Transfert', amount: '-100 000', status: 'En attente', date: 'Auj. 12:00', icon: Send, color: 'text-orange-600', bg: 'bg-orange-100' },
  { id: 'TXN004', type: 'Carte Virtuelle', amount: '-25 000', status: 'Complétée', date: 'Hier 18:45', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-100' },
  { id: 'TXN005', type: 'Collecte QR', amount: '+75 000', status: 'Complétée', date: 'Hier 16:20', icon: QrCode, color: 'text-green-600', bg: 'bg-green-100' },
]

const stats = [
  { label: 'Solde Total', value: '2 450 000', suffix: ' FCFA', change: '+12.5%', icon: DollarSign, color: 'bg-primary-100 text-primary-600' },
  { label: 'Transactions Aujourd\'hui', value: '45', change: '+8.2%', icon: BarChart3, color: 'bg-green-100 text-green-600' },
  { label: 'Clients Actifs', value: '1 234', change: '+5.1%', icon: Users, color: 'bg-orange-100 text-orange-600' },
  { label: 'Revenu du Mois', value: '850 000', suffix: ' FCFA', change: '+18.3%', icon: TrendingUp, color: 'bg-purple-100 text-purple-600' },
]

const navItems = [
  { icon: BarChart3, label: 'Vue d\'ensemble', id: 'overview' },
  { icon: QrCode, label: 'QR Code', id: 'qr' },
  { icon: Send, label: 'Transferts', id: 'transfers' },
  { icon: Smartphone, label: 'Crédit & Internet', id: 'credit' },
  { icon: CreditCard, label: 'Cartes Virtuelles', id: 'cards' },
  { icon: Users, label: 'Salaires', id: 'salaries' },
  { icon: Settings, label: 'Paramètres', id: 'settings' },
]

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 fixed h-full z-40 lg:relative`}>
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <DollarSign size={20} className="text-white" />
          </div>
          {sidebarOpen && <span className="font-heading font-bold text-foreground">MOBILE-PAY</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-muted-foreground hover:bg-gray-50 hover:text-foreground'
              }`}>
              <item.icon size={18} className="flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-gray-100">
          <div className={`flex items-center gap-3 px-3 py-2 rounded-lg ${sidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user?.name || 'Utilisateur'}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            )}
          </div>
          <button onClick={logout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors mt-1 ${sidebarOpen ? '' : 'justify-center'}`}>
            <LogOut size={16} className="flex-shrink-0" />
            {sidebarOpen && 'Déconnexion'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`flex-1 ${sidebarOpen ? 'lg:ml-0' : ''} ml-16 lg:ml-0 overflow-auto`}>
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 text-muted-foreground">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h1 className="text-lg font-bold text-foreground">Tableau de bord</h1>
              <p className="text-xs text-muted-foreground">Bienvenue, {user?.name?.split(' ')[0] || 'Utilisateur'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 text-muted-foreground">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </button>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Retour au site
            </Link>
          </div>
        </header>

        {/* Dashboard content */}
        <div className="p-6 space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(s => (
              <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}>
                    <s.icon size={20} />
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {s.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {s.value}
                  {s.suffix && <span className="text-sm font-normal text-muted-foreground">{s.suffix}</span>}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Revenue chart */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-base font-semibold text-foreground mb-4">Revenus mensuels</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: any) => [`${v.toLocaleString()} FCFA`, 'Revenus']} />
                  <Bar dataKey="revenue" fill="#10B981" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Transactions trend */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-base font-semibold text-foreground mb-4">Tendance des transactions</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="transactions" stroke="#FF6B35" strokeWidth={2} dot={{ fill: '#FF6B35', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent transactions */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-base font-semibold text-foreground">Transactions récentes</h3>
              <button className="text-sm text-primary-500 font-medium hover:underline flex items-center gap-1">
                Voir tout <ChevronRight size={14} />
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {recentTransactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${tx.bg} flex items-center justify-center`}>
                      <tx.icon size={18} className={tx.color} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{tx.type}</p>
                      <p className="text-xs text-muted-foreground">{tx.id} · {tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${tx.amount.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                      {tx.amount} FCFA
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      tx.status === 'Complétée' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: QrCode, label: 'Générer QR', color: 'bg-primary-500' },
              { icon: Send, label: 'Envoyer', color: 'bg-blue-500' },
              { icon: ArrowDownLeft, label: 'Recevoir', color: 'bg-green-500' },
              { icon: CreditCard, label: 'Carte Virtuelle', color: 'bg-purple-500' },
            ].map(a => (
              <button key={a.label}
                className="flex flex-col items-center gap-3 p-5 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${a.color} rounded-xl flex items-center justify-center`}>
                  <a.icon size={22} className="text-white" />
                </div>
                <span className="text-sm font-medium text-foreground">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

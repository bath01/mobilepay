import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, LayoutDashboard, Shield } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from './AuthModal'

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/merchants', label: 'Marchands' },
  { href: '/international', label: 'Transferts' },
  { href: '/pricing', label: 'Tarifs' },
  { href: '/faq', label: 'FAQ' },
  { href: '/about', label: 'À propos' },
]

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const location = useLocation()

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            {/* Logo : marque MobilePay (logo horizontal de l'app mobile) */}
            <Link to="/" className="flex items-center">
              <img
                src="/logo-horizontal.png"
                alt="MobilePay"
                className="h-11 w-auto"
              />
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    location.pathname === link.href
                      ? 'text-primary-500'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Shield size={16} />
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <LogOut size={16} />
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowAuth(true)}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => setShowAuth(true)}
                    className="bg-primary-500 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Commencer
                  </button>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 animate-slide-down">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block py-3 text-sm font-medium border-b border-gray-50 ${
                  location.pathname === link.href ? 'text-primary-500' : 'text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 flex gap-3">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                    className="flex-1 bg-primary-500 text-white text-sm font-semibold py-2 rounded-lg text-center">
                    Dashboard
                  </Link>
                  <button onClick={() => { logout(); setMobileOpen(false) }}
                    className="flex-1 border border-gray-200 text-sm py-2 rounded-lg text-center">
                    Déconnexion
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setShowAuth(true); setMobileOpen(false) }}
                  className="flex-1 bg-primary-500 text-white text-sm font-semibold py-2 rounded-lg"
                >
                  Connexion / Inscription
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}

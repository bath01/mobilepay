import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Merchants from './pages/Merchants'
import { International, About, Pricing, Blog, NotFound } from './pages/pages'
import FAQ from './pages/FAQ'
import AdminDashboard from './pages/AdminDashboard'
import AdminFAQ from './pages/AdminFAQ'
import AdminMerchants from './pages/AdminMerchants'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1A1A1A',
            color: '#fff',
            borderRadius: '8px',
          },
          success: {
            iconTheme: { primary: '#10B981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#fff' },
          },
        }}
      />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/merchants" element={<Merchants />} />
        <Route path="/international" element={<International />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/blog" element={<Blog />} />

        {/* Protected user routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/faq" element={
          <ProtectedRoute adminOnly>
            <AdminFAQ />
          </ProtectedRoute>
        } />
        <Route path="/admin/merchants" element={
          <ProtectedRoute adminOnly>
            <AdminMerchants />
          </ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}

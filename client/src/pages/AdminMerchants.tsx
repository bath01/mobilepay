import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ArrowLeft, Loader2, Store, Mail, Phone, MapPin, CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react'
import api from '../lib/api'
import toast from 'react-hot-toast'

interface MerchantRequest {
  id: number
  business_name: string
  contact_name: string
  email: string
  phone: string
  business_type: string
  city: string
  message: string | null
  status: 'pending' | 'contacted' | 'approved' | 'rejected'
  admin_notes: string | null
  created_at: string
}

const statusConfig = {
  pending: { label: 'En attente', color: 'bg-orange-50 text-orange-600', icon: Clock },
  contacted: { label: 'Contacté', color: 'bg-blue-50 text-blue-600', icon: MessageSquare },
  approved: { label: 'Approuvé', color: 'bg-green-50 text-green-600', icon: CheckCircle },
  rejected: { label: 'Refusé', color: 'bg-red-50 text-red-500', icon: XCircle },
}

export default function AdminMerchants() {
  const qc = useQueryClient()
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [notes, setNotes] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-merchants', statusFilter],
    queryFn: () => api.get(`/admin/merchants${statusFilter ? `?status=${statusFilter}` : ''}`).then(r => r.data),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, status, adminNotes }: any) => api.patch(`/admin/merchants/${id}`, { status, adminNotes }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-merchants'] }); toast.success('Statut mis à jour !') },
  })

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/merchants/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-merchants'] }); toast.success('Supprimé !') },
  })

  const requests: MerchantRequest[] = data?.requests || []

  return (
    <div className="min-h-screen bg-secondary">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="p-2 rounded-lg hover:bg-gray-100 text-muted-foreground">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-lg font-bold text-foreground">Demandes Marchands</h1>
            {data?.total !== undefined && (
              <span className="bg-primary-50 text-primary-600 text-xs font-medium px-2 py-1 rounded-full">
                {data.total} au total
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {[{ v: '', l: 'Toutes' }, { v: 'pending', l: 'En attente' }, { v: 'contacted', l: 'Contacté' }, { v: 'approved', l: 'Approuvé' }, { v: 'rejected', l: 'Refusé' }].map(f => (
            <button key={f.v} onClick={() => setStatusFilter(f.v)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                statusFilter === f.v ? 'bg-primary-500 text-white' : 'bg-white text-muted-foreground hover:bg-gray-100 border border-gray-200'
              }`}>
              {f.l}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={32} className="animate-spin text-primary-500" />
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(req => {
              const status = statusConfig[req.status]
              return (
                <div key={req.id} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                          <Store size={20} className="text-primary-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{req.business_name}</h3>
                          <p className="text-xs text-muted-foreground">{req.business_type}</p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{req.contact_name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mail size={14} />
                          <a href={`mailto:${req.email}`} className="hover:text-primary-500">{req.email}</a>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone size={14} />
                          <a href={`tel:${req.phone}`} className="hover:text-primary-500">{req.phone}</a>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} />
                          {req.city}
                        </div>
                      </div>
                      {req.message && (
                        <p className="mt-3 text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg italic">
                          "{req.message}"
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Soumis le {new Date(req.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[180px]">
                      <select
                        value={req.status}
                        onChange={e => updateMut.mutate({ id: req.id, status: e.target.value })}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                      >
                        <option value="pending">En attente</option>
                        <option value="contacted">Contacté</option>
                        <option value="approved">Approuvé</option>
                        <option value="rejected">Refusé</option>
                      </select>

                      {selectedId === req.id ? (
                        <div className="space-y-2">
                          <textarea value={notes} onChange={e => setNotes(e.target.value)}
                            placeholder="Notes admin..." rows={3}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
                          <div className="flex gap-2">
                            <button onClick={() => { updateMut.mutate({ id: req.id, adminNotes: notes }); setSelectedId(null) }}
                              className="flex-1 bg-primary-500 text-white text-xs py-1.5 rounded-lg font-medium">
                              Sauvegarder
                            </button>
                            <button onClick={() => setSelectedId(null)} className="flex-1 border border-gray-200 text-xs py-1.5 rounded-lg">
                              Annuler
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => { setSelectedId(req.id); setNotes(req.admin_notes || '') }}
                          className="border border-gray-200 text-muted-foreground text-xs py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                          {req.admin_notes ? 'Modifier les notes' : 'Ajouter des notes'}
                        </button>
                      )}

                      <button onClick={() => { if (confirm('Supprimer cette demande ?')) deleteMut.mutate(req.id) }}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors py-1">
                        Supprimer
                      </button>
                    </div>
                  </div>
                  {req.admin_notes && selectedId !== req.id && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs font-medium text-yellow-700">Notes admin :</p>
                      <p className="text-xs text-yellow-700 mt-0.5">{req.admin_notes}</p>
                    </div>
                  )}
                </div>
              )
            })}
            {requests.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Store size={48} className="mx-auto mb-4 opacity-30" />
                <p>Aucune demande pour ce filtre.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

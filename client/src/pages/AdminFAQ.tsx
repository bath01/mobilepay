import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Eye, EyeOff, Save, X, ArrowLeft, Loader2 } from 'lucide-react'
import api from '../lib/api'
import toast from 'react-hot-toast'

interface FaqEntry {
  id: number
  slug: string
  question: string
  answer: string
  category: string
  sort_order: number
  is_published: 'yes' | 'no'
}

const defaultForm = { question: '', answer: '', category: 'Général', sortOrder: 0, isPublished: 'yes' as const }

export default function AdminFAQ() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState<FaqEntry | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(defaultForm)

  const { data, isLoading } = useQuery<FaqEntry[]>({
    queryKey: ['admin-faq'],
    queryFn: () => api.get('/admin/faq').then(r => r.data.faq),
  })

  const createMut = useMutation({
    mutationFn: (d: typeof form) => api.post('/admin/faq', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-faq'] }); setCreating(false); setForm(defaultForm); toast.success('FAQ créée !') },
    onError: () => toast.error('Erreur lors de la création'),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, ...d }: any) => api.put(`/admin/faq/${id}`, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-faq'] }); setEditing(null); toast.success('FAQ mise à jour !') },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  })

  const deleteMut = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/faq/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-faq'] }); toast.success('FAQ supprimée !') },
    onError: () => toast.error('Erreur lors de la suppression'),
  })

  const togglePublish = (faq: FaqEntry) => {
    updateMut.mutate({ id: faq.id, isPublished: faq.is_published === 'yes' ? 'no' : 'yes' })
  }

  const startEdit = (faq: FaqEntry) => {
    setEditing(faq)
    setForm({ question: faq.question, answer: faq.answer, category: faq.category, sortOrder: faq.sort_order, isPublished: faq.is_published })
  }

  return (
    <div className="min-h-screen bg-secondary">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="p-2 rounded-lg hover:bg-gray-100 text-muted-foreground">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-lg font-bold text-foreground">Gestion FAQ</h1>
          </div>
          <button onClick={() => { setCreating(true); setEditing(null); setForm(defaultForm) }}
            className="aio-button-primary text-sm px-4 py-2">
            <Plus size={16} /> Nouvelle FAQ
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Create/Edit form */}
        {(creating || editing) && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h3 className="text-base font-semibold mb-4">{editing ? 'Modifier la FAQ' : 'Nouvelle entrée FAQ'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Question *</label>
                <input type="text" value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Réponse *</label>
                <textarea value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))}
                  rows={5}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Catégorie</label>
                  <input type="text" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Ordre</label>
                  <input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Publication</label>
                  <select value={form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.value as 'yes' | 'no' }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                    <option value="yes">Publiée</option>
                    <option value="no">Brouillon</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => editing ? updateMut.mutate({ id: editing.id, ...form }) : createMut.mutate(form)}
                  disabled={createMut.isPending || updateMut.isPending}
                  className="aio-button-primary text-sm px-4 py-2">
                  {(createMut.isPending || updateMut.isPending) && <Loader2 size={14} className="animate-spin" />}
                  <Save size={14} /> Sauvegarder
                </button>
                <button onClick={() => { setCreating(false); setEditing(null) }}
                  className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                  <X size={14} /> Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FAQ List */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={32} className="animate-spin text-primary-500" />
          </div>
        ) : (
          <div className="space-y-3">
            {data?.map(faq => (
              <div key={faq.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full">{faq.category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${faq.is_published === 'yes' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        {faq.is_published === 'yes' ? 'Publiée' : 'Brouillon'}
                      </span>
                      <span className="text-xs text-muted-foreground">Ordre: {faq.sort_order}</span>
                    </div>
                    <p className="font-medium text-foreground">{faq.question}</p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{faq.answer}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => togglePublish(faq)}
                      className={`p-2 rounded-lg hover:bg-gray-100 ${faq.is_published === 'yes' ? 'text-green-600' : 'text-muted-foreground'}`}
                      title={faq.is_published === 'yes' ? 'Dépublier' : 'Publier'}>
                      {faq.is_published === 'yes' ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button onClick={() => startEdit(faq)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-muted-foreground hover:text-foreground">
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => { if (confirm('Supprimer cette FAQ ?')) deleteMut.mutate(faq.id) }}
                      className="p-2 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {(!data || data.length === 0) && (
              <div className="text-center py-16 text-muted-foreground">
                <p>Aucune entrée FAQ. Créez-en une !</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

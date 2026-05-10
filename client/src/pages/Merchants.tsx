import { useState } from 'react'
import { Store, QrCode, BarChart3, Shield, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import api from '../lib/api'
import toast from 'react-hot-toast'

const benefits = [
  { icon: QrCode, title: 'QR Code Unique', desc: 'Générez votre code QR personnalisé et acceptez tous les paiements mobiles en un seul scan.' },
  { icon: BarChart3, title: 'Dashboard Complet', desc: 'Suivez vos ventes, transactions et revenus en temps réel depuis votre tableau de bord.' },
  { icon: Shield, title: 'Sécurisé & Fiable', desc: 'Toutes les transactions sont protégées par notre système de sécurité bancaire de niveau militaire.' },
  { icon: Store, title: 'Sans Frais d\'Installation', desc: 'Inscription gratuite, aucun matériel requis. Commencez à accepter des paiements en quelques minutes.' },
]

const businessTypes = [
  'Commerce de détail', 'Restaurant / Alimentation', 'Pharmacie / Santé',
  'Transport', 'Agriculture / Producteur', 'Service / Artisanat',
  'Technologie / IT', 'Éducation', 'Autre',
]

export default function Merchants() {
  const [form, setForm] = useState({
    businessName: '', contactName: '', email: '', phone: '',
    businessType: '', city: '', message: '',
  })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/merchants/contact', form)
      setSent(true)
      toast.success('Demande envoyée ! Nous vous contacterons sous 24h.')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erreur lors de l\'envoi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="gradient-hero py-20 lg:py-28">
        <div className="container">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 text-sm font-medium px-3 py-1.5 rounded-full mb-6">
              <Store size={14} /> Solution marchands
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Développez votre commerce avec <span className="text-primary-500">MOBILE-PAY</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Rejoignez des milliers de marchands qui utilisent MOBILE-PAY pour accepter les paiements mobiles, gérer leurs ventes et développer leur activité en Afrique de l'Ouest.
            </p>
            <div className="flex gap-4">
              <a href="#join" className="aio-button-primary">
                Devenir marchand <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-py bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Pourquoi choisir MOBILE-PAY ?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Une solution complète pensée pour les marchands africains.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map(b => (
              <div key={b.title} className="aio-card p-6 text-center">
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <b.icon className="text-primary-500" size={26} />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{b.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="section-py bg-secondary">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Tarifs transparents</h2>
            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              {[
                { label: 'Paiements QR', value: '0%', desc: 'Gratuit pour vous' },
                { label: 'Transferts locaux', value: '0,5%', desc: 'Du montant envoyé' },
                { label: 'Vente crédit', value: '2-5%', desc: 'Marge commerciale' },
              ].map(p => (
                <div key={p.label} className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="text-3xl font-bold text-primary-500 mb-1">{p.value}</div>
                  <p className="font-semibold text-foreground text-sm">{p.label}</p>
                  <p className="text-muted-foreground text-xs mt-1">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Join form */}
      <section id="join" className="section-py bg-white">
        <div className="container max-w-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">Rejoindre MOBILE-PAY</h2>
            <p className="text-muted-foreground">
              Remplissez le formulaire et notre équipe vous contactera sous 24h.
            </p>
          </div>

          {sent ? (
            <div className="text-center py-16 aio-card p-12">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="text-primary-500" size={32} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Demande envoyée !</h3>
              <p className="text-muted-foreground">Notre équipe commerciale vous contactera dans les 24 heures.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="aio-card p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  { name: 'businessName', label: 'Nom du commerce *', placeholder: 'Mon Commerce' },
                  { name: 'contactName', label: 'Nom du responsable *', placeholder: 'Jean Kouakou' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{f.label}</label>
                    <input type="text" name={f.name} required value={(form as any)[f.name]} onChange={handle}
                      placeholder={f.placeholder}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
                  <input type="email" name="email" required value={form.email} onChange={handle}
                    placeholder="contact@moncommerce.ci"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Téléphone *</label>
                  <input type="tel" name="phone" required value={form.phone} onChange={handle}
                    placeholder="+225 07 00 00 00"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Type d'activité *</label>
                  <select name="businessType" required value={form.businessType} onChange={handle}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                    <option value="">Sélectionnez...</option>
                    {businessTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Ville *</label>
                  <input type="text" name="city" required value={form.city} onChange={handle}
                    placeholder="Abidjan"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Message (optionnel)</label>
                <textarea name="message" value={form.message} onChange={handle}
                  placeholder="Décrivez votre besoin..." rows={4}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              </div>
              <button type="submit" disabled={loading}
                className="aio-button-primary w-full justify-center">
                {loading && <Loader2 size={18} className="animate-spin" />}
                {loading ? 'Envoi en cours...' : 'Envoyer ma demande'}
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

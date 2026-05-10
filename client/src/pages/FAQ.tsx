import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, Search } from 'lucide-react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import FAQChatbot from '../components/FAQChatbot'
import api from '../lib/api'

interface FaqEntry {
  id: number
  question: string
  answer: string
  category: string
}

const staticFaq: FaqEntry[] = [
  { id: 1, question: 'Comment puis-je créer un compte MOBILE-PAY ?', answer: 'Créer un compte MOBILE-PAY est simple et rapide. Téléchargez l\'application, entrez votre numéro de téléphone, vérifiez votre identité avec une pièce d\'identité valide, et vous êtes prêt. Le processus prend moins de 5 minutes.', category: 'Compte' },
  { id: 2, question: 'Quels sont les frais de transaction ?', answer: 'Pour les transferts locaux : 0,5%. Transferts internationaux : 1,5%. Les paiements via QR code sont gratuits pour les marchands. Les retraits sont à 0,25%.', category: 'Tarifs' },
  { id: 3, question: 'Comment puis-je recevoir de l\'argent ?', answer: 'Votre contact peut vous envoyer de l\'argent en entrant votre numéro de téléphone, le montant, et en confirmant. Vous recevrez une notification et l\'argent sera crédité instantanément.', category: 'Paiements' },
  { id: 4, question: 'Est-ce que MOBILE-PAY est sécurisé ?', answer: 'Oui, la sécurité est notre priorité. Nous utilisons le chiffrement AES-256, l\'authentification biométrique, et la vérification en deux étapes pour protéger votre compte.', category: 'Sécurité' },
  { id: 5, question: 'Quel est le montant maximum que je peux transférer ?', answer: 'Niveau 1 : 500 000 FCFA/jour. Niveau 2 : 2 000 000 FCFA/jour. Niveau 3 (professionnel) : 5 000 000 FCFA/jour.', category: 'Tarifs' },
  { id: 6, question: 'Comment utiliser le QR code pour payer ?', answer: 'Scannez le code QR du marchand, entrez le montant, et confirmez. Le paiement est instantané. Aucun frais n\'est facturé pour les paiements via QR code.', category: 'Paiements' },
  { id: 7, question: 'Comment acheter du crédit d\'appel ?', answer: 'Depuis votre dashboard, sélectionnez "Vente Crédit", choisissez l\'opérateur et le montant, et confirmez. Le crédit est crédité instantanément sur le numéro cible.', category: 'Services' },
  { id: 8, question: 'Quels pays sont couverts pour les transferts internationaux ?', answer: 'Actuellement : Côte d\'Ivoire, Sénégal, Mali, Burkina Faso, Guinée, et en expansion vers d\'autres pays d\'Afrique de l\'Ouest.', category: 'International' },
]

export default function FAQ() {
  const [search, setSearch] = useState('')
  const [openId, setOpenId] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState('Tous')

  const { data } = useQuery({
    queryKey: ['faq-public'],
    queryFn: () => api.get('/faq').then(r => r.data.faq as FaqEntry[]),
    initialData: staticFaq,
  })

  const faq = data || staticFaq
  const categories = ['Tous', ...Array.from(new Set(faq.map(f => f.category)))]

  const filtered = faq.filter(f => {
    const matchCat = activeCategory === 'Tous' || f.category === activeCategory
    const matchSearch = !search || f.question.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Questions Fréquentes
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Trouvez rapidement les réponses à vos questions sur MOBILE-PAY et nos services.
          </p>
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher une question..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </section>

      {/* Category tabs */}
      <div className="border-b border-gray-200 bg-white sticky top-16 z-20">
        <div className="container">
          <div className="flex gap-1 overflow-x-auto py-3 hide-scrollbar">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-primary-500 text-white'
                    : 'text-muted-foreground hover:bg-gray-100'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ List */}
      <section className="section-py">
        <div className="container max-w-3xl">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg mb-2">Aucune question trouvée</p>
              <p className="text-sm">Essayez notre chatbot IA pour une réponse personnalisée.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(f => (
                <div key={f.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setOpenId(openId === f.id ? null : f.id)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <span className="text-xs font-medium text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full mr-3">
                        {f.category}
                      </span>
                      <span className="font-medium text-foreground">{f.question}</span>
                    </div>
                    <ChevronDown size={20} className={`flex-shrink-0 ml-4 text-muted-foreground transition-transform duration-200 ${openId === f.id ? 'rotate-180' : ''}`} />
                  </button>
                  {openId === f.id && (
                    <div className="px-5 pb-5 pt-2 text-muted-foreground text-sm leading-relaxed border-t border-gray-100 bg-gray-50">
                      {f.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Still have questions */}
          <div className="mt-12 text-center p-8 bg-gradient-to-br from-primary-50 to-emerald-50 rounded-2xl border border-primary-100">
            <h3 className="text-xl font-bold text-foreground mb-2">Vous n'avez pas trouvé votre réponse ?</h3>
            <p className="text-muted-foreground text-sm mb-6">Notre assistant IA répond à toutes vos questions en temps réel.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="mailto:info@mobilepay-ci.com"
                className="aio-button-outline text-sm px-5 py-2.5">
                Envoyer un email
              </a>
              <a href="tel:+2250504921096"
                className="aio-button-primary text-sm px-5 py-2.5">
                Appeler le support
              </a>
            </div>
          </div>
        </div>
      </section>

      <FAQChatbot />
      <Footer />
    </div>
  )
}

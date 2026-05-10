// International.tsx
import { Globe2, ArrowRight, CheckCircle2, Clock, DollarSign } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

const countries = [
  { flag: '🇨🇮', name: 'Côte d\'Ivoire', currency: 'FCFA', available: true },
  { flag: '🇸🇳', name: 'Sénégal', currency: 'FCFA', available: true },
  { flag: '🇲🇱', name: 'Mali', currency: 'FCFA', available: true },
  { flag: '🇧🇫', name: 'Burkina Faso', currency: 'FCFA', available: true },
  { flag: '🇬🇳', name: 'Guinée', currency: 'GNF', available: true },
  { flag: '🇬🇭', name: 'Ghana', currency: 'GHS', available: true },
  { flag: '🇳🇬', name: 'Nigeria', currency: 'NGN', available: true },
  { flag: '🇨🇲', name: 'Cameroun', currency: 'FCFA', available: false },
]

export function International() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <section className="gradient-hero py-20 lg:py-28">
        <div className="container text-center">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 text-sm font-medium px-3 py-1.5 rounded-full mb-6">
            <Globe2 size={14} /> Transferts internationaux
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Envoyez de l'argent partout en Afrique
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transferts instantanés vers 8 pays avec des frais à seulement 1,5%. Rapide, sécurisé, et sans intermédiaires.
          </p>
          <div className="inline-flex items-center gap-8 bg-white rounded-2xl shadow-sm border border-gray-200 px-8 py-5">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-500">1,5%</div>
              <div className="text-xs text-muted-foreground">Frais seulement</div>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-500">Instantané</div>
              <div className="text-xs text-muted-foreground">Délai de transfert</div>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-500">8 pays</div>
              <div className="text-xs text-muted-foreground">Couverts</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-py bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Pays disponibles</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {countries.map(c => (
              <div key={c.name} className={`aio-card p-5 text-center ${!c.available ? 'opacity-50' : ''}`}>
                <div className="text-4xl mb-3">{c.flag}</div>
                <p className="font-semibold text-foreground text-sm">{c.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{c.currency}</p>
                {!c.available && <p className="text-xs text-orange-500 mt-1">Bientôt disponible</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-py bg-secondary">
        <div className="container max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Comment envoyer de l'argent</h2>
          <div className="grid sm:grid-cols-3 gap-6 mt-8">
            {[
              { n: '1', icon: DollarSign, title: 'Choisissez le montant', desc: 'Entrez la somme à envoyer et le pays de destination.' },
              { n: '2', icon: Globe2, title: 'Renseignez le destinataire', desc: 'Numéro de téléphone ou compte bancaire du bénéficiaire.' },
              { n: '3', icon: CheckCircle2, title: 'Confirmez l\'envoi', desc: 'Validez avec votre code PIN. Le transfert est instantané !' },
            ].map(s => (
              <div key={s.n} className="text-center">
                <div className="w-12 h-12 bg-primary-500 text-white rounded-xl flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  {s.n}
                </div>
                <h3 className="font-semibold text-foreground mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
          <button className="aio-button-primary mt-10 mx-auto">
            Commencer un transfert <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <section className="gradient-hero py-20">
        <div className="container max-w-3xl text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">À propos de MOBILE-PAY</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            MOBILE-PAY est une solution fintech développée par la Compagnie des Services Numériques, basée en Côte d'Ivoire. 
            Notre mission est de démocratiser l'accès aux services financiers pour tous les Africains.
          </p>
        </div>
      </section>

      <section className="section-py bg-white">
        <div className="container max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Notre Mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nous croyons en un avenir où chaque Africain, qu'il soit en ville ou en milieu rural, a accès à des services financiers dignes, sécurisés et abordables.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                MOBILE-PAY facilite les paiements, les transferts et la gestion financière pour les marchands, les agriculteurs, les employeurs et les particuliers.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { v: '2022', l: 'Année de création' },
                { v: '500K+', l: 'Utilisateurs actifs' },
                { v: '8 pays', l: 'Couverts' },
                { v: '24/7', l: 'Support' },
              ].map(s => (
                <div key={s.l} className="aio-card p-6 text-center">
                  <div className="text-2xl font-bold text-primary-500">{s.v}</div>
                  <p className="text-sm text-muted-foreground mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export function Pricing() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <section className="gradient-hero py-20">
        <div className="container text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">Tarifs Transparents</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Des prix clairs et compétitifs. Aucun frais caché. Payez seulement ce que vous utilisez.
          </p>
        </div>
      </section>

      <section className="section-py bg-white">
        <div className="container max-w-4xl">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Particulier',
                price: 'Gratuit',
                features: ['Inscription gratuite', 'Paiements QR gratuits', 'Transferts locaux 0,5%', 'Limite: 500K FCFA/jour'],
                primary: false,
              },
              {
                title: 'Marchand',
                price: 'Gratuit',
                features: ['Tout Particulier inclus', 'Dashboard complet', 'Vente crédit téléphonique', 'Gestion salaires', 'Limite: 2M FCFA/jour'],
                primary: true,
              },
              {
                title: 'Entreprise',
                price: 'Sur devis',
                features: ['Tout Marchand inclus', 'API d\'intégration', 'Manager dédié', 'Limites personnalisées', 'SLA garanti'],
                primary: false,
              },
            ].map(p => (
              <div key={p.title} className={`rounded-2xl p-8 border-2 ${p.primary ? 'border-primary-500 bg-primary-50 relative' : 'border-gray-200 bg-white'}`}>
                {p.primary && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    Recommandé
                  </div>
                )}
                <h3 className="text-xl font-bold text-foreground mb-2">{p.title}</h3>
                <div className="text-3xl font-bold text-primary-500 mb-6">{p.price}</div>
                <ul className="space-y-3 mb-8">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 size={16} className="text-primary-500 flex-shrink-0" />
                      <span className="text-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to={p.title === 'Marchand' ? '/merchants' : '/'} className={`block text-center py-3 rounded-xl font-semibold text-sm transition-colors ${p.primary ? 'bg-primary-500 text-white hover:bg-primary-600' : 'border border-gray-300 text-foreground hover:bg-gray-50'}`}>
                  {p.title === 'Entreprise' ? 'Nous contacter' : 'Commencer'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export function Blog() {
  const posts = [
    { title: 'L\'avenir du paiement mobile en Afrique de l\'Ouest', category: 'Fintech', date: '15 Jan 2026', excerpt: 'Découvrez comment le paiement mobile transforme les économies africaines...' },
    { title: 'Comment protéger votre compte MOBILE-PAY', category: 'Sécurité', date: '8 Jan 2026', excerpt: 'Les meilleures pratiques pour sécuriser votre portefeuille numérique...' },
    { title: 'MOBILE-PAY et l\'inclusion financière rurale', category: 'Impact', date: '2 Jan 2026', excerpt: 'Comment nous aidons les communautés rurales à accéder aux services bancaires...' },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <section className="gradient-hero py-16">
        <div className="container">
          <h1 className="text-4xl font-bold text-foreground mb-4">Blog & Actualités</h1>
          <p className="text-lg text-muted-foreground">Restez informé des dernières nouvelles de MOBILE-PAY et de la fintech africaine.</p>
        </div>
      </section>
      <section className="section-py bg-white">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map(p => (
              <div key={p.title} className="aio-card overflow-hidden group cursor-pointer">
                <div className="h-48 bg-gradient-to-br from-primary-100 to-emerald-100 flex items-center justify-center">
                  <Globe2 size={48} className="text-primary-300" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full">{p.category}</span>
                    <span className="text-xs text-muted-foreground">{p.date}</span>
                  </div>
                  <h3 className="font-bold text-foreground mb-2 group-hover:text-primary-500 transition-colors">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container text-center py-32">
        <div className="text-9xl font-bold text-primary-100 mb-4">404</div>
        <h1 className="text-3xl font-bold text-foreground mb-4">Page introuvable</h1>
        <p className="text-muted-foreground mb-8">Cette page n'existe pas ou a été déplacée.</p>
        <Link to="/" className="aio-button-primary mx-auto">
          Retour à l'accueil <ArrowRight size={18} />
        </Link>
      </div>
      <Footer />
    </div>
  )
}

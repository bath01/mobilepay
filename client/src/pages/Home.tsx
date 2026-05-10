import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Zap, Lock, Globe2, Smartphone, TrendingUp,
  Send, CreditCard, FileText, CheckCircle2, Star, ChevronDown
} from 'lucide-react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import FAQChatbot from '../components/FAQChatbot'
import ContactForm from '../components/ContactForm'

const features = [
  {
    icon: <CreditCard className="text-primary-500" size={28} />,
    bg: 'bg-blue-100',
    title: 'Collecte via QR Code',
    desc: 'Acceptez les paiements clients via un code QR unique qui regroupe tous les wallets et cartes bancaires du pays.',
  },
  {
    icon: <Send className="text-accent" size={28} />,
    bg: 'bg-orange-100',
    title: 'Remittance Locale & Internationale',
    desc: 'Transferts instantanés locaux et internationaux avec des frais compétitifs et des taux de change avantageux.',
    link: '/international',
  },
  {
    icon: <TrendingUp className="text-green-600" size={28} />,
    bg: 'bg-green-100',
    title: 'Paiement Agricole en Milieu Rural',
    desc: 'Facilitez le paiement des revenus agricoles directement aux fermiers et producteurs sans intermédiaires.',
  },
  {
    icon: <FileText className="text-purple-600" size={28} />,
    bg: 'bg-purple-100',
    title: 'Gestion des Salaires & Primes',
    desc: 'Gérez facilement le paiement des salaires, des primes de mission et de stage pour vos équipes.',
  },
  {
    icon: <Smartphone className="text-cyan-600" size={28} />,
    bg: 'bg-cyan-100',
    title: 'Vente de Crédit & Internet',
    desc: 'Vendez du crédit d\'appel et d\'internet directement depuis votre dashboard avec des marges compétitives.',
  },
  {
    icon: <Lock className="text-indigo-600" size={28} />,
    bg: 'bg-indigo-100',
    title: 'Cartes Bancaires Prépayées Virtuelles',
    desc: 'Créez et gérez des cartes prépayées virtuelles VISA et MASTERCARD pour des paiements en ligne sécurisés.',
  },
]

const steps = [
  { n: 1, title: 'Téléchargez l\'application', desc: 'Téléchargez MOBILE-PAY depuis l\'App Store ou Google Play en quelques secondes.' },
  { n: 2, title: 'Créez votre compte', desc: 'Inscrivez-vous avec votre email ou numéro de téléphone en moins d\'une minute.' },
  { n: 3, title: 'Vérifiez votre identité', desc: 'Complétez la vérification KYC pour accéder à toutes les fonctionnalités.' },
  { n: 4, title: 'Commencez à utiliser', desc: 'Ajoutez des fonds et commencez à gérer vos finances immédiatement.' },
]

const testimonials = [
  { name: 'Amara Koné', location: 'Abidjan, Côte d\'Ivoire', initials: 'AK', title: 'Très facile à utiliser', text: 'MOBILE-PAY a rendu la gestion de mes finances tellement simple. L\'interface est intuitive et je peux envoyer de l\'argent à ma famille en quelques secondes.' },
  { name: 'Jean-Marie Dubois', location: 'Dakar, Sénégal', initials: 'JM', title: 'Sécurité de confiance', text: 'La sécurité de Mobile-Pay m\'a rassuré. Je me sens en confiance pour gérer mes transactions importantes. C\'est vraiment fiable.' },
  { name: 'Nadia Kamara', location: 'Lagos, Nigeria', initials: 'NK', title: 'Facilité et rapidité', text: 'Avant MOBILE-PAY, j\'avais peur de faire des transferts d\'argent. Maintenant, c\'est tellement facile et rapide.' },
]

const faqItems = [
  { q: 'Comment puis-je créer un compte MOBILE-PAY ?', a: 'Créer un compte MOBILE-PAY est simple et rapide. Téléchargez l\'application, entrez votre numéro de téléphone, vérifiez votre identité avec une pièce d\'identité valide. Le processus prend moins de 5 minutes.' },
  { q: 'Quels sont les frais de transaction ?', a: 'Les frais varient selon le type de transaction. Pour les transferts locaux : 0,5%. Pour les transferts internationaux : 1,5%. Les paiements via QR code sont gratuits pour les marchands.' },
  { q: 'Est-ce que MOBILE-PAY est sécurisé ?', a: 'Oui, la sécurité est notre priorité absolue. Nous utilisons le chiffrement bancaire AES-256. Votre compte est protégé par une authentification à deux facteurs (2FA) et un code PIN personnel.' },
  { q: 'Quel est le montant maximum que je peux transférer ?', a: 'Niveau 1 : 500 000 FCFA/jour. Niveau 2 : 2 000 000 FCFA/jour. Niveau 3 : 5 000 000 FCFA/jour (compte professionnel).' },
]

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white text-foreground">
      <Navigation />

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background blob */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: content */}
            <div className="aio-slide-up">
              <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-sm font-medium px-3 py-1.5 rounded-full mb-6">
                <Zap size={14} />
                <span>La fintech de l'Afrique de l'Ouest</span>
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6 leading-tight">
                Collectez, Transférez, Payez avec{' '}
                <span className="text-primary-500">MOBILE-PAY</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl">
                La solution numérique complète pour les marchands, agriculteurs et professionnels. 
                Acceptez les paiements QR, effectuez des transferts locaux et internationaux depuis un seul dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="aio-button-primary text-base">
                  Télécharger l'app <ArrowRight size={18} />
                </button>
                <Link to="/merchants" className="aio-button-outline text-base">
                  Devenir marchand
                </Link>
              </div>

              {/* International CTA */}
              <div className="p-4 bg-gradient-to-r from-primary-50 to-emerald-50 rounded-xl border border-primary-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Globe2 size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">Transferts internationaux</p>
                    <p className="text-xs text-muted-foreground">8 pays · Frais à 1,5 % · Instantané</p>
                  </div>
                </div>
                <Link to="/international"
                  className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors">
                  Envoyer de l'argent <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right: image */}
            <div className="relative hidden lg:flex items-center justify-center rounded-2xl overflow-hidden h-[480px] shadow-2xl aio-fade-in">
              <img
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663089638801/FcaTtocAxlZSwjig.png"
                alt="Centre commercial africain avec paiement MOBILE-PAY"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────────── */}
      <section className="py-12 bg-primary-500">
        <div className="container">
          <div className="grid grid-cols-3 gap-4 text-center text-white">
            {[
              { v: '500K+', l: 'Utilisateurs actifs' },
              { v: '$50M+', l: 'Transactions mensuelles' },
              { v: '24/7', l: 'Support client' },
            ].map(s => (
              <div key={s.l} className="aio-slide-up">
                <div className="text-3xl lg:text-4xl font-bold mb-1">{s.v}</div>
                <p className="text-primary-100 text-sm">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Diagonal divider ──────────────────────────────────────────────────── */}
      <div className="h-16 bg-gradient-to-b from-primary-500 to-secondary relative">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 64" preserveAspectRatio="none">
          <path d="M0,20 Q300,50 600,20 T1200,20 L1200,64 L0,64 Z" fill="#F5F7FA" />
        </svg>
      </div>

      {/* ── Features ──────────────────────────────────────────────────────────── */}
      <section id="features" className="section-py bg-secondary">
        <div className="container">
          <div className="text-center mb-14 aio-slide-up">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              MOBILE-PAY regroupe tous les services financiers essentiels dans une seule application intuitive et sécurisée.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className={`aio-card p-8 aio-slide-up ${i % 2 === 1 ? 'md:mt-6' : ''}`}>
                <div className={`aio-icon-circle ${f.bg} mb-6`}>{f.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{f.desc}</p>
                {f.link && (
                  <Link to={f.link} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-500 hover:text-primary-700 transition-colors">
                    En savoir plus <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="section-py bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 hidden lg:flex items-center justify-center order-2 lg:order-1 rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663089638801/HqqpcIxtaMyQecGY.png"
                alt="Famille rurale ouest africaine avec MOBILE-PAY"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aio-slide-up order-1 lg:order-2">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8">Comment ça marche</h2>
              <div className="space-y-6">
                {steps.map(s => (
                  <div key={s.n} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-500 text-white font-bold flex items-center justify-center text-lg">
                      {s.n}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">{s.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────────── */}
      <section className="section-py bg-secondary">
        <div className="container">
          <div className="text-center mb-12 aio-slide-up">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Ce que disent nos utilisateurs</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez comment MOBILE-PAY simplifie la vie financière de milliers de personnes.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 aio-slide-up">
                <div className="flex gap-0.5 mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} size={16} className="fill-primary-500 text-primary-500" />
                  ))}
                </div>
                <p className="font-semibold text-foreground mb-2">{t.title}</p>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Impact ────────────────────────────────────────────────────────────── */}
      <section className="section-py bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 hidden lg:flex items-center justify-center rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663089638801/cWzxQnaTBvsaPLWh.png"
                alt="Famille africaine heureuse"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aio-slide-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">L'impact réel de Mobile-Pay</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Des milliers de familles africaines utilisent MOBILE-PAY pour recevoir de l'argent de leurs proches à l'étranger, payer leurs factures et gérer leurs finances au quotidien.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { title: 'Transferts instantanés', desc: 'Recevez de l\'argent en quelques secondes, où que vous soyez.' },
                  { title: 'Frais réduits', desc: 'Économisez jusqu\'à 80% sur les frais de transfert traditionnels.' },
                  { title: 'Sécurité garantie', desc: 'Vos données sont protégées par le chiffrement bancaire AES-256.' },
                ].map(i => (
                  <div key={i.title} className="flex gap-4">
                    <CheckCircle2 className="text-primary-500 flex-shrink-0 mt-0.5" size={22} />
                    <div>
                      <h4 className="font-semibold text-foreground">{i.title}</h4>
                      <p className="text-muted-foreground text-sm">{i.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="aio-button-primary">
                Rejoindre la communauté <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────────── */}
      <section className="section-py bg-secondary">
        <div className="container">
          <div className="mb-10 aio-slide-up">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Questions Fréquemment Posées</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Trouvez les réponses aux questions les plus courantes sur MOBILE-PAY et nos services.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-foreground pr-4">{item.q}</span>
                    <ChevronDown
                      size={20}
                      className={`flex-shrink-0 text-primary-500 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 pt-1 text-muted-foreground text-sm leading-relaxed border-t border-gray-100 bg-gray-50">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
              <Link to="/faq" className="inline-flex items-center gap-2 text-primary-500 font-medium hover:underline text-sm pt-2">
                Voir toutes les questions <ArrowRight size={16} />
              </Link>
            </div>

            {/* Chatbot invitation */}
            <div className="flex flex-col gap-6 lg:sticky lg:top-24">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663089638801/wHyADjNmxcqJCRcP.png"
                  alt="Jeunes Africains posant des questions sur MOBILE-PAY"
                  className="w-full h-72 object-cover object-top"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                  <p className="text-white font-semibold text-sm">Des milliers de jeunes font confiance à MOBILE-PAY</p>
                  <p className="text-white/80 text-xs mt-1">Rejoignez la communauté et posez vos questions à notre assistant IA</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary-50 to-emerald-50 border border-primary-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">🤖</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">Assistant IA disponible 24/7</h3>
                    <p className="text-xs text-muted-foreground">Réponses instantanées à vos questions</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Vous ne trouvez pas la réponse à votre question ? Notre assistant IA est là pour vous aider.
                </p>
                <button
                  onClick={() => (document.querySelector('[aria-label="Ouvrir le chatbot IA"]') as HTMLButtonElement)?.click()}
                  className="w-full bg-primary-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 text-sm">
                  💬 Poser une question à l'IA
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ───────────────────────────────────────────────────────────── */}
      <section id="contact" className="section-py bg-white">
        <div className="container max-w-3xl">
          <div className="text-center mb-10 aio-slide-up">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Nous aimerions vous entendre</h2>
            <p className="text-lg text-muted-foreground">
              Avez-vous des questions ? Notre équipe vous répondra dans les 24 heures.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <FAQChatbot />
      <Footer />
    </div>
  )
}

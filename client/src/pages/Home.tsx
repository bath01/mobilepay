import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Zap, Lock, Globe2, Smartphone, TrendingUp,
  Send, CreditCard, FileText, CheckCircle2, Star, ChevronDown,
  Wallet, ArrowDownToLine, ArrowUpFromLine, Gift, Building2,
  Wifi, ShieldCheck, Code2, QrCode
} from 'lucide-react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import FAQChatbot from '../components/FAQChatbot'
import ContactForm from '../components/ContactForm'

const ANDROID_APK_URL = '/app-release.apk'

const services = [
  {
    icon: <ArrowDownToLine className="text-emerald-600" size={24} />,
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    label: 'Dépôt',
    desc: 'Alimentez votre wallet via Mobile Money, carte bancaire ou virement.',
  },
  {
    icon: <ArrowUpFromLine className="text-orange-500" size={24} />,
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    label: 'Retrait',
    desc: 'Retirez vos fonds vers votre compte Mobile Money ou bancaire.',
  },
  {
    icon: <Send className="text-blue-500" size={24} />,
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    label: 'Transfert',
    desc: 'Envoyez de l\'argent à n\'importe quel utilisateur MOBILE-PAY instantanément.',
  },
  {
    icon: <Smartphone className="text-cyan-600" size={24} />,
    bg: 'bg-cyan-50',
    border: 'border-cyan-100',
    label: 'Airtime',
    desc: 'Rechargez n\'importe quel numéro Orange, MTN, Moov en quelques secondes.',
  },
  {
    icon: <Wifi className="text-purple-600" size={24} />,
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    label: 'Data',
    desc: 'Achetez des forfaits internet data pour tous les opérateurs du pays.',
  },
  {
    icon: <CreditCard className="text-indigo-600" size={24} />,
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    label: 'Carte virtuelle',
    desc: 'Générez une carte Visa/Mastercard virtuelle pour vos achats en ligne.',
  },
  {
    icon: <Gift className="text-pink-500" size={24} />,
    bg: 'bg-pink-50',
    border: 'border-pink-100',
    label: 'Carte cadeau',
    desc: 'Offrez des cartes cadeaux numériques pour toutes les occasions.',
  },
  {
    icon: <Building2 className="text-amber-600" size={24} />,
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    label: 'Virement bancaire',
    desc: 'Effectuez des virements vers tous les comptes bancaires de la zone UEMOA.',
  },
  {
    icon: <Code2 className="text-teal-600" size={24} />,
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    label: 'API Business',
    desc: 'Intégrez MOBILE-PAY à votre plateforme via notre API REST documentée.',
  },
]

const accounts = [
  {
    type: 'Compte Particulier',
    icon: <Wallet className="text-emerald-600" size={28} />,
    bg: 'bg-emerald-50',
    accent: 'border-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700',
    badgeLabel: 'Client standard',
    perks: [
      'Dépôt & retrait Mobile Money',
      'Transferts P2P instantanés',
      'Airtime & Data pour tous opérateurs',
      'Carte virtuelle Visa/Mastercard',
      'Historique des transactions',
      'KYC simplifié en 5 min',
    ],
    cta: 'Créer mon compte',
    note: 'Disponible sur Android & iOS',
  },
  {
    type: 'Compte Business',
    icon: <Building2 className="text-blue-600" size={28} />,
    bg: 'bg-blue-50',
    accent: 'border-blue-500',
    badge: 'bg-blue-100 text-blue-700',
    badgeLabel: 'Compte marchand',
    perks: [
      'Collecte via QR Code',
      'Virement bancaire UEMOA',
      'Accès à l\'API Business',
      'Gestion des salaires & primes',
      'Dashboard marchand dédié',
      'KYB et conformité réglementaire',
    ],
    cta: 'Ouvrir un compte business',
    note: 'Réservé aux entreprises',
  },
]

const steps = [
  { n: 1, title: 'Téléchargez l\'application', desc: 'Disponible sur Android maintenant, iOS très prochainement.' },
  { n: 2, title: 'Créez votre compte', desc: 'Particulier ou Business, inscrivez-vous en moins de 5 minutes.' },
  { n: 3, title: 'Vérifiez votre identité', desc: 'KYC simplifié pour accéder à tous les services.' },
  { n: 4, title: 'Utilisez vos services', desc: 'Dépôt, retrait, transfert, airtime, carte virtuelle et plus.' },
]

const testimonials = [
  { name: 'Amara Koné', location: 'Abidjan, Côte d\'Ivoire', initials: 'AK', title: 'Tout en un seul endroit', text: 'J\'utilise MOBILE-PAY pour recharger mon téléphone, envoyer de l\'argent et payer en ligne. Tout est là, simple et rapide.' },
  { name: 'Jean-Marie Dubois', location: 'Dakar, Sénégal', initials: 'JM', title: 'API très bien documentée', text: 'Nous avons intégré l\'API MOBILE-PAY en 2 jours. Les paiements marchands fonctionnent parfaitement depuis notre plateforme e-commerce.' },
  { name: 'Nadia Kamara', location: 'Lagos, Nigeria', initials: 'NK', title: 'Carte virtuelle pratique', text: 'Ma carte virtuelle MOBILE-PAY me permet de payer sur Amazon et Alibaba. Plus besoin d\'intermédiaires ni de frais cachés.' },
]

const faqItems = [
  { q: 'Comment créer un compte MOBILE-PAY ?', a: 'Téléchargez l\'app Android, entrez votre numéro de téléphone, vérifiez votre identité (KYC) en moins de 5 minutes. Pour un compte Business, contactez notre équipe pour le processus KYB.' },
  { q: 'Quels sont les frais de transaction ?', a: 'Transferts locaux : 0,5%. Transferts internationaux : 1,5%. Retraits : 0,25%. Dépôts : gratuits. Airtime et Data : sans frais supplémentaires. Carte virtuelle : frais de création uniques.' },
  { q: 'Quels services sont disponibles pour les marchands ?', a: 'Collecte via QR Code, virement bancaire UEMOA, gestion des salaires, accès à l\'API Business pour intégrer nos paiements à votre plateforme, et un dashboard marchand dédié.' },
  { q: 'Comment fonctionne la carte virtuelle ?', a: 'Depuis votre app MOBILE-PAY, générez une carte Visa ou Mastercard virtuelle instantanément. Utilisez-la pour payer sur tous les sites e-commerce internationaux.' },
]

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white text-foreground">
      <Navigation />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-sm font-medium px-3 py-1.5 rounded-full mb-6">
                <Zap size={14} />
                <span>La super-app fintech de l'Afrique de l'Ouest</span>
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6 leading-tight">
                Tous vos services financiers,{' '}
                <span className="text-primary-500">une seule app</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl">
                Dépôt, retrait, transfert, airtime, data, carte virtuelle, virement bancaire et API Business — MOBILE-PAY centralise tout ce dont vous avez besoin.
              </p>

              {/* Download buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <a
                  href={ANDROID_APK_URL}
                  download="mobilepay.apk"
                  className="flex items-center justify-center gap-3 bg-foreground text-white px-5 py-3.5 rounded-xl hover:bg-gray-800 transition-colors font-medium text-sm"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white flex-shrink-0">
                    <path d="M17.523 0c-.16 0-.323.033-.476.102l-9.06 4.357C6.948 4.92 6.5 5.668 6.5 6.5v11c0 .832.448 1.58 1.487 2.041l9.06 4.357c.153.069.316.102.476.102.508 0 1-.334 1.148-.852L21 13.5V10.5L18.671.852C18.523.334 18.031 0 17.523 0zM3 7.5A1.5 1.5 0 0 0 1.5 9v6A1.5 1.5 0 0 0 3 16.5h1V7.5H3zm18 0h-1v9h1a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 21 7.5z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-gray-300 leading-none">Télécharger sur</div>
                    <div className="text-sm font-semibold leading-tight">Android APK</div>
                  </div>
                </a>

                <button
                  disabled
                  className="flex items-center justify-center gap-3 bg-gray-100 text-gray-400 px-5 py-3.5 rounded-xl font-medium text-sm cursor-not-allowed border border-gray-200"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-gray-400 flex-shrink-0">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-gray-400 leading-none">Bientôt sur</div>
                    <div className="text-sm font-semibold leading-tight">App Store iOS</div>
                  </div>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck size={14} className="text-primary-500" />
                <span>Application sécurisée · Données chiffrées AES-256 · Aucun frais cachés</span>
              </div>
            </div>

            {/* Right image */}
            <div className="relative hidden lg:flex items-center justify-center rounded-2xl overflow-hidden h-[480px] shadow-2xl">
              <img
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663089638801/FcaTtocAxlZSwjig.png"
                alt="Paiement MOBILE-PAY en Afrique de l'Ouest"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

              {/* floating badge */}
              <div className="absolute bottom-6 left-6 bg-white rounded-xl px-4 py-3 shadow-lg flex items-center gap-3">
                <div className="w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Paiement confirmé</p>
                  <p className="text-sm font-bold text-foreground">+25 000 FCFA reçus</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 bg-primary-500">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {[
              { v: '500K+', l: 'Utilisateurs actifs' },
              { v: '9 services', l: 'Dans une seule app' },
              { v: '8 pays', l: 'Afrique de l\'Ouest' },
              { v: '24/7', l: 'Support & assistance' },
            ].map(s => (
              <div key={s.l}>
                <div className="text-3xl lg:text-4xl font-bold mb-1">{s.v}</div>
                <p className="text-primary-100 text-sm">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services grid ── */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-sm font-medium px-3 py-1.5 rounded-full mb-4">
              <QrCode size={14} />
              <span>9 services disponibles</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Tout ce que vous pouvez faire avec MOBILE-PAY
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Particuliers ou entreprises, accédez à tous vos services financiers depuis une application unique.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <div
                key={i}
                className={`bg-white border ${s.border} rounded-2xl p-6 hover:shadow-md transition-shadow duration-200`}
              >
                <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center mb-4`}>
                  {s.icon}
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{s.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Account types ── */}
      <section id="comptes" className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Choisissez votre type de compte
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Un compte particulier pour gérer vos finances personnelles, un compte business pour vos activités professionnelles.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {accounts.map((a, i) => (
              <div
                key={i}
                className={`rounded-2xl border-2 ${a.accent} p-8 flex flex-col`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-12 h-12 ${a.bg} rounded-xl flex items-center justify-center`}>
                    {a.icon}
                  </div>
                  <div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${a.badge}`}>{a.badgeLabel}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mt-4 mb-6">{a.type}</h3>

                <ul className="space-y-3 mb-8 flex-1">
                  {a.perks.map((p, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-foreground">
                      <CheckCircle2 size={16} className="text-primary-500 flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>

                <div>
                  <a
                    href={ANDROID_APK_URL}
                    download="mobilepay.apk"
                    className="w-full bg-primary-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    {a.cta} <ArrowRight size={16} />
                  </a>
                  <p className="text-xs text-center text-muted-foreground mt-3">{a.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Download CTA ── */}
      <section className="py-20 bg-primary-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 left-8 w-64 h-64 bg-white rounded-full" />
          <div className="absolute bottom-8 right-8 w-96 h-96 bg-white rounded-full" />
        </div>
        <div className="container relative text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-medium px-3 py-1.5 rounded-full mb-6">
            <Smartphone size={14} />
            <span>Application mobile disponible</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 max-w-2xl mx-auto leading-tight">
            Téléchargez MOBILE-PAY maintenant
          </h2>
          <p className="text-primary-100 text-lg mb-10 max-w-xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui gèrent leurs finances depuis leur smartphone. Gratuit, sécurisé, disponible partout.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={ANDROID_APK_URL}
              download="mobilepay.apk"
              className="flex items-center justify-center gap-3 bg-white text-foreground px-6 py-4 rounded-xl hover:bg-gray-100 transition-colors font-medium shadow-lg"
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-green-600 flex-shrink-0">
                <path d="M17.523 0c-.16 0-.323.033-.476.102l-9.06 4.357C6.948 4.92 6.5 5.668 6.5 6.5v11c0 .832.448 1.58 1.487 2.041l9.06 4.357c.153.069.316.102.476.102.508 0 1-.334 1.148-.852L21 13.5V10.5L18.671.852C18.523.334 18.031 0 17.523 0zM3 7.5A1.5 1.5 0 0 0 1.5 9v6A1.5 1.5 0 0 0 3 16.5h1V7.5H3zm18 0h-1v9h1a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 21 7.5z"/>
              </svg>
              <div className="text-left">
                <div className="text-xs text-gray-500 leading-none">Télécharger l'APK</div>
                <div className="text-sm font-bold leading-tight">Android</div>
              </div>
            </a>

            <button
              disabled
              className="flex items-center justify-center gap-3 bg-white/20 text-white/60 px-6 py-4 rounded-xl font-medium border border-white/30 cursor-not-allowed"
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white/50 flex-shrink-0">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="text-left">
                <div className="text-xs text-white/50 leading-none">Bientôt disponible</div>
                <div className="text-sm font-bold leading-tight text-white/60">iOS App Store</div>
              </div>
            </button>
          </div>

          <p className="text-primary-200 text-xs mt-6">
            Version Android · 79 Mo · Gratuit · Aucun abonnement requis
          </p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 hidden lg:flex items-center justify-center order-2 lg:order-1 rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663089638801/HqqpcIxtaMyQecGY.png"
                alt="Famille africaine avec MOBILE-PAY"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
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
              <div className="mt-8">
                <a
                  href={ANDROID_APK_URL}
                  download="mobilepay.apk"
                  className="inline-flex items-center gap-2 bg-primary-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-600 transition-colors text-sm"
                >
                  Télécharger l'app Android <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Ce que disent nos utilisateurs</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Particuliers et entreprises font confiance à MOBILE-PAY pour leurs finances au quotidien.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
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

      {/* ── Impact ── */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 hidden lg:flex items-center justify-center rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663089638801/cWzxQnaTBvsaPLWh.png"
                alt="Famille africaine heureuse avec MOBILE-PAY"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">Conçu pour l'Afrique de l'Ouest</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                MOBILE-PAY est la première super-app financière qui répond aux besoins réels des particuliers et des entreprises de la zone UEMOA — des transferts ruraux aux paiements e-commerce internationaux.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { title: 'Mobile Money & Bancaire', desc: 'Compatible Orange Money, MTN MoMo, Wave, Moov et toutes les banques UEMOA.' },
                  { title: 'Frais transparents', desc: 'Aucun frais caché. Tarifs clairs affichés avant chaque transaction.' },
                  { title: 'Sécurité bancaire', desc: 'Chiffrement AES-256, authentification 2FA et code PIN personnel.' },
                ].map(item => (
                  <div key={item.title} className="flex gap-4">
                    <CheckCircle2 className="text-primary-500 flex-shrink-0 mt-0.5" size={22} />
                    <div>
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 flex-wrap">
                <a
                  href={ANDROID_APK_URL}
                  download="mobilepay.apk"
                  className="inline-flex items-center gap-2 bg-primary-500 text-white font-semibold px-5 py-3 rounded-xl hover:bg-primary-600 transition-colors text-sm"
                >
                  Télécharger l'app <ArrowRight size={16} />
                </a>
                <Link to="/merchants" className="inline-flex items-center gap-2 border border-gray-200 text-foreground font-semibold px-5 py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                  Compte Business <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Questions fréquentes</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Tout ce que vous devez savoir sur MOBILE-PAY et ses services.
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

            <div className="flex flex-col gap-6 lg:sticky lg:top-24">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663089638801/wHyADjNmxcqJCRcP.png"
                  alt="Jeunes Africains avec MOBILE-PAY"
                  className="w-full h-72 object-cover object-top"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                  <p className="text-white font-semibold text-sm">Des milliers de jeunes font confiance à MOBILE-PAY</p>
                  <p className="text-white/80 text-xs mt-1">Rejoignez la communauté</p>
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
                  Une question sur nos services ? Notre assistant IA répond immédiatement.
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

      {/* ── Contact ── */}
      <section id="contact" className="py-20 bg-white">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Contactez-nous</h2>
            <p className="text-lg text-muted-foreground">
              Notre équipe vous répond dans les 24 heures.
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

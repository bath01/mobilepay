import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-foreground text-white py-14">
      <div className="container">
        <div className="grid md:grid-cols-5 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            {/* Marque : pastille (logo-mark) + nom en blanc (fond sombre) */}
            <div className="flex items-center gap-2.5 font-heading font-bold text-xl mb-4">
              <img src="/logo-mark.png" alt="MobilePay" className="w-9 h-9" />
              <span>MOBILE-<span className="text-primary-400">PAY</span></span>
            </div>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed max-w-xs">
              Votre portefeuille numérique tout-en-un pour une gestion financière simplifiée en Afrique de l'Ouest.
            </p>
            <div className="space-y-1.5 text-sm text-gray-400">
              <p><a href="tel:+2250504921096" className="hover:text-white transition-colors">+225 05 04 92 10 96</a></p>
              <p><a href="mailto:info@mobilepay-ci.com" className="hover:text-white transition-colors">info@mobilepay-ci.com</a></p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Produit</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/merchants" className="hover:text-white transition-colors">Marchands</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Tarifs</Link></li>
              <li><Link to="/international" className="hover:text-white transition-colors">Transferts</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Entreprise</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-white transition-colors">À propos</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><a href="mailto:info@mobilepay-ci.com" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} COMPAGNIE DES SERVICES NUMERIQUES. Tous droits réservés.
          </p>
          <div className="flex gap-5 text-sm">
            {['Twitter', 'LinkedIn', 'Facebook'].map(s => (
              <a key={s} href="#" className="text-gray-400 hover:text-white transition-colors">{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

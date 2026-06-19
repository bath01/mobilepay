import { useEffect, useState } from 'react'

/**
 * Écran de chargement plein écran affiché au démarrage de l'app.
 * Design moderne : logo de marque en pulsation, anneau conique rotatif autour,
 * et barre de progression « shimmer ». Disparaît en fondu une fois la page prête.
 */
export default function Loader() {
  // `hidden` déclenche le fondu de sortie ; `removed` retire le DOM après le fondu.
  const [hidden, setHidden] = useState(false)
  const [removed, setRemoved] = useState(false)

  // Délai minimal d'affichage pour laisser l'animation s'exprimer, puis on masque.
  useEffect(() => {
    const showFor = setTimeout(() => setHidden(true), 1400)
    return () => clearTimeout(showFor)
  }, [])

  // Retrait du DOM une fois le fondu (500ms) terminé.
  useEffect(() => {
    if (!hidden) return
    const fadeOut = setTimeout(() => setRemoved(true), 500)
    return () => clearTimeout(fadeOut)
  }, [hidden])

  if (removed) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${
        hidden ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Halo vert diffus en arrière-plan */}
      <div className="absolute w-72 h-72 rounded-full bg-primary-100 blur-3xl opacity-60" />

      {/* Logo + anneau rotatif */}
      <div className="relative flex items-center justify-center">
        {/* Anneau conique (donut via mask) qui tourne autour du logo */}
        <div
          className="absolute w-32 h-32 rounded-full animate-spin"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0deg, #00D27A 300deg, transparent 360deg)',
            WebkitMask:
              'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3px))',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3px))',
          }}
        />
        {/* Logo de marque en pulsation douce */}
        <img
          src="/logo-mark.png"
          alt="MobilePay"
          className="relative w-20 h-20 animate-pulse-soft"
        />
      </div>

      {/* Nom de marque */}
      <div className="mt-8 font-heading font-bold text-lg tracking-wide text-foreground">
        MOBILE-<span className="text-primary-500">PAY</span>
      </div>

      {/* Barre de progression : se remplit de 0% à 100% jusqu'à la fin du chargement */}
      <div className="mt-4 w-40 h-1 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full w-0 rounded-full bg-primary-500 animate-loader-bar" />
      </div>
    </div>
  )
}

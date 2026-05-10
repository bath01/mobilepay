import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { query } from '../db/index.js'
import { optionalAuth, AuthenticatedRequest } from '../middleware/auth.js'

const router = Router()

// Build chatbot system prompt with FAQ from DB
async function buildSystemPrompt(): Promise<string> {
  const base = `Tu es l'assistant IA de MOBILE-PAY, une solution de paiement numérique africaine.
Tu réponds aux questions des utilisateurs en français de manière concise, amicale et professionnelle.

Informations clés sur MOBILE-PAY :
- Création de compte : Télécharger l'app, s'inscrire avec son numéro de téléphone, vérifier son identité (KYC), définir un code PIN.
- Frais : Transferts locaux 0,5%, internationaux 1,5%, retraits 0,25%, dépôts gratuits.
- Sécurité : Chiffrement AES-256, authentification biométrique, vérification en deux étapes.
- Limites : Niveau 1 : 500 000 FCFA/jour, Niveau 2 : 2 000 000 FCFA/jour, Niveau 3 : 5 000 000 FCFA/jour.
- Support : +225 05 04 92 10 96, info@mobilepay-ci.com, disponible 24/7.
- Fonctionnalités : Paiement QR code, transferts locaux/internationaux, gestion salaires, vente crédit téléphonique, cartes prépayées VISA/Mastercard.
- Pays couverts : Côte d'Ivoire, Sénégal, Mali, Burkina Faso, Guinée, et en expansion.`

  try {
    const faqResult = await query(
      `SELECT question, answer, category FROM faq_entries WHERE is_published = 'yes' ORDER BY sort_order, created_at`
    )

    if (faqResult.rows.length > 0) {
      const byCategory = faqResult.rows.reduce((acc: any, item: any) => {
        const cat = item.category || 'Général'
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(item)
        return acc
      }, {})

      const faqSection = Object.entries(byCategory)
        .map(([cat, items]: any) => {
          const qas = items.map((i: any) => `  Q: ${i.question}\n  R: ${i.answer}`).join('\n\n')
          return `### ${cat}\n${qas}`
        })
        .join('\n\n')

      return `${base}\n\n---\n\nBase de connaissances FAQ (${faqResult.rows.length} questions) :\n\n${faqSection}\n\n---\n\nInstructions : Utilise en priorité la base FAQ. Garde tes réponses courtes (2-4 phrases max) et précises.`
    }
  } catch (err) {
    console.warn('[Chatbot] Could not load FAQ from DB:', err)
  }

  return `${base}\n\nGarde tes réponses courtes (2-4 phrases maximum) et précises.`
}

async function callAI(messages: Array<{ role: string; content: string }>): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return 'Je suis désolé, le service IA n\'est pas disponible pour le moment. Contactez-nous au +225 05 04 92 10 96.'
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: messages[0]?.role === 'system' ? messages[0].content : undefined,
      messages: messages.filter(m => m.role !== 'system').map(m => ({
        role: m.role,
        content: m.content,
      })),
    }),
  })

  if (!response.ok) {
    throw new Error(`AI API error: ${response.status}`)
  }

  const data = await response.json() as any
  return data.content?.[0]?.text || 'Je suis désolé, je n\'ai pas pu traiter votre demande.'
}

// POST /api/chatbot/message
router.post('/message', optionalAuth as any, async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      message: z.string().min(1).max(1000),
      sessionToken: z.string().min(1).max(128),
    })
    const { message, sessionToken } = schema.parse(req.body)
    const authReq = req as AuthenticatedRequest

    // Get or create session
    let sessionResult = await query(
      'SELECT id FROM chat_sessions WHERE session_token = $1',
      [sessionToken]
    )

    let sessionId: number
    if (sessionResult.rows.length === 0) {
      const newSession = await query(
        'INSERT INTO chat_sessions (session_token, user_id) VALUES ($1, $2) RETURNING id',
        [sessionToken, authReq.user?.id || null]
      )
      sessionId = newSession.rows[0].id
    } else {
      sessionId = sessionResult.rows[0].id
    }

    // Get history
    const historyResult = await query(
      `SELECT role, content FROM chat_messages WHERE session_id = $1 ORDER BY created_at LIMIT 50`,
      [sessionId]
    )

    // Build prompt
    const systemPrompt = await buildSystemPrompt()
    const messages = [
      { role: 'system', content: systemPrompt },
      ...historyResult.rows.map((m: any) => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
    ]

    // Save user message
    await query(
      'INSERT INTO chat_messages (session_id, role, content) VALUES ($1, $2, $3)',
      [sessionId, 'user', message]
    )

    // Call AI
    const reply = await callAI(messages)

    // Save AI response
    await query(
      'INSERT INTO chat_messages (session_id, role, content) VALUES ($1, $2, $3)',
      [sessionId, 'assistant', reply]
    )

    res.json({ reply, sessionId })
  } catch (error: any) {
    if (error?.issues) return res.status(400).json({ error: 'Données invalides' })
    console.error('[Chatbot] Error:', error)
    res.status(500).json({ error: 'Erreur du chatbot' })
  }
})

// GET /api/chatbot/history/:sessionToken
router.get('/history/:sessionToken', async (req: Request, res: Response) => {
  try {
    const sessionToken = req.params.sessionToken
    
    const sessionResult = await query(
      'SELECT id FROM chat_sessions WHERE session_token = $1',
      [sessionToken]
    )

    if (sessionResult.rows.length === 0) {
      return res.json({ messages: [] })
    }

    const sessionId = sessionResult.rows[0].id
    const messages = await query(
      `SELECT id, role, content, created_at FROM chat_messages WHERE session_id = $1 ORDER BY created_at`,
      [sessionId]
    )

    res.json({ messages: messages.rows })
  } catch (error) {
    console.error('[Chatbot] History error:', error)
    res.status(500).json({ error: 'Erreur lors du chargement' })
  }
})

// DELETE /api/chatbot/history/:sessionToken
router.delete('/history/:sessionToken', async (req: Request, res: Response) => {
  try {
    const sessionResult = await query(
      'SELECT id FROM chat_sessions WHERE session_token = $1',
      [req.params.sessionToken]
    )
    if (sessionResult.rows.length > 0) {
      await query('DELETE FROM chat_messages WHERE session_id = $1', [sessionResult.rows[0].id])
    }
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' })
  }
})

export default router

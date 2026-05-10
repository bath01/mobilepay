import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { query } from '../db/index.js'

const router = Router()

const contactSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email(),
  subject: z.string().max(500).optional(),
  message: z.string().min(10).max(5000),
})

// POST /api/contact
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = contactSchema.parse(req.body)

    await query(
      `INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4)`,
      [data.name, data.email, data.subject || null, data.message]
    )

    res.status(201).json({ success: true })
  } catch (error: any) {
    if (error?.issues) {
      return res.status(400).json({ error: error.issues[0]?.message || 'Données invalides' })
    }
    console.error('[Contact] Error:', error)
    res.status(500).json({ error: 'Erreur lors de l\'envoi' })
  }
})

export default router

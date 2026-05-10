import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { query } from '../db/index.js'

const router = Router()

const merchantSchema = z.object({
  businessName: z.string().min(2).max(200),
  contactName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(8).max(20),
  businessType: z.string().min(2).max(100),
  city: z.string().min(2).max(100),
  message: z.string().max(1000).optional(),
})

// POST /api/merchants/contact - Submit merchant request
router.post('/contact', async (req: Request, res: Response) => {
  try {
    const data = merchantSchema.parse(req.body)

    const result = await query(
      `INSERT INTO merchant_requests 
        (business_name, contact_name, email, phone, business_type, city, message, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
       RETURNING id, created_at`,
      [
        data.businessName,
        data.contactName,
        data.email,
        data.phone,
        data.businessType,
        data.city,
        data.message || null,
      ]
    )

    res.status(201).json({ success: true, requestId: result.rows[0].id })
  } catch (error: any) {
    if (error?.issues) {
      return res.status(400).json({ error: error.issues[0]?.message || 'Données invalides' })
    }
    console.error('[Merchants] Contact error:', error)
    res.status(500).json({ error: 'Erreur lors de l\'envoi de la demande' })
  }
})

export default router

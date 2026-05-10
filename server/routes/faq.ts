import { Router, Request, Response } from 'express'
import { query } from '../db/index.js'

const router = Router()

// GET /api/faq - Public: list published FAQ entries
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT id, slug, question, answer, category, sort_order 
       FROM faq_entries 
       WHERE is_published = 'yes' 
       ORDER BY sort_order ASC, created_at ASC`
    )
    res.json({ faq: result.rows })
  } catch (error) {
    console.error('[FAQ] List error:', error)
    res.status(500).json({ error: 'Erreur lors du chargement des FAQ' })
  }
})

export default router

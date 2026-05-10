import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { query } from '../db/index.js'
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth.js'

const router = Router()

// All admin routes require admin role
router.use(requireAdmin as any)

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const [sessions, messages, users, merchants, faq] = await Promise.all([
      query('SELECT COUNT(*) as count FROM chat_sessions'),
      query('SELECT COUNT(*) as count FROM chat_messages'),
      query('SELECT COUNT(*) as count FROM users'),
      query("SELECT COUNT(*) as count FROM merchant_requests WHERE status = 'pending'"),
      query('SELECT COUNT(*) as count FROM faq_entries'),
    ])

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const recentSessions = await query(
      'SELECT COUNT(*) as count FROM chat_sessions WHERE created_at > $1',
      [sevenDaysAgo]
    )

    res.json({
      totalSessions: parseInt(sessions.rows[0]?.count || '0'),
      totalMessages: parseInt(messages.rows[0]?.count || '0'),
      totalUsers: parseInt(users.rows[0]?.count || '0'),
      pendingMerchants: parseInt(merchants.rows[0]?.count || '0'),
      totalFaq: parseInt(faq.rows[0]?.count || '0'),
      recentSessions: parseInt(recentSessions.rows[0]?.count || '0'),
    })
  } catch (error) {
    console.error('[Admin] Stats error:', error)
    res.status(500).json({ error: 'Erreur lors du chargement des statistiques' })
  }
})

// ─── FAQ Management ───────────────────────────────────────────────────────────

router.get('/faq', async (_req: Request, res: Response) => {
  const result = await query('SELECT * FROM faq_entries ORDER BY sort_order, created_at')
  res.json({ faq: result.rows })
})

router.post('/faq', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      question: z.string().min(5).max(500),
      answer: z.string().min(10).max(5000),
      category: z.string().min(1).max(64).default('Général'),
      sortOrder: z.number().int().min(0).default(0),
      isPublished: z.enum(['yes', 'no']).default('yes'),
    })
    const data = schema.parse(req.body)
    const slug = `faq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    const result = await query(
      `INSERT INTO faq_entries (slug, question, answer, category, sort_order, is_published)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [slug, data.question, data.answer, data.category, data.sortOrder, data.isPublished]
    )
    res.status(201).json({ faq: result.rows[0] })
  } catch (error: any) {
    if (error?.issues) return res.status(400).json({ error: 'Données invalides' })
    res.status(500).json({ error: 'Erreur lors de la création' })
  }
})

router.put('/faq/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    const schema = z.object({
      question: z.string().min(5).max(500).optional(),
      answer: z.string().min(10).max(5000).optional(),
      category: z.string().min(1).max(64).optional(),
      sortOrder: z.number().int().min(0).optional(),
      isPublished: z.enum(['yes', 'no']).optional(),
    })
    const data = schema.parse(req.body)

    const fields = Object.entries({
      question: data.question,
      answer: data.answer,
      category: data.category,
      sort_order: data.sortOrder,
      is_published: data.isPublished,
    }).filter(([, v]) => v !== undefined)

    if (fields.length === 0) return res.status(400).json({ error: 'Aucune donnée à mettre à jour' })

    const setClause = fields.map(([k], i) => `${k} = $${i + 2}`).join(', ')
    const values = [id, ...fields.map(([, v]) => v)]

    const result = await query(
      `UPDATE faq_entries SET ${setClause} WHERE id = $1 RETURNING *`,
      values
    )
    res.json({ faq: result.rows[0] })
  } catch (error: any) {
    if (error?.issues) return res.status(400).json({ error: 'Données invalides' })
    res.status(500).json({ error: 'Erreur lors de la mise à jour' })
  }
})

router.delete('/faq/:id', async (req: Request, res: Response) => {
  try {
    await query('DELETE FROM faq_entries WHERE id = $1', [parseInt(req.params.id)])
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Erreur lors de la suppression' })
  }
})

// ─── Merchant Requests Management ────────────────────────────────────────────

router.get('/merchants', async (req: Request, res: Response) => {
  try {
    const { status, page = '1', limit = '20' } = req.query
    const pageNum = parseInt(page as string)
    const limitNum = Math.min(parseInt(limit as string), 100)
    const offset = (pageNum - 1) * limitNum

    let sql = 'SELECT * FROM merchant_requests'
    let countSql = 'SELECT COUNT(*) as count FROM merchant_requests'
    const params: any[] = []

    if (status && ['pending', 'contacted', 'approved', 'rejected'].includes(status as string)) {
      sql += ' WHERE status = $1'
      countSql += ' WHERE status = $1'
      params.push(status)
    }

    sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limitNum, offset)

    const [rows, countResult] = await Promise.all([
      query(sql, params),
      query(countSql, status ? [status] : []),
    ])

    res.json({
      requests: rows.rows,
      total: parseInt(countResult.rows[0]?.count || '0'),
      page: pageNum,
      limit: limitNum,
    })
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du chargement' })
  }
})

router.patch('/merchants/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    const schema = z.object({
      status: z.enum(['pending', 'contacted', 'approved', 'rejected']).optional(),
      adminNotes: z.string().max(2000).optional(),
    })
    const data = schema.parse(req.body)

    const result = await query(
      `UPDATE merchant_requests SET 
        status = COALESCE($2, status),
        admin_notes = COALESCE($3, admin_notes)
       WHERE id = $1 RETURNING *`,
      [id, data.status || null, data.adminNotes || null]
    )
    res.json({ request: result.rows[0] })
  } catch {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' })
  }
})

router.delete('/merchants/:id', async (req: Request, res: Response) => {
  try {
    await query('DELETE FROM merchant_requests WHERE id = $1', [parseInt(req.params.id)])
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Erreur lors de la suppression' })
  }
})

// ─── Chat Sessions ────────────────────────────────────────────────────────────

router.get('/chat-sessions', async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '20' } = req.query
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string)

    const sessions = await query(
      `SELECT cs.*, 
        (SELECT COUNT(*) FROM chat_messages WHERE session_id = cs.id) as message_count,
        (SELECT content FROM chat_messages WHERE session_id = cs.id ORDER BY created_at DESC LIMIT 1) as last_message
       FROM chat_sessions cs
       ORDER BY cs.updated_at DESC
       LIMIT $1 OFFSET $2`,
      [parseInt(limit as string), offset]
    )

    const total = await query('SELECT COUNT(*) as count FROM chat_sessions')

    res.json({ sessions: sessions.rows, total: parseInt(total.rows[0]?.count || '0') })
  } catch {
    res.status(500).json({ error: 'Erreur lors du chargement des sessions' })
  }
})

router.get('/chat-sessions/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    const [sessionResult, messagesResult] = await Promise.all([
      query('SELECT * FROM chat_sessions WHERE id = $1', [id]),
      query('SELECT * FROM chat_messages WHERE session_id = $1 ORDER BY created_at', [id]),
    ])
    if (sessionResult.rows.length === 0) return res.status(404).json({ error: 'Session introuvable' })
    res.json({ session: sessionResult.rows[0], messages: messagesResult.rows })
  } catch {
    res.status(500).json({ error: 'Erreur lors du chargement' })
  }
})

router.delete('/chat-sessions/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    await query('DELETE FROM chat_messages WHERE session_id = $1', [id])
    await query('DELETE FROM chat_sessions WHERE id = $1', [id])
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Erreur lors de la suppression' })
  }
})

export default router

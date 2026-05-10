import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { query } from '../db/index.js'
import { authenticate, AuthenticatedRequest } from '../middleware/auth.js'

const router = Router()

const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Mot de passe trop court (8 caractères minimum)'),
  name: z.string().min(2, 'Nom trop court').max(200),
  phone: z.string().min(8).max(20).optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

function generateToken(userId: number) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: '7d',
  })
}

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body)

    // Check if user already exists
    const existing = await query('SELECT id FROM users WHERE email = $1', [data.email])
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Un compte avec cet email existe déjà' })
    }

    const passwordHash = await bcrypt.hash(data.password, 12)

    const result = await query(
      `INSERT INTO users (email, password_hash, name, phone) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, name, role, created_at`,
      [data.email, passwordHash, data.name, data.phone || null]
    )

    const user = result.rows[0]
    const token = generateToken(user.id)

    return res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    })
  } catch (error: any) {
    if (error?.issues) {
      return res.status(400).json({ error: error.issues[0]?.message || 'Données invalides' })
    }
    console.error('[Auth] Register error:', error)
    return res.status(500).json({ error: 'Erreur lors de la création du compte' })
  }
})

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body)

    const result = await query(
      'SELECT id, email, password_hash, name, role FROM users WHERE email = $1',
      [data.email]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
    }

    const user = result.rows[0]
    const validPassword = await bcrypt.compare(data.password, user.password_hash)

    if (!validPassword) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
    }

    await query('UPDATE users SET last_signed_in = NOW() WHERE id = $1', [user.id])

    const token = generateToken(user.id)

    return res.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    })
  } catch (error: any) {
    if (error?.issues) {
      return res.status(400).json({ error: 'Données invalides' })
    }
    console.error('[Auth] Login error:', error)
    return res.status(500).json({ error: 'Erreur de connexion' })
  }
})

// GET /api/auth/me
router.get('/me', authenticate as any, async (req: AuthenticatedRequest, res: Response) => {
  res.json({ user: req.user })
})

// POST /api/auth/logout
router.post('/logout', (_req: Request, res: Response) => {
  res.json({ success: true })
})

export default router

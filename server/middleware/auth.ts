import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { query } from '../db/index.js'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number
    email: string
    name: string | null
    role: string
  }
}

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token =
    req.headers.authorization?.split(' ')[1] ||
    (req.session as any)?.token

  if (!token) {
    return res.status(401).json({ error: 'Non authentifié' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as any
    const result = await query('SELECT id, email, name, role FROM users WHERE id = $1', [decoded.id])
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Utilisateur introuvable' })
    }
    
    req.user = result.rows[0]
    next()
  } catch {
    return res.status(401).json({ error: 'Token invalide' })
  }
}

export async function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  await authenticate(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Accès admin requis' })
    }
    next()
  })
}

export function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) {
  const token =
    req.headers.authorization?.split(' ')[1] ||
    (req.session as any)?.token

  if (!token) return next()

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as any
    query('SELECT id, email, name, role FROM users WHERE id = $1', [decoded.id])
      .then(result => {
        if (result.rows.length > 0) req.user = result.rows[0]
        next()
      })
      .catch(() => next())
  } catch {
    next()
  }
}

// lib/auth.js - JWT utilities
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key'
const JWT_EXPIRES_IN = '7d'
const REFRESH_TOKEN_EXPIRES_IN = '30d'

export function generateToken(userId, role) {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

export function generateRefreshToken(userId) {
  return jwt.sign(
    { userId, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  )
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export function requireAuth(handler) {
  return async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ error: 'غير مصرح - يجب تسجيل الدخول' })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return res.status(401).json({ error: 'رمز غير صالح أو منتهي الصلاحية' })
    }

    req.user = decoded
    return handler(req, res)
  }
}

export function requireAdmin(handler) {
  return requireAuth(async (req, res) => {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'غير مصرح - صلاحيات المسؤول مطلوبة' })
    }
    return handler(req, res)
  })
}

// pages/api/auth/login.js
import bcrypt from 'bcryptjs'
import { prisma } from '../../../lib/prisma'
import { generateToken, generateRefreshToken } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ error: 'الحساب معطل. يرجى التواصل مع الدعم' })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' })
    }

    // Generate tokens
    const token = generateToken(user.id, user.role)
    const refreshToken = generateRefreshToken(user.id)

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        entity: 'User',
        entityId: user.id,
        details: JSON.stringify({ email: user.email }),
        ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      }
    })

    res.status(200).json({
      message: 'تم تسجيل الدخول بنجاح',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token,
      refreshToken
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'خطأ في تسجيل الدخول' })
  }
}

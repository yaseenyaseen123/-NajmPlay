// pages/api/auth/register.js
import bcrypt from 'bcryptjs'
import { prisma } from '../../../lib/prisma'
import { generateToken, generateRefreshToken } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password, name, phone } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' })
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ error: 'المستخدم موجود بالفعل' })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        phone,
        role: 'USER',
        isActive: true
      }
    })

    // Generate tokens
    const token = generateToken(user.id, user.role)
    const refreshToken = generateRefreshToken(user.id)

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'REGISTER',
        entity: 'User',
        entityId: user.id,
        details: JSON.stringify({ email: user.email }),
        ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      }
    })

    res.status(201).json({
      message: 'تم إنشاء الحساب بنجاح',
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
    console.error('Registration error:', error)
    res.status(500).json({ error: 'خطأ في إنشاء الحساب' })
  }
}

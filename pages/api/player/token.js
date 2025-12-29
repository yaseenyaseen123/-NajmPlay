// pages/api/player/token.js
import crypto from 'crypto'
import { requireAuth } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'

/**
 * Player Token Endpoint
 * 
 * يولد signed URL أو token للمشغل للوصول إلى المحتوى المحمي
 * يتحقق من صلاحية اشتراك المستخدم قبل منح الوصول
 */

async function getPlayerToken(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { content_id, episode_id, channel_id } = req.query
    const userId = req.user.userId

    // التحقق من وجود اشتراك نشط
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: ['TRIAL', 'ACTIVE'] },
        OR: [
          { endDate: { gte: new Date() } },
          { endDate: null }
        ]
      },
      include: {
        plan: true
      }
    })

    if (!activeSubscription) {
      return res.status(403).json({ 
        error: 'لا يوجد اشتراك نشط',
        requireSubscription: true 
      })
    }

    // التحقق من فترة التجربة
    if (activeSubscription.isTrial && activeSubscription.trialEndDate) {
      if (new Date() > new Date(activeSubscription.trialEndDate)) {
        await prisma.subscription.update({
          where: { id: activeSubscription.id },
          data: { status: 'EXPIRED' }
        })
        
        return res.status(403).json({ 
          error: 'انتهت فترة التجربة المجانية',
          requireSubscription: true 
        })
      }
    }

    // التحقق من عدد الأجهزة المتصلة
    const deviceCount = await prisma.device.count({
      where: {
        userId,
        isActive: true
      }
    })

    if (deviceCount >= activeSubscription.plan.maxDevices) {
      // TODO: يمكن إضافة منطق لإدارة الأجهزة
      console.warn(`User ${userId} exceeded device limit`)
    }

    // الحصول على URL المحتوى
    let videoUrl = null
    let contentType = null

    if (content_id) {
      const content = await prisma.content.findUnique({
        where: { id: content_id }
      })
      
      if (!content || !content.isActive) {
        return res.status(404).json({ error: 'المحتوى غير موجود' })
      }

      videoUrl = content.videoUrl
      contentType = 'movie'

      // تحديث عداد المشاهدات
      await prisma.content.update({
        where: { id: content_id },
        data: { viewCount: { increment: 1 } }
      })
    } else if (episode_id) {
      const episode = await prisma.episode.findUnique({
        where: { id: episode_id }
      })
      
      if (!episode) {
        return res.status(404).json({ error: 'الحلقة غير موجودة' })
      }

      videoUrl = episode.videoUrl
      contentType = 'episode'

      await prisma.episode.update({
        where: { id: episode_id },
        data: { viewCount: { increment: 1 } }
      })
    } else if (channel_id) {
      const channel = await prisma.channel.findUnique({
        where: { id: channel_id }
      })
      
      if (!channel || !channel.isActive) {
        return res.status(404).json({ error: 'القناة غير موجودة' })
      }

      videoUrl = channel.streamUrl
      contentType = 'live'

      await prisma.channel.update({
        where: { id: channel_id },
        data: { viewCount: { increment: 1 } }
      })
    } else {
      return res.status(400).json({ error: 'يجب تحديد content_id أو episode_id أو channel_id' })
    }

    if (!videoUrl) {
      return res.status(404).json({ error: 'رابط الفيديو غير متوفر' })
    }

    // توليد signed token
    const token = generateSignedToken(userId, videoUrl, contentType)

    // تسجيل النشاط
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'VIDEO_ACCESS',
        entity: contentType,
        entityId: content_id || episode_id || channel_id,
        details: JSON.stringify({ 
          contentType,
          subscriptionId: activeSubscription.id 
        }),
        ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      }
    })

    res.status(200).json({
      success: true,
      token: token.token,
      signedUrl: token.signedUrl,
      expiresAt: token.expiresAt,
      contentType
    })
  } catch (error) {
    console.error('Player token error:', error)
    res.status(500).json({ error: 'خطأ في توليد رمز المشغل' })
  }
}

/**
 * توليد signed token للفيديو
 * يستخدم HMAC لحماية الرابط من الوصول غير المصرح به
 */
function generateSignedToken(userId, videoUrl, contentType) {
  const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key'
  const expiresIn = 4 * 60 * 60 * 1000 // 4 hours in milliseconds
  const expiresAt = new Date(Date.now() + expiresIn)

  // إنشاء payload
  const payload = {
    userId,
    videoUrl,
    contentType,
    exp: Math.floor(expiresAt.getTime() / 1000)
  }

  // توليد HMAC signature
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex')

  // إنشاء token
  const token = Buffer.from(JSON.stringify(payload)).toString('base64')

  // إنشاء signed URL
  const signedUrl = `${videoUrl}?token=${token}&signature=${signature}`

  return {
    token,
    signature,
    signedUrl,
    expiresAt: expiresAt.toISOString()
  }
}

/**
 * دالة للتحقق من صحة signed token
 * يمكن استخدامها في middleware للمشغل
 */
export function verifySignedToken(token, signature) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key'
    
    // فك تشفير payload
    const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'))

    // التحقق من الصلاحية
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false, error: 'Token expired' }
    }

    // التحقق من التوقيع
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(JSON.stringify(payload))
      .digest('hex')

    if (signature !== expectedSignature) {
      return { valid: false, error: 'Invalid signature' }
    }

    return { valid: true, payload }
  } catch (error) {
    return { valid: false, error: error.message }
  }
}

export default requireAuth(getPlayerToken)

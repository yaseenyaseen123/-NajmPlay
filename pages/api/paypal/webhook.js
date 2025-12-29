// pages/api/paypal/webhook.js
import { prisma } from '../../../lib/prisma'

/**
 * PayPal Webhook Handler
 * 
 * هذا الـ endpoint يستقبل إشعارات PayPal للأحداث المختلفة
 * مثل إنشاء اشتراك، دفع ناجح، إلغاء اشتراك، إلخ.
 * 
 * للتحقق من صحة webhook، يجب استخدام PayPal SDK:
 * https://developer.paypal.com/docs/api/webhooks/v1/#verify-webhook-signature
 * 
 * TODO: إضافة التحقق من توقيع PayPal للأمان
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const event = req.body
    const eventType = event.event_type

    console.log('PayPal Webhook received:', eventType)

    // TODO: تحقق من توقيع PayPal webhook
    // const isValid = await verifyPayPalWebhookSignature(req)
    // if (!isValid) {
    //   return res.status(401).json({ error: 'Invalid webhook signature' })
    // }

    // معالجة الأحداث المختلفة
    switch (eventType) {
      case 'BILLING.SUBSCRIPTION.CREATED':
        await handleSubscriptionCreated(event)
        break

      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        await handleSubscriptionActivated(event)
        break

      case 'PAYMENT.SALE.COMPLETED':
        await handlePaymentCompleted(event)
        break

      case 'BILLING.SUBSCRIPTION.CANCELLED':
        await handleSubscriptionCancelled(event)
        break

      case 'BILLING.SUBSCRIPTION.SUSPENDED':
        await handleSubscriptionSuspended(event)
        break

      case 'BILLING.SUBSCRIPTION.EXPIRED':
        await handleSubscriptionExpired(event)
        break

      case 'PAYMENT.SALE.REFUNDED':
        await handlePaymentRefunded(event)
        break

      default:
        console.log('Unhandled event type:', eventType)
    }

    // دائماً أرجع 200 OK لـ PayPal
    res.status(200).json({ received: true })
  } catch (error) {
    console.error('PayPal webhook error:', error)
    // حتى في حالة الخطأ، أرجع 200 لتجنب إعادة محاولة PayPal
    res.status(200).json({ received: true, error: error.message })
  }
}

async function handleSubscriptionCreated(event) {
  const subscription = event.resource
  const paypalSubscriptionId = subscription.id
  
  // TODO: ربط الاشتراك بالمستخدم عبر custom_id أو metadata
  console.log('Subscription created:', paypalSubscriptionId)
  
  // مثال: تحديث قاعدة البيانات
  // await prisma.subscription.create({
  //   data: {
  //     userId: ...,
  //     planId: ...,
  //     paypalSubscriptionId,
  //     status: 'TRIAL',
  //     ...
  //   }
  // })
}

async function handleSubscriptionActivated(event) {
  const subscription = event.resource
  const paypalSubscriptionId = subscription.id

  await prisma.subscription.updateMany({
    where: { paypalSubscriptionId },
    data: { 
      status: 'ACTIVE',
      isTrial: false
    }
  })

  console.log('Subscription activated:', paypalSubscriptionId)
}

async function handlePaymentCompleted(event) {
  const sale = event.resource
  const paypalPaymentId = sale.id
  const amount = parseFloat(sale.amount.total)

  // TODO: استخرج معلومات الاشتراك والمستخدم
  // يمكن استخدام sale.billing_agreement_id للربط

  await prisma.payment.create({
    data: {
      userId: '...', // TODO: استخراج من metadata
      paypalPaymentId,
      amount,
      currency: sale.amount.currency,
      status: 'COMPLETED',
      paymentMethod: 'paypal',
      description: 'PayPal subscription payment',
      metadata: JSON.stringify(sale)
    }
  })

  console.log('Payment completed:', paypalPaymentId, amount)
}

async function handleSubscriptionCancelled(event) {
  const subscription = event.resource
  const paypalSubscriptionId = subscription.id

  await prisma.subscription.updateMany({
    where: { paypalSubscriptionId },
    data: { 
      status: 'CANCELLED',
      cancelledAt: new Date(),
      autoRenew: false
    }
  })

  console.log('Subscription cancelled:', paypalSubscriptionId)
}

async function handleSubscriptionSuspended(event) {
  const subscription = event.resource
  const paypalSubscriptionId = subscription.id

  await prisma.subscription.updateMany({
    where: { paypalSubscriptionId },
    data: { 
      status: 'PAYMENT_FAILED'
    }
  })

  console.log('Subscription suspended:', paypalSubscriptionId)
}

async function handleSubscriptionExpired(event) {
  const subscription = event.resource
  const paypalSubscriptionId = subscription.id

  await prisma.subscription.updateMany({
    where: { paypalSubscriptionId },
    data: { 
      status: 'EXPIRED'
    }
  })

  console.log('Subscription expired:', paypalSubscriptionId)
}

async function handlePaymentRefunded(event) {
  const refund = event.resource
  const paypalPaymentId = refund.sale_id

  await prisma.payment.updateMany({
    where: { paypalPaymentId },
    data: { 
      status: 'REFUNDED'
    }
  })

  console.log('Payment refunded:', paypalPaymentId)
}

/**
 * دالة للتحقق من توقيع PayPal webhook
 * يجب تنفيذها باستخدام PayPal SDK
 */
async function verifyPayPalWebhookSignature(req) {
  // TODO: تنفيذ التحقق باستخدام PayPal SDK
  // const headers = req.headers
  // const body = req.body
  // 
  // استخدم:
  // - PAYPAL_WEBHOOK_ID من إعدادات PayPal
  // - PayPal SDK للتحقق
  // 
  // مثال:
  // const isValid = await paypal.notification.webhookEvent.verify(
  //   headers,
  //   body,
  //   process.env.PAYPAL_WEBHOOK_ID
  // )
  
  return true // مؤقت - يجب تغييره
}

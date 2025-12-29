// pages/api/whatsapp/send.js
import axios from 'axios'
import { requireAdmin } from '../../../lib/auth'

/**
 * WhatsApp Send Message API
 * 
 * يستخدم هذا الـ endpoint لإرسال رسائل WhatsApp عبر WhatsApp Business API
 * أو مزود وسيط مثل Twilio, MessageBird, أو غيرها
 * 
 * يجب تكوين WHATSAPP_API_URL و WHATSAPP_API_KEY في .env
 */

// Message Templates (قوالب الرسائل بالعربية)
export const MESSAGE_TEMPLATES = {
  WELCOME: (name) => `مرحباً ${name} 👋\n\nشكراً لتسجيلك في NajmPlay!\n\nاستمتع بتجربتك المجانية لمدة 24 ساعة وتصفح آلاف الأفلام والمسلسلات والقنوات الرياضية.\n\nفريق NajmPlay`,
  
  OTP: (code) => `رمز التحقق الخاص بك في NajmPlay هو:\n\n${code}\n\nهذا الرمز صالح لمدة 10 دقائق.\nلا تشارك هذا الرمز مع أي شخص.`,
  
  TRIAL_ENDING: (name, hoursLeft) => `مرحباً ${name},\n\nتجربتك المجانية ستنتهي خلال ${hoursLeft} ساعة.\n\nللاستمرار في الاستمتاع بمحتوى NajmPlay، يرجى تفعيل اشتراكك.\n\nفريق NajmPlay`,
  
  TRIAL_ENDED: (name) => `مرحباً ${name},\n\nانتهت تجربتك المجانية.\n\nللاستمرار في المشاهدة، يرجى الاشتراك من خلال حسابك.\n\nشكراً لك،\nفريق NajmPlay`,
  
  SUBSCRIPTION_ACTIVATED: (name, planName) => `مرحباً ${name} 🎉\n\nتم تفعيل اشتراكك في خطة "${planName}" بنجاح!\n\nيمكنك الآن الاستمتاع بجميع المحتوى المتاح.\n\nفريق NajmPlay`,
  
  PAYMENT_SUCCESS: (name, amount) => `مرحباً ${name},\n\nتم استلام دفعتك بقيمة $${amount} بنجاح.\n\nشكراً لك على ثقتك في NajmPlay!\n\nفريق NajmPlay`,
  
  PAYMENT_FAILED: (name) => `مرحباً ${name},\n\nلم نتمكن من معالجة دفعتك.\n\nيرجى تحديث معلومات الدفع الخاصة بك لتجنب انقطاع الخدمة.\n\nفريق NajmPlay`,
  
  SUBSCRIPTION_RENEWED: (name, nextBillingDate) => `مرحباً ${name},\n\nتم تجديد اشتراكك بنجاح!\n\nتاريخ الدفع القادم: ${nextBillingDate}\n\nفريق NajmPlay`,
  
  SUPPORT_RESPONSE: (name, message) => `مرحباً ${name},\n\n${message}\n\nإذا كان لديك أي استفسارات أخرى، لا تتردد في التواصل معنا.\n\nفريق دعم NajmPlay`
}

async function sendWhatsAppMessage(req, res) {
  try {
    const { to, message, templateType, templateData } = req.body

    // Validation
    if (!to) {
      return res.status(400).json({ error: 'رقم الهاتف مطلوب' })
    }

    // Get message content
    let messageContent = message
    
    if (templateType && MESSAGE_TEMPLATES[templateType]) {
      messageContent = MESSAGE_TEMPLATES[templateType](...(templateData || []))
    }

    if (!messageContent) {
      return res.status(400).json({ error: 'محتوى الرسالة مطلوب' })
    }

    // Send via WhatsApp API
    const result = await sendViaWhatsAppAPI(to, messageContent)

    res.status(200).json({
      success: true,
      message: 'تم إرسال الرسالة بنجاح',
      messageId: result.messageId
    })
  } catch (error) {
    console.error('WhatsApp send error:', error)
    res.status(500).json({ 
      error: 'فشل إرسال الرسالة',
      details: error.message 
    })
  }
}

/**
 * إرسال رسالة عبر WhatsApp API
 * يجب تكييف هذه الدالة حسب المزود المستخدم
 */
async function sendViaWhatsAppAPI(phoneNumber, message) {
  const apiUrl = process.env.WHATSAPP_API_URL
  const apiKey = process.env.WHATSAPP_API_KEY

  if (!apiUrl || !apiKey) {
    throw new Error('WHATSAPP_API_URL أو WHATSAPP_API_KEY غير مكونة')
  }

  // مثال عام - يجب تعديله حسب API المستخدم
  // مثال لـ Twilio:
  // const response = await axios.post(
  //   `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`,
  //   {
  //     From: `whatsapp:${FROM_NUMBER}`,
  //     To: `whatsapp:${phoneNumber}`,
  //     Body: message
  //   },
  //   {
  //     auth: {
  //       username: ACCOUNT_SID,
  //       password: AUTH_TOKEN
  //     }
  //   }
  // )

  // مثال عام:
  try {
    const response = await axios.post(
      apiUrl,
      {
        phone: phoneNumber,
        message: message
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    return {
      success: true,
      messageId: response.data.id || response.data.message_id
    }
  } catch (error) {
    console.error('WhatsApp API error:', error.response?.data || error.message)
    throw error
  }
}

// حماية الـ endpoint - فقط للمسؤولين أو النظام
export default requireAdmin(sendWhatsAppMessage)

// يمكن تصدير دالة مساعدة للاستخدام في أماكن أخرى
export async function sendWhatsAppNotification(phoneNumber, templateType, ...templateData) {
  if (!MESSAGE_TEMPLATES[templateType]) {
    throw new Error(`Template type ${templateType} not found`)
  }

  const message = MESSAGE_TEMPLATES[templateType](...templateData)
  return sendViaWhatsAppAPI(phoneNumber, message)
}

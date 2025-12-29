# تعليمات رفع المشروع إلى GitHub يدوياً

نظراً لقيود الصلاحيات في بيئة Codespace، يمكنك رفع المشروع يدوياً بإحدى الطريقتين:

## الطريقة الأولى: استخدام Git على جهازك المحلي

### الخطوة 1: تحميل المشروع من Codespace

```bash
# قم بإنشاء أرشيف مضغوط للمشروع
cd /home/codespace/-NajmPlay
tar -czf ~/najmplay-project.tar.gz .

# أو استخدم zip
zip -r ~/najmplay-project.zip .
```

### الخطوة 2: تحميل الأرشيف إلى جهازك

قم بتحميل الملف `najmplay-project.tar.gz` أو `najmplay-project.zip` من Codespace إلى جهازك.

### الخطوة 3: استخراج الملفات على جهازك

```bash
# إذا كان tar.gz
tar -xzf najmplay-project.tar.gz -C najmplay

# إذا كان zip
unzip najmplay-project.zip -d najmplay
```

### الخطوة 4: رفع إلى GitHub من جهازك

```bash
cd najmplay

# التأكد من أن Git مهيأ
git init
git add .
git commit -m "Initial NajmPlay scaffold"
git branch -M main

# ربط بالمستودع ورفع
git remote add origin https://github.com/yaseenyaseen123/-NajmPlay.git
git push -u origin main
```

إذا طُلب منك بيانات الاعتماد:
- استخدم اسم المستخدم على GitHub: `yaseenyaseen123`
- استخدم Personal Access Token بدلاً من كلمة المرور

### إنشاء Personal Access Token

1. اذهب إلى: https://github.com/settings/tokens
2. اضغط "Generate new token" → "Generate new token (classic)"
3. اختر الصلاحيات:
   - ✅ repo (كامل)
4. انسخ الـ Token واستخدمه كـ password عند الدفع

---

## الطريقة الثانية: استخدام GitHub Web Interface

### الخطوة 1: إنشاء الملفات يدوياً

اذهب إلى: https://github.com/yaseenyaseen123/-NajmPlay

### الخطوة 2: رفع الملفات

يمكنك:
1. استخدام "Add file" → "Upload files" لرفع ملفات متعددة
2. أو استخدام "Add file" → "Create new file" لإنشاء كل ملف على حدة

### الخطوة 3: الالتزام الأول

عند رفع الملفات، استخدم رسالة الالتزام:
```
Initial NajmPlay scaffold
```

---

## الطريقة الثالثة: استخدام GitHub CLI مع Token جديد

إذا كنت لا تزال في Codespace:

```bash
# إنشاء Personal Access Token من:
# https://github.com/settings/tokens

# تسجيل الدخول باستخدام Token
export GH_TOKEN="your_personal_access_token_here"

# أو
gh auth login

# ثم الدفع
git push -u origin main
```

---

## ✅ التحقق من نجاح الرفع

بعد الرفع، تحقق من:

1. جميع الملفات موجودة: https://github.com/yaseenyaseen123/-NajmPlay
2. الالتزام الأول "Initial NajmPlay scaffold"
3. الفرع الرئيسي هو `main`

## 📦 قائمة الملفات المطلوبة (21 ملف)

يجب أن تتضمن:

```
✅ README.md
✅ package.json
✅ .gitignore
✅ .env.example
✅ next.config.js
✅ tailwind.config.js
✅ postcss.config.js
✅ styles/globals.css
✅ pages/_app.js
✅ pages/_document.js
✅ pages/index.js
✅ pages/admin/index.js
✅ pages/api/auth/register.js
✅ pages/api/auth/login.js
✅ pages/api/paypal/webhook.js
✅ pages/api/whatsapp/send.js
✅ pages/api/player/token.js
✅ lib/prisma.js
✅ lib/auth.js
✅ prisma/schema.prisma
✅ prisma/seed.js
```

---

## 🆘 إذا واجهت مشاكل

تواصل معي وسأقدم لك:
- رابط تحميل مباشر لملف ZIP
- تعليمات إضافية
- حل بديل

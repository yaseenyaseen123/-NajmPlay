import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>NajmPlay - منصة IPTV للأفلام والمسلسلات</title>
        <meta name="description" content="منصة NajmPlay لمشاهدة الأفلام والمسلسلات والقنوات الرياضية" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <header className="text-center mb-16">
            <h1 className="text-6xl font-bold text-white mb-4">
              مرحباً بك في NajmPlay
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              منصتك المتكاملة لمشاهدة الأفلام والمسلسلات والقنوات الرياضية
            </p>
          </header>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center hover:bg-white/20 transition">
              <div className="text-5xl mb-4">🎬</div>
              <h3 className="text-2xl font-bold text-white mb-2">أفلام حصرية</h3>
              <p className="text-gray-200">
                آلاف الأفلام بجودة عالية ومحتوى متنوع
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center hover:bg-white/20 transition">
              <div className="text-5xl mb-4">📺</div>
              <h3 className="text-2xl font-bold text-white mb-2">مسلسلات</h3>
              <p className="text-gray-200">
                أحدث المسلسلات العربية والأجنبية
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center hover:bg-white/20 transition">
              <div className="text-5xl mb-4">⚽</div>
              <h3 className="text-2xl font-bold text-white mb-2">قنوات رياضية</h3>
              <p className="text-gray-200">
                مباريات حية بجودة HD وبدون انقطاع
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              جرب مجاناً لمدة 24 ساعة
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              ابدأ تجربتك المجانية الآن بدون الحاجة لبطاقة ائتمان
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a 
                href="/register" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full text-lg transition shadow-lg"
              >
                ابدأ التجربة المجانية
              </a>
              <a 
                href="/login" 
                className="bg-white/20 hover:bg-white/30 text-white font-bold py-4 px-8 rounded-full text-lg transition border-2 border-white/50"
              >
                تسجيل الدخول
              </a>
            </div>
          </div>

          {/* Admin Link */}
          <div className="text-center mt-12">
            <a 
              href="/admin" 
              className="text-gray-300 hover:text-white underline text-sm"
            >
              لوحة التحكم (للمسؤولين)
            </a>
          </div>
        </div>
      </main>
    </>
  )
}

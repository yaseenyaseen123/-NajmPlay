// prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 بدء عملية إدخال البيانات...')

  // 1. إنشاء حساب أدمن افتراضي
  console.log('👤 إنشاء حساب المسؤول...')
  const adminPasswordHash = await bcrypt.hash('P@ssw0rd123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@najmplay.test' },
    update: {},
    create: {
      email: 'admin@najmplay.test',
      passwordHash: adminPasswordHash,
      name: 'مسؤول النظام',
      role: 'ADMIN',
      isActive: true
    }
  })
  console.log('✅ تم إنشاء حساب المسؤول:', admin.email)

  // 2. إنشاء مستخدم تجريبي
  console.log('👥 إنشاء مستخدمين تجريبيين...')
  const userPasswordHash = await bcrypt.hash('User123!', 10)
  
  const testUser = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      passwordHash: userPasswordHash,
      name: 'مستخدم تجريبي',
      phone: '+966501234567',
      role: 'USER',
      isActive: true
    }
  })
  console.log('✅ تم إنشاء مستخدم تجريبي:', testUser.email)

  // 3. إنشاء خطط الاشتراك
  console.log('💳 إنشاء خطط الاشتراك...')
  
  const monthlyPlan = await prisma.plan.upsert({
    where: { id: 'plan-monthly' },
    update: {},
    create: {
      id: 'plan-monthly',
      name: 'Monthly Plan',
      nameAr: 'الخطة الشهرية',
      description: 'Full access to all content for one month',
      descriptionAr: 'وصول كامل لجميع المحتويات لمدة شهر',
      price: 9.99,
      currency: 'USD',
      durationDays: 30,
      maxDevices: 2,
      hasTrialPeriod: true,
      trialDurationDays: 1,
      features: [
        'جميع الأفلام والمسلسلات',
        'القنوات الرياضية المباشرة',
        'جودة HD',
        'دعم على مدار الساعة',
        'مشاهدة على جهازين'
      ],
      isActive: true
    }
  })

  const yearlyPlan = await prisma.plan.upsert({
    where: { id: 'plan-yearly' },
    update: {},
    create: {
      id: 'plan-yearly',
      name: 'Yearly Plan',
      nameAr: 'الخطة السنوية',
      description: 'Full access to all content for one year with 20% discount',
      descriptionAr: 'وصول كامل لجميع المحتويات لمدة سنة مع خصم 20%',
      price: 95.99,
      currency: 'USD',
      durationDays: 365,
      maxDevices: 4,
      hasTrialPeriod: true,
      trialDurationDays: 1,
      features: [
        'جميع الأفلام والمسلسلات',
        'القنوات الرياضية المباشرة',
        'جودة 4K',
        'دعم VIP على مدار الساعة',
        'مشاهدة على 4 أجهزة',
        'تنزيل للمشاهدة دون اتصال',
        'خصم 20%'
      ],
      isActive: true
    }
  })

  console.log('✅ تم إنشاء خطط الاشتراك')

  // 4. إنشاء أفلام تجريبية
  console.log('🎬 إنشاء الأفلام...')
  
  const movies = [
    {
      id: 'movie-1',
      title: 'The Dark Knight',
      titleAr: 'فارس الظلام',
      description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
      descriptionAr: 'عندما يعيث الجوكر فساداً في مدينة جوثام، يجب على باتمان أن يواجه أحد أعظم الاختبارات النفسية والجسدية.',
      type: 'MOVIE',
      genre: ['Action', 'Crime', 'Drama'],
      releaseYear: 2008,
      rating: 9.0,
      duration: 152,
      thumbnailUrl: 'https://example.com/thumbnails/dark-knight.jpg',
      posterUrl: 'https://example.com/posters/dark-knight.jpg',
      trailerUrl: 'https://example.com/trailers/dark-knight.mp4',
      videoUrl: 'https://example.com/videos/dark-knight.m3u8',
      isActive: true,
      isFeatured: true
    },
    {
      id: 'movie-2',
      title: 'Inception',
      titleAr: 'البداية',
      description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.',
      descriptionAr: 'لص يسرق أسرار الشركات من خلال تقنية مشاركة الأحلام يُكلف بمهمة معكوسة لزرع فكرة.',
      type: 'MOVIE',
      genre: ['Action', 'Sci-Fi', 'Thriller'],
      releaseYear: 2010,
      rating: 8.8,
      duration: 148,
      thumbnailUrl: 'https://example.com/thumbnails/inception.jpg',
      posterUrl: 'https://example.com/posters/inception.jpg',
      trailerUrl: 'https://example.com/trailers/inception.mp4',
      videoUrl: 'https://example.com/videos/inception.m3u8',
      isActive: true,
      isFeatured: true
    },
    {
      id: 'movie-3',
      title: 'The Shawshank Redemption',
      titleAr: 'الخلاص من شاوشانك',
      description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
      descriptionAr: 'رجلان مسجونان يرتبطان على مدى سنوات، يجدان العزاء والخلاص في نهاية المطاف من خلال أعمال اللياقة المشتركة.',
      type: 'MOVIE',
      genre: ['Drama'],
      releaseYear: 1994,
      rating: 9.3,
      duration: 142,
      thumbnailUrl: 'https://example.com/thumbnails/shawshank.jpg',
      posterUrl: 'https://example.com/posters/shawshank.jpg',
      trailerUrl: 'https://example.com/trailers/shawshank.mp4',
      videoUrl: 'https://example.com/videos/shawshank.m3u8',
      isActive: true,
      isFeatured: false
    }
  ]

  for (const movie of movies) {
    await prisma.content.upsert({
      where: { id: movie.id },
      update: {},
      create: movie
    })
  }

  console.log(`✅ تم إنشاء ${movies.length} أفلام`)

  // 5. إنشاء مسلسل مع مواسم وحلقات
  console.log('📺 إنشاء المسلسلات...')
  
  const seriesContent = await prisma.content.upsert({
    where: { id: 'series-1' },
    update: {},
    create: {
      id: 'series-1',
      title: 'Breaking Bad',
      titleAr: 'بريكنج باد',
      description: 'A high school chemistry teacher turned methamphetamine producer partners with a former student.',
      descriptionAr: 'أستاذ كيمياء في المدرسة الثانوية يتحول إلى منتج ميثامفيتامين ويشارك مع طالب سابق.',
      type: 'SERIES',
      genre: ['Crime', 'Drama', 'Thriller'],
      releaseYear: 2008,
      rating: 9.5,
      thumbnailUrl: 'https://example.com/thumbnails/breaking-bad.jpg',
      posterUrl: 'https://example.com/posters/breaking-bad.jpg',
      trailerUrl: 'https://example.com/trailers/breaking-bad.mp4',
      isActive: true,
      isFeatured: true
    }
  })

  const series = await prisma.series.upsert({
    where: { id: 'series-1-data' },
    update: {},
    create: {
      id: 'series-1-data',
      contentId: seriesContent.id,
      totalSeasons: 2,
      totalEpisodes: 10
    }
  })

  // الموسم الأول
  const season1 = await prisma.season.upsert({
    where: { 
      seriesId_seasonNumber: { 
        seriesId: series.id, 
        seasonNumber: 1 
      } 
    },
    update: {},
    create: {
      seriesId: series.id,
      seasonNumber: 1,
      title: 'Season 1',
      titleAr: 'الموسم الأول',
      description: 'Walter White, a struggling high school chemistry teacher, is diagnosed with lung cancer.',
      descriptionAr: 'والتر وايت، أستاذ كيمياء في المدرسة الثانوية، يُشخص بسرطان الرئة.',
      posterUrl: 'https://example.com/posters/breaking-bad-s1.jpg',
      releaseYear: 2008
    }
  })

  // حلقات الموسم الأول
  const season1Episodes = [
    { number: 1, title: 'Pilot', titleAr: 'الحلقة التجريبية', duration: 58 },
    { number: 2, title: 'Cat\'s in the Bag...', titleAr: 'القطة في الحقيبة', duration: 48 },
    { number: 3, title: '...And the Bag\'s in the River', titleAr: 'والحقيبة في النهر', duration: 48 },
    { number: 4, title: 'Cancer Man', titleAr: 'رجل السرطان', duration: 48 },
    { number: 5, title: 'Gray Matter', titleAr: 'المادة الرمادية', duration: 48 }
  ]

  for (const ep of season1Episodes) {
    await prisma.episode.upsert({
      where: {
        seasonId_episodeNumber: {
          seasonId: season1.id,
          episodeNumber: ep.number
        }
      },
      update: {},
      create: {
        seasonId: season1.id,
        episodeNumber: ep.number,
        title: ep.title,
        titleAr: ep.titleAr,
        description: `Episode ${ep.number} of Breaking Bad Season 1`,
        descriptionAr: `الحلقة ${ep.number} من الموسم الأول`,
        duration: ep.duration,
        thumbnailUrl: `https://example.com/thumbnails/bb-s1e${ep.number}.jpg`,
        videoUrl: `https://example.com/videos/breaking-bad-s1e${ep.number}.m3u8`,
        airDate: new Date(2008, 0, ep.number * 7)
      }
    })
  }

  // الموسم الثاني
  const season2 = await prisma.season.upsert({
    where: { 
      seriesId_seasonNumber: { 
        seriesId: series.id, 
        seasonNumber: 2 
      } 
    },
    update: {},
    create: {
      seriesId: series.id,
      seasonNumber: 2,
      title: 'Season 2',
      titleAr: 'الموسم الثاني',
      description: 'Walt and Jesse realize how dire their situation is.',
      descriptionAr: 'يدرك والت وجيسي مدى خطورة وضعهم.',
      posterUrl: 'https://example.com/posters/breaking-bad-s2.jpg',
      releaseYear: 2009
    }
  })

  // حلقات الموسم الثاني
  const season2Episodes = [
    { number: 1, title: 'Seven Thirty-Seven', titleAr: 'سبعمائة وسبعة وثلاثون', duration: 47 },
    { number: 2, title: 'Grilled', titleAr: 'مشوي', duration: 47 },
    { number: 3, title: 'Bit by a Dead Bee', titleAr: 'لدغة نحلة ميتة', duration: 47 },
    { number: 4, title: 'Down', titleAr: 'أسفل', duration: 47 },
    { number: 5, title: 'Breakage', titleAr: 'كسر', duration: 47 }
  ]

  for (const ep of season2Episodes) {
    await prisma.episode.upsert({
      where: {
        seasonId_episodeNumber: {
          seasonId: season2.id,
          episodeNumber: ep.number
        }
      },
      update: {},
      create: {
        seasonId: season2.id,
        episodeNumber: ep.number,
        title: ep.title,
        titleAr: ep.titleAr,
        description: `Episode ${ep.number} of Breaking Bad Season 2`,
        descriptionAr: `الحلقة ${ep.number} من الموسم الثاني`,
        duration: ep.duration,
        thumbnailUrl: `https://example.com/thumbnails/bb-s2e${ep.number}.jpg`,
        videoUrl: `https://example.com/videos/breaking-bad-s2e${ep.number}.m3u8`,
        airDate: new Date(2009, 2, ep.number * 7)
      }
    })
  }

  console.log('✅ تم إنشاء مسلسل مع موسمين و10 حلقات')

  // 6. إنشاء قنوات مباشرة
  console.log('📡 إنشاء القنوات المباشرة...')
  
  const channels = [
    {
      id: 'channel-1',
      name: 'beIN Sports 1',
      nameAr: 'بي إن سبورتس 1',
      description: 'Live sports channel featuring football, tennis, and more',
      descriptionAr: 'قناة رياضية مباشرة تعرض كرة القدم والتنس والمزيد',
      category: 'sports',
      logoUrl: 'https://example.com/logos/bein-sports-1.png',
      ingestUrl: 'rtmp://ingest.example.com/live/bein1',
      streamUrl: 'https://stream.example.com/live/bein1/playlist.m3u8',
      isLive: true,
      isActive: true
    },
    {
      id: 'channel-2',
      name: 'SSC Sports',
      nameAr: 'قنوات السعودية الرياضية',
      description: 'Saudi Sports Channel - Live coverage of Saudi league',
      descriptionAr: 'القناة الرياضية السعودية - تغطية مباشرة للدوري السعودي',
      category: 'sports',
      logoUrl: 'https://example.com/logos/ssc.png',
      ingestUrl: 'rtmp://ingest.example.com/live/ssc',
      streamUrl: 'https://stream.example.com/live/ssc/playlist.m3u8',
      isLive: true,
      isActive: true
    }
  ]

  for (const channel of channels) {
    await prisma.channel.upsert({
      where: { id: channel.id },
      update: {},
      create: channel
    })
  }

  console.log(`✅ تم إنشاء ${channels.length} قنوات مباشرة`)

  // 7. إنشاء اشتراك تجريبي للمستخدم التجريبي
  console.log('💳 إنشاء اشتراك تجريبي...')
  
  const trialEndDate = new Date()
  trialEndDate.setHours(trialEndDate.getHours() + 24)

  await prisma.subscription.upsert({
    where: { id: 'subscription-test-1' },
    update: {},
    create: {
      id: 'subscription-test-1',
      userId: testUser.id,
      planId: monthlyPlan.id,
      status: 'TRIAL',
      isTrial: true,
      trialEndDate: trialEndDate,
      autoRenew: true
    }
  })

  console.log('✅ تم إنشاء اشتراك تجريبي')

  console.log('\n🎉 تم إكمال عملية إدخال البيانات بنجاح!\n')
  console.log('📊 ملخص البيانات المُدخلة:')
  console.log(`   - ${await prisma.user.count()} مستخدمين`)
  console.log(`   - ${await prisma.plan.count()} خطط اشتراك`)
  console.log(`   - ${await prisma.content.count()} محتويات (أفلام + مسلسلات)`)
  console.log(`   - ${await prisma.season.count()} مواسم`)
  console.log(`   - ${await prisma.episode.count()} حلقات`)
  console.log(`   - ${await prisma.channel.count()} قنوات مباشرة`)
  console.log(`   - ${await prisma.subscription.count()} اشتراكات`)
  console.log('\n✅ يمكنك الآن تسجيل الدخول باستخدام:')
  console.log('   Admin: admin@najmplay.test / P@ssw0rd123')
  console.log('   User: user@test.com / User123!')
}

main()
  .catch((e) => {
    console.error('❌ خطأ في عملية إدخال البيانات:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

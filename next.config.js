/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // تمت إزالة i18n لدعم static export
  images: {
    domains: ['localhost'],
  },
  output: 'export', // لتفعيل التصدير الثابت
}

module.exports = nextConfig

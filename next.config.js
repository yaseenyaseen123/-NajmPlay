/** @type {import('next').NextConfig} */
const repoName = '-NajmPlay';
const nextConfig = {
  reactStrictMode: true,
  // تمت إزالة i18n لدعم static export
  images: {
    domains: ['localhost'],
  },
  output: 'export', // لتفعيل التصدير الثابت
  basePath: `/${repoName}`,
  assetPrefix: `/${repoName}/`,
}

module.exports = nextConfig

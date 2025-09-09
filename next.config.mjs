/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@neondatabase/serverless'],
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    formats: ['image/webp', 'image/avif']
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig

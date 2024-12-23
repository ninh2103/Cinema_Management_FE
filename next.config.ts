/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Bật Strict Mode
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000'
      },
      {
        hostname: 'via.placeholder.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      }
    ]
  }
}

export default nextConfig

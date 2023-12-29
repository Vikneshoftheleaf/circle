/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images:{
    remotePatterns:[
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**'
      }
    ],
    },
    /*images: {
        domains: [
          'lh3.googleusercontent.com',
          'firebasestorage.googleapis.com',
        ],
      },
      */
}

module.exports = nextConfig

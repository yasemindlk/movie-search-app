/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_OMDB_API_KEY: process.env.NEXT_PUBLIC_OMDB_API_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/api/omdb/:path*',
        destination: 'https://www.omdbapi.com/:path*',
      },
    ];
  },
}

module.exports = nextConfig 
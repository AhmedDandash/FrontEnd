/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizePackageImports: ['antd', '@ant-design/icons'],
  },
  async rewrites() {
    // Only use proxy in development to bypass CORS
    // In production, use direct API calls (requires proper CORS configuration on server)
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'https://sigma26.runasp.net/api/:path*',
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    PORT: process.env.PORT,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    BACKEND_API_URL: process.env.BACKEND_API_URL,
  }
};

export default nextConfig;

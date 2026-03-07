/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: __dirname,
  },
  typescript: {
    // Allow production builds to succeed even with type errors
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;

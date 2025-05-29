/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 👈 OVO omogućava static export bez `next export`

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  }
};

export default nextConfig;

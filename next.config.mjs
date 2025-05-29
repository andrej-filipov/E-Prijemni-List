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
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    return {
      ...config,
      externals: {
        ...config.externals,
        '@tauri-apps/api': 'window.__TAURI__',
        '@tauri-apps/api/updater': 'window.__TAURI__.updater',
      },
    };
  },
};

export default nextConfig;

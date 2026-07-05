import path from "path";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nextConfig: any = {
  // Allow images from external sources
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eduvale.in",
      },
      {
        protocol: "https",
        hostname: "www.mitcorer.edu.in",
      },
    ],
  },
  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  webpack: (config: any) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'framer-motion': path.resolve(__dirname, 'node_modules/framer-motion'),
    };
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

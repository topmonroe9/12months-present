/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    basePath: "/12months-present",
    assetPrefix: "/12months-present/",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gift-app-bucket.s3.eu-central-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  output: "export",
  // Add any other Next.js config options you need
};

export default nextConfig;

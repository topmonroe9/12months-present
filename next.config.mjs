/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gift-app-bucket.s3.eu-central-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  basePath: process.env.NODE_ENV === "production" ? "/12months-present" : "",
  assetPrefix:
    process.env.NODE_ENV === "production" ? "/12months-present/" : "",
  trailingSlash: true,
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tmdb.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "themoviedb.org",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

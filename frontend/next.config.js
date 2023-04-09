/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [process.env.NEXT_PUBLIC_IMG_DOMAINS],
  },
  env: {
    SITE_NAME: process.env.SITE_NAME || "SpotLie",
    SITE_LOCALE: process.env.SITE_LOCALE || "pt-br",
    SITE_BASEURL: process.env.SITE_BASEURL || "http://localhost:3000",
  },
};

module.exports = nextConfig;

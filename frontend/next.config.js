/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [process.env.NEXT_PUBLIC_DOMAINS_IMG],
  },
  env: {
    SITE_NAME: "Spotify-Zero",
    SITE_LOCALE: "pt-br",
    SITE_BASEURL: "http://localhost:3000",
  },
};

module.exports = nextConfig;

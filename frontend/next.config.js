/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["spotify0.vercel.app", "i.scdn.co", "127.0.0.1"],
  },
  env: {
    SITE_NAME: "Spotify-Zero",
    SITE_LOCALE: "pt-br",
    SITE_BASEURL: "http://localhost:3000",
  },
};

module.exports = nextConfig;

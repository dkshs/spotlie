/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SITE_NAME: "Spotify-Zero",
    SITE_LOCALE: "pt-br",
    SITE_BASEURL: "http://localhost:3000",
  },
};

module.exports = nextConfig;

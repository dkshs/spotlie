/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: process.env.NEXT_PUBLIC_IMG_DOMAINS?.split(",").map(
      (domain) => ({
        hostname: domain,
      }),
    ),
  },
};

export default nextConfig;

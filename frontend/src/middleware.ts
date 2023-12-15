import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes in your Next.js app except for the public ones.
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: ["/"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)"],
};

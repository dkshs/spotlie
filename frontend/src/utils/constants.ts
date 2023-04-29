export const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
export const NEXT_PUBLIC_API_KEY = process.env.NEXT_PUBLIC_API_KEY;
export const SITE_BASEURL = process.env.SITE_BASEURL;

if (!NEXT_PUBLIC_API_URL) throw new Error("Missing env.NEXT_PUBLIC_API_URL");
if (!NEXT_PUBLIC_API_KEY) throw new Error("Missing env.NEXT_PUBLIC_API_KEY");
if (!SITE_BASEURL) throw new Error("Missing env.SITE_BASEURL");

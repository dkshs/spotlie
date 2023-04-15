import axios from "axios";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const NEXT_PUBLIC_API_KEY = process.env.NEXT_PUBLIC_API_KEY;

if (!NEXT_PUBLIC_API_URL) throw new Error("Missing env.NEXT_PUBLIC_API_URL");
if (!NEXT_PUBLIC_API_KEY) throw new Error("Missing env.NEXT_PUBLIC_API_KEY");

export const api = axios.create({
  baseURL: NEXT_PUBLIC_API_URL,
  headers: { Authorization: `Bearer ${NEXT_PUBLIC_API_KEY}` },
});

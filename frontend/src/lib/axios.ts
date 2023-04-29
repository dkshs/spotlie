import axios from "axios";
import { NEXT_PUBLIC_API_URL, NEXT_PUBLIC_API_KEY } from "@/utils/constants";

export const api = axios.create({
  baseURL: NEXT_PUBLIC_API_URL,
  headers: { Authorization: `Bearer ${NEXT_PUBLIC_API_KEY}` },
});

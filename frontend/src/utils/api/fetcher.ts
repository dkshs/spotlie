import { env } from "@/env.mjs";

export interface FetcherOpts extends RequestInit {
  token?: string | null;
  searchParams?: Record<string, string> | URLSearchParams | null;
}

export async function fetcher<T = unknown>(
  path: string,
  opts?: FetcherOpts,
): Promise<Awaited<T>> {
  const url = new URL(`${env.NEXT_PUBLIC_BACKEND_API_URL}${path}`);
  if (opts?.searchParams)
    url.search = new URLSearchParams(opts.searchParams).toString();
  if (!opts?.token) {
    const res = await fetch(url, opts);
    if (res.status === 204) {
      return null as Awaited<T>;
    }
    return res.json() as Awaited<T>;
  }
  const headers = { ...opts.headers, Authorization: `Bearer ${opts.token}` };
  const res = await fetch(url, { ...opts, headers });
  if (res.status === 204) {
    return null as Awaited<T>;
  }
  return res.json() as Awaited<T>;
}

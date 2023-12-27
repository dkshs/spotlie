import { env } from "@/env.mjs";

export interface FetcherOpts extends RequestInit {
  token?: string | null;
  searchParams?: Record<string, string> | URLSearchParams | null;
}
export interface FetcherResponse<T> {
  data: T | null;
  ok: boolean;
}

export async function fetcher<T = unknown>(
  path: string,
  opts?: FetcherOpts,
): Promise<FetcherResponse<T>> {
  const url = new URL(`${env.NEXT_PUBLIC_BACKEND_API_URL}${path}`);
  if (opts?.searchParams)
    url.search = new URLSearchParams(opts.searchParams).toString();
  const auth = opts?.token ? { Authorization: `Bearer ${opts.token}` } : null;
  const headers = { ...opts?.headers, ...auth };
  const res = await fetch(url.toString(), { ...opts, headers });
  if (!res.ok) throw new Error(res.statusText);
  const data =
    !res.body || res.status === 204 || res.status === 205
      ? null
      : ((await res.json()) as T);
  return { data, ok: res.ok };
}

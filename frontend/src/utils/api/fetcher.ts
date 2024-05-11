import { env } from "@/env.js";

export interface FetcherOpts extends RequestInit {
  token?: string | null;
  searchParams?: Record<string, string> | URLSearchParams | null;
  throwError?: boolean;
}
export interface FetcherResponse<T> {
  data: T | null;
  ok: boolean;
  errorMsg: string | null;
}

export async function fetcher<T = unknown>(
  path: string,
  opts?: FetcherOpts,
): Promise<FetcherResponse<T>> {
  const throwError = opts?.throwError ?? true;
  const url = new URL(`${env.NEXT_PUBLIC_BACKEND_API_URL}${path}`);
  if (opts?.searchParams)
    url.search = new URLSearchParams(opts.searchParams).toString();
  const auth = opts?.token ? { Authorization: `Bearer ${opts.token}` } : null;
  const headers = { ...opts?.headers, ...auth };
  const res = await fetch(url.toString(), { ...opts, headers });
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const json = JSON.parse(await res.text());
      msg = json.full_message || msg;
    } catch {}
    if (throwError) throw new Error(msg);
    return { data: null, ok: false, errorMsg: msg };
  }
  const data =
    !res.body || res.status === 204 || res.status === 205
      ? null
      : ((await res.json()) as T);
  return { data, ok: res.ok, errorMsg: null };
}

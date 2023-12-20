import { cache } from "react";
import { auth } from "@clerk/nextjs";

import { type FetcherOpts, fetcher } from "./fetcher";

export const serverFetcher = cache(
  async <T>(path: string, opts?: FetcherOpts & { needAuth?: boolean }) => {
    if (!opts?.needAuth) return fetcher<T>(path, opts);
    const token = await auth().getToken({ template: "backend" });
    return fetcher<T>(path, { ...opts, token });
  },
);

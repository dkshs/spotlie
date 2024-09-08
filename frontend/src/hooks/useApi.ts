import { useAuth } from "@clerk/nextjs";
import { env } from "@/env.js";
import { type FetcherOpts, fetcher } from "@/utils/api";

export const useApi = () => {
  const { getToken } = useAuth();

  return {
    fetcher: async <T>(
      path: string,
      opts?: FetcherOpts & { needAuth?: boolean },
    ) => {
      if (!opts?.needAuth) return fetcher<T>(path, opts);
      const jwtTemplate = env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE_NAME;
      const token = await getToken({ template: jwtTemplate });
      return fetcher<T>(path, { ...opts, token });
    },
  };
};

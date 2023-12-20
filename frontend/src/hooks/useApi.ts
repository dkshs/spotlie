import { useAuth } from "@clerk/nextjs";
import { fetcher, type FetcherOpts } from "@/utils/api";

export const useApi = () => {
  const { getToken } = useAuth();

  return {
    fetcher: async <T>(
      path: string,
      opts?: FetcherOpts & { needAuth?: boolean },
    ) => {
      if (!opts?.needAuth) return fetcher<T>(path, opts);
      const token = await getToken({ template: "backend" });
      return fetcher<T>(path, { ...opts, token });
    },
  };
};

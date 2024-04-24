"use client";

import { type ReactNode, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MusicContextProvider } from "@/context/MusicContext";

export function Providers({ children }: { readonly children: ReactNode }) {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <MusicContextProvider>{children}</MusicContextProvider>
    </QueryClientProvider>
  );
}

"use client";

import { type ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MusicContextProvider } from "@/context/MusicContext";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <MusicContextProvider>{children}</MusicContextProvider>
    </QueryClientProvider>
  );
}

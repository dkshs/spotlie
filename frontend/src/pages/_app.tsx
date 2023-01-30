import "../styles/global.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

import type { AppProps } from "next/app";

import { Header } from "@/components/Header";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-w-7xl min-w-[320px] m-auto">
        <Header />
        <div className="pt-[72px]">
          <Component {...pageProps} />
        </div>
      </div>
    </QueryClientProvider>
  );
}

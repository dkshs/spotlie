import "../styles/global.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

import type { AppProps } from "next/app";

import { Header } from "@/components/Header";
import { Player } from "@/components/Player";
import { MusicContextProvider } from "@/context/useContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <MusicContextProvider>
        <div className="max-w-[1600px] min-w-[320px] m-auto">
          <Header />
          <div className="pt-[72px] pb-[90px]">
            <Component {...pageProps} />
          </div>
          <Player />
        </div>
      </MusicContextProvider>
    </QueryClientProvider>
  );
}

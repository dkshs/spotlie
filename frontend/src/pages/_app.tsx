import "@/styles/globals.css";

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";
import { QueryClientProvider } from "@tanstack/react-query";
import { ApiContextProvider } from "@/context/ApiContext";
import { MusicContextProvider } from "@/context/MusicContext";
import { useRouter } from "next/router";
import { queryClient } from "@/lib/queryClient";
import { dark } from "@clerk/themes";
import { ptBR } from "@clerk/localizations";

import type { AppProps } from "next/app";

import { Header } from "@/components/Header";
import { Player } from "@/components/Player";
import { motion, AnimatePresence } from "framer-motion";

const publicPages = ["/", "/sign-in/[[...index]]", "/sign-up/[[...index]]"];

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  const isPublicPage = publicPages.includes(pathname);
  const isPlayerPage = pathname === "/player";

  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: "rgb(139 92 246)" },
      }}
      localization={ptBR}
      {...pageProps}
    >
      <QueryClientProvider client={queryClient}>
        <ApiContextProvider>
          <MusicContextProvider>
            <div className="bg-violet-900 bg-gradient-to-b from-black/60 to-black fixed inset-0 -z-[1]" />
            <AnimatePresence mode="wait">
              <div
                className={`${
                  !isPlayerPage && "max-w-[1600px] min-w-[320px] m-auto"
                }`}
              >
                {!isPlayerPage && <Header />}
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, translateY: -10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  exit={{ opacity: 0, translateY: -10 }}
                >
                  <div className={`${!isPlayerPage && "pt-[72px] pb-[90px]"}`}>
                    {isPublicPage ? (
                      <Component {...pageProps} />
                    ) : (
                      <>
                        <SignedIn>
                          <Component {...pageProps} />
                        </SignedIn>
                        <SignedOut>
                          <RedirectToSignIn />
                        </SignedOut>
                      </>
                    )}
                  </div>
                </motion.div>
                {!isPlayerPage && <Player />}
              </div>
            </AnimatePresence>
          </MusicContextProvider>
        </ApiContextProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

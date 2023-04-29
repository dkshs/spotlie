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

const publicPages = ["/", "/sign-in/[[...index]]", "/sign-up/[[...index]]"];

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  const isPublicPage = publicPages.includes(pathname);

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
            <div
              className={`${
                pathname !== "/player" && "max-w-[1600px] min-w-[320px] m-auto"
              }`}
            >
              {pathname !== "/player" && <Header />}
              <div
                className={`${pathname !== "/player" && "pt-[72px] pb-[90px]"}`}
              >
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
              {pathname !== "/player" && <Player />}
            </div>
          </MusicContextProvider>
        </ApiContextProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

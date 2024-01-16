import "react-toastify/dist/ReactToastify.min.css";
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Merriweather_Sans as MerriweatherSans } from "next/font/google";

import { env } from "@/env.mjs";
import { Providers } from "./providers";
import { ToastContainer } from "react-toastify";
import { ClerkProvider } from "@clerk/nextjs";
import { clerkTheme } from "./clerkTheme";

import { Header } from "@/components/Header";
import { Player } from "@/components/Player";

const merriweatherSans = MerriweatherSans({
  subsets: ["latin"],
  variable: "--font-merriweather-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.SITE_BASEURL),
  title: {
    default: env.SITE_NAME,
    template: `%s • ${env.SITE_NAME}`,
  },
  description:
    "Browse and listen to your favorite music in your web browser now.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: {
      default: env.SITE_NAME,
      template: `%s • ${env.SITE_NAME}`,
    },
    description:
      "Browse and listen to your favorite music in your web browser now.",
    siteName: env.SITE_NAME,
    type: "website",
    url: "/",
    locale: env.SITE_LOCALE,
  },
  twitter: {
    title: {
      default: env.SITE_NAME,
      template: `%s • ${env.SITE_NAME}`,
    },
    description:
      "Browse and listen to your favorite music in your web browser now.",
    card: "summary",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider appearance={{ baseTheme: clerkTheme }}>
      <html lang="en" className={merriweatherSans.variable}>
        <body>
          <Providers>
            <div className="mx-auto min-w-[320px] max-w-[1600px]">
              <ToastContainer
                autoClose={3000}
                theme="dark"
                newestOnTop={true}
                pauseOnFocusLoss={false}
                limit={3}
                closeOnClick
                stacked
              />
              <Header />
              <div className="pb-20 pt-[72px]">{children}</div>
              <Player />
            </div>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}

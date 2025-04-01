import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ToastContainer } from "react-toastify";
import { ClerkProvider } from "@clerk/nextjs";
import { Merriweather_Sans as MerriweatherSans } from "next/font/google";
import { Header } from "@/components/Header";
import { Player } from "@/components/Player";
import { env } from "@/env.js";
import { clerkTheme } from "./clerkTheme";
import { Providers } from "./providers";

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

export default function RootLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <ClerkProvider appearance={{ baseTheme: clerkTheme }}>
      <html lang="en" suppressHydrationWarning>
        <body className={merriweatherSans.variable}>
          <Providers>
            <ToastContainer
              autoClose={3000}
              theme="dark"
              newestOnTop
              pauseOnFocusLoss={false}
              limit={3}
              closeOnClick
              stacked
              className="z-[999999] bg-background font-merriweatherSans text-foreground"
              toastClassName="bg-background text-foreground"
            />
            <Header />
            <div className="mx-auto min-w-[320px] max-w-[1600px]">
              {children}
            </div>
            <Player />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}

import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Merriweather_Sans as MerriweatherSans } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";

const merriweatherSans = MerriweatherSans({
  subsets: ["latin"],
  variable: "--font-merriweather-sans",
});

export const metadata: Metadata = {
  title: "SpotLie",
  description:
    "Browse and listen to your favorite music in your web browser now.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={merriweatherSans.variable}>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}

import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Merriweather_Sans as MerriweatherSans } from "next/font/google";

import { env } from "@/env.mjs";
import { Providers } from "./providers";
import { ClerkProvider } from "@clerk/nextjs";
import { unstable_createTheme as unstableCreateTheme } from "@clerk/themes";

import { Header } from "@/components/Header";

const clerkTheme = unstableCreateTheme({
  elements: {
    card: "bg-card border border-primary/50",
    modalCloseButton:
      "text-foreground hover:bg-secondary/80 active:bg-secondary focus:ring focus:ring-ring",
    identityPreview: "bg-secondary",
    identityPreviewText: "text-foreground/60",
    identityPreviewEditButton: "text-primary/90 hover:text-primary",
    headerTitle: "text-foreground",
    headerSubtitle: "text-foreground/60",
    form: "[&_.cl-internal-3vf5mz]:text-foreground [&_p]:text-foreground",
    formHeaderTitle: "text-foreground",
    formHeaderSubtitle: "text-foreground/60",
    formFieldLabel: "text-foreground",
    formFieldInput:
      "border-input bg-background text-foreground ring-ring focus:ring-1 dark:border-zinc-700",
    formFieldInputShowPasswordButton:
      "text-foreground/40 hover:text-foreground/70",
    formFieldWarningText: "text-foreground/60",
    formFieldSuccessText: "text-foreground/60",
    formButtonPrimary:
      "bg-primary/80 duration-300 hover:bg-primary focus:bg-primary focus:ring focus:ring-ring",
    formButtonReset:
      "hover:bg-primary/20 active:bg-primary/30 text-primary duration-300 focus:ring focus:ring-ring",
    formResendCodeLink: "text-primary hover:text-primary",
    formFieldAction__password: "text-primary hover:text-primary",
    fileDropAreaButtonPrimary:
      "hover:bg-primary/20 active:bg-primary/30 text-primary duration-300 focus:ring focus:ring-ring",
    fileDropAreaBox: "bg-secondary dark:bg-secondary/60",
    fileDropAreaIconBox: "bg-background",
    fileDropAreaIcon: "text-foreground/60",
    fileDropAreaHint: "text-foreground/60 font-medium",
    headerBackRow:
      "[&_a]:text-primary [&_a]:hover:text-primary [&_a]:active:text-primary [&_a]:focus:ring [&_a]:focus:ring-ring",
    otpCodeFieldInput:
      "border-b-2 border-border text-foreground focus:border-primary",
    alternativeMethodsBlockButton:
      "text-foreground border border-input hover:bg-secondary active:bg-secondary focus:ring focus:ring-ring",
    main: "[&>.cl-internal-1b63r8w]:text-foreground [&>.cl-internal-rsjg4y]:text-foreground/60",
    footerActionLink:
      "text-primary hover:text-primary focus:ring focus:ring-ring",
    footerActionText: "text-foreground/60",
    userPreviewMainIdentifier: "text-foreground",
    userPreviewSecondaryIdentifier: "text-foreground/60",
    userButtonPopoverActionButton:
      "hover:bg-secondary/60 focus-visible:bg-secondary/60 active:bg-secondary",
    userButtonPopoverActionButtonText: "text-foreground/60",
    userButtonPopoverActionButtonIconBox: "[&_*]:text-foreground/40",
    userButtonPopoverFooter: "hidden",
    userButtonTrigger: "focus:ring focus:ring-ring",
    profileSectionTitle: "border-b border-border",
    profileSectionTitleText: "text-foreground",
    profileSectionContent:
      "[&_p:not(.cl-internal-fqx4fd)]:text-foreground [&_.cl-internal-fqx4fd]:text-foreground/60",
    profileSectionPrimaryButton:
      "text-primary hover:bg-primary/20 active:bg-primary/30 focus:ring focus:ring-ring",
    accordionTriggerButton:
      "text-foreground hover:bg-secondary/80 focus:ring focus:ring-ring active:bg-secondary",
    navbarButton:
      "text-foreground/80 data-[active=true]:text-foreground hover:bg-secondary focus:ring focus:ring-ring",
    avatarImageActionsUpload:
      "text-primary hover:text-primary active:text-primary focus:ring focus:ring-ring",
    breadcrumbsItem__currentPage: "text-foreground",
    breadcrumbsItem: "text-foreground/60 focus:ring focus:ring-ring",
    breadcrumbsItemDivider: "text-foreground/60",
    badge: "text-primary bg-primary/20",
  },
});

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
              <Header />
              <div className="pt-[72px]">{children}</div>
            </div>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}

import "~/app/globals.css";
import "~/styles/prosemirror.css";

import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { ClerkProvider } from "@clerk/nextjs";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { OpenAPI } from "@shc/api/client";
import { cn } from "@shc/ui";
import { Toaster } from "@shc/ui/sonner";
import { ThemeProvider } from "@shc/ui/theme";

import { env } from "~/env";
import { TRPCReactProvider } from "~/trpc/react";

if (env.NODE_ENV === "production") {
  OpenAPI.BASE = env.NEXT_PUBLIC_FASTAPI_URL;
}

export const metadata: Metadata = {
  metadataBase: new URL(
    env.NODE_ENV === "production"
      ? "https://scribeHCyour-domain.com"
      : "http://localhost:3000",
  ),
  title: "scribeHC",
  description: "AI ambient scribe app for healthcare.",
  openGraph: {
    title: "scribeHC",
    description: "AI ambient scribe app for healthcare.",
    url: "https://www.scribeHCyour-domain.com",
    siteName: "scribeHC",
  },
  twitter: {
    card: "summary_large_image",
    site: "@trevorpfiz",
    creator: "@trevorpfiz",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  const headersList = headers();
  const host = headersList.get("host");

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-sans text-foreground antialiased",
            GeistSans.variable,
            GeistMono.variable,
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <TRPCReactProvider host={host}>{props.children}</TRPCReactProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

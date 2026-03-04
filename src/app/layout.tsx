import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import AuthProvider from "@/providers/AuthProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ToastProvider } from "@/providers/ToastProvider";

const satoshi = localFont({
  src: [
    {
      path: "../../public/fonts/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const peculiar = localFont({
  src: "../../public/fonts/PeculiarSans.woff2",
  variable: "--font-peculiar",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Glamyad | Book Top Beauty & Wellness Professionals",
    template: "%s | Glamyad",
  },
  description:
    "Discover and book the best stylists, barbers, and wellness experts near you. Trusted professionals, seamless booking.",
  keywords: [
    "beauty",
    "wellness",
    "barber",
    "stylist",
    "booking",
    "salon",
    "skincare",
  ],
  authors: [{ name: "Glamyad Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Glamyad",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: "#7c3aed",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://glamyad.com",
    title: "Glamyad | Book Top Beauty & Wellness Professionals",
    description:
      "Discover and book the best beauty and wellness experts near you.",
    siteName: "Glamyad",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Glamyad - Beauty & Wellness Booking",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Glamyad | Book Top Beauty & Wellness Professionals",
    description:
      "Discover and book the best beauty and wellness experts near you.",
    images: ["/og-image.png"],
    creator: "@glamyad",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { CookieConsent } from "@/components/common/CookieConsent";
import { ModalProvider } from "@/providers/ModalProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${satoshi.variable} ${peculiar.variable} font-satoshi antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              {children}
              <ModalProvider />
              <ToastProvider />
              <CookieConsent />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

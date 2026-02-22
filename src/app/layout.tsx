import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import AuthProvider from "@/providers/AuthProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ToastProvider } from "@/providers/ToastProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: {
    default: "Peculia | Book Top Beauty & Wellness Professionals",
    template: "%s | Peculia",
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
  authors: [{ name: "Peculia Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://peculia.com",
    title: "Peculia | Book Top Beauty & Wellness Professionals",
    description:
      "Discover and book the best beauty and wellness experts near you.",
    siteName: "Peculia",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Peculia - Beauty & Wellness Booking",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Peculia | Book Top Beauty & Wellness Professionals",
    description:
      "Discover and book the best beauty and wellness experts near you.",
    images: ["/og-image.png"],
    creator: "@peculia",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} font-inter antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              {children}
              <ToastProvider />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

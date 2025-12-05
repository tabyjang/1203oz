import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";

import Navbar from "@/components/Navbar";
import { SyncUserProvider } from "@/components/providers/sync-user-provider";
import { currentLocalization } from "@/lib/clerk/localization";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "쇼핑몰",
    template: "%s | 쇼핑몰",
  },
  description: "Next.js + Clerk + Supabase 기반 쇼핑몰",
  keywords: ["쇼핑몰", "온라인 쇼핑", "의류", "전자제품", "도서"],
  authors: [{ name: "쇼핑몰" }],
  creator: "쇼핑몰",
  publisher: "쇼핑몰",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com"
  ),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com",
    siteName: "쇼핑몰",
    title: "쇼핑몰",
    description: "Next.js + Clerk + Supabase 기반 쇼핑몰",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "쇼핑몰",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "쇼핑몰",
    description: "Next.js + Clerk + Supabase 기반 쇼핑몰",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={currentLocalization}>
      <html lang="ko">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SyncUserProvider>
            <Navbar />
            {children}
            <Toaster position="top-center" />
          </SyncUserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

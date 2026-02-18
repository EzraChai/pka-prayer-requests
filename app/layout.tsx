import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import LanguageProvider from "@/components/LanguageContextProvider";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PKA Prayer Care",
  authors: [
    {
      name: "PKA Team",
      url: "https://linktr.ee/pkausm",
    },
  ],
  manifest: "/site.webmanifest",
  openGraph: {
    title: "PKA Prayer Care",
    description:
      "PKA Prayer Care offers a compassionate space to share burdens and joys, providing prayer, encouragement, and spiritual support to bring hope, comfort, and God's presence to everyone.",
    url: "https://pkaprayercare.vercel.app",
    images: [
      {
        url: "https://pkaprayercare.vercel.app/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  description:
    "PKA Prayer Care offers a compassionate space to share burdens and joys, providing prayer, encouragement, and spiritual support to bring hope, comfort, and God's presence to everyone.",
  keywords: [
    "prayer",
    "spiritual support",
    "encouragement",
    "faith",
    "hope",
    "comfort",
    "community",
    "Christian care",
    "ministry",
  ],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <ConvexClientProvider>
            <Navbar />
            {children}
            <Toaster position="top-center" />
          </ConvexClientProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

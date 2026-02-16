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
  description:
    "PKA Prayer Care provides a caring space to share your burdens and joys, offering prayer, encouragement, and spiritual support. We aim to bring hope, comfort, and God’s presence to everyone, reminding you that you are never alone.",
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
    icon: "/convex.svg",
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

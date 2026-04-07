import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import { Poppins } from "next/font/google";
import "./globals.css";
import Cursor from "../components/Cursor";
import Navbar from "../components/Navbar";
import NavigationGuard from "../components/NavigationGuard";
import { Analytics } from "@vercel/analytics/next";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Venture Craft | Build Your Venture",
  description: "Venture Craft is KFUPM's premier international deep-tech startup competition, supporting innovation and global impact.",
  metadataBase: new URL("https://kfupm-venturecraft.org/"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} font - poppins antialiased`}
      >
        <NavigationGuard>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <Cursor />
          {children}
          <Analytics />
        </NavigationGuard>

        <Script src="https://t.contentsquare.net/uxa/6dbc7bf2a02fd.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { Poppins } from "next/font/google";
import "./globals.css";
import Cursor from "../components/Cursor";
import Navbar from "../components/Navbar";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Venture Craft | 100K Competition",
  description: "Venture Craft is KFUPM's premier international deep-tech startup competition, supporting innovation and global impact.",
  metadataBase: new URL("https://kfupm-venturecraft.org/"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} font-poppins antialiased`}
      >
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        <Cursor />
        {children}
      </body>
    </html>
  );
}

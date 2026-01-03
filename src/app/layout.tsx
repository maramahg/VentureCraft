import type { Metadata } from "next";
import { Inter, Space_Grotesk, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Venture Craft",
  description: "KFUPM Venture Craft - A premier global startup competition with 100,000 SAR in prizes. Transform your innovative ideas into successful ventures.",
  keywords: ["KFUPM", "Venture Craft", "startup competition", "entrepreneurship", "Saudi Arabia", "innovation", "100K prize"],
  authors: [{ name: "KFUPM Entrepreneurship Institute" }],
  openGraph: {
    title: "Venture Craft",
    description: "Transform your vision into reality. Join the premier global startup competition at KFUPM.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Venture Craft",
    description: "Transform your vision into reality. Join the premier global startup competition at KFUPM.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${poppins.variable} antialiased`}
        style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

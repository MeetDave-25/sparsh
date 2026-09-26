import type { Metadata } from "next";
import { Cormorant_Garamond, Italianno, Jost } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const italianno = Italianno({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-italianno",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/motion/SmoothScroll";

export const metadata: Metadata = {
  title: {
    default: "Sparsh Divine Art Studio — Handmade Candles, Resin Art & Jewellery",
    template: "%s | Sparsh Divine Art Studio",
  },
  description:
    "Discover handcrafted candles, resin art, jewellery, stationery & custom gift hampers made with love in India. Custom orders welcome — reach us on WhatsApp or email.",
  keywords: [
    "handmade candles India",
    "soy candles",
    "resin art",
    "handmade jewellery India",
    "custom gift hampers",
    "personalized gifts India",
    "Sparsh Divine Art Studio",
  ],
  authors: [{ name: "Sparsh Divine Art Studio" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://sparshdivineartstudio.com",
    siteName: "Sparsh Divine Art Studio",
    title: "Sparsh Divine Art Studio — Handmade with Love",
    description:
      "Handcrafted candles, resin art, jewellery & custom gifts. Made with love in India. Custom orders available.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sparsh Divine Art Studio",
    description: "Handmade candles, resin art, jewellery & custom gifts from India.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${italianno.variable} ${jost.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider>
          <SmoothScroll />
          <Navbar />
          <main id="main-content">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

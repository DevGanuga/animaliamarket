import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Animalia | For Pets Who Are Family",
    template: "%s | Animalia",
  },
  description:
    "Premium, intentionally curated pet wellness products. Clean ingredients, transparent origins, and products we trust for our own furry family members.",
  keywords: [
    "pet wellness",
    "natural pet products",
    "organic pet care",
    "calming dog treats",
    "anxiety relief for pets",
    "premium pet food",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${cormorant.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

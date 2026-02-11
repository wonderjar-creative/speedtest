import type { Metadata } from "next";
import { inter, playfair } from "@/lib/fonts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Elevation Design Studio",
    template: "%s | Elevation Design Studio",
  },
  description: "Award-winning architecture & interior design in Denver, Colorado. Residential and commercial design since 2010.",
  openGraph: {
    siteName: "Elevation Design Studio",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

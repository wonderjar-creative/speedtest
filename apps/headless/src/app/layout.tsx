import type { Metadata } from "next";
import { inter, playfair } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Elevation Design Studio",
    template: "%s | Elevation Design Studio",
  },
  description:
    "Award-winning architecture & interior design in Denver, Colorado. Residential and commercial design since 2010.",
  openGraph: {
    siteName: "Elevation Design Studio",
    locale: "en_US",
    type: "website",
  },
};

/**
 * Root layout — intentionally minimal.
 *
 * Header and footer are rendered as WordPress template parts
 * within each page's template, not as fixed layout components.
 * This allows different pages to use different headers
 * (e.g., absolute header on the front page).
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}

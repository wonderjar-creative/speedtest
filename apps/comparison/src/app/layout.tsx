import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Speed Test — Denver Headless",
  description:
    "Same server. Same content. Same backend. Half the load time, near-perfect Lighthouse — see the difference headless makes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        {/*
          Plausible, proxied first-party via the Cloudflare Worker on the
          denverheadless.com zone. Reports into the denverheadless.com site; the
          Worker resolves this subdomain to that root, so the hostname filter
          separates it in the dashboard.

          Only this hostname is instrumented. slow-speedtest and fast-speedtest
          are DNS-only, so Worker routes cannot fire there at all, and putting
          Cloudflare in front of them would cache the very thing the demo exists
          to measure. Keeping JavaScript off those two also keeps the
          performance comparison honest.
        */}
        {process.env.NEXT_PUBLIC_ANALYTICS_ENABLED && (
          <>
            <Script src="/signal/script.js" strategy="afterInteractive" />
            <Script id="plausible-init" strategy="afterInteractive">
              {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init({endpoint:"/signal/event"})`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}

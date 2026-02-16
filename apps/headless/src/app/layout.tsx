import { draftMode } from "next/headers";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elevation Design Studio",
  description: "Architecture & Interior Design in Denver, Colorado",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled } = await draftMode();

  return (
    <html lang="en">
      <body>
        {isEnabled && (
          <div className="bg-yellow-500 text-black text-center py-2 text-sm font-medium">
            Preview Mode —{" "}
            <a href="/api/exit-preview" className="underline">
              Exit Preview
            </a>
          </div>
        )}
        <div className="wp-site-blocks">{children}</div>
      </body>
    </html>
  );
}

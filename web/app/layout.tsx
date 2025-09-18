import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// styles
import "@/styles/globals.css";
// providers
import { AppProvider } from "./provider";
// constants
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_TITLE } from "@syncturtle/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  metadataBase: new URL("https://syncturtle.com"),
  keywords: SITE_KEYWORDS,
};

export const viewport: Viewport = {
  minimumScale: 1,
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  width: "device-width",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProvider>
          <div className="h-screen w-full overflow-hidden relative flex flex-col">
            <main className="w-full h-full overflow-hidden relative">{children}</main>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}

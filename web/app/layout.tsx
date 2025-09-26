import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// styles
import "@/styles/globals.css";
// providers
import { AppProvider } from "./provider";
// helpers
import { log } from "@/lib/log";
// constants
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_TITLE } from "@syncturtle/constants";
import { INTERNAL_API_BASE_URL } from "@/helpers/common.helper";
// types
import { IInstanceInfo } from "@syncturtle/types";

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

type TError = {
  status: string;
  message: string;
};

export const fetchInstanceInfo = async (): Promise<IInstanceInfo | TError> => {
  try {
    const start = performance.now();
    log("info", "Fetch instance start", { url: `${INTERNAL_API_BASE_URL}`, route: `/ui/v1/instance` });

    const res = await fetch(`${INTERNAL_API_BASE_URL}/api/v1/instances`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    log("info", "Fetch instance success", { status: res.status, ms: Math.round(performance.now() - start) });

    return data;
  } catch (error) {
    log("error", "Fetch instance error", {});
    return {
      status: "error",
      message: "Failed to fetch isntance info",
    };
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const instanceInfo = await fetchInstanceInfo();
  const initialData = { instance: instanceInfo };
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProvider initialState={initialData}>
          <div className="h-screen w-full overflow-hidden bg-custom-background-100 relative flex flex-col">
            <main className="w-full h-full overflow-hidden relative">{children}</main>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}

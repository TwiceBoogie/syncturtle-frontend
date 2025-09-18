import type { Metadata } from "next";
import "@/styles/globals.css";
import { AppProvider } from "./provider";
import { ADMIN_BASE_PATH } from "@/helpers/common.helper";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_KEYWORDS } from "@syncturtle/constants";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  metadataBase: new URL("https://syncturtle.com"),
  keywords: SITE_KEYWORDS,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ASSET_PREFIX = ADMIN_BASE_PATH;
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href={`${ASSET_PREFIX}/favicon/favicon-32x32.png`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`${ASSET_PREFIX}/favicon/favicon-16x16.png`} />
        <link rel="shortcut icon" href={`${ASSET_PREFIX}/favicon/favicon.ico`} />
      </head>
      <body className={`antialiased`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}

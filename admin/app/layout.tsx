import type { Metadata } from "next";
// constants
import { ADMIN_BASE_PATH, API_BASE_URL, INTERNAL_API_BASE_URL } from "@/helpers/common.helper";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_KEYWORDS } from "@syncturtle/constants";
// styles
import "@/styles/globals.css";
import { AppProvider } from "./provider";
import { cn } from "@syncturtle/utils";
import { fetchInstanceInfo } from "@/lib/server";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  metadataBase: new URL("https://syncturtle.com"),
  keywords: SITE_KEYWORDS,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const instanceInfo = await fetchInstanceInfo();
  const initialData = { instance: instanceInfo };
  const ASSET_PREFIX = ADMIN_BASE_PATH;
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href={`${ASSET_PREFIX}/favicon/favicon-32x32.png`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`${ASSET_PREFIX}/favicon/favicon-16x16.png`} />
        <link rel="shortcut icon" href={`${ASSET_PREFIX}/favicon/favicon.ico`} />
      </head>
      <body className={`antialiased`}>
        <AppProvider initialState={initialData}>
          <div
            className={cn(
              "h-screen w-full overflow-hidden bg-custom-background-100 relative flex flex-col",
              "app-container"
            )}
          >
            <main className="w-full h-full overflow-hidden relative">{children}</main>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}

"use client";

import { FC, ReactNode } from "react";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import { SWRConfig } from "swr";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { InstanceWrapper } from "@/lib/wrappers/instance-wrapper";
import { WEB_SWR_CONFIG } from "@syncturtle/constants";
import { StoreProvider } from "@/lib/store-context";
import dynamic from "next/dynamic";
import { useAppRouter } from "@/hooks/use-app-router";
// dynamic imports
const PostHogProvider = dynamic(() => import("@/lib/posthog-provider"), { ssr: false });
const StoreWrapper = dynamic(() => import("@/lib/wrappers/store-wrapper"), { ssr: false });

export interface IAppProvider {
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialState?: any;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useAppRouter>["push"]>[1]>;
  }
}

export const AppProvider: FC<IAppProvider> = (props) => {
  const { children, initialState = {} } = props;

  return (
    <>
      <ProgressProvider height="4px" options={{ showSpinner: false }} shallowRouting>
        <StoreProvider initialState={initialState}>
          <NextThemeProvider
            attribute={"class"}
            defaultTheme="system"
            enableSystem
            enableColorScheme
            themes={["dark", "light"]}
          >
            <HeroUIProvider>
              <ToastProvider />
              <StoreWrapper>
                <InstanceWrapper>
                  <PostHogProvider>
                    <SWRConfig value={WEB_SWR_CONFIG}>{children}</SWRConfig>
                  </PostHogProvider>
                </InstanceWrapper>
              </StoreWrapper>
            </HeroUIProvider>
          </NextThemeProvider>
        </StoreProvider>
      </ProgressProvider>
    </>
  );
};

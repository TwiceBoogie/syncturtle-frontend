"use client";

import { FC, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { SWRConfig } from "swr";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { InstanceWrapper } from "@/lib/wrappers/instance-wrapper";
import { WEB_SWR_CONFIG } from "@syncturtle/constants";
import { StoreProvider } from "@/lib/store-context";

export interface IAppProvider {
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialState?: any;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
  }
}

export const AppProvider: FC<IAppProvider> = (props) => {
  const { children, initialState = {} } = props;
  const router = useRouter();

  return (
    <NextThemeProvider
      attribute={"class"}
      defaultTheme="system"
      enableSystem
      enableColorScheme
      themes={["dark", "light"]}
    >
      <SWRConfig value={WEB_SWR_CONFIG}>
        <HeroUIProvider navigate={router.push}>
          <ToastProvider />
          <StoreProvider initialState={initialState}>
            <InstanceWrapper>{children}</InstanceWrapper>
          </StoreProvider>
        </HeroUIProvider>
      </SWRConfig>
    </NextThemeProvider>
  );
};

"use client";

import { FC, ReactNode } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { SWRConfig } from "swr";
import { WEB_SWR_CONFIG } from "@syncturtle/constants";
import { StoreProvider } from "@/lib/store-context";
import { InstanceWrapper } from "@/lib/wrappers/instance-wrapper";
import { useRouter } from "next/navigation";

export interface IAppProvider {
  children: ReactNode;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
  }
}

export const AppProvider: FC<IAppProvider> = (props) => {
  const { children } = props;
  const router = useRouter();

  return (
    <StoreProvider>
      <NextThemeProvider attribute={"class"} defaultTheme="system" enableSystem themes={["dark", "light"]}>
        <InstanceWrapper>
          <HeroUIProvider navigate={router.push}>
            <ToastProvider />
            <SWRConfig value={WEB_SWR_CONFIG}>{children}</SWRConfig>
          </HeroUIProvider>
        </InstanceWrapper>
      </NextThemeProvider>
    </StoreProvider>
  );
};

"use client";

import { FC, ReactNode } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { HeroUIProvider } from "@heroui/react";
import { StoreProvider } from "@/lib/store-context";
import { SWRConfig } from "swr";
import { DEFAULT_SWR_CONFIG } from "@syncturtle/constants";
import { InstanceWrapper } from "@/lib/wrappers/instance-wrapper";

export interface IAppProvider {
  children: ReactNode;
}

export const AppProvider: FC<IAppProvider> = (props) => {
  const { children } = props;
  console.log("hello from provider.tsx");
  return (
    <StoreProvider>
      <NextThemeProvider attribute={"class"} defaultTheme="system" enableSystem themes={["light", "dark"]}>
        <InstanceWrapper>
          <HeroUIProvider>
            <SWRConfig value={DEFAULT_SWR_CONFIG}>{children}</SWRConfig>
          </HeroUIProvider>
        </InstanceWrapper>
      </NextThemeProvider>
    </StoreProvider>
  );
};

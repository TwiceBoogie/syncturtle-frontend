"use client";

import { FC, ReactNode } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { StoreProvider } from "@/lib/store-context";
import { SWRConfig } from "swr";
import { DEFAULT_SWR_CONFIG } from "@syncturtle/constants";
import { InstanceWrapper, UserWrapper } from "@/lib/wrappers";
import { useRouter } from "next/navigation";
import { ADMIN_BASE_PATH } from "@/helpers/common.helper";

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
  const useHref = (href: string) => ADMIN_BASE_PATH + href;
  return (
    <NextThemeProvider
      attribute={"class"}
      defaultTheme="system"
      enableSystem
      enableColorScheme
      themes={["light", "dark"]}
    >
      <SWRConfig value={DEFAULT_SWR_CONFIG}>
        <HeroUIProvider navigate={router.push} useHref={useHref}>
          <ToastProvider />
          <StoreProvider initialState={initialState}>
            <InstanceWrapper>
              <UserWrapper>{children}</UserWrapper>
            </InstanceWrapper>
          </StoreProvider>
        </HeroUIProvider>
      </SWRConfig>
    </NextThemeProvider>
  );
};

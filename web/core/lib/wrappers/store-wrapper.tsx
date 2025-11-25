import { FC, ReactNode, useEffect } from "react";
import { useTheme } from "next-themes";
import { useParams } from "next/navigation";
// store hooks
import { useAppTheme, useRouterParams } from "@/hooks/store";

interface IStoreWrapper {
  children: ReactNode;
}

const StoreWrapper: FC<IStoreWrapper> = (props) => {
  const { children } = props;

  const { setTheme } = useTheme();
  const params = useParams();
  // store hooks
  const { setQuery } = useRouterParams();
  const { sidebarCollapsed, toggleSidebar } = useAppTheme();

  useEffect(() => {
    const localValue = localStorage && localStorage.getItem("app_sidebar_collapsed");
    const localBoolValue = localValue ? (localValue === "true" ? true : false) : false;
    if (localValue && sidebarCollapsed === undefined) {
      toggleSidebar(localBoolValue);
    }
  }, [sidebarCollapsed, setTheme, toggleSidebar]);

  useEffect(() => {
    if (!params) {
      return;
    }
    setQuery(params);
  }, [params, setQuery]);

  return <>{children}</>;
};

export default StoreWrapper;

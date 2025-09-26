import { FC, ReactNode, useEffect } from "react";
import useSWR from "swr";
// hooks
import { useTheme } from "@/hooks/store";

interface IUserWrapper {
  children: ReactNode;
}

export const UserWrapper: FC<IUserWrapper> = (props) => {
  const { children } = props;
  //hooks
  const { isSidebarCollapsed, toggleSidebar } = useTheme();
  //   const { currentUser, fetchCurrentUser } = useUser();
  //   const { fetchInstanceAdmins } = useInstance();

  //   useSWR("CURRENT_USER", () => fetchCurrentUser(), {
  //     shouldRetryOnError: false,
  //   });
  //   useSWR("INSTANCE_ADMINS", () => fetchInstanceAdmins());

  useEffect(() => {
    const localValue = localStorage && localStorage.getItem("god_mode_sidebar_collapsed");
    const localBoolValue = localValue ? (localValue === "true" ? true : false) : false;
    if (isSidebarCollapsed === undefined && localBoolValue != isSidebarCollapsed) toggleSidebar(localBoolValue);
  }, [isSidebarCollapsed, toggleSidebar]);

  return <>{children}</>;
};

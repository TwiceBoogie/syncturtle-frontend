"use client";

import { FC, ReactNode } from "react";
import { useInstance } from "@/hooks/store";
import useSWR from "swr";

interface IInstanceWrapper {
  children: ReactNode;
}

export const InstanceWrapper: FC<IInstanceWrapper> = (props) => {
  const { children } = props;
  // custom hooks
  const { fetchInstanceInfo } = useInstance();
  // call hook
  useSWR("INSTANCE_DETAILS", fetchInstanceInfo, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    errorRetryCount: 0,
  });

  return <>{children}</>;
};

import { FC, ReactNode } from "react";
import useSWR from "swr";
// components
import { Spinner } from "@heroui/spinner";
import { MaintenanceView, InstanceNotReady } from "@/components/instance";
// hooks
import { useInstance } from "@/hooks/store";
import { log } from "../log";

type TInstanceWrapper = {
  children: ReactNode;
};

export const InstanceWrapper: FC<TInstanceWrapper> = (props) => {
  const { children } = props;
  const { isLoading, instance, error, fetchInstanceInfo } = useInstance();

  const { isLoading: isInstanceSWRLoading, error: instanceSWRError } = useSWR(
    "INSTANCE_INFORMATION",
    async () => await fetchInstanceInfo(),
    { revalidateOnFocus: false }
  );

  // loading state
  if ((isLoading || isInstanceSWRLoading) && !instance) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (instanceSWRError) return <MaintenanceView />;

  // something went wrong while in the request
  if (error && error?.status === "error") {
    return <MaintenanceView />;
  }

  // instance is not ready and setup is not done
  if (instance?.isSetupDone === false) return <InstanceNotReady />;

  return <>{children}</>;
};

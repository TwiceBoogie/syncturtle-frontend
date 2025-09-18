import { InstanceLoading } from "@/components/instance/loading";
import { useInstance } from "@/hooks/store";
import DefaultLayout from "@/layouts/default-layout";
import { Spinner } from "@heroui/react";
import { FC, ReactNode } from "react";
import useSWR from "swr";

interface IInstanceWrapper {
  children: ReactNode;
}

export const InstanceWrapper: FC<IInstanceWrapper> = (props) => {
  const { children } = props;

  const { isLoading, error, instance, fetchInstanceInfo } = useInstance();

  // useSWR("INSTANCE_DETAILS", async () => fetchInstanceInfo(), {
  //   revalidateOnFocus: false,
  //   revalidateIfStale: false,
  //   errorRetryCount: 0,
  // });

  // // loading state
  // if (!instance && !error) {
  //   console.log(`Instance: ${instance}, Error: ${error}`);
  //   return (
  //     <div className="relative h-screen w-full overflow-y-auto px-6 py-10 mx-auto flex justify-center items-center">
  //       <InstanceLoading />
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <DefaultLayout>
        <div>fail</div>
      </DefaultLayout>
    );
  }

  return <>{children}</>;
};

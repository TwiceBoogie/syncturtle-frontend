import { FC, ReactNode } from "react";
import { InstanceFailureView } from "@/components/instance/instance-fail";
import { InstanceLoading } from "@/components/instance/loading";
import { InstanceSetupForm } from "@/components/instance/setup-form";
import { useInstance } from "@/hooks/store";
import DefaultLayout from "@/layouts/default-layout";
import useSWR from "swr";
import AdminLayout from "@/layouts/admin-layout";

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
  //   // console.log(`Instance: ${instance}, Error: ${error}`);
  //   return (
  //     <DefaultLayout>
  //       <div className="relative h-full w-full overflow-y-auto px-6 py-10 mx-auto flex justify-center items-center">
  //         <InstanceLoading />
  //       </div>
  //     </DefaultLayout>
  //   );
  // }

  if (error) {
    return (
      <DefaultLayout>
        <div className="relative h-full w-full overflow-y-auto px-6 py-10 mx-auto flex justify-center items-center">
          <InstanceFailureView />
        </div>
      </DefaultLayout>
    );
  }

  if (instance && !instance.isSetupDone) {
    return (
      <DefaultLayout>
        <div className="relative h-full w-full overflow-y-auto px-6 py-10 mx-auto flex justify-center items-center">
          <InstanceSetupForm />
        </div>
      </DefaultLayout>
    );
  }

  return <>{children}</>;
};

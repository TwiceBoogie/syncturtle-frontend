import { Button } from "@heroui/react";
import { FC } from "react";

export const InstanceFailureView: FC = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="h-full w-full relative container px-5 mx-auto flex justify-center items-center">
      <div className="w-auto max-w-2xl relative space-y-8 py-10">
        <div className="relative flex flex-col justify-center items-center space-y-4">
          <h3 className="font-medium text-2xl">Unable to fetch instance details</h3>
          <p className="font-medium text-base text-center">
            We were unable to fetch the details of the instance. <br />
            Talk to an administrator for more details.
          </p>
        </div>
        <div className="flex justify-center">
          <Button onPress={handleRetry}>Retry</Button>
        </div>
      </div>
    </div>
  );
};

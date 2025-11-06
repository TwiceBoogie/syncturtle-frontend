import { FC, useEffect, useState } from "react";
// 3rd
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
// store
import { useInstance } from "@/hooks/store";
// service
import { AuthService } from "@/services/auth.service";
// types
import { IInstance, IInstanceAdmin, TInstanceUpdate } from "@syncturtle/types";

interface IGeneralForm {
  instance: IInstance;
  instanceAdmins: IInstanceAdmin[];
}

const authService = new AuthService();

export const GeneralForm: FC<IGeneralForm> = (props) => {
  const { instance, instanceAdmins } = props;
  // hooks
  const { updateInstanceInfo } = useInstance();
  // state
  const [csrfToken, setCsrfToken] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TInstanceUpdate>({
    instanceName: instance?.instanceName,
    namespace: instance?.namespace,
  });

  useEffect(() => {
    const fetchCsrfToken = async () => {
      if (csrfToken === undefined) {
        const { csrfToken: token } = await authService.requestCSRFToken();
        setCsrfToken(token);
      }
    };
    fetchCsrfToken();
  }, [csrfToken]);

  const handleFormChange = (key: keyof TInstanceUpdate, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      if (csrfToken) {
        await updateInstanceInfo(formData, csrfToken);
        addToast({
          title: "Success",
          description: "Settings updated successfully",
          color: "success",
        });
      } else {
        addToast({
          title: "Csrf token error",
          description: "Must have a valid csrf token",
          color: "danger",
        });
      }
    } catch (error) {
      console.error(error);
      addToast({
        title: "Error",
        description: "Oops, an error has occurred. Please try again later",
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="text-lg font-medium">Instance details</div>
        <div className="grid grid-col w-full grid-cols-1 items-center justify-between gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Input
            id="instanceName"
            type="text"
            name="instanceName"
            label="Name of Instance"
            labelPlacement="outside"
            value={formData.instanceName}
            onValueChange={(value) => handleFormChange("instanceName", value)}
          />
          <Input
            id="email"
            type="email"
            name="email"
            label="Email"
            labelPlacement="outside"
            value={instanceAdmins[0]?.user.email}
            isDisabled
            disableAnimation
          />
          <Input
            id="instanceId"
            type="text"
            name="instanceId"
            label="Instance Id"
            labelPlacement="outside"
            value={instance.id}
            isDisabled
            disableAnimation
          />
        </div>
      </div>
      <Button color="primary" isLoading={isSubmitting} onPress={onSubmit}>
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};

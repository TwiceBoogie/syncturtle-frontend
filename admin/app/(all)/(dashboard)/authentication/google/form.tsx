import { FC, FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
// heroui
import { useInstance } from "@/hooks/store";
import { useDisclosure } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
// components
import { ConfirmDiscardModal } from "@/components/common/confirm-discard-modal";
// types
import { IApiErrorPayload, TFormattedInstanceConfiguration } from "@syncturtle/types";

type TGoogleFieldKey = "GOOGLE_CLIENT_ID" | "GOOGLE_CLIENT_SECRET";

type TGoogleConfigFormValues = Record<TGoogleFieldKey, string>;
type FieldErrors = Partial<Record<TGoogleFieldKey, string[]>>;

interface IInstanceGoogleConfigFormProps {
  config: TFormattedInstanceConfiguration;
}

export const InstanceGoogleConfigForm: FC<IInstanceGoogleConfigFormProps> = (props) => {
  const { config } = props;
  const router = useRouter();
  // store hooks
  const { updateInstanceConfigurations } = useInstance();

  // ***** modal state *****
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  // form state
  const [formData, setFormData] = useState<TGoogleConfigFormValues>({
    GOOGLE_CLIENT_ID: config["GOOGLE_CLIENT_ID"],
    GOOGLE_CLIENT_SECRET: config["GOOGLE_CLIENT_SECRET"],
  });

  // client + server errors per field
  const [errors, setErrors] = useState<FieldErrors>({});
  // non-field banner error (internal server errors)
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDirty = useMemo(() => {
    return (
      formData.GOOGLE_CLIENT_ID !== config["GOOGLE_CLIENT_ID"] ||
      formData.GOOGLE_CLIENT_SECRET !== config["GOOGLE_CLIENT_SECRET"]
    );
  }, [formData, config]);

  const handleFormChange = (key: TGoogleFieldKey, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setBannerError(null);
  };

  const handleGoBack = () => {
    if (isDirty) {
      onOpen();
    } else {
      router.push("/authentication");
    }
    // if not dirty, let navigation continue
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBannerError(null);
    setErrors({});

    try {
      setIsSubmitting(true);

      const payload: Partial<TGoogleConfigFormValues> = { ...formData };

      const response = await updateInstanceConfigurations(payload);

      addToast({
        title: "Done!",
        description: "Your Google authentication is configured. You should test it now.",
        color: "success",
      });
    } catch (error: unknown) {
      const apiError = error as IApiErrorPayload;
      if (apiError && typeof apiError === "object" && "type" in apiError) {
        if (apiError.fieldErrors) {
          setErrors(apiError.fieldErrors);
        }
        setBannerError(apiError.message ?? "Validation failed. Please check your inputs.");
        return;
      }

      if (error instanceof Error) {
        setBannerError(error.message);
      } else {
        setBannerError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <>
      <ConfirmDiscardModal
        isOpen={isOpen}
        handleClose={onClose}
        onOpenChange={onOpenChange}
        onDiscardHref="/authentication"
      />
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-2 gap-x-12 gap-y-8 w-full">
          <div className="flex flex-col gap-y-4 col-span-2 md:col-span-1 pt-1">
            <div className="pt-2.5 text-xl font-medium">
              Google-provided details for Sync<span className="text-green-400">Turtle</span>
            </div>
            <Form validationBehavior="aria" validationErrors={errors} onSubmit={handleSubmit}>
              {bannerError && (
                <div className="rounded-md bg-red-500/50 border border-red-500/40 px-3 py-2 text-sm text-red-500">
                  {bannerError}
                </div>
              )}
              <Input
                type="text"
                name="GOOGLE_CLIENT_ID"
                label="Client ID"
                labelPlacement="outside"
                placeholder="4954205...apps.googleusercontent.com"
                value={formData.GOOGLE_CLIENT_ID}
                onValueChange={(value) => handleFormChange("GOOGLE_CLIENT_ID", value)}
                description={
                  <>
                    Your client ID lives in your Google API Console.{" "}
                    <a
                      tabIndex={-1}
                      href="https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow#creatingcred"
                      target="_blank"
                      className="text-custom-primary-100 hover:underline"
                      rel="noreferrer"
                    >
                      Learn more
                    </a>
                  </>
                }
                size="sm"
                radius="sm"
                isRequired
              />
              <Input
                type="password"
                name="GOOGLE_CLIENT_SECRET"
                label="Secret ID"
                labelPlacement="outside"
                placeholder="GOCShX..."
                value={formData.GOOGLE_CLIENT_SECRET}
                onValueChange={(value) => handleFormChange("GOOGLE_CLIENT_SECRET", value)}
                description={
                  <>
                    Your secret ID lives in your Google API Console.{" "}
                    <a
                      tabIndex={-1}
                      href="https://developers.google.com/identity/oauth2/web/guides/get-google-api-clientid"
                      target="_blank"
                      className="text-custom-primary-100 hover:underline"
                      rel="noreferrer"
                    >
                      Learn more
                    </a>
                  </>
                }
                size="sm"
                radius="sm"
                isRequired
              />
              <div className="flex items-center gap-4 pt-2">
                <Button
                  color="primary"
                  size="sm"
                  type="submit"
                  isLoading={isSubmitting}
                  isDisabled={!isDirty || isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save changes"}
                </Button>
                <Button onPress={handleGoBack} size="sm">
                  Go back
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

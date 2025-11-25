import { FC, FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// heroui
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { Alert } from "@heroui/alert";
import { Form, Input, Select, SelectItem } from "@heroui/react";
// service
import { ICreateWorkspace, WorkspaceService } from "@/services/workspace.service";
import { HttpError } from "@/services/api.service";
//store
import { useWorkspace } from "@/hooks/store";
//helpers
import { ValidationError } from "@/helpers/errors.helper";
import { WEB_BASE_URL } from "@/helpers/common.helper";
import { IWorkspace, IApiErrorPayload } from "@syncturtle/types";

const organizationSizeSelect = [
  {
    key: "self",
    label: "Just myself",
  },
  {
    key: "2-10",
    label: "2-10",
  },
  {
    key: "11-50",
    label: "11-50",
  },
];

const workspaceService = new WorkspaceService();

interface IAlertBanner {
  bannerData: string | undefined;
  handleBannerData?: (bannerData: string | undefined) => void;
}
const AlertBanner: FC<IAlertBanner> = (props) => {
  const { bannerData, handleBannerData } = props;
  return (
    <div className="place-self-center w-full max-w-sm">
      <Alert description={bannerData} onClose={() => handleBannerData?.(undefined)} color="danger" />
    </div>
  );
};

export const WorkspaceCreateForm: FC = () => {
  // router
  const router = useRouter();
  // store hook
  const { createWorkspace } = useWorkspace();
  // state
  const [serverErrors, setServerErrors] = useState<Record<string, string | string[]>>({});
  const [bannerError, setBannerError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ICreateWorkspace>({
    name: "",
    slug: "",
    organizationSize: "",
  });

  const handleFormChange = (key: keyof IWorkspace, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const workspaceBaseURL = encodeURI(WEB_BASE_URL || window.location.origin + "/");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // clear previous round
    setServerErrors({});
    setBannerError("");
    setIsSubmitting(true);
    try {
      // check slug availability and validate
      const slugRes = await workspaceService.slugCheck(formData.slug ?? "");
      if (slugRes && !slugRes.status) {
        const response = await createWorkspace(formData);
        console.log(response);
        addToast({
          title: "Success",
          description: "Workspace has been created successfully.",
          color: "success",
        });
      }
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        setServerErrors(error.fieldErrors);
      } else if (error instanceof HttpError) {
        const payload = error.data as IApiErrorPayload | null;
        setBannerError(payload?.message ?? "Something went wrong. Please try again.");
      } else if (error instanceof Error) {
        setBannerError(error.message);
      } else {
        setBannerError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Form
      validationBehavior="aria"
      validationErrors={serverErrors}
      onSubmit={handleSubmit}
      className="gap-x-10 gap-y-6"
    >
      {bannerError && <AlertBanner bannerData={bannerError} handleBannerData={(value) => setBannerError(value)} />}
      <Input
        id="workspaceName"
        type="text"
        name="name"
        label="Name your workspace"
        labelPlacement="outside"
        placeholder="Something familiar"
        value={formData.name}
        maxLength={80}
        onValueChange={(value) => {
          handleFormChange("name", value);
          handleFormChange("slug", value.toLocaleLowerCase().trim().replace(/ /g, "-"));
        }}
        radius="sm"
        isRequired
      />
      <Input
        id="slug"
        type="text"
        name="slug"
        label="Set your workspace's URL"
        labelPlacement="outside"
        placeholder="workspace-name"
        startContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-default-400 text-small">{workspaceBaseURL}</span>
          </div>
        }
        value={(formData.slug ?? "").toLocaleLowerCase().trim().replace(/ /g, "-")}
        onValueChange={(value) => {
          setBannerError("");
          handleFormChange("slug", value.toLowerCase());
        }}
        radius="sm"
        isRequired
      />
      <Select
        size="md"
        name="organizationSize"
        label="Organization size"
        labelPlacement="outside"
        placeholder="Just myself"
        items={organizationSizeSelect}
        isRequired
      >
        {(size) => <SelectItem>{size.label}</SelectItem>}
      </Select>
      <div className="flex items-center py-1 gap-4">
        <Button type="submit" isDisabled={isSubmitting} color="primary" radius="sm">
          Create workspace
        </Button>
        <Button type="button" radius="sm" as={Link} href="/workspace">
          Back
        </Button>
      </div>
    </Form>
  );
};

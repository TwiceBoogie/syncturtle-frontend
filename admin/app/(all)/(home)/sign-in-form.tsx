import { FC, FormEvent, useEffect, useMemo, useState } from "react";
// heroui
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
// services
import { AuthService } from "@/services/auth.service";
// constants
import { API_BASE_URL } from "@/helpers/common.helper";
// icons
import { Eye, EyeOff } from "lucide-react";
// swr
import { mutate } from "swr";

type TFormData = {
  email: string;
  password: string;
};

const initialData: TFormData = {
  email: "",
  password: "",
};

const authService = new AuthService();

export const InstanceSignInForm: FC = () => {
  // state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TFormData>(initialData);
  const [showPassword, setShowPassword] = useState(false);

  const handleFormChange = (key: keyof TFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const isButtonDisabled = useMemo(
    () => (!isSubmitting && formData.email && formData.password ? false : true),
    [formData.email, formData.password, isSubmitting]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await authService.login(formData);

      await Promise.all([mutate("CURRENT_USER"), mutate("INSTANCE_ADMINS")]);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <Input
        id="email"
        type="email"
        name="email"
        placeholder="name@company.com"
        label="Email"
        labelPlacement="outside"
        isRequired
        radius="none"
        size="lg"
        value={formData.email}
        onValueChange={(value) => handleFormChange("email", value)}
        classNames={{
          label: ["group-[&:not([data-invalid=true])]:!text-onboarding-text-300 text-sm"],
          inputWrapper: ["rounded-md border border-onboarding-border-100 !bg-onboarding-background-300"],
          input: "text-sm",
        }}
      />
      <Input
        id="password"
        type={showPassword ? "text" : "password"}
        name="password"
        placeholder="Enter your password..."
        label="Password"
        labelPlacement="outside"
        isRequired
        radius="none"
        size="lg"
        value={formData.password}
        onValueChange={(value) => handleFormChange("password", value)}
        classNames={{
          label: ["group-[&:not([data-invalid=true])]:!text-onboarding-text-300 text-sm"],
          inputWrapper: ["rounded-md border border-onboarding-border-100 !bg-onboarding-background-300"],
          input: "text-sm",
        }}
        endContent={
          <button
            type="button"
            tabIndex={-1}
            aria-label="toggle password visibility"
            className="focus:outline-solid outline-transparent cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <Eye className="text-custom-text-400 h-4 w-4" />
            ) : (
              <EyeOff className="text-custom-text-400 h-4 w-4" />
            )}
          </button>
        }
      />
      <Button
        type="submit"
        color="primary"
        className="rounded w-full"
        isLoading={isSubmitting}
        isDisabled={isButtonDisabled}
      >
        Sign-in
      </Button>
    </form>
  );
};

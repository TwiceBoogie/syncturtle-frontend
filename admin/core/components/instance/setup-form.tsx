import { FC, FormEvent, useEffect, useMemo, useState } from "react";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Eye, EyeOff } from "lucide-react";
// components
import { PasswordStrenthIndicator } from "@syncturtle/ui";
import { Button } from "@heroui/react";
import { AuthService } from "@/services/auth.service";
import { API_BASE_URL } from "@/helpers/common.helper";
import { useRouter } from "next/navigation";

const authService = new AuthService();

type TFormData = {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  password: string;
  confirmPassword?: string;
};

const defaultFormData: TFormData = {
  firstName: "",
  lastName: "",
  email: "",
  companyName: "",
  password: "",
};

type TShowPassword = {
  password: boolean;
  retypePassword: boolean;
};

export const InstanceSetupForm: FC = (props) => {
  const router = useRouter();
  const {} = props;
  // state
  const [csrfToken, setCsrfToken] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordInputFocused, setIsPasswordInputFocused] = useState(false);
  const [isRetryPasswordInputFocused, setIsRetryPasswordInputFocused] = useState(false);
  const [formData, setFormData] = useState<TFormData>(defaultFormData);
  const [showPassword, setShowPassword] = useState<TShowPassword>({
    password: false,
    retypePassword: false,
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

  const handleShowPassword = (key: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFormChange = (key: keyof TFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      const url = `${API_BASE_URL}/api/v1/instances/admins/sign-up`;
      console.log("POST →", window.location.origin + url);
      const res = await fetch(`${API_BASE_URL}/api/v1/instances/admins/sign-up`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRF-TOKEN": csrfToken } : {}),
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        throw new Error(`Http ${res.status}`);
      }
      console.log(res.headers.get("Location"));
      router.push("/general");
    } catch (error) {
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = useMemo(
    () =>
      !isSubmitting &&
      formData.firstName &&
      formData.lastName &&
      formData.companyName &&
      formData.email &&
      formData.password &&
      formData.password === formData.confirmPassword
        ? false
        : true,
    [
      formData.firstName,
      formData.lastName,
      formData.companyName,
      formData.email,
      formData.password,
      formData.confirmPassword,
    ]
  );

  const password = formData.password ?? "";
  const confirmPassword = formData.confirmPassword ?? "";
  const renderPasswordMatchError = !isRetryPasswordInputFocused || confirmPassword.length >= password.length;
  return (
    <div className="max-w-lg lg:max-w-md w-full">
      <div className="relative flex flex-col space-y-6">
        <div className="text-center space-y-1">
          <h3 className="flex gap-4 justify-center text-3xl font-bold text-onboarding-text-100">
            Setup your Syncturtle Instance
          </h3>
          <p className="font-medium text-onboarding-text-400">
            Post setup you will be able to manage this Syncturtle instance.
          </p>
        </div>

        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Input
              id="firstName"
              type="text"
              name="firstName"
              placeholder="Luna"
              label="First name"
              labelPlacement="outside"
              isRequired
              radius="none"
              size="lg"
              value={formData.firstName}
              onValueChange={(value) => handleFormChange("firstName", value)}
              classNames={{
                label: ["group-[&:not([data-invalid=true])]:!text-onboarding-text-300 text-sm"],
                inputWrapper: ["rounded-md border border-onboarding-border-100 !bg-onboarding-background-300"],
                input: "text-sm",
              }}
            />

            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Snow"
              label="Last name"
              labelPlacement="outside"
              isRequired
              radius="none"
              size="lg"
              value={formData.lastName}
              onValueChange={(value) => handleFormChange("lastName", value)}
              classNames={{
                label: ["group-[&:not([data-invalid=true])]:!text-onboarding-text-300 text-sm"],
                inputWrapper: ["rounded-md border border-onboarding-border-100 !bg-onboarding-background-300"],
                input: "text-sm",
              }}
            />
          </div>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="name@company.com"
            label="Email"
            labelPlacement="outside"
            radius="none"
            isRequired
            size="lg"
            value={formData.email}
            onValueChange={(value) => handleFormChange("email", value)}
            classNames={{
              label: ["group-[&:not([data-invalid=true])]:!text-onboarding-text-300 text-sm"],
              inputWrapper: ["rounded-md border border-onboarding-border-100 !bg-onboarding-background-300"],
              input: "text-sm",
            }}
          />
          <div className="w-full space-y-1">
            <Input
              id="companyName"
              type="text"
              name="companyName"
              placeholder="Company name"
              label="Company name"
              labelPlacement="outside"
              isRequired
              radius="none"
              size="lg"
              value={formData.companyName}
              onValueChange={(value) => handleFormChange("companyName", value)}
              classNames={{
                label: ["group-[&:not([data-invalid=true])]:!text-onboarding-text-300 text-sm"],
                inputWrapper: ["rounded-md border border-onboarding-border-100 !bg-onboarding-background-300"],
                input: "text-sm",
              }}
            />
          </div>
          <div className="w-full space-y-1">
            <Input
              id="password"
              type={showPassword.password ? "text" : "password"}
              name="password"
              placeholder="New password..."
              label="Set a password"
              labelPlacement="outside"
              isRequired
              radius="none"
              size="lg"
              value={formData.password}
              onValueChange={(value) => handleFormChange("password", value)}
              onFocus={() => setIsPasswordInputFocused(true)}
              onBlur={() => setIsPasswordInputFocused(false)}
              classNames={{
                label: ["group-[&:not([data-invalid=true])]:!text-onboarding-text-300 text-sm"],
                inputWrapper: ["rounded-md border border-onboarding-border-100 !bg-onboarding-background-300"],
                input: "text-sm",
                description: "text-sm",
              }}
              endContent={
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label="toggle password visibility"
                  className="focus:outline-solid outline-transparent cursor-pointer"
                  onClick={() => handleShowPassword("password")}
                >
                  {showPassword.password ? (
                    <Eye className="text-custom-text-400 h-4 w-4" />
                  ) : (
                    <EyeOff className="text-custom-text-400 h-4 w-4" />
                  )}
                </button>
              }
            />
            <PasswordStrenthIndicator password={formData.password} isFocused={isPasswordInputFocused} />
          </div>
          <div className="w-full space-y-1">
            <Input
              id="confirmPassword"
              type={showPassword.retypePassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Retype password..."
              label="Confirm password"
              labelPlacement="outside"
              isRequired
              radius="none"
              size="lg"
              value={formData.confirmPassword ?? ""}
              onValueChange={(value) => handleFormChange("confirmPassword", value)}
              onFocus={() => setIsRetryPasswordInputFocused(true)}
              onBlur={() => setIsRetryPasswordInputFocused(false)}
              validate={() => {
                if (
                  !!formData.confirmPassword &&
                  formData.confirmPassword !== formData.password &&
                  renderPasswordMatchError
                ) {
                  return "Passwords don't match";
                }
                return null;
              }}
              classNames={{
                label: ["group-[&:not([data-invalid=true])]:!text-onboarding-text-300 text-sm"],
                inputWrapper: ["rounded-md border border-onboarding-border-100 !bg-onboarding-background-300"],
                input: "text-sm",
              }}
              endContent={
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label="toggle retype password visibility"
                  className="focus:outline-solid outline-transparent cursor-pointer"
                  onClick={() => handleShowPassword("retypePassword")}
                >
                  {showPassword.retypePassword ? (
                    <Eye className="text-custom-text-400 h-4 w-4" />
                  ) : (
                    <EyeOff className="text-custom-text-400 h-4 w-4" />
                  )}
                </button>
              }
            />
          </div>
          <Button
            type="submit"
            className="rounded w-full"
            color="primary"
            isDisabled={isButtonDisabled}
            isLoading={isSubmitting}
          >
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
};

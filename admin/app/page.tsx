"use client";

import { API_BASE_URL } from "@/helpers/common.helper";
import DefaultLayout from "@/layouts/default-layout";
import { AuthService } from "@/services/auth.service";
import { Button, Input } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

type TFormData = {
  email: string;
  password: string;
};

const initialData: TFormData = {
  email: "",
  password: "",
};

const authService = new AuthService();

// login
export default function Home() {
  const router = useRouter();
  // state
  const [csrfToken, setCsrfToken] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TFormData>(initialData);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      if (csrfToken === undefined) {
        const { csrfToken: token } = await authService.requestCSRFToken();
        setCsrfToken(token);
      }
    };
    fetchCsrfToken();
  }, [csrfToken]);

  const handleFormChange = (key: keyof TFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const isButtonDisabled = useMemo(
    () => (!isSubmitting && formData.email && formData.password ? false : true),
    [formData.email, formData.password, isSubmitting]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      const url = `${API_BASE_URL}/api/v1/auth/admin/login`;
      console.log("POST ->", window.location.origin + url);
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/admin/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRF-TOKEN": csrfToken } : {}),
        },
        body: JSON.stringify(formData),
      });
      console.log(res.status);
      if (!res.ok) {
        throw new Error(`Http ${res.status}`);
      }
      console.log("should push");
      router.push("/general");
    } catch (error) {
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="flex-grow container mx-auto max-w-lg px-10 lg:max-w-md lg:px-10 py-10 lg:pt-28 transition-all">
        <div className="relative flex flex-col space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-3xl font-bold text-onboarding-text-100">
              Manage your Sync<span className="text-green-400">turtle</span> instance
            </h3>
            <p className="font-medium text-onboarding-text-400">
              Configure instance-wide settings to secure your instance
            </p>
          </div>
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
        </div>
      </div>
    </DefaultLayout>
  );
}

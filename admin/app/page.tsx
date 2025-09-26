"use client";

import DefaultLayout from "@/layouts/default-layout";
import { Button, Input } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { useMemo, useState } from "react";

type TFormData = {
  email: string;
  password: string;
};

const initialData: TFormData = {
  email: "",
  password: "",
};

// login
export default function Home() {
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
          <form className="space-y-10">
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
            <Button color="primary" className="rounded w-full" isLoading={isSubmitting} isDisabled={isButtonDisabled}>
              Sign-in
            </Button>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
}

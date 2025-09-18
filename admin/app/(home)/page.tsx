"use client";

import React, { FC, useState } from "react";
import { Button, Form, Input } from "@heroui/react";
import { PasswordStrenthIndicator } from "@syncturtle/ui";
// import { Input } from "@syncturtle/ui";

import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "next-themes";

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

// login
export default function Home() {
  const { resolvedTheme, setTheme } = useTheme();
  // state
  const [isPasswordInputFocused, setIsPasswordInputFocused] = useState(false);
  const [isRetryPasswordInputFocused, setIsRetryPasswordInputFocused] = useState(false);
  const [formData, setFormData] = useState<TFormData>(defaultFormData);
  const [showPassword, setShowPassword] = useState<TShowPassword>({
    password: false,
    retypePassword: false,
  });

  const handleShowPassword = (key: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFormChange = (key: keyof TFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const password = formData.password ?? "";
  const confirmPassword = formData.confirmPassword ?? "";
  const renderPasswordMatchError = !isRetryPasswordInputFocused || confirmPassword.length >= password.length;
  return (
    <div className="relative h-full w-full overflow-y-auto px-6 py-10 mx-auto flex justify-center items-center">
      {/* setup-form.tsx */}
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

          <Form className="space-y-4">
            <input type="hidden" />
            <input type="hidden" />
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
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

              <div className="w-full space-y-1">
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
            </div>
            <div className="w-full space-y-1">
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
            </div>
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
                // description={
                //   <PasswordStrenthIndicator password={formData.password} isFocused={isPasswordInputFocused} />
                // }
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
                value={formData.confirmPassword}
                onValueChange={(value) => handleFormChange("confirmPassword", value)}
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
          </Form>
          {/* <form className="space-y-4">
            <div className="w-full space-y-1">
              <label className="text-sm text-onboarding-text-300 font-medium" htmlFor="password">
                Set a password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  className="w-full border border-onboarding-border-100 !bg-onboarding-background-200 placeholder:text-onboarding-text-400"
                  id="password"
                  name="password"
                  type={showPassword.password ? "text" : "password"}
                  inputSize="md"
                  placeholder="New password..."
                  value={formData.password}
                  onChange={(e) => handleFormChange("password", e.target.value)}
                  // hasError={errorData.type && errorData.type === EErrorCodes.INVALID_PASSWORD ? true : false}
                  onFocus={() => setIsPasswordInputFocused(true)}
                  onBlur={() => setIsPasswordInputFocused(false)}
                  autoComplete="on"
                />
                {showPassword.password ? (
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-3.5 flex items-center justify-center text-custom-text-400"
                    onClick={() => handleShowPassword("password")}
                  >
                    <EyeOff className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-3.5 flex items-center justify-center text-custom-text-400"
                    onClick={() => handleShowPassword("password")}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                )}
              </div>
              <PasswordStrenthIndicator password={formData.password} isFocused={isPasswordInputFocused} />
            </div>
          </form> */}
          <Button
            className="text-custom-text-100"
            onPress={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            Change theme
          </Button>
        </div>
      </div>
    </div>
  );
}

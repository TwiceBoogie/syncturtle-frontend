import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

const inputVariants = tv({
  base: "block rounded-md bg-transparent text-sm placeholder-custom-text-400 focus:outline-none",
  variants: {
    mode: {
      primary: "border-[0.5px] border-custom-border-200",
      transparent: "border-none bg-transparent ring-0 transition-all focus:ring-1 focus:ring-custom-primary",
      "true-transparent": "border-none bg-transparent ring-0",
    },
    inputSize: {
      xs: "px-1.5 py-1",
      sm: "px-3 py-2",
      md: "p-3",
    },
    hasError: {
      true: "",
      false: "",
    },
  },
  defaultVariants: {
    mode: "primary",
    inputSize: "md",
  },
  compoundVariants: [{ mode: "primary", hasError: true, class: "border-red-500" }],
});

export interface InputProps extends React.ComponentProps<"input">, VariantProps<typeof inputVariants> {
  autoComplete?: "on" | "off";
  mode?: "primary" | "transparent" | "true-transparent";
  inputSize?: "xs" | "sm" | "md";
  hasError?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ id, type, name, mode, inputSize, hasError = false, className, autoComplete = "off", ...rest }, ref) => {
    return (
      <input
        id={id}
        ref={ref}
        type={type}
        name={name}
        className={inputVariants({ mode, inputSize, hasError, class: className })}
        autoComplete={autoComplete}
        {...rest}
      />
    );
  }
);

Input.displayName = "syncturtle-input";

import { cn } from "@syncturtle/utils";

export type TInputVariant = "primary" | "danger" | "transparent";
export type TInputSize = "xs" | "sm" | "md";

export type TInputVariantProps = {
  variant?: TInputVariant;
  size?: TInputSize;
  hasError?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  hasStartContent?: boolean;
  hasEndContent?: boolean;
  className?: string;
};

const WRAPPER_BASE =
  "flex items-center rounded-md px-3 outline-1 -outline-offset-1 " +
  "transition-colors has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2";

const WRAPPER_MODE_CLASSES: Record<TInputVariant, string> = {
  primary: "bg-gray-800 outline-gray-600 has-[input:focus-within]:outline-indigo-500",
  transparent: "bg-white/5 outline-gray-700 has-[input:focus-visible]:outline-indigo-500",
  danger: "",
};

const WRAPPER_SIZE_CLASSES: Record<TInputSize, string> = {
  xs: "",
  sm: "",
  md: "",
};

export function getInputWrapperClassNames(props: TInputVariantProps & { className?: string }) {
  const {
    variant = "primary",
    size = "sm",
    hasError,
    disabled,
    readOnly,
    hasStartContent,
    hasEndContent,
    className,
  } = props;
  const isDisabledLike = disabled || readOnly;

  return cn(
    WRAPPER_BASE,
    WRAPPER_MODE_CLASSES[variant],
    WRAPPER_SIZE_CLASSES[size],
    (hasStartContent || hasEndContent) && "gap-x-2",
    hasError && "bg-red-950/40 outline-red-500/60 has-[input:focus-visible]:outline-red-500",
    isDisabledLike && "bg-gray-800/70 outline-gray-700 cursor-not-allowed",
    className
  );
}

const INPUT_BASE = "block min-w-0 grow bg-transparent focus:outline-none placeholder:text-gray-500";

const INPUT_SIZE_CLASSES: Record<TInputSize, string> = {
  xs: "py-1 text-xs sm:text-xs",
  sm: "py-1.5 text-sm sm:text-sm/6",
  md: "py-2 text-sm sm:text-sm/6",
};

export function getInputInnerClassNames(props: TInputVariantProps & { className?: string }) {
  const { size = "md", hasError, disabled, readOnly, className } = props;

  const isDisabledLike = disabled || readOnly;

  return cn(
    INPUT_BASE,
    INPUT_SIZE_CLASSES[size],

    hasError ? "text-red-50 placeholder:text-red-300" : "text-white placeholder:text-gray-500",
    isDisabledLike && "cursor-not-allowed text-gray-500 placeholder:text-gray-600",

    className
  );
}

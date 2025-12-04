import { cn } from "@syncturtle/utils";

export type TButtonVariant = "primary" | "secondary" | "danger";
export type TButtonSize = "sm" | "md" | "lg";

export type TButtonVariantProps = {
  variant?: TButtonVariant;
  size?: TButtonSize;
  fullWidth?: boolean;
  isIconOnly?: boolean;
  isDisabled?: boolean;
};

export type TButtonStyles = Record<
  TButtonVariant,
  {
    default: string;
    hover: string;
    pressed: string;
    disabled: string;
  }
>;

const BASE = "font-medium text-sm rounded flex items-center gap-1.5 whitespace-nowrap transition-all justify-center";

const SIZE_CLASSES: Record<TButtonSize, string> = {
  sm: "px-3 py-1.5",
  md: "px-4 py-1.5",
  lg: "px-5 py-2",
};

export const buttonStyling: TButtonStyles = {
  primary: {
    default: `text-white bg-custom-primary-100`,
    hover: `hover:bg-custom-primary-200`,
    pressed: `focus:text-custom-brand-40 focus:bg-custom-primary-200`,
    disabled: `cursor-not-allowed !bg-custom-primary-60 hover:bg-custom-primary-60`,
  },
  secondary: {
    default: "",
    hover: "",
    pressed: "",
    disabled: "",
  },
  danger: {
    default: `text-white bg-red-500`,
    hover: `hover:bg-red-600`,
    pressed: `focus:text-red-200 focus:bg-red-600`,
    disabled: `cursor-not-allowed !bg-red-300`,
  },
};

export function getButtonClassNames(props: TButtonVariantProps & { className?: string }) {
  const { size = "md", variant = "primary", fullWidth, isDisabled, isIconOnly, className } = props;

  const currentVariant = buttonStyling[variant];

  return cn(
    BASE,
    SIZE_CLASSES[size],

    currentVariant.default,
    isDisabled && currentVariant.disabled,
    !isDisabled && currentVariant.hover,
    !isDisabled && currentVariant.pressed,

    fullWidth && "w-full",
    isIconOnly ? "px-0 !gap-0" : "[&>svg]:max-w-[theme(spacing.8)]",
    className
  );
}

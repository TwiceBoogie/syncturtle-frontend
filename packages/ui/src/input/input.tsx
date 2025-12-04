import * as React from "react";
import { AlertCircle, Lock } from "lucide-react";
import { getInputInnerClassNames, getInputWrapperClassNames, TInputSize, TInputVariant } from "./styles";
import { cn } from "@syncturtle/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  autoComplete?: "on" | "off";
  variant?: TInputVariant;
  inputSize?: TInputSize;
  hasError?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  label?: string;
  helper?: string;
  errorMessage?: string;
  description?: string;
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    id,
    name,
    type = "text",
    variant = "primary",
    inputSize = "md",
    hasError,
    isInvalid,
    isRequired,
    startContent: startContentProp,
    endContent: endContentProp,
    label,
    helper,
    wrapperClassName,
    className,
    autoComplete = "off",
    disabled,
    readOnly,
    description,
    errorMessage,
    ...rest
  } = props;

  const inputId = id ?? name;
  const showError = hasError || isInvalid;
  const isDisabledLike = disabled || readOnly;

  const wrapperClasses = getInputWrapperClassNames({
    variant,
    size: inputSize,
    hasError: showError,
    disabled,
    readOnly,
    hasStartContent: !!startContentProp,
    hasEndContent: !!endContentProp,
    className: wrapperClassName,
  });

  const inputClasses = getInputInnerClassNames({
    size: inputSize,
    hasError: showError,
    disabled,
    readOnly,
    className,
  });

  const getIconClone = (icon: React.ReactNode) =>
    React.isValidElement(icon)
      ? React.cloneElement(icon, {
          // @ts-ignore
          "aria-hidden": true,
          focusable: false,
        })
      : null;

  const startContent = getIconClone(startContentProp);
  const endContent = getIconClone(endContentProp);

  const hasHelper = !!description || !!errorMessage;

  const helperWrapper = React.useMemo(() => {
    const shouldShowError = isInvalid && errorMessage;
    const hasContent = shouldShowError || description;

    if (!hasHelper || !hasContent) return null;

    return (
      <div>
        {shouldShowError ? (
          <p id={`${inputId}-error-message`} className="mt-2 flex items-center gap-x-1.5 text-xs/5 text-red-400">
            <AlertCircle className="h-4 w-4 flex-none" aria-hidden="true" />
            {errorMessage}
          </p>
        ) : (
          <p className="mt-2 text-xs/5 text-gray-400">{description}</p>
        )}
      </div>
    );
  }, [hasHelper, isInvalid, errorMessage, description]);

  return (
    <div>
      {(label || helper || readOnly) && (
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={inputId}
              className={cn("block text-sm/6 font-medium", showError ? "text-red-200" : "text-white")}
            >
              {label}
              {isRequired && (
                <>
                  <span className="ml-0.5 text-xs font-semibold text-red-500" aria-hidden="true">
                    *
                  </span>
                  <span className="sr-only"> (required)</span>
                </>
              )}
            </label>
          )}

          {helper && !showError && <span className="text-xs/5 text-gray-400">{helper}</span>}

          {readOnly && !disabled && (
            <span className="inline-flex items-center gap-x-1 rounded-full bg-gray-800 px-2 py-0.5 text-[10px] font-medium text-gray-400 ring-1 ring-gray-700/80">
              <Lock className="h-3 w-3" aria-hidden="true" />
              Read-only
            </span>
          )}
        </div>
      )}
      <div className={label || helper || readOnly ? "mt-2" : undefined}>
        <div className={wrapperClasses}>
          {startContent && <span className="flex items-center text-gray-400">{startContent}</span>}
          <input
            id={inputId}
            ref={ref}
            type={type}
            name={name}
            autoComplete={autoComplete}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={showError || undefined}
            className={inputClasses}
            required={isRequired}
            {...rest}
          />
          {endContent && <span className="flex items-center text-gray-400">{endContent}</span>}
        </div>
      </div>
      {helperWrapper}
    </div>
  );
});

Input.displayName = "syncturtle-input";

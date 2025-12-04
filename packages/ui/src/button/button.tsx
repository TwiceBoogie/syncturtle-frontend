import * as React from "react";
import { getButtonClassNames, TButtonVariantProps } from "./styles";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  spinner?: React.ReactNode;
  isLoading?: boolean;
}

export type UseButtonProps = Props & TButtonVariantProps;

const Button = React.forwardRef<HTMLButtonElement, UseButtonProps>((props, ref) => {
  const {
    children,
    startContent: startContentProps,
    endContent: endContentProps,
    className,
    spinner,
    isLoading,
    fullWidth,
    size,
    variant,
    isDisabled,
    isIconOnly,
    ...rest
  } = props;

  const styles = getButtonClassNames({
    variant,
    size,
    fullWidth,
    isIconOnly,
    isDisabled,
    className,
  });

  return (
    <button ref={ref} className={styles} {...rest}>
      {children}
    </button>
  );
});

Button.displayName = "syncturtle-button";

export { Button };

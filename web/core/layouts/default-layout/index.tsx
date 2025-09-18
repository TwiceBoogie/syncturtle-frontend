import { cn } from "@syncturtle/utils";
import { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
  gradient?: boolean;
  className?: string;
};

const DefaultLayout: FC<Props> = ({ children, gradient = false, className }) => (
  <div className={cn(`h-screen w-full overflow-hidden`, className)}>{children}</div>
);

export default DefaultLayout;

import { FC } from "react";

import LogoSpinnerDark from "@/public/images/logo-spinner-dark.gif";
import LogoSpinnerLight from "@/public/images/logo-spinner-light.gif";
import { useTheme } from "next-themes";
import Image from "next/image";

export const InstanceLoading: FC = () => {
  const { resolvedTheme } = useTheme();
  const logoSrc = resolvedTheme === "dark" ? LogoSpinnerDark : LogoSpinnerLight;

  return (
    <div className="h-full w-full relative container px-5 mx-auto flex justify-center items-center">
      <div className="w-auto max-w-2xl relative space-y-8 py-10">
        <div className="relative flex flex-col justify-center items-center space-y-4">
          {/* https://medium.com/better-programming/how-to-create-a-loading-screen-for-client-side-fetching-in-nextjs-eaede11c0921 */}
          <div className="loading-screen">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <h3 className="font-medium text-2xl">Fetching instance info...</h3>
        </div>
      </div>
    </div>
  );
};

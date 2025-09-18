"use client";

import { useTheme } from "next-themes";
import { ReactNode } from "react";
import SyncturtleBackgroundDark from "@/public/auth/syncturtle-bg-dark.jpg";
import SyncturtleBackgroundLight from "@/public/auth/syncturtle-bg-light.jpg";
import Image from "next/image";

export default function RootLayout({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();

  const background = resolvedTheme === "dark" ? SyncturtleBackgroundDark : SyncturtleBackgroundLight;
  return (
    <div className="relative">
      <div className="h-screen w-full overflow-hidden overflow-y-auto flex flex-col">
        <div className="container h-[110px] flex-shrink-0 mx-auto px-5 lg:px-0 flex items-center justify-between gap-5 z-50"></div>
        <div className="absolute inset-0 z-0">
          <Image src={background} className="w-screen h-full object-cover" alt="Syncturtle background" priority />
        </div>
        <div className="relative z-10 flex-grow">{children}</div>
      </div>
    </div>
  );
}

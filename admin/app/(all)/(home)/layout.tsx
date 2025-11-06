"use client";

import Link from "next/link";
import Image from "next/image";
// hooks
import { useTheme } from "next-themes";
// images
import SyncturtleBackgroundDark from "@/public/auth/syncturtle-bg-dark.jpg";
import SyncturtleBackgroundLight from "@/public/auth/syncturtle-bg-light.jpg";
import BlackHorizontalLogo from "@/public/syncturtle-logos/black-horizontal-logo-with-text.png";
import WhiteHorizontalLogo from "@/public/syncturtle-logos/white-horizontal-logo-with-text.png";
import { useUser } from "@/hooks/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { isUserLoggedIn } = useUser();

  const background = resolvedTheme === "light" ? SyncturtleBackgroundLight : SyncturtleBackgroundDark;
  const logo = resolvedTheme === "light" ? BlackHorizontalLogo : WhiteHorizontalLogo;

  useEffect(() => {
    if (isUserLoggedIn === true) {
      router.push("/general");
    }
  }, [router, isUserLoggedIn]);

  return (
    <div className="relative">
      <div className="h-screen w-full overflow-hidden overflow-y-auto flex flex-col">
        <div className="container h-[110px] flex-shrink-0 mx-auto px-5 lg:px-0 flex items-center justify-between gap-5 z-50">
          <div className="flex items-center gap-x-2 py-10">
            <Link href={`/`} className="h-[30px] w-[133px]">
              <Image src={logo} alt="Syncturtle logo" priority />
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 z-0">
          <Image src={background} className="w-screen h-full object-cover" alt="Syncturtle background" priority />
        </div>
        <div className="relative z-10 flex-grow">{children}</div>
      </div>
    </div>
  );
}

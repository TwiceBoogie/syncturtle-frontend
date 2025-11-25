"use client";

import Link from "next/link";
import Image from "next/image";
// ui
// import { useTheme } from "next-themes";
//components
import { PageHead } from "@/components/core";
// layouts
import DefaultLayout from "@/layouts/default-layout";
import { log } from "@/lib/log";
// assets
// import SyncturtleBackgroundDark from "@/public/auth/syncturtle-bg-dark.jpg";
// import SyncturtleBackground from "@/public/auth/syncturtle-bg-light.jpg";
// import BlackHorizontalLogo from "@/public/plane-logos/black-horizontal-with-blue-logo.png";
// import WhiteHorizontalLogo from "@/public/plane-logos/white-horizontal-with-blue-logo.png";
// import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { changeUrl } from "./action";
import { AuthenticationWrapper } from "@/lib/wrappers/authentication-wrapper";
import { EPageTypes } from "@/helpers/authentication.helper";
// import { changeUrl } from "./action";

export default function Home() {
  // const { resolvedTheme } = useTheme();
  // const background = resolvedTheme === "light" ? SyncturtleBackground : SyncturtleBackgroundDark;
  // const logo = resolvedTheme === "light" ? BlackHorizontalLogo : WhiteHorizontalLogo;
  // const router = useRouter();

  return (
    <AuthenticationWrapper pageType={EPageTypes.NON_AUTHENTICATED}>
      <DefaultLayout>
        <div className="relative h-screen w-screen overflow-hidden">
          <PageHead title="Log in - Syncturtle" />
          {/* <div className="absolute inset-0 z-10">
          <Image src={background} alt="Syncturtle background" className="w-full h-full object-cover" />
        </div> */}
          <div className="relative z-10 w-screen h-screen overflow-hidden overflow-y-auto flex flex-col">
            <div className="container min-w-full px-10 lg:px-20 xl:px-36 flex-shrink-0 relative flex items-center justify-between pb-4 transition-all">
              <div className="flex items-center gap-x-2 py-10">
                {/* <Link href={`/`} className="h-[30px] w-[133px]">
                <Image src={logo} alt="Syncturtle logo" />
              </Link> */}
              </div>
              <div className="flex flex-col items-end sm:items-center sm:gap-2 sm:flex-row text-center text-sm font-medium text-onboarding-text-300">
                <p>
                  New to Sync<span className="text-green-400">turtle</span>
                </p>
                <Link href={`/sign-up`} className="font-semibold text-custom-primary-100 hover:underline">
                  Create an account
                </Link>
              </div>
            </div>
            <div className="flex flex-col justify-center flex-grow container h-[100vh-60px] mx-auto max-w-lg px-10 lg:px-5 transition-all">
              <Button>Move</Button>
            </div>
          </div>
        </div>
      </DefaultLayout>
    </AuthenticationWrapper>
  );
}

"use client";

import { AdminHeader } from "@/components/auth-header";
import { NewUserPopup } from "@/components/new-user-popup";
import { AdminSidebar } from "@/components/sidebar";
import { useUser } from "@/hooks/store";
import { Spinner } from "@heroui/spinner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isUserLoggedIn } = useUser();

  useEffect(() => {
    console.log(`isUserLoggedIn: ${isUserLoggedIn}`);
    if (isUserLoggedIn === false) {
      router.push("/");
    }
  }, [router, isUserLoggedIn]);

  if (isUserLoggedIn === undefined) {
    return (
      <div className="relative flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isUserLoggedIn) {
    return (
      <div className="flex relative size-full overflow-hidden bg-custom-background-90 rounded-lg transition-all ease-in-out duration-300">
        <div className="size-full p-2 flex-grow transition-all ease-in-out duration-300 overflow-hidden">
          {/* end of layout */}
          <div className="relative flex flex-col h-full w-full overflow-hidden rounded-lg border border-custom-border-200">
            <div className="relative flex size-full overflow-hidden">
              <AdminSidebar />
              <main className="relative flex h-full w-full flex-col overflow-hidden bg-custom-background-100">
                <AdminHeader />
                <div className="h-full w-full overflow-hidden">{children}</div>
              </main>
              <NewUserPopup />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <></>;
}

"use client";

import { FC, ReactNode } from "react";
import { AdminHeader } from "@/components/auth-header";
import { AdminSidebar } from "@/components/sidebar";
import { NewUserPopup } from "@/components/new-user-popup";

type Props = {
  children: ReactNode;
};

const AdminLayout: FC<Props> = (props) => {
  const { children } = props;

  return (
    <div className="relative flex h-screen w-screen overflow-hidden">
      <AdminSidebar />
      <main className="relative flex w-full flex-col overflow-hidden bg-custom-background-100">
        <AdminHeader />
        <div className="h-full w-full overflow-hidden">{children}</div>
      </main>
      <NewUserPopup />
    </div>
  );
};

export default AdminLayout;

import type { Metadata } from "next";
import AdminLayout from "@/layouts/admin-layout";

export const metadata: Metadata = {
  title: "Authentication Settings - Syncturtle Web",
};

export default function AuthenticationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

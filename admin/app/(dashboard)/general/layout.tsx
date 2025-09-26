import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "General Settings - Syncturtle Web",
};

export default function GeneralLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

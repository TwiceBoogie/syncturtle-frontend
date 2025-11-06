import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workspace Settings - Syncturtle Web",
};

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

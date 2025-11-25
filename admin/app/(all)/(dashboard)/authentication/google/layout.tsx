import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Google Authentication | God Mode",
};

export default function GoogleAuthenticationLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

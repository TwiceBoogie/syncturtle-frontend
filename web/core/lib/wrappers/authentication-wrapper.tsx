import { EPageTypes } from "@/helpers/authentication.helper";
import { useUser, useUserProfile } from "@/hooks/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, ReactNode } from "react";
import useSWR from "swr";

type TPageType = EPageTypes;

type TAuthenticationWrapper = {
  children: ReactNode;
  pageType?: TPageType;
};

export const AuthenticationWrapper: FC<TAuthenticationWrapper> = (props) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next_path");
  //props
  const { children, pageType = EPageTypes.AUTHENTICATED } = props;
  // hooks
  const { isLoading: isUserLoading, data: currentUser, fetchCurrentUser } = useUser();
  const { data: currentUserProfile } = useUserProfile();

  const { isLoading: isUserSWRLoading } = useSWR("USER_INFORMATION", async () => await fetchCurrentUser(), {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const isUserOnboarded =
    currentUserProfile.isOnboarded ||
    (currentUserProfile.onboardingStep.profileComplete &&
      currentUserProfile.onboardingStep.workspaceCreate &&
      currentUserProfile.onboardingStep.workspaceInvite &&
      currentUserProfile.onboardingStep.workspaceJoin) ||
    false;

  return <>{children}</>;
};

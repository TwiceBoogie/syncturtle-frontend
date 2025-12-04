import { FC } from "react";
import { EAuthModes } from "@/helpers/authentication.helper";
import { AuthHeader } from "./auth-header";
import { AuthEmailForm } from "./email";

interface IAuthRoot {
  authMode: EAuthModes;
}

export const AuthRoot: FC<IAuthRoot> = (props) => {
  const { authMode: currentAuthMode } = props;

  return (
    <div className="relative flex flex-col space-y-6">
      <AuthHeader>
        <AuthEmailForm />
      </AuthHeader>
    </div>
  );
};

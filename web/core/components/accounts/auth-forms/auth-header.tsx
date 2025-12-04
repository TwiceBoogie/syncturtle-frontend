import { FC, ReactNode } from "react";

interface IAuthHeader {
  children: ReactNode;
}

export const AuthHeader: FC<IAuthHeader> = (props) => {
  const { children } = props;
  return (
    <>
      <div className="space-y-1 text-center">
        <h3>header</h3>
        <p>subHeader</p>
      </div>
      {children}
    </>
  );
};

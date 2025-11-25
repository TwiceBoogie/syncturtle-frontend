import { FC, JSX } from "react";
import { Input } from "@heroui/input";

interface IControllerInput {
  key: string;
  type: "text" | "password";
  label: string;
  description?: string | JSX.Element;
  placeholder: string;
  error: boolean;
  required: boolean;
}

export const ControllerInput: FC<IControllerInput> = (props) => {
  return <Input />;
};

import { cn } from "@syncturtle/utils";
import { CircleCheck } from "lucide-react";
import React from "react";

enum E_PASSWORD_STRENGTH {
  EMPTY = "empty",
  LENGTH_NOT_VALID = "length not valid",
  STRENGTH_NOT_VALID = "strength not valid",
  STRENGTH_VALID = "strength valid",
}

type TPasswordCriteria = {
  key: string;
  label: string;
  isValid: boolean;
};

const checkPasswordStrength = (password: string): E_PASSWORD_STRENGTH => {
  // if null or isEmpty or isBlank
  if (!password || password === "" || password.length <= 0) {
    return E_PASSWORD_STRENGTH.EMPTY;
  }

  if (password.length < 8) {
    return E_PASSWORD_STRENGTH.LENGTH_NOT_VALID;
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasDigits = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()\-_+=\[\]{}|;:'",.<>?/]/.test(password);

  if (hasUpperCase && hasLowerCase && hasDigits && hasSpecialChar) {
    return E_PASSWORD_STRENGTH.STRENGTH_VALID;
  }

  return E_PASSWORD_STRENGTH.STRENGTH_NOT_VALID;
};

const checkPasswordCriteria = (password: string): TPasswordCriteria[] => [
  {
    key: "length",
    label: "Min 8 Characters",
    isValid: password.length >= 8,
  },
  {
    key: "uppercase",
    label: "Min 1 Uppercase Letter",
    isValid: /[A-Z]/.test(password),
  },
  {
    key: "lowercase",
    label: "Min 1 Lowercase Letter",
    isValid: /[a-z]/.test(password),
  },
  {
    key: "number",
    label: "Min 1 Number Letter",
    isValid: /[0-9]/.test(password),
  },
  {
    key: "specialchar",
    label: "Min 1 Special Letter",
    isValid: /[!@#$%^&*()\-_+=\[\]{}|;:'",.<>?/]/.test(password),
  },
];

const checkStrengthInfo = (strength: E_PASSWORD_STRENGTH): TStrenthInfo => {
  switch (strength) {
    case E_PASSWORD_STRENGTH.EMPTY:
      return {
        message: "Please enter your password",
        textColor: "text-custom-text-100",
        activeFragment: 0,
      };
    case E_PASSWORD_STRENGTH.LENGTH_NOT_VALID:
      return {
        message: "Password is too short",
        textColor: "text-red-500",
        activeFragment: 1,
      };
    case E_PASSWORD_STRENGTH.STRENGTH_NOT_VALID:
      return {
        message: "Password is weak",
        textColor: "text-orange-500",
        activeFragment: 2,
      };
    case E_PASSWORD_STRENGTH.STRENGTH_VALID:
      return {
        message: "Password is strong",
        textColor: "text-green-500",
        activeFragment: 3,
      };
    default:
      return {
        message: "Please enter your password",
        textColor: "text-custom-text-100",
        activeFragment: 0,
      };
  }
};

const checkFragmentInfo = (fragmentIndex: number, activeFragment: number): string => {
  if (fragmentIndex >= activeFragment) {
    return "bg-custom-background-90";
  }
  switch (activeFragment) {
    case 1:
      return "bg-red-500";
    case 2:
      return "bg-orange-500";
    case 3:
      return "bg-green-500";
    default:
      return "bg-custom-background-90";
  }
};

export type TStrenthInfo = {
  message: string;
  textColor: string;
  activeFragment: number;
};

export interface IPasswordStrengthIndicator {
  password: string;
  isFocused?: boolean;
  showCriteria?: boolean;
}
export const PasswordStrenthIndicator: React.FC<IPasswordStrengthIndicator> = ({
  password,
  showCriteria = true,
  isFocused = false,
}) => {
  const strength = checkPasswordStrength(password);
  const criteria = checkPasswordCriteria(password);
  const strengthInfo = checkStrengthInfo(strength);

  const isVisble = isFocused ? true : strength === E_PASSWORD_STRENGTH.STRENGTH_VALID ? false : true;

  if ((!password && !showCriteria) || !isVisble) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="flex gap-1 w-full transition-all duration-300 ease-linear">
          {[0, 1, 2].map((fragmentIndex) => (
            <div
              key={fragmentIndex}
              className={cn(
                "h-1 flex-1 rounded-sm transition-all duration-300 ease-in-out",
                checkFragmentInfo(fragmentIndex, strengthInfo.activeFragment)
              )}
            />
          ))}
        </div>
        {password && <p className={cn("text-sm font-medium", strengthInfo.textColor)}>{strengthInfo.message}</p>}
      </div>
      {showCriteria && (
        <div className="flex flex-wrap gap-2">
          {criteria.map((criterion) => (
            <div key={criterion.key} className="flex items-center gap-1.5">
              <div className="flex items-center justify-center p-0.5">
                <CircleCheck
                  className={cn("h-3 w-3 flex-shrink-0", {
                    "text-green-500": criterion.isValid,
                    "text-custom-text-100": !criterion.isValid,
                  })}
                />
              </div>
              <span
                className={cn("text-xs", {
                  "text-green-500": criterion.isValid,
                  "text-custom-text-100": !criterion.isValid,
                })}
              >
                {criterion.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

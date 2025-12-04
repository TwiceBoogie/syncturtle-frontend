import { FC } from "react";
import { Button, Input } from "@syncturtle/ui";

export const AuthEmailForm: FC = () => {
  const errorMessage = "Something is wrong";
  return (
    <form className="mt-5 space-y-4" noValidate>
      <Input
        name="email"
        type="email"
        label="Email address"
        helper="We'll never share this."
        placeholder="you@example.com"
        description="Use an address you check regularly so we can send you notifications."
        isRequired
        inputSize="sm"
        errorMessage={errorMessage}
        isInvalid={true}
      />
      <Button>submit</Button>
    </form>
  );
};

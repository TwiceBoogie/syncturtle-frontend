import { FC, useEffect } from "react";
import { addToast, Button, Link } from "@heroui/react";
import { useTheme } from "@/hooks/store";

export const NewUserPopup: FC = () => {
  const { isNewUserPopup, toggleNewUserPopup } = useTheme();
  useEffect(() => {
    if (!isNewUserPopup) {
      toggleNewUserPopup();
    }
  }, [toggleNewUserPopup]);
  if (!isNewUserPopup) return <></>;
  return (
    <div className="absolute bottom-8 right-8 p-6 w-96 border border-custom-border-100 shadow-md rounded-lg bg-custom-background-100">
      <div>
        <div className="">
          <div className="text-base font-semibold">Create workspace</div>
          <div className="py-2 text-sm font-medium text-custom-text-300">
            Instance setup done! Welcome to Syncturtle instance portal. Start your journey by creating your first
            workspace.
          </div>
          <div className="flex items-center gap-4 text-custom-text-300">
            <Button as={Link} href="/workspace/create" size="sm">
              Create workspace
            </Button>
            <Button size="sm" onPress={toggleNewUserPopup}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

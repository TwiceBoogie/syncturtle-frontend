import { FC, useRef } from "react";
import { useTheme } from "@/hooks/store";
import { Button } from "@heroui/react";
import { ExternalLink, MoveLeft } from "lucide-react";
import { cn } from "@syncturtle/utils";
import { WEB_BASE_URL } from "@/helpers/common.helper";
import Link from "next/link";

export const AdminSidebarHelpSection: FC = () => {
  // store
  const { isSidebarCollapsed, toggleSidebar } = useTheme();

  const redirectionLink = encodeURI(WEB_BASE_URL + "/");
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-1 self-baseline border-t border-custom-border-200 bg-custom-sidebar-background-100 px-4 h-14 flex-shrink-0",
        {
          "flex-col h-auto py-1.5": isSidebarCollapsed,
        }
      )}
    >
      <div
        className={`flex items-center gap-1 ${
          isSidebarCollapsed ? "flex-col justify-center" : "justify-between w-full"
        }`}
      >
        <Button as={Link} href={redirectionLink} radius="sm" size="sm" isIconOnly={isSidebarCollapsed}>
          <ExternalLink size={14} />
          {!isSidebarCollapsed && (
            <p>
              Redirect to Sync<span className="text-green-400">turtle</span>
            </p>
          )}
        </Button>
        <Button radius="sm" size="sm" isIconOnly onPress={() => toggleSidebar(!isSidebarCollapsed)}>
          <MoveLeft className={`h-3.5 w-3.5 duration-300 ${isSidebarCollapsed ? "rotate-180" : ""}`} />
        </Button>
      </div>
    </div>
  );
};

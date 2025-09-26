import { FC } from "react";
import { useTheme } from "@/hooks/store";
import { usePathname } from "next/navigation";
import { Cog, Mail, BrainCog, Network, Image, Lock } from "lucide-react";
import { Button, Link } from "@heroui/react";
import { cn } from "@syncturtle/utils";

const INSTANCE_ADMIN_LINKS = [
  {
    Icon: Cog,
    name: "General",
    description: "Identify your instances and get key details.",
    href: `/general/`,
  },
  {
    Icon: Network,
    name: "Workspaces",
    description: "Manage all workspaces on this instance.",
    href: `/workspace/`,
  },
  {
    Icon: Mail,
    name: "Email",
    description: "Configure your SMTP controls.",
    href: `/email/`,
  },
  {
    Icon: Lock,
    name: "Authentication",
    description: "Configure authentication modes.",
    href: `/authentication/`,
  },
  {
    Icon: BrainCog,
    name: "Artificial intelligence",
    description: "Configure your OpenAI creds.",
    href: `/ai/`,
  },
  {
    Icon: Image,
    name: "Images in Plane",
    description: "Allow third-party image libraries.",
    href: `/image/`,
  },
];

export const AdminSidebarMenu: FC = () => {
  // store hooks
  const { isSidebarCollapsed, toggleSidebar } = useTheme();
  // router
  const pathName = usePathname();

  const handleItemClick = () => {
    if (window.innerWidth < 768) {
      toggleSidebar(!isSidebarCollapsed);
    }
  };

  return (
    <div className="flex h-full w-full flex-col gap-2.5 px-4 py-4">
      {INSTANCE_ADMIN_LINKS.map((item, index) => {
        const isActive = item.href === pathName || pathName.includes(item.href);
        return (
          <Button
            as={Link}
            variant={isActive ? "solid" : "light"}
            radius="sm"
            size={isSidebarCollapsed ? "sm" : "lg"}
            key={index}
            isIconOnly={isSidebarCollapsed}
            onPress={handleItemClick}
            href={item.href}
            className={cn(
              `group flex w-full items-center gap-3 rounded-md px-3 py-2 outline-none transition-colors`,
              isActive
                ? "bg-custom-primary-100/10 text-custom-primary-100"
                : "text-custom-sidebar-text-200 hover:bg-custom-sidebar-background-80 focus:bg-custom-sidebar-background-80",
              isSidebarCollapsed ? "justify-center" : "w-[260px]"
            )}
          >
            {<item.Icon className="h-4 w-4 flex-shrink-0" />}
            {!isSidebarCollapsed && (
              <div className="w-full">
                <div>
                  <div
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isActive ? "text-primary" : "text-custom-sidebar-text-200"
                    )}
                  >
                    {item.name}
                  </div>
                  <div
                    className={cn(
                      `text-[10px] transition-colors`,
                      isActive ? "text-primary" : "text-custom-sidebar-text-400"
                    )}
                  >
                    {item.description}
                  </div>
                </div>
              </div>
            )}
          </Button>
        );
      })}
    </div>
  );
};

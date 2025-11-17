"use client";

import { FC } from "react";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import { Button } from "@heroui/button";
import { usePathname } from "next/navigation";
import { Cog, Menu } from "lucide-react";
import { useTheme } from "@/hooks/store";

export const HamburgerToggle: FC = () => {
  const { isSidebarCollapsed, toggleSidebar } = useTheme();
  return (
    <Button size="sm" isIconOnly onPress={() => toggleSidebar(!isSidebarCollapsed)} className="md:hidden">
      <Menu className="h-5 w-5" />
    </Button>
  );
};

export const AdminHeader: FC = () => {
  const pathName = usePathname();

  const getHeaderTitle = (pathName: string) => {
    switch (pathName) {
      case "general":
        return "General";
      case "ai":
        return "Artificial Intelligence";
      case "email":
        return "Email";
      case "authentication":
        return "Authentication";
      case "image":
        return "Image";
      case "google":
        return "Google";
      case "github":
        return "GitHub";
      case "gitlab":
        return "GitLab";
      case "workspace":
        return "Workspace";
      case "create":
        return "Create";
      default:
        return pathName.toUpperCase();
    }
  };

  const generateBreadCrumbItems = () => {
    const pathSegment = pathName.split("/").slice(1);
    pathSegment.pop();

    let current = "";
    const breadCrumbItems = pathSegment.map((segment) => {
      current += "/" + segment;
      return {
        title: getHeaderTitle(segment),
        href: current,
      };
    });
    return breadCrumbItems;
  };
  const breadCrumbItems = generateBreadCrumbItems();
  return (
    <div className="relative z-10 flex h-[3.25rem] w-full flex-shrink-0 flex-row items-center justify-between gap-x-2 gap-y-4 border-b border-custom-sidebar-border-200 bg-custom-sidebar-background-100 p-4">
      <HamburgerToggle />
      {breadCrumbItems.length >= 0 && (
        <Breadcrumbs>
          <BreadcrumbItem href="/general" startContent={<Cog className="h-4 w-4" />}>
            Settings
          </BreadcrumbItem>
          {breadCrumbItems.map((item, index) => (
            <BreadcrumbItem href={item.href}>{item.title}</BreadcrumbItem>
          ))}
        </Breadcrumbs>
      )}
    </div>
  );
};

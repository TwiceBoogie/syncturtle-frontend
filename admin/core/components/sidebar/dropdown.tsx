import { useTheme } from "@/hooks/store";
import { useTheme as useNextTheme } from "next-themes";
// import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { cn } from "@syncturtle/utils";
import { LogOut, Palette, UserCog2 } from "lucide-react";
import { FC } from "react";

import { API_BASE_URL } from "@/helpers/common.helper";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  MenuItem,
} from "@heroui/react";
import { MenuItems } from "@headlessui/react";

export const AdminSidebarDropdown: FC = () => {
  const { isSidebarCollapsed } = useTheme();
  const { resolvedTheme, setTheme } = useNextTheme();

  const handleThemeSwitch = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  const getSidebarMenuItems = () => (
    <MenuItems
      anchor="bottom start"
      transition
      className={cn(
        "absolute left-0 z-20 mt-1.5 flex w-52 flex-col",
        "divide-y divide-custom-sidebar-border-100",
        "rounded-md border border-custom-sidebar-border-200",
        "bg-custom-background-100 px-1 py-2 text-xs focus:outline-none",
        "shadow-lg transition ease-out",
        "data-[closed]:opacity-0 data-[closed]:scale-95",
        "data-[enter]:duration-100 data-[leave]:duration-75",
        {
          "left-4": isSidebarCollapsed,
        }
      )}
    >
      <div className="flex flex-col gap-2.5 pb-2">
        <span className="px-2 text-custom-sidebar-text-200">name@company.com</span>
      </div>
      <div className="py-2">
        <MenuItem key={"theme"}>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded px-2 py-1 hover:bg-custom-sidebar-background-80"
            onClick={handleThemeSwitch}
          >
            <Palette className="h-4 w-4 stroke-[1.5]" />
            Switch to {resolvedTheme === "dark" ? "light" : "dark"} mode
          </button>
        </MenuItem>
      </div>
      <div className="py-2">
        <form method="POST" action={`${API_BASE_URL}/api/instances/admins/sign-out/`}>
          <input type="hidden" name="csrfmiddlewaretoken" />
          <MenuItem
            as="button"
            key={"submit"}
            className="flex w-full items-center gap-2 rounded px-2 py-1 hover:bg-custom-sidebar-background-80"
          >
            <LogOut className="h-4 w-4 stroke-[1.5]" />
            Sign out
          </MenuItem>
        </form>
      </div>
    </MenuItems>
  );
  return (
    <div className="flex items-center gap-x-5 gap-y-2 border-b border-custom-sidebar-border-200 px-4 py-3.5">
      <div className="h-full w-full truncate">
        <div
          className={`flex flex-grow items-center gap-x-2 truncate rounded py-1 ${
            isSidebarCollapsed ? "justify-center" : ""
          }`}
        >
          <Dropdown
            placement="bottom-start"
            backdrop="transparent"
            radius="none"
            shadow="none"
            classNames={{
              base: "p-0",
              content: "p-0 bg-transparent border-0 shadow-none",
            }}
          >
            <DropdownTrigger>
              <Button radius="sm" size="sm" isIconOnly isDisabled={!isSidebarCollapsed}>
                <UserCog2 className="h-5 w-5 text-custom-text-200" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Admin actions"
              disabledKeys={["email"]}
              classNames={{
                // panel container
                base: [
                  "z-10 w-52 rounded-md border border-custom-sidebar-border-200",
                  "bg-custom-sidebar-background-100 shadow-md p-0",
                ],
                list: "px-1 py-2 gap-1",
                emptyContent: "text-xs text-default-400 py-6",
              }}
              itemClasses={{
                base: ["rounded px-2 py-1 text-xs"],
                wrapper: "gap-0",
                title: "text-xs text-custom-text-200",
                description: "text-[11px] text-default-400",
              }}
              topContent={
                <div className="px-2 pt-2">
                  <span className="block text-xs text-custom-sidebar-text-200">luna@snow.com</span>
                </div>
              }
            >
              <DropdownSection showDivider>
                <DropdownItem
                  key={"theme"}
                  startContent={<Palette className="h-4 w-4 stroke-[1.5]" />}
                  onPress={handleThemeSwitch}
                >
                  Switch to {resolvedTheme === "dark" ? "light" : "dark"} mode
                </DropdownItem>
              </DropdownSection>
              <DropdownItem key={"logout"} startContent={<LogOut className="h-4 w-4 stroke-[1.5]" />}>
                Sign out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          {/* <Menu as={"div"} className={"flex-shrink-0"}>
            <MenuButton
              className={cn("grid place-items-center outline-none", {
                "cursor-default": !isSidebarCollapsed,
              })}
            >
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded bg-custom-sidebar-background-80">
                <UserCog2 className="h-5 w-5 text-custom-text-200" />
              </div>
            </MenuButton>
            {isSidebarCollapsed && getSidebarMenuItems()}
          </Menu> */}
          {!isSidebarCollapsed && (
            <div className="flex w-full gap-2">
              <h4 className="grow truncate text-base font-medium text-custom-text-200">Instance admin</h4>
            </div>
          )}
        </div>
      </div>
      {!isSidebarCollapsed && (
        <Dropdown
          placement="bottom-start"
          backdrop="transparent"
          radius="none"
          shadow="none"
          classNames={{
            base: "p-0",
            content: "p-0 bg-transparent border-0 shadow-none",
          }}
        >
          <DropdownTrigger>
            <Button radius="sm" size="sm" isIconOnly>
              <UserCog2 className="h-5 w-5 text-custom-text-200" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Admin actions"
            disabledKeys={["email"]}
            classNames={{
              // panel container
              base: [
                "z-10 w-52 rounded-md border border-custom-sidebar-border-200",
                "bg-custom-sidebar-background-100 shadow-md p-0",
              ],
              list: "px-1 py-2 gap-1",
              emptyContent: "text-xs text-default-400 py-6",
            }}
            itemClasses={{
              base: ["rounded px-2 py-1 text-xs"],
              wrapper: "gap-0",
              title: "text-xs text-custom-text-200",
              description: "text-[11px] text-default-400",
            }}
            topContent={
              <div className="px-2 pt-2">
                <span className="block text-xs text-custom-sidebar-text-200">luna@snow.com</span>
              </div>
            }
          >
            <DropdownSection showDivider>
              <DropdownItem
                key={"theme"}
                startContent={<Palette className="h-4 w-4 stroke-[1.5]" />}
                onPress={handleThemeSwitch}
              >
                Switch to {resolvedTheme === "dark" ? "light" : "dark"} mode
              </DropdownItem>
            </DropdownSection>
            <DropdownItem key={"logout"} startContent={<LogOut className="h-4 w-4 stroke-[1.5]" />}>
              Sign out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
    </div>
  );
};

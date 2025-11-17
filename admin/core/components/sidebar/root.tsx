"use client";

import { useTheme } from "@/hooks/store";
import React, { FC, useEffect, useRef } from "react";
import { AdminSidebarDropdown } from "./dropdown";
import { AdminSidebarHelpSection } from "./help-section";
import { AdminSidebarMenu } from "./menu";

export const useOutsideClickDetector = (
  ref: React.RefObject<HTMLElement> | any, // the 'inside' element to protect
  callback: () => void, // called when an 'outside' click happens
  useCapture = false // event phase flag (capture vs bubble)
) => {
  const handleClick = (event: MouseEvent) => {
    // if we have an element and the click target isn't inside it
    if (ref.current && !ref.current.contains(event.target as any)) {
      // look up the ancestor chain for an element that opts out of outside-close
      const preventOutsideClickElement = (event.target as unknown as HTMLElement | undefined)?.closest(
        "[data-prevent-outside-click]"
      );

      if (preventOutsideClickElement) return; // whitelist hit -> do nothing
      callback(); // otherwise fire the outside click callback
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick, useCapture);
    return () => {
      document.removeEventListener("mousedown", handleClick, useCapture);
    };
  });
};

export const AdminSidebar: FC = () => {
  // store
  const { isSidebarCollapsed, toggleSidebar } = useTheme();

  const ref = useRef<HTMLDivElement>(null);

  useOutsideClickDetector(ref, () => {
    if (isSidebarCollapsed === false) {
      if (window.innerWidth < 768) {
        toggleSidebar(!isSidebarCollapsed);
      }
    }
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        toggleSidebar(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [toggleSidebar]);

  return (
    <div
      className={`inset-y-0 z-30 flex h-full flex-shrink-0 flex-grow-0 flex-col border-r border-custom-sidebar-border-200 bg-custom-sidebar-background-100 duration-300
        fixed md:relative
        ${isSidebarCollapsed ? "-ml-[290px]" : ""}
        sm:${isSidebarCollapsed ? "-ml-[290px]" : ""}
        md:ml-0 ${isSidebarCollapsed ? "w-[70px]" : "w-[290px]"}
        lg:ml-0 ${isSidebarCollapsed ? "w-[70px]" : "w-[290px]"}
      `}
    >
      <div ref={ref} className="flex h-full w-full flex-1 flex-col">
        <AdminSidebarDropdown />
        <AdminSidebarMenu />
        <AdminSidebarHelpSection />
      </div>
    </div>
  );
};

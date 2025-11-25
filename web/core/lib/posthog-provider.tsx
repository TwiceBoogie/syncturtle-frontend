"use client";

import { FC, ReactNode, useEffect } from "react";
import dynamic from "next/dynamic";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useInstance, useUser, useWorkspace } from "@/hooks/store";
import { useParams } from "next/navigation";
// dynamic imports
const PostHogPageView = dynamic(() => import("@/lib/posthog-view"), { ssr: false });

export interface IPosthogWrapper {
  children: ReactNode;
}

export type TEventState = "SUCCESS" | "ERROR";
export type TElementContext = Record<string, any>;
export type TEventContext = Record<string, any>;
export type TInteractionType = "clicked" | "viewed" | "hovered";

type TCaptureElementParams = {
  elementName: string;
  interactionType: TInteractionType;
  context?: TElementContext;
};

const captureElement = (params: TCaptureElementParams) => {
  const { elementName, interactionType, context } = params;
  if (!posthog) {
    return;
  }

  const elementEvent = `${elementName}_${interactionType}`;

  const payload = {
    elementType: elementName,
    timestamp: new Date().toISOString(),
    ...context,
  };

  posthog.capture(elementEvent, payload);
};

type TCaptureClickParams = Omit<TCaptureElementParams, "interactionType">;

const captureClick = (params: TCaptureClickParams) => {
  captureElement({ ...params, interactionType: "clicked" });
};

const PostHogProvider: FC<IPosthogWrapper> = (props) => {
  const { children } = props;
  const { data: user } = useUser();
  const { currentWorkspace } = useWorkspace();
  const { instance } = useInstance();
  const { workspaceSlug } = useParams();

  const isTelemetryEnabled = instance?.isTelemetryEnabled || false;
  const isPosthogEnabled =
    process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST && isTelemetryEnabled;

  // useEffect(() => {
  //   if (user) {
  //     posthog.identify(user.email, {
  //       id: user.id,
  //       firstName: user.firstName,
  //       lastName: user.lastName,
  //       email: user.email,
  //     });
  //   }
  // })

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: "/ingest",
        ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        debug: process.env.NEXT_PUBLIC_POSTHOG_DEBUG === "1",
        autocapture: false,
        capture_pageview: false,
        capture_pageleave: true,
        disable_session_recording: true,

        person_profiles: "identified_only",
      });
    }
  }, []);

  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Use closest to find the nearest parent element with data-ph-element attribute
      const elementWithAttribute = target.closest("[data-ph-element]") as HTMLElement;
      if (elementWithAttribute) {
        const element = elementWithAttribute.getAttribute("data-ph-element");
        if (element) {
          captureClick({ elementName: element });
        }
      }
    };

    if (isPosthogEnabled) {
      document.addEventListener("click", clickHandler);
    }

    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, [isPosthogEnabled]);

  if (isPosthogEnabled) {
    return (
      <PHProvider client={posthog}>
        <PostHogPageView />
        {children}
      </PHProvider>
    );
  }

  return <>{children}</>;
};

export default PostHogProvider;

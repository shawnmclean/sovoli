"use client";

import React, { forwardRef } from "react";
import { useLink } from "@sovoli/ui/hooks";
import type { LinkProps } from "@sovoli/ui/components/link";
import { config } from "~/utils/config";
import type { Properties } from "posthog-js";
import posthog from "posthog-js";

interface WhatsAppLinkProps extends LinkProps {
  phoneNumber?: string;
  message?: string;
  fallback?: boolean;
  event?: string;
  eventProperties?: Properties | null;

  // Tracking props
  intent?:
    | "Submit Application"
    | "Submit Missing Info"
    | "Purchase"
    | "Add to Wishlist"
    | "Claim School"
    | "Request Data"
    | "CustomEvent"
    | "Contact"; // eg. matches Fb event name
  role?: "parent" | "admin";
  page?:
    | "listing"
    | "details"
    | "scores"
    | "pricing"
    | "landing"
    | "programs"
    | "mobile-footer";
  orgId?: string;
  orgName?: string;
  funnel?: string; // e.g. "discovery", "conversion"
}

export const WhatsAppLink = forwardRef<HTMLAnchorElement, WhatsAppLinkProps>(
  (
    {
      phoneNumber = config.contact.whatsapp,
      message,

      // old tracking props
      intent = "Contact",
      role,
      page,
      orgId,
      orgName,
      funnel,
      // Tracking props
      event,
      eventProperties,
      ...rest
    },
    ref,
  ) => {
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    const encodedMessage = message ? encodeURIComponent(message) : "";

    const webUrl = `https://wa.me/${cleanNumber}${message ? `?text=${encodedMessage}` : ""}`;

    const onPress = () => {
      posthog.capture(
        event ?? "whatsapp_link_clicked",
        eventProperties ?? {
          intent,
          role: role ?? "unknown",
          page: page ?? "unknown",
          org_id: orgId,
          org_name: orgName,
          funnel: funnel ?? "default",
          source: "sovoli_web",
          cta_schema_version: "v1",
        },
        {
          send_instantly: true,
        },
      );
    };

    const { Component, children, getLinkProps } = useLink({
      ...rest,
      onPress,
      href: webUrl,
      target: "_blank",
      ref,
    });

    return (
      <Component {...getLinkProps()}>
        {children ?? "Message on WhatsApp"}
      </Component>
    );
  },
);

WhatsAppLink.displayName = "WhatsAppLink";

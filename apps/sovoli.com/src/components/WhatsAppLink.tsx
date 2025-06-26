"use client";

import React, { forwardRef } from "react";
import { useLink } from "@sovoli/ui/hooks";
import type { LinkProps } from "@sovoli/ui/components/link";
import { config } from "~/utils/config";

interface WhatsAppLinkProps extends LinkProps {
  phoneNumber?: string;
  message?: string;
  fallback?: boolean;
}

export const WhatsAppLink = forwardRef<HTMLAnchorElement, WhatsAppLinkProps>(
  (
    {
      phoneNumber = config.contact.whatsapp,
      message,
      fallback = true,
      ...rest
    },
    ref,
  ) => {
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    const encodedMessage = message ? encodeURIComponent(message) : "";
    const appUrl = `whatsapp://send?phone=${cleanNumber}${message ? `&text=${encodedMessage}` : ""}`;
    const webUrl = `https://wa.me/${cleanNumber}${message ? `?text=${encodedMessage}` : ""}`;

    const onPress = () => {
      window.location.href = appUrl;

      if (fallback) {
        setTimeout(() => {
          window.open(webUrl, "_blank");
        }, 1000);
      }
    };

    const { Component, children, getLinkProps } = useLink({
      ...rest,
      href: appUrl,
      onPress: onPress,
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

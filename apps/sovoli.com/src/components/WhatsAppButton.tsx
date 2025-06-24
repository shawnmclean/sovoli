"use client";

import React, { useRef } from "react";
import { useButton } from "@sovoli/ui/hooks";
import type { ButtonProps } from "@sovoli/ui/components/button";

interface WhatsAppButtonProps extends Omit<ButtonProps, "onPress"> {
  phoneNumber: string;
  message?: string;
  fallback?: boolean;
  as?: React.ElementType;
}

export function WhatsAppButton({
  phoneNumber,
  message,
  fallback = true,
  children,
  as: Component = "button",
  ...rest
}: WhatsAppButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const cleanNumber = phoneNumber.replace(/\D/g, "");
  const encodedMessage = message ? encodeURIComponent(message) : "";
  const appUrl = `whatsapp://send?phone=${cleanNumber}${message ? `&text=${encodedMessage}` : ""}`;
  const webUrl = `https://wa.me/${cleanNumber}${message ? `?text=${encodedMessage}` : ""}`;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (rest.onClick) rest.onClick(e);
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.defaultPrevented) return;

    window.location.href = appUrl;

    if (fallback) {
      setTimeout(() => {
        window.open(webUrl, "_blank");
      }, 1000);
    }
  };

  const { getButtonProps } = useButton({
    ...rest,
    onClick: handleClick,
    ref,
  });

  return <Component {...getButtonProps()}>{children ?? "Message on WhatsApp"}</Component>;
}

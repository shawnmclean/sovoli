"use client";

import React from "react";
import { Button } from "@sovoli/ui/components/button";

interface WhatsAppButtonProps {
  groupCode?: string;
  children?: React.ReactNode;
}

export function WhatsAppButton({
  groupCode = "J0rpd3MhRsxHZRpL11LnwB",
  children = "Join Whatspp Group",
}: WhatsAppButtonProps) {
  const appUrl = `whatsapp://chat?code=${groupCode}`;
  const webUrl = `https://chat.whatsapp.com/${groupCode}`;

  const handleClick = () => {
    // Attempt to open WhatsApp app
    window.location.href = appUrl;

    // Fallback to WhatsApp Web after 1 second
    setTimeout(() => {
      window.open(webUrl, "_blank");
    }, 1000);
  };

  return (
    <Button
      radius="md"
      size="lg"
      onPress={handleClick}
      className="bg-green-600 text-white transition hover:bg-green-700"
    >
      {children}
    </Button>
  );
}

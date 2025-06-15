"use client";

import React from "react";
import { Button } from "@sovoli/ui/components/button";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  children?: React.ReactNode;
}

export function WhatsAppButton({
  phoneNumber,
  message,
  children = "Message on WhatsApp",
}: WhatsAppButtonProps) {
  // Remove any non-numeric characters from the phone number
  const cleanNumber = phoneNumber.replace(/\D/g, "");
  const encodedMessage = message ? encodeURIComponent(message) : "";
  const appUrl = `whatsapp://send?phone=${cleanNumber}${message ? `&text=${encodedMessage}` : ""}`;
  const webUrl = `https://wa.me/${cleanNumber}${message ? `?text=${encodedMessage}` : ""}`;

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

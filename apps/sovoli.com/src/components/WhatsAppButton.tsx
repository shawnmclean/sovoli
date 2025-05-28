"use client";

import React from "react";

export function WhatsAppButton() {
  const groupCode = "J0rpd3MhRsxHZRpL11LnwB";
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
    <button
      onClick={handleClick}
      className="inline-block rounded-full bg-green-600 px-6 py-2 text-white transition hover:bg-green-700"
    >
      Join WhatsApp Group
    </button>
  );
}

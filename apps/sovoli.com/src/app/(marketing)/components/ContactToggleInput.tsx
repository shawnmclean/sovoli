"use client";

import React, { useState } from "react";
import { Input } from "@sovoli/ui/components/input";
import { MailIcon, PhoneIcon } from "lucide-react";

interface ContactToggleInputProps {
  defaultMode?: "whatsapp" | "email";
  defaultValue?: string;
  renderAfterInput?: React.ReactNode;
}

export function ContactToggleInput({
  defaultMode = "whatsapp",
  defaultValue = "",
  renderAfterInput,
}: ContactToggleInputProps) {
  const [mode, setMode] = useState<"whatsapp" | "email">(defaultMode);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-4">
      {/* Toggle Pill */}
      <div className="flex justify-center rounded-full border border-default-200 p-1">
        {["whatsapp", "email"].map((type) => {
          const isActive = mode === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setMode(type as "whatsapp" | "email")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-default-foreground text-background"
                  : "text-default-500 hover:bg-default-100"
              }`}
            >
              {type === "whatsapp" ? "WhatsApp" : "Email"}
            </button>
          );
        })}
      </div>

      {/* Input + Optional Button */}
      <div
        className={`flex w-full flex-col items-center gap-3 ${
          renderAfterInput
            ? "sm:flex-row sm:justify-between"
            : "sm:justify-center"
        }`}
      >
        <div className="w-full max-w-sm">
          {mode === "email" ? (
            <Input
              name="contactValue"
              type="email"
              placeholder="Your email address"
              defaultValue={defaultValue}
              required
              className="h-10 w-full text-sm"
              startContent={<MailIcon className="text-default-400" />}
            />
          ) : (
            <Input
              name="contactValue"
              type="tel"
              placeholder="Your WhatsApp number"
              defaultValue={defaultValue}
              required
              className="h-10 w-full text-sm"
              startContent={<PhoneIcon className="text-default-400" />}
            />
          )}
        </div>

        {renderAfterInput && (
          <div className="w-full sm:w-auto">{renderAfterInput}</div>
        )}
      </div>

      <input type="hidden" name="mode" value={mode} />
    </div>
  );
}

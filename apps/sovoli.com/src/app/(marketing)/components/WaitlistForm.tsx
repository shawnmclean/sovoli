"use client";

import React, { useState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Input } from "@sovoli/ui/components/input";

export function WaitlistForm() {
  const [mode, setMode] = useState<"whatsapp" | "email">("whatsapp");

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-xl border border-default-100 p-8 backdrop-blur-md">
      {/* Toggle Pill Group */}
      <div className="flex justify-center rounded-full border border-default-100 p-1">
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

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const data = new FormData(form);
          const value = data.get(mode);
          alert(
            `${mode === "email" ? "Email" : "WhatsApp"} submitted: ${value}`,
          );
          form.reset();
        }}
        className="flex w-full flex-col items-center gap-3 sm:flex-row sm:gap-4"
      >
        {mode === "email" ? (
          <Input
            name="email"
            type="email"
            placeholder="Your email address"
            required
            className="h-10 w-full text-sm sm:w-[260px]"
          />
        ) : (
          <Input
            name="whatsapp"
            type="tel"
            placeholder="Your WhatsApp number"
            required
            className="h-10 w-full text-sm sm:w-[260px]"
          />
        )}

        <Button
          type="submit"
          className="h-10 w-full text-sm font-medium sm:w-[140px]"
        >
          Notify Me
        </Button>
      </form>
    </div>
  );
}

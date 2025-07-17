"use client";

import { useState, useEffect } from "react";
import { Input } from "@sovoli/ui/components/input";
import { NumberInput } from "@sovoli/ui/components/number-input";
import { Button } from "@sovoli/ui/components/button";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import { gradientBorderButton } from "~/components/GradientBorderButton";
import { MessageSquareShareIcon, PlusIcon, MinusIcon } from "lucide-react";
import posthog from "posthog-js";
import type { OrgProgram } from "~/modules/academics/types";
import { sanitizePhoneNumber } from "~/utils/sanitizePhoneNumber";

interface Child {
  id: string;
  age: number;
}

interface ReserveFormProps {
  whatsappNumber?: string;
  onClose?: () => void;
  program: OrgProgram;
  cycle?: string;
  level?: string;
}

export function ReserveForm({
  whatsappNumber,
  onClose,
  cycle,
  level,
}: ReserveFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("592 ");
  const [children, setChildren] = useState<Child[]>([]);

  useEffect(() => {
    setChildren([{ id: Date.now().toString(), age: 2 }]);
  }, []);

  const addChild = () =>
    setChildren([...children, { id: Date.now().toString(), age: 2 }]);

  const removeChild = (id: string) =>
    setChildren(children.filter((c) => c.id !== id));

  const updateChildAge = (id: string, age: number) =>
    setChildren(children.map((c) => (c.id === id ? { ...c, age } : c)));

  const previewMessage = () => {
    let msg = `Hi, I'm interested in the ${level} for ${cycle}.`;
    if (children.length) {
      msg += `\n\nChildren: ${children.map((c) => `${c.age} yrs.`).join(", ")}`;
    }
    return msg;
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Scrollable Content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <h2 className="text-lg font-semibold text-foreground">
            You’re About to Start a Chat
          </h2>
          <p className="text-sm text-default-500">
            Just a few quick details before we continue.
          </p>
        </div>

        {/* WhatsApp Number */}
        <Input
          type="tel"
          label="Your WhatsApp Number"
          autoFocus
          placeholder="592 425 4450"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        {/* Children Block */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {children.length} {children.length === 1 ? "Child" : "Children"}
            </span>
            <Button
              size="sm"
              variant="flat"
              onPress={addChild}
              startContent={<PlusIcon size={16} />}
            >
              Add Child
            </Button>
          </div>

          {children.map((child) => (
            <div
              key={child.id}
              className="flex items-center gap-3 px-2 bg-default-100 rounded-lg"
            >
              <NumberInput
                min={0}
                max={18}
                label="Age"
                value={child.age}
                onChange={(v) =>
                  typeof v === "number" && updateChildAge(child.id, v)
                }
              />
              <Button
                size="md"
                variant="flat"
                color="danger"
                isIconOnly
                onPress={() => removeChild(child.id)}
                startContent={<MinusIcon size={16} />}
              />
            </div>
          ))}
        </div>

        {/* Message Preview (styled as theme-friendly bubble) */}
        <div className="mt-2 px-3 py-4 rounded-xl bg-default-100 text-sm text-default-800 whitespace-pre-wrap shadow-sm">
          {previewMessage()}
        </div>
      </div>

      {/* Fixed Bottom Chat Start CTA */}
      <div className="sticky bottom-0 left-0 right-0 bg-background px-4 pb-4 pt-2 border-t border-default-200 z-10">
        <Button
          as={WhatsAppLink}
          phoneNumber={whatsappNumber}
          message={previewMessage()}
          intent="Contact"
          page="mobile-footer"
          variant="shadow"
          color="primary"
          radius="full"
          fullWidth
          startContent={<MessageSquareShareIcon size={16} />}
          className={gradientBorderButton()}
          onPress={() => {
            posthog.setPersonProperties({
              phone: sanitizePhoneNumber(phoneNumber, "592"),
              children: children.length,
            });
            onClose?.();
          }}
        >
          Send & Start Chat
        </Button>
      </div>
    </div>
  );
}

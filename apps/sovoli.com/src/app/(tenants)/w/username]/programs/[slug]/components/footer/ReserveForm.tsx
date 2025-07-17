"use client";

import { useState, useEffect } fromreact;
import [object Object] Button } from "@sovoli/ui/components/button";
import [object Object]Input } from "@sovoli/ui/components/input;
import { NumberInput } from "@sovoli/ui/components/number-input";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import { gradientBorderButton } from "~/components/GradientBorderButton";
import { MessageSquareShareIcon, PlusIcon, MinusIcon } from "lucide-react";
import posthog from "posthog-js";

interface Child[object Object] id: string;
  age: number;
}

interface ReserveFormProps [object Object]  whatsappNumber?: string;
  onClose?: () => void;
  cycle?: string;
  level?: string;
}

export function ReserveForm([object Object]  whatsappNumber,
  onClose,
  cycle,
  level,
}: ReserveFormProps) {
  const [phoneNumber, setPhoneNumber] = useState(592 
  const [children, setChildren] = useState<Child

  // Set default child on component mount
  useEffect(() => {
    const defaultChild: Child = {
      id: Date.now().toString(),
      age:2};
    setChildren([defaultChild]);
  },

  const addChild = () => {
    const newChild: Child = {
      id: Date.now().toString(),
      age:2};
    setChildren([...children, newChild]);
  };

  const removeChild = (id: string) => {
    setChildren(children.filter((child) => child.id !== id));
  };

  const updateChildAge = (id: string, age: number) =>[object Object]
    setChildren(
      children.map((child) => (child.id === id ?[object Object] ...child, age } : child)),
    );
  };

  const generateWhatsAppMessage = () => {
    let enhancedMessage = `Hi, I'm interested in the ${level} for ${cycle}.`;

    if (children.length > 0) {
      const childrenInfo = children
        .map((child) => `${child.age} yrs.`)
        .join(", );   enhancedMessage += `\n\nChildren: ${childrenInfo}`;
    }

    return enhancedMessage;
  };

  return (
    <div className="space-y-6ax-w-md mx-auto">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2text-gray-900>Reserve Your Spot</h3        {(cycle ?? level) && (
          <p className=text-sm text-gray-600 mb-1           {[cycle, level].filter(Boolean).join(" •)}
          </p>
        )}
        <p className=text-sm text-gray-500
          Provide your details to get started
        </p>
      </div>

      {/* Phone Number Input */}
      <div className="space-y-2>  <Input
          type="tel"
          label="Your WhatsApp Number"
          placeholder="592 42550         autoFocus
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full       />
      </div>

      {/* Children Section */}
      <div className="space-y-4">
        <div className=flex items-center justify-between">
          <label className="text-sm font-medium text-gray-70        [object Object]children.length} {children.length === 1 ? "Child" : "Children"}
          </label>
          <Button
            size="sm"
            variant=flat
            color="primary"
            startContent={<PlusIcon size={16/>}
            onPress={addChild}
            className="text-xs"
          >
            Add Child
          </Button>
        </div>

        {children.length === 0& (
          <div className="text-center py-6 border-2 border-dashed border-gray-200d-lg">
            <p className=text-sm text-gray-500">No children added yet</p>
          </div>
        )}

        <div className="space-y-3">
          {children.map((child) => (
            <div
              key={child.id}
              className="flex items-end gap-3 p-4 bg-gray-50 rounded-lg border border-gray-10   >
              <div className="flex-1>
                <NumberInput
                  min={0}
                  max={18}
                  label="Age"
                  value={child.age}
                  onChange={(value) => {
                    if (typeof value === "number") updateChildAge(child.id, value);
                  }}
                  className="w-full"
                />
              </div>

              <Button
                size="md"
                variant="flat"
                color="danger"
                isIconOnly
                startContent={<MinusIcon size={16} />}
                onPress={() => removeChild(child.id)}
                className="h-12 w-12k-0"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4>
        <Button
          as={WhatsAppLink}
          phoneNumber={whatsappNumber}
          message={generateWhatsAppMessage()}
          intent="Contact      page="mobile-footer"
          variant=shadow"
          color="primary          radius="lg"
          startContent={<MessageSquareShareIcon size={16} />}
          className={`${gradientBorderButton()} w-full h-12t-base font-medium`}
          onPress={() => [object Object]           posthog.setPersonProperties({
              phone: phoneNumber,
              children: children.length,
            });
            onClose?.();
          }}
        >
          Continue to Chat
        </Button>
      </div>
    </div>
  );
} 
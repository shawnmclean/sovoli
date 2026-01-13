"use client";

import { useId } from "react";
import { Input } from "@sovoli/ui/components/input";
import { Checkbox } from "@sovoli/ui/components/checkbox";
import type { ProgramEvidence } from "../../types/lead-extraction-schema";

interface CyclePricingFieldProps {
  pricing: ProgramEvidence["pricing"] | null;
  value: ProgramEvidence["pricing"] | null;
  onChange: (value: ProgramEvidence["pricing"] | null) => void;
  onSelectedChange?: (selected: boolean) => void;
  selected?: boolean;
  action?: "add" | "update" | null;
}

export function CyclePricingField({
  pricing,
  value,
  onChange,
  onSelectedChange,
  selected = true,
  action,
}: CyclePricingFieldProps) {
  const fieldId = useId();
  const checkboxId = `pricing-${fieldId}`;

  if (!pricing) {
    return null;
  }

  const currentPricing = value || pricing;

  const updatePricingItem = (
    type: "registration" | "tuition" | "materials",
    index: number,
    field: "amount" | "label" | "notes",
    newValue: string,
  ) => {
    const updated = { ...currentPricing };
    const items = updated[type] || [];
    const updatedItems = [...items];
    
    if (updatedItems[index]) {
      updatedItems[index] = {
        ...updatedItems[index]!,
        [field]: newValue,
      };
      updated[type] = updatedItems;
      onChange(updated);
    }
  };

  const addPricingItem = (type: "registration" | "tuition" | "materials") => {
    const updated = { ...currentPricing };
    const items = updated[type] || [];
    updated[type] = [
      ...items,
      {
        amount: "",
        label: type === "registration" ? "Registration" : type === "tuition" ? "Tuition" : "Materials",
        currency: "JMD",
        notes: "",
      },
    ];
    onChange(updated);
  };

  const removePricingItem = (
    type: "registration" | "tuition" | "materials",
    index: number,
  ) => {
    const updated = { ...currentPricing };
    const items = updated[type] || [];
    const updatedItems = items.filter((_, i) => i !== index);
    if (updatedItems.length === 0) {
      delete updated[type];
    } else {
      updated[type] = updatedItems;
    }
    onChange(updated);
  };

  const hasAnyPricing =
    (currentPricing.registration && currentPricing.registration.length > 0) ||
    (currentPricing.tuition && currentPricing.tuition.length > 0) ||
    (currentPricing.materials && currentPricing.materials.length > 0);

  if (!hasAnyPricing) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {onSelectedChange && (
          <Checkbox
            id={checkboxId}
            isSelected={selected}
            onValueChange={onSelectedChange}
          />
        )}
        <label
          htmlFor={onSelectedChange ? checkboxId : undefined}
          className="text-sm font-medium"
        >
          Cycle Pricing
        </label>
        {action && (
          <span
            className={`text-xs px-2 py-0.5 rounded ${
              action === "add"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            }`}
          >
            {action === "add" ? "New" : "Updated"}
          </span>
        )}
      </div>
      <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-md space-y-4">
        {/* Registration Fees */}
        {currentPricing.registration && currentPricing.registration.length > 0 && (
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Registration Fees
            </label>
            <div className="space-y-2">
              {currentPricing.registration.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-2 items-start p-2 bg-white dark:bg-gray-900 rounded"
                >
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Label (e.g., Registration Fee)"
                      value={item.label || ""}
                      onChange={(e) =>
                        updatePricingItem("registration", index, "label", e.target.value)
                      }
                      disabled={!selected}
                      className="bg-white dark:bg-gray-900"
                    />
                    <Input
                      placeholder="Amount (e.g., $5000 or 5000)"
                      value={item.amount || ""}
                      onChange={(e) =>
                        updatePricingItem("registration", index, "amount", e.target.value)
                      }
                      disabled={!selected}
                      className="bg-white dark:bg-gray-900"
                    />
                    {item.notes && (
                      <Input
                        placeholder="Notes (optional)"
                        value={item.notes || ""}
                        onChange={(e) =>
                          updatePricingItem("registration", index, "notes", e.target.value)
                        }
                        disabled={!selected}
                        className="bg-white dark:bg-gray-900"
                      />
                    )}
                  </div>
                  {selected && (
                    <button
                      type="button"
                      onClick={() => removePricingItem("registration", index)}
                      className="text-red-600 hover:text-red-800 text-xs px-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              {selected && (
                <button
                  type="button"
                  onClick={() => addPricingItem("registration")}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  + Add Registration Fee
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tuition */}
        {currentPricing.tuition && currentPricing.tuition.length > 0 && (
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Tuition
            </label>
            <div className="space-y-2">
              {currentPricing.tuition.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-2 items-start p-2 bg-white dark:bg-gray-900 rounded"
                >
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Label (e.g., Tuition Fee)"
                      value={item.label || ""}
                      onChange={(e) =>
                        updatePricingItem("tuition", index, "label", e.target.value)
                      }
                      disabled={!selected}
                      className="bg-white dark:bg-gray-900"
                    />
                    <Input
                      placeholder="Amount (e.g., $100000 or 100000)"
                      value={item.amount || ""}
                      onChange={(e) =>
                        updatePricingItem("tuition", index, "amount", e.target.value)
                      }
                      disabled={!selected}
                      className="bg-white dark:bg-gray-900"
                    />
                    {item.notes && (
                      <Input
                        placeholder="Notes (optional)"
                        value={item.notes || ""}
                        onChange={(e) =>
                          updatePricingItem("tuition", index, "notes", e.target.value)
                        }
                        disabled={!selected}
                        className="bg-white dark:bg-gray-900"
                      />
                    )}
                  </div>
                  {selected && (
                    <button
                      type="button"
                      onClick={() => removePricingItem("tuition", index)}
                      className="text-red-600 hover:text-red-800 text-xs px-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              {selected && (
                <button
                  type="button"
                  onClick={() => addPricingItem("tuition")}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  + Add Tuition
                </button>
              )}
            </div>
          </div>
        )}

        {/* Materials */}
        {currentPricing.materials && currentPricing.materials.length > 0 && (
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Materials
            </label>
            <div className="space-y-2">
              {currentPricing.materials.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-2 items-start p-2 bg-white dark:bg-gray-900 rounded"
                >
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Label (e.g., Materials Fee)"
                      value={item.label || ""}
                      onChange={(e) =>
                        updatePricingItem("materials", index, "label", e.target.value)
                      }
                      disabled={!selected}
                      className="bg-white dark:bg-gray-900"
                    />
                    <Input
                      placeholder="Amount (e.g., $5000 or 5000)"
                      value={item.amount || ""}
                      onChange={(e) =>
                        updatePricingItem("materials", index, "amount", e.target.value)
                      }
                      disabled={!selected}
                      className="bg-white dark:bg-gray-900"
                    />
                    {item.notes && (
                      <Input
                        placeholder="Notes (optional)"
                        value={item.notes || ""}
                        onChange={(e) =>
                          updatePricingItem("materials", index, "notes", e.target.value)
                        }
                        disabled={!selected}
                        className="bg-white dark:bg-gray-900"
                      />
                    )}
                  </div>
                  {selected && (
                    <button
                      type="button"
                      onClick={() => removePricingItem("materials", index)}
                      className="text-red-600 hover:text-red-800 text-xs px-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              {selected && (
                <button
                  type="button"
                  onClick={() => addPricingItem("materials")}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  + Add Materials Fee
                </button>
              )}
            </div>
          </div>
        )}

        {!hasAnyPricing && selected && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => addPricingItem("registration")}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              + Add Registration Fee
            </button>
            <button
              type="button"
              onClick={() => addPricingItem("tuition")}
              className="text-xs text-blue-600 hover:text-blue-800 block"
            >
              + Add Tuition
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

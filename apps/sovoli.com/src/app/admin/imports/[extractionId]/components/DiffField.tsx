"use client";

import { useId } from "react";
import { Input } from "@sovoli/ui/components/input";
import { Checkbox } from "@sovoli/ui/components/checkbox";
import type { DiffEntry } from "../../utils/diff-compute";

interface DiffFieldProps {
  diff: DiffEntry;
  value: unknown;
  onChange: (value: unknown) => void;
  onSelectedChange?: (selected: boolean) => void;
  selected?: boolean;
  label?: string;
  action?: "add" | "update" | null;
}

export function DiffField({
  diff,
  value,
  onChange,
  onSelectedChange,
  selected = true,
  label,
  action,
}: DiffFieldProps) {
  // Generate stable ID for SSR compatibility
  const checkboxId = useId();
  const fieldId = `field-checkbox-${diff.field}-${checkboxId}`;

  // Create a human-readable label from the field path
  const getFieldLabel = () => {
    if (label) return label;

    // Convert field path like "locations[0].address.line1" to "Location 1 - Address Line 1"
    const parts = diff.field.split(/[.[\]]/).filter(Boolean);
    const readable = parts.map((part, index) => {
      // If it's a number, it's an array index
      if (!Number.isNaN(Number(part))) {
        const prevPart = parts[index - 1];
        if (prevPart) {
          // Capitalize and pluralize the previous part
          const singular = prevPart.replace(/s$/, "");
          return `${singular.charAt(0).toUpperCase() + singular.slice(1)} ${Number(part) + 1}`;
        }
        return `Item ${Number(part) + 1}`;
      }
      // Capitalize and format the part
      return (
        part.charAt(0).toUpperCase() + part.slice(1).replace(/([A-Z])/g, " $1")
      );
    });

    return readable.join(" - ");
  };

  const fieldLabel = getFieldLabel();

  // Determine the background color based on diff type
  const getBgColor = () => {
    switch (diff.type) {
      case "add":
        return "bg-green-50 dark:bg-green-950/20";
      case "update":
        return "bg-yellow-50 dark:bg-yellow-950/20";
      default:
        return "bg-muted";
    }
  };

  // Helper to safely stringify oldValue
  const getOldValuePlaceholder = () => {
    if (diff.oldValue === null || diff.oldValue === undefined) return "";
    if (typeof diff.oldValue === "string" || typeof diff.oldValue === "number" || typeof diff.oldValue === "boolean") {
      return String(diff.oldValue);
    }
    return "";
  };

  const safeStringifyValue = (input: unknown): string => {
    if (input === null || input === undefined) return "";
    if (
      typeof input === "string" ||
      typeof input === "number" ||
      typeof input === "boolean" ||
      typeof input === "bigint" ||
      typeof input === "symbol" ||
      typeof input === "function"
    ) {
      return String(input);
    }
    try {
      return JSON.stringify(input);
    } catch {
      return "";
    }
  };

  // Handle different value types - only show simple inputs, no JSON
  const renderValue = () => {
    if (value === null || value === undefined) {
      return (
        <Input
          value=""
          onChange={(e) => onChange(e.target.value)}
          className={getBgColor()}
          placeholder={getOldValuePlaceholder()}
          disabled={!selected}
        />
      );
    }

    if (typeof value === "string") {
      return (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={getBgColor()}
          placeholder={getOldValuePlaceholder()}
          disabled={!selected}
        />
      );
    }

    if (typeof value === "number") {
      return (
        <Input
          type="number"
          value={String(value)}
          onChange={(e) => onChange(Number(e.target.value))}
          className={getBgColor()}
          placeholder={getOldValuePlaceholder()}
          disabled={!selected}
        />
      );
    }

    if (typeof value === "boolean") {
      return (
        <Checkbox
          isSelected={value}
          onValueChange={onChange}
          disabled={!selected}
        />
      );
    }

    // For arrays or objects, we shouldn't reach here if diff computation is correct
    // But as a fallback, show as string
    const stringValue = safeStringifyValue(value);
    return (
      <Input
        value={stringValue}
        onChange={(e) => onChange(e.target.value)}
        className={getBgColor()}
        placeholder={getOldValuePlaceholder()}
        disabled={!selected}
      />
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {onSelectedChange && (
          <Checkbox
            id={fieldId}
            isSelected={selected}
            onValueChange={onSelectedChange}
          />
        )}
        <label
          htmlFor={onSelectedChange ? fieldId : undefined}
          className="text-sm font-medium"
        >
          {fieldLabel}
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
      {renderValue()}
      {diff.oldValue !== undefined && diff.type === "update" && (
        <p className="text-xs text-muted-foreground">
          Previous: {getOldValuePlaceholder()}
        </p>
      )}
    </div>
  );
}

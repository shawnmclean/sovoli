"use client";

import { useId } from "react";
import { Input } from "@sovoli/ui/components/input";
import { Checkbox } from "@sovoli/ui/components/checkbox";
import { extractStartDate, parseExtractionDate } from "../../utils/cycle-utils";

interface CycleScheduleFieldProps {
  schedule: { dates?: string[] } | null;
  value: { dates?: string[] } | null;
  onChange: (value: { dates?: string[] } | null) => void;
  onSelectedChange?: (selected: boolean) => void;
  selected?: boolean;
  action?: "add" | "update" | null;
}

export function CycleScheduleField({
  schedule,
  value,
  onChange,
  onSelectedChange,
  selected = true,
  action,
}: CycleScheduleFieldProps) {
  const fieldId = useId();
  const checkboxId = `schedule-${fieldId}`;

  if (!schedule?.dates || schedule.dates.length === 0) {
    return null;
  }

  // Get the first date as the start date
  const firstDate = schedule.dates[0] ?? "";
  const parsedDate = extractStartDate(schedule);

  // Get current value - prefer value, then parsed date, then original date
  // For date input, we need YYYY-MM-DD format
  let currentDate = "";
  if (value?.dates?.[0]) {
    const val = value.dates[0];
    // Check if it's already in YYYY-MM-DD format
    const dateMatch = /^\d{4}-\d{2}-\d{2}$/.exec(val);
    if (dateMatch) {
      currentDate = val;
    } else {
      // Try to parse it
      const parsed = parseExtractionDate(val);
      currentDate = parsed ?? val;
    }
  } else if (parsedDate) {
    currentDate = parsedDate;
  } else if (firstDate) {
    // Try to parse the original date string
    const parsed = parseExtractionDate(firstDate);
    currentDate = parsed ?? "";
  }

  const handleDateChange = (newDate: string) => {
    if (newDate) {
      // If it's a date input (YYYY-MM-DD), use it directly
      // Otherwise, try to parse it
      const dateMatch = /^\d{4}-\d{2}-\d{2}$/.exec(newDate);
      if (dateMatch) {
        onChange({ dates: [newDate] });
      } else {
        // Try to parse the date string
        const parsed = parseExtractionDate(newDate);
        if (parsed) {
          onChange({ dates: [parsed] });
        } else {
          // Keep as string if can't parse
          onChange({ dates: [newDate] });
        }
      }
    } else {
      onChange(null);
    }
  };

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
          Cycle Start Date
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
      <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-md">
        <div className="space-y-2">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Detected Date: {firstDate}
            </label>
            <Input
              type="date"
              value={currentDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="bg-white dark:bg-gray-900"
              disabled={!selected}
            />
          </div>
          {parsedDate && (
            <p className="text-xs text-muted-foreground">
              Parsed as: {new Date(parsedDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

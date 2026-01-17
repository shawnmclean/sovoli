"use client";

import { Card } from "@sovoli/ui/components/card";
import { Select, SelectItem } from "@sovoli/ui/components/select";
import { PROGRAM_SUFFIXES } from "../utils/suffix-utils";
import type { ProgramSuffix } from "../utils/suffix-utils";

interface ProgramConfigurationProps {
  selectedSuffix: ProgramSuffix | null;
  onSuffixChange: (suffix: ProgramSuffix | null) => void;
  onApplyToAllPrograms: (suffix: ProgramSuffix | null) => void;
}

export function ProgramConfiguration({
  selectedSuffix,
  onSuffixChange,
  onApplyToAllPrograms,
}: ProgramConfigurationProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Configuration</h3>
          <p className="text-sm text-muted-foreground">
            Choose a suffix to apply to all program names. Existing suffixes will be replaced.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm font-medium min-w-[120px]">
            Choose Suffix:
          </label>
          <Select
            selectedKeys={
              selectedSuffix ? new Set([selectedSuffix]) : new Set()
            }
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string | undefined;
              if (selectedKey && PROGRAM_SUFFIXES.includes(selectedKey as ProgramSuffix)) {
                const suffix = selectedKey as ProgramSuffix;
                onSuffixChange(suffix);
                // Apply suffix to all programs
                onApplyToAllPrograms(suffix);
              } else {
                onSuffixChange(null);
                // Remove suffix from all programs
                onApplyToAllPrograms(null);
              }
            }}
            className="max-w-xs"
            placeholder="No suffix"
            labelPlacement="outside"
          >
            {PROGRAM_SUFFIXES.map((suffix) => (
              <SelectItem key={suffix} textValue={suffix}>
                {suffix}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
    </Card>
  );
}

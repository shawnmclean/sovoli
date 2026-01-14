"use client";

import { Card } from "@sovoli/ui/components/card";
import { Checkbox } from "@sovoli/ui/components/checkbox";
import { Select, SelectItem } from "@sovoli/ui/components/select";
import { DiffField } from "./DiffField";
import { CycleScheduleField } from "./CycleScheduleField";
import { CyclePricingField } from "./CyclePricingField";
import { useProgramDiff } from "../hooks/useProgramDiff";
import { getNestedValue } from "../utils/object-utils";
import { extractStartDate } from "../../utils/cycle-utils";
import { useState, useEffect } from "react";
import type { ProgramEvidence } from "../../types/lead-extraction-schema";

interface ProgramDiffViewProps {
  programId: string;
  programName: string;
  oldProgram: Record<string, unknown> | null;
  oldProgramId?: string | null;
  newProgram: Record<string, unknown>;
  matchedPrograms?: Array<{ id: string; name: string; score: number }> | null;
  allExistingPrograms?: Array<{ id: string; name: string }>;
  schedule?: { dates?: string[] } | null;
  pricing?: Record<string, unknown> | null;
  onChange: (
    updatedProgram: Record<string, unknown> | null,
    action: "add" | "update" | null,
    targetProgramId?: string,
  ) => void;
}

export function ProgramDiffView({
  programId,
  programName,
  oldProgram,
  oldProgramId,
  newProgram,
  matchedPrograms,
  allExistingPrograms = [],
  schedule,
  pricing,
  onChange,
}: ProgramDiffViewProps) {
  const {
    editedProgram,
    isSelected,
    action,
    targetProgramId,
    selectedFields,
    allDiffs,
    isNew,
    isMatched,
    handleFieldChange,
    handleFieldSelection,
    handleProgramSelection,
    handleActionChange,
    setTargetProgramId,
  } = useProgramDiff({
    programId,
    oldProgram,
    oldProgramId: oldProgramId ?? null,
    newProgram,
    matchedPrograms: matchedPrograms ?? null,
    allExistingPrograms,
    onChange,
  });

  // Use edited name if available, otherwise fall back to original program name
  const displayName = (editedProgram.name as string) || programName;

  // Manage schedule and pricing state separately
  const [editedSchedule, setEditedSchedule] = useState<{
    dates?: string[];
  } | null>(schedule ?? null);
  const [editedPricing, setEditedPricing] = useState<Record<string, unknown> | null>(pricing ?? null);
  const [scheduleSelected, setScheduleSelected] = useState(!!schedule);
  const [pricingSelected, setPricingSelected] = useState(!!pricing);

  // Wrapper function to ensure pricing onChange matches expected type
  const handlePricingChange = (value: ProgramEvidence["pricing"] | null) => {
    setEditedPricing(value ?? null);
  };

  // Update edited schedule/pricing when props change
  useEffect(() => {
    if (schedule) {
      setEditedSchedule(schedule);
      setScheduleSelected(true);
    }
    if (pricing) {
      setEditedPricing(pricing);
      setPricingSelected(true);
    }
  }, [schedule, pricing]);

  // Update parent when schedule or pricing changes
  useEffect(() => {
    if (!isSelected || !action) return;

    const updated = { ...editedProgram };
    if (scheduleSelected && editedSchedule) {
      updated._extractedSchedule = editedSchedule;
    } else {
      delete updated._extractedSchedule;
    }
    if (pricingSelected && editedPricing) {
      updated._extractedPricing = editedPricing;
    } else {
      delete updated._extractedPricing;
    }

    // Use handleFieldChange to update the program data properly
    handleFieldChange(
      "_extractedSchedule",
      scheduleSelected && editedSchedule ? editedSchedule : undefined,
    );
    handleFieldChange(
      "_extractedPricing",
      pricingSelected && editedPricing ? editedPricing : undefined,
    );
  }, [
    editedSchedule,
    editedPricing,
    scheduleSelected,
    pricingSelected,
    isSelected,
    action,
    handleFieldChange,
  ]);

  return (
    <Card className="p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Checkbox
              isSelected={isSelected}
              onValueChange={handleProgramSelection}
            />
            <h2 className="text-xl font-semibold">{displayName}</h2>
          </div>
          {isMatched && matchedPrograms && matchedPrograms.length > 0 && (
            <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Matched ({matchedPrograms[0]!.score.toFixed(2)})
            </span>
          )}
        </div>

        {isSelected && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Action:</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`action-${programId}`}
                    checked={action === "add"}
                    onChange={() => handleActionChange("add")}
                    className="cursor-pointer"
                  />
                  <span className="text-sm">Add New Program</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`action-${programId}`}
                    checked={action === "update"}
                    onChange={() => handleActionChange("update")}
                    className="cursor-pointer"
                    disabled={allExistingPrograms.length === 0}
                  />
                  <span className="text-sm">Update Existing</span>
                  {allExistingPrograms.length === 0 && (
                    <span className="text-xs text-muted-foreground">
                      (No existing programs)
                    </span>
                  )}
                </label>
              </div>
            </div>

            {action === "update" && allExistingPrograms.length > 0 && (
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Update Program:</label>
                <Select
                  selectedKeys={
                    targetProgramId ? new Set([targetProgramId]) : new Set()
                  }
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0];
                    if (selectedKey) {
                      setTargetProgramId(selectedKey as string);
                    } else {
                      setTargetProgramId(undefined);
                    }
                  }}
                  className="max-w-xs"
                  placeholder="Select a program to update"
                  labelPlacement="outside"
                >
                  {allExistingPrograms.map((program) => {
                    // Highlight matched programs
                    const isMatched = matchedPrograms?.some(
                      (m) => m.id === program.id,
                    );
                    const match = matchedPrograms?.find(
                      (m) => m.id === program.id,
                    );
                    return (
                      <SelectItem key={program.id} textValue={program.name}>
                        {program.name}
                        {isMatched && match && (
                          <span className="text-xs text-blue-600 dark:text-blue-400 ml-2">
                            (Matched: {match.score.toFixed(2)})
                          </span>
                        )}
                      </SelectItem>
                    );
                  })}
                </Select>
              </div>
            )}

            {action === "update" && allExistingPrograms.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No existing programs found. This will create a new program.
              </p>
            )}

            {action === "update" && oldProgram && (
              <p className="text-xs text-muted-foreground">
                Updating existing program. Select which fields to update below.
              </p>
            )}

            {action === "add" && (
              <p className="text-xs text-muted-foreground">
                Creating new program. Select which fields to include below.
              </p>
            )}
          </div>
        )}
      </div>

      {isSelected && (
        <div className="space-y-4">
          {/* Cycle Schedule Field */}
          {schedule && (
            <CycleScheduleField
              schedule={schedule}
              value={editedSchedule}
              onChange={setEditedSchedule}
              onSelectedChange={setScheduleSelected}
              selected={scheduleSelected}
              action={action}
            />
          )}

          {/* Cycle Pricing Field */}
          {pricing && (
            <CyclePricingField
              pricing={pricing}
              value={editedPricing as ProgramEvidence["pricing"] | null}
              onChange={handlePricingChange}
              onSelectedChange={setPricingSelected}
              selected={pricingSelected}
              action={action}
            />
          )}

          {/* Other program fields */}
          {allDiffs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No changes detected.
            </p>
          ) : (
            allDiffs.map((diff) => {
              const value = getNestedValue(editedProgram, diff.field);

              return (
                <DiffField
                  key={diff.field}
                  diff={diff}
                  value={value}
                  onChange={(newValue) =>
                    handleFieldChange(diff.field, newValue)
                  }
                  onSelectedChange={(selected) =>
                    handleFieldSelection(diff.field, selected)
                  }
                  selected={selectedFields.has(diff.field)}
                  action={action}
                />
              );
            })
          )}
        </div>
      )}
    </Card>
  );
}

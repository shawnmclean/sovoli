import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { computeDiff } from "../../utils/diff-compute";

interface UseProgramDiffProps {
  programId: string;
  oldProgram: Record<string, unknown> | null;
  oldProgramId: string | null;
  newProgram: Record<string, unknown>;
  matchedPrograms: { id: string; name: string; score: number }[] | null;
  allExistingPrograms: { id: string; name: string }[];
  onChange: (
    updatedProgram: Record<string, unknown> | null,
    action: "add" | "update" | null,
    targetProgramId?: string,
  ) => void;
}

export function useProgramDiff({
  oldProgram,
  oldProgramId,
  newProgram,
  matchedPrograms,
  allExistingPrograms,
  onChange,
}: UseProgramDiffProps) {
  const isNew = oldProgram === null;
  const isMatched = matchedPrograms && matchedPrograms.length > 0;

  // Compute initial default values - memoized to avoid recreating on every render
  const initialAction = useMemo((): "add" | "update" | null => {
    // Only default to "update" if there's a matched program or an old program
    if (isMatched && matchedPrograms && matchedPrograms.length > 0) {
      return "update";
    }
    if (!isNew && oldProgram) {
      return "update";
    }
    // Otherwise, default to "add" (even if there are existing programs available)
    return "add";
  }, [isMatched, isNew, matchedPrograms, oldProgram]);

  const initialTargetProgramId = useMemo((): string | undefined => {
    // Only set target program ID if we're updating
    if (initialAction !== "update") {
      return undefined;
    }

    // If matched, use matched program
    if (isMatched && matchedPrograms && matchedPrograms.length > 0) {
      const firstMatch = matchedPrograms[0];
      return firstMatch ? firstMatch.id : undefined;
    }
    // If we have an old program ID, use it
    if (!isNew && oldProgramId) {
      return oldProgramId;
    }
    // Otherwise, if there are existing programs, use the first one
    // (user can change it via dropdown)
    if (allExistingPrograms.length > 0) {
      const firstProgram = allExistingPrograms[0];
      return firstProgram ? firstProgram.id : undefined;
    }
    return undefined;
  }, [
    initialAction,
    isMatched,
    isNew,
    matchedPrograms,
    oldProgramId,
    allExistingPrograms,
  ]);

  const [editedProgram, setEditedProgram] =
    useState<Record<string, unknown>>(newProgram);
  const [isSelected, setIsSelected] = useState(true);
  const [action, setAction] = useState<"add" | "update" | null>(initialAction);
  const [targetProgramId, setTargetProgramId] = useState<string | undefined>(
    initialTargetProgramId,
  );
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());

  // Refs for tracking state and preventing unnecessary updates
  const lastNewProgramRef = useRef<string>(JSON.stringify(newProgram));
  const lastFinalProgramRef = useRef<string>("");
  const onChangeRef = useRef(onChange);
  const isInitialMountRef = useRef(true);
  const editedProgramRef = useRef<Record<string, unknown>>(newProgram);
  const hasInitializedFieldsRef = useRef(false);
  const isUserEditingRef = useRef(false);
  const userEditTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Keep onChange ref up to date
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Keep editedProgramRef in sync with editedProgram state
  useEffect(() => {
    editedProgramRef.current = editedProgram;
  }, [editedProgram]);

  // Sync editedProgram when newProgram prop changes (e.g., when suffix is applied)
  // This should only happen for external updates, not user typing
  useEffect(() => {
    const newProgramString = JSON.stringify(newProgram);
    const currentProgramString = JSON.stringify(editedProgramRef.current);

    // Skip if nothing changed
    if (newProgramString === lastNewProgramRef.current) {
      return;
    }

    // Skip if user is currently editing (typing in input)
    if (isUserEditingRef.current) {
      return;
    }

    // Check if this is an echo-back from our own onChange
    const isEchoBack = newProgramString === lastFinalProgramRef.current;
    if (isEchoBack) {
      // This is our own change being echoed back, don't sync
      lastNewProgramRef.current = newProgramString;
      return;
    }

    // This is a real external update (e.g., suffix application)
    // Only sync if the new program is actually different from current
    if (newProgramString !== currentProgramString) {
      lastNewProgramRef.current = newProgramString;
      setEditedProgram(newProgram);
      editedProgramRef.current = newProgram;
    }

    // Mark as mounted after first effect run
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
    }
  }, [newProgram]);

  // Update when props change - but only if action/target haven't been set by user
  useEffect(() => {
    // Only auto-update if we don't have a user-selected action yet
    // This prevents resetting user choices when props change
    if (action === null) {
      setTargetProgramId(initialTargetProgramId);
      setAction(initialAction);
    }
  }, [action, initialAction, initialTargetProgramId]);

  // Compute diffs - memoized
  const allDiffs = useMemo(() => {
    if (isNew || !oldProgram) {
      return computeDiff({} as Record<string, unknown>, editedProgram);
    }
    const diffs = computeDiff(oldProgram, editedProgram);
    const filteredDiffs = diffs.filter((diff) => diff.type !== "remove");

    // Always include name field when updating, even if it hasn't changed
    // This ensures the name is always editable
    const hasNameDiff = filteredDiffs.some((diff) => diff.field === "name");
    if (!hasNameDiff && editedProgram.name !== undefined) {
      const oldName = (oldProgram.name as string) || "";
      const newName = (editedProgram.name as string) || "";
      filteredDiffs.push({
        field: "name",
        oldValue: oldName,
        newValue: newName,
        type: "update", // Always show as update to make it editable
      });
    }

    return filteredDiffs;
  }, [editedProgram, oldProgram, isNew]);

  // Initialize selected fields - all selected by default (only once)
  useEffect(() => {
    if (!hasInitializedFieldsRef.current && allDiffs.length > 0) {
      const initialSelected = new Set(allDiffs.map((diff) => diff.field));
      setSelectedFields(initialSelected);
      hasInitializedFieldsRef.current = true;
    }
  }, [allDiffs.length]);

  // Ensure name field is selected when it changes (e.g., from suffix application)
  // Also ensure it's included in diffs even if it wasn't there before
  useEffect(() => {
    if (editedProgram.name) {
      // Check if name is in diffs but not selected
      const nameInDiffs = allDiffs.some((diff) => diff.field === "name");
      if (nameInDiffs && !selectedFields.has("name")) {
        const newSelected = new Set(selectedFields);
        newSelected.add("name");
        setSelectedFields(newSelected);
      }
    }
  }, [editedProgram.name, allDiffs, selectedFields]);

  // Compute final program data based on selections - memoized
  const finalProgram = useMemo(() => {
    if (!isSelected || !action) {
      return null;
    }

    // Build final program with only selected fields
    const result: Record<string, unknown> = {};

    // If updating, start with old program data
    if (action === "update" && oldProgram) {
      Object.assign(result, oldProgram);
    }

    // Apply only selected field changes
    for (const diff of allDiffs) {
      if (selectedFields.has(diff.field)) {
        const parts = diff.field.split(".");
        let current: Record<string, unknown> = result;
        let source: Record<string, unknown> = editedProgram;

        // Navigate to the field location
        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i];
          if (!part) continue;

          if (!(part in current)) {
            current[part] = {};
          }

          const sourceValue = source[part];
          if (
            !(part in source) ||
            typeof sourceValue !== "object" ||
            sourceValue === null ||
            Array.isArray(sourceValue)
          ) {
            // Don't mutate source, just use empty object for navigation
            source = {};
          } else {
            source = sourceValue as Record<string, unknown>;
          }

          const currentValue = current[part];
          if (
            typeof currentValue === "object" &&
            currentValue !== null &&
            !Array.isArray(currentValue)
          ) {
            current = currentValue as Record<string, unknown>;
          } else {
            current[part] = {};
            current = current[part] as Record<string, unknown>;
          }
        }

        const lastPart = parts[parts.length - 1];
        if (lastPart && lastPart in source) {
          current[lastPart] = source[lastPart];
        }
      }
    }

    return result;
  }, [editedProgram, selectedFields, allDiffs, oldProgram, action, isSelected]);

  // Track last action and target to detect changes
  const lastActionRef = useRef<"add" | "update" | null>(action);
  const lastTargetRef = useRef<string | undefined>(targetProgramId);
  const pendingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update parent when final program, action, or target changes
  // Action and target changes should be immediate, program data changes can be debounced
  useEffect(() => {
    // Clear any pending timeout
    if (pendingTimeoutRef.current) {
      clearTimeout(pendingTimeoutRef.current);
      pendingTimeoutRef.current = null;
    }

    if (finalProgram === null) {
      lastFinalProgramRef.current = "";
      lastActionRef.current = null;
      lastTargetRef.current = undefined;
      onChangeRef.current(null, null);
      return;
    }

    const finalProgramString = JSON.stringify(finalProgram);
    const actionChanged = lastActionRef.current !== action;
    const targetChanged = lastTargetRef.current !== targetProgramId;
    const programChanged = finalProgramString !== lastFinalProgramRef.current;

    // Call onChange if program data, action, or target changed
    if (programChanged || actionChanged || targetChanged) {
      lastFinalProgramRef.current = finalProgramString;
      lastActionRef.current = action;
      lastTargetRef.current = targetProgramId;

      // Action and target changes should be immediate (no debounce)
      // Program data changes can be debounced to avoid too many updates during typing
      if (actionChanged || targetChanged) {
        // Immediate update for action/target changes
        onChangeRef.current(finalProgram, action, targetProgramId);
      } else {
        // Debounced update for program data changes
        pendingTimeoutRef.current = setTimeout(() => {
          onChangeRef.current(finalProgram, action, targetProgramId);
          pendingTimeoutRef.current = null;
        }, 100);
      }
    }
  }, [finalProgram, action, targetProgramId]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (userEditTimeoutRef.current) {
        clearTimeout(userEditTimeoutRef.current);
      }
      if (pendingTimeoutRef.current) {
        clearTimeout(pendingTimeoutRef.current);
      }
    };
  }, []);

  // Helper to set nested value in an object (immutably)
  // Defined as a regular function to allow recursion
  function setNestedValueImmutable(
    obj: Record<string, unknown>,
    path: string,
    value: unknown,
  ): Record<string, unknown> {
    const parts = path.split(".").filter(Boolean);

    if (parts.length === 0) {
      return obj;
    }

    if (parts.length === 1) {
      const part = parts[0];
      if (!part) return obj;
      return { ...obj, [part]: value };
    }

    // For nested paths, create a new object with the updated nested value
    const [firstPart, ...restParts] = parts;
    if (!firstPart) return obj;

    const currentValue = obj[firstPart];
    const isObject =
      typeof currentValue === "object" &&
      currentValue !== null &&
      !Array.isArray(currentValue);

    const nestedValue = isObject
      ? setNestedValueImmutable(
          currentValue as Record<string, unknown>,
          restParts.join("."),
          value,
        )
      : (() => {
          // Create nested structure
          const newObj: Record<string, unknown> = {};
          let current = newObj;
          for (let i = 0; i < restParts.length - 1; i++) {
            const part = restParts[i];
            if (!part) continue;
            current[part] = {};
            current = current[part] as Record<string, unknown>;
          }
          const lastPart = restParts[restParts.length - 1];
          if (lastPart) {
            current[lastPart] = value;
          }
          return newObj;
        })();

    return { ...obj, [firstPart]: nestedValue };
  }

  const handleFieldChange = useCallback((field: string, value: unknown) => {
    // Mark that user is editing
    isUserEditingRef.current = true;

    // Clear any existing timeout
    if (userEditTimeoutRef.current) {
      clearTimeout(userEditTimeoutRef.current);
    }

    // Update the program state immutably
    const updated = setNestedValueImmutable(
      editedProgramRef.current,
      field,
      value,
    );
    setEditedProgram(updated);
    editedProgramRef.current = updated;

    // Reset the editing flag after a short delay (user stopped typing)
    userEditTimeoutRef.current = setTimeout(() => {
      isUserEditingRef.current = false;
    }, 300);
  }, []);

  const handleFieldSelection = (field: string, selected: boolean) => {
    const newSelected = new Set(selectedFields);
    if (selected) {
      newSelected.add(field);
    } else {
      newSelected.delete(field);
    }
    setSelectedFields(newSelected);
  };

  const handleProgramSelection = (selected: boolean) => {
    setIsSelected(selected);
    if (!selected) {
      setAction(null);
    } else if (!action) {
      // Set default action if none selected
      if (isMatched && matchedPrograms && matchedPrograms.length > 0) {
        setAction("update");
        const firstMatch = matchedPrograms[0];
        if (firstMatch) {
          setTargetProgramId(firstMatch.id);
        }
      } else {
        setAction("add");
      }
    }
  };

  const handleActionChange = (newAction: "add" | "update") => {
    setAction(newAction);
    if (newAction === "update") {
      // Default to matched program if available, otherwise first existing program
      if (isMatched && matchedPrograms && matchedPrograms.length > 0) {
        const firstMatch = matchedPrograms[0];
        if (firstMatch) {
          setTargetProgramId(firstMatch.id);
        }
      } else if (allExistingPrograms.length > 0) {
        const firstProgram = allExistingPrograms[0];
        if (firstProgram) {
          setTargetProgramId(firstProgram.id);
        }
      }
    } else {
      setTargetProgramId(undefined);
    }
  };

  return {
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
  };
}

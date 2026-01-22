import { useEffect, useMemo, useRef, useState } from "react";
import { computeDiff, deepEqual } from "../../utils/diff-compute";
import { getNestedValue, setNestedValue } from "../utils/object-utils";

interface UseOrgDiffProps {
  oldOrg: Record<string, unknown> | null;
  newOrg: Record<string, unknown>;
  onChange: (updatedOrg: Record<string, unknown>) => void;
}

export function useOrgDiff({ oldOrg, newOrg, onChange }: UseOrgDiffProps) {
  const [editedOrg, setEditedOrg] = useState<Record<string, unknown>>(newOrg);
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
  const isNew = oldOrg === null;
  const lastFinalOrgRef = useRef<string>("");
  const lastNewOrgRef = useRef<string>(JSON.stringify(newOrg));
  const onChangeRef = useRef(onChange);
  const isInitialMountRef = useRef(true);
  const editedOrgRef = useRef<Record<string, unknown>>(newOrg);
  const hasInitializedFieldsRef = useRef(false);

  // Keep onChange ref up to date
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Keep editedOrgRef in sync with editedOrg state
  useEffect(() => {
    editedOrgRef.current = editedOrg;
  }, [editedOrg]);

  // Sync editedOrg when newOrg prop changes (only if actually different)
  // Only sync when content actually changes, not on every render
  useEffect(() => {
    const newOrgString = JSON.stringify(newOrg);
    if (newOrgString !== lastNewOrgRef.current) {
      lastNewOrgRef.current = newOrgString;

      // Skip if this is just the parent echoing back what we sent via onChange
      // This happens because: we call onChange(finalOrg) -> parent sets state -> passes it back as newOrg
      if (newOrgString === lastFinalOrgRef.current) {
        return;
      }

      // Only update if editedOrg is different from newOrg
      if (!deepEqual(editedOrgRef.current, newOrg)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setEditedOrg(newOrg);
        editedOrgRef.current = newOrg;
      }
    }
    // Mark as mounted after first effect run
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
    }
  }, [newOrg]);

  // Compute diffs - memoized to prevent unnecessary recalculations
  const allDiffs = useMemo(() => {
    if (isNew) {
      return computeDiff({}, editedOrg);
    }
    // When isNew is false, oldOrg is guaranteed to be non-null
    const diffs = computeDiff(oldOrg, editedOrg);
    return diffs.filter((diff) => diff.type !== "remove");
  }, [editedOrg, oldOrg, isNew]);

  // Initialize selected fields - all selected by default (only once)
  useEffect(() => {
    if (!hasInitializedFieldsRef.current && allDiffs.length > 0) {
      const initialSelected = new Set(allDiffs.map((diff) => diff.field));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedFields(initialSelected);
      hasInitializedFieldsRef.current = true;
    }
  }, [allDiffs]);

  // Compute final org data based on selected fields - memoized
  const finalOrg = useMemo(() => {
    // Start with old org data if updating, otherwise empty object
    const result: Record<string, unknown> = oldOrg
      ? (JSON.parse(JSON.stringify(oldOrg)) as Record<string, unknown>)
      : {};

    // Apply only selected field changes
    for (const diff of allDiffs) {
      if (selectedFields.has(diff.field)) {
        const value = getNestedValue(editedOrg, diff.field);
        setNestedValue(result, diff.field, value);
      }
    }

    return result;
  }, [editedOrg, selectedFields, allDiffs, oldOrg]);

  // Update parent when final org changes (avoid infinite loops)
  useEffect(() => {
    const finalOrgString = JSON.stringify(finalOrg);
    if (finalOrgString !== lastFinalOrgRef.current) {
      lastFinalOrgRef.current = finalOrgString;
      onChangeRef.current(finalOrg);
    }
  }, [finalOrg]);

  const handleFieldChange = (field: string, value: unknown) => {
    const updated = JSON.parse(JSON.stringify(editedOrg)) as Record<
      string,
      unknown
    >;
    setNestedValue(updated, field, value);
    setEditedOrg(updated);
  };

  const handleFieldSelection = (field: string, selected: boolean) => {
    const newSelected = new Set(selectedFields);
    if (selected) {
      newSelected.add(field);
    } else {
      newSelected.delete(field);
    }
    setSelectedFields(newSelected);
  };

  return {
    editedOrg,
    selectedFields,
    allDiffs,
    isNew,
    handleFieldChange,
    handleFieldSelection,
  };
}

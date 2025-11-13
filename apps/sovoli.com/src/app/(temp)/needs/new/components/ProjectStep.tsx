"use client";

import { Select, SelectItem } from "@sovoli/ui/components/select";
import { Textarea } from "@sovoli/ui/components/input";
import { ImageFileInput } from "~/components/form/ImageFileInput";
import { SEVERITY_OPTIONS } from "./options";
import type { SeverityOptionKey } from "./options";

const SEVERITY_COLORS: Record<SeverityOptionKey, string> = {
  minor: "bg-blue-500",
  moderate: "bg-yellow-500",
  severe: "bg-orange-500",
  critical: "bg-red-500",
};

interface ProjectStepProps {
  severity: SeverityOptionKey | "";
  damageDescription: string;
  photos: File[];
  onSeverityChange: (value: SeverityOptionKey | "") => void;
  onDamageDescriptionChange: (value: string) => void;
  onPhotosChange: (files: File[]) => void;
}

export function ProjectStep({
  severity,
  damageDescription,
  photos,
  onSeverityChange,
  onDamageDescriptionChange,
  onPhotosChange,
}: ProjectStepProps) {
  const handleFileDropped = (files: File[]) => {
    onPhotosChange(files);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Select
          label="Severity"
          description="How bad is the damage?"
          selectedKeys={severity ? [severity] : []}
          onSelectionChange={(keys) =>
            onSeverityChange(
              (Array.from(keys)[0] as SeverityOptionKey | undefined) ?? "",
            )
          }
          placeholder="Select severity level"
          size="lg"
          renderValue={(items) => {
            const selected = items[0];
            if (!selected) return null;
            const option = SEVERITY_OPTIONS.find(
              (opt) => opt.key === selected.key,
            );
            if (!option) return selected.textValue;
            return (
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${SEVERITY_COLORS[option.key]}`}
                />
                <span>{option.label}</span>
              </div>
            );
          }}
        >
          {SEVERITY_OPTIONS.map((option) => (
            <SelectItem key={option.key} textValue={option.label}>
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${SEVERITY_COLORS[option.key]}`}
                />
                <div className="flex flex-col">
                  <span>{option.label}</span>
                  <span className="text-xs text-default-500">
                    {option.description}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Textarea
          label="Description of the Damage"
          placeholder="Describe the damage in detail..."
          value={damageDescription}
          onValueChange={onDamageDescriptionChange}
          minRows={4}
          size="lg"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-default-700">Photos</label>
        <ImageFileInput
          name="damage-photos"
          multiple={true}
          onFileDropped={handleFileDropped}
        />
        {photos.length > 0 && (
          <p className="text-sm text-default-500">
            {photos.length} photo{photos.length !== 1 ? "s" : ""} selected
          </p>
        )}
      </div>
    </div>
  );
}

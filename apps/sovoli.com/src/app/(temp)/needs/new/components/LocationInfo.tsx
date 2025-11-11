import { Input } from "@sovoli/ui/components/input";
import { Select, SelectItem } from "@sovoli/ui/components/select";
import { PARISH_OPTIONS } from "./options";
import type { ParishOptionKey } from "./options";

interface LocationInfoProps {
  addressLine1: string;
  addressLine2: string;
  city: string;
  parish: ParishOptionKey | "";
  onAddressLine1Change: (value: string) => void;
  onAddressLine2Change: (value: string) => void;
  onCityChange: (value: string) => void;
  onParishChange: (value: ParishOptionKey | "") => void;
}

export function LocationInfo({
  addressLine1,
  addressLine2,
  city,
  parish,
  onAddressLine1Change,
  onAddressLine2Change,
  onCityChange,
  onParishChange,
}: LocationInfoProps) {
  return (
    <div className="space-y-6">
      <Input
        size="lg"
        label="Street address"
        placeholder="Street or district"
        value={addressLine1}
        onValueChange={onAddressLine1Change}
      />
      <Input
        size="lg"
        label="Additional details (optional)"
        placeholder="Apartment, landmark, etc."
        value={addressLine2}
        onValueChange={onAddressLine2Change}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          size="lg"
          label="Community / Town"
          placeholder="Community or town"
          value={city}
          onValueChange={onCityChange}
        />
        <Select
          label="Parish"
          selectedKeys={parish ? [parish] : []}
          onSelectionChange={(keys) =>
            onParishChange(
              (Array.from(keys)[0] as ParishOptionKey | undefined) ?? "",
            )
          }
          placeholder="Select parish"
          size="lg"
        >
          {PARISH_OPTIONS.map((option) => (
            <SelectItem key={option.key}>{option.label}</SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
}

import { Input } from "@sovoli/ui/components/input";

interface ContactInfoProps {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateCountry: string;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onAddressLine1Change: (value: string) => void;
  onAddressLine2Change: (value: string) => void;
  onCityChange: (value: string) => void;
  onStateCountryChange: (value: string) => void;
}

export function ContactInfo({
  name,
  phone,
  addressLine1,
  addressLine2,
  city,
  stateCountry,
  onNameChange,
  onPhoneChange,
  onAddressLine1Change,
  onAddressLine2Change,
  onCityChange,
  onStateCountryChange,
}: ContactInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-base text-default-500">
          We'll use this information to coordinate your contribution.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          size="lg"
          label="Full name"
          placeholder="Enter your name"
          value={name}
          onValueChange={onNameChange}
        />
        <Input
          size="lg"
          label="Contact number"
          type="tel"
          placeholder="e.g. 876-555-0123"
          value={phone}
          onValueChange={onPhoneChange}
        />
      </div>
      <div className="space-y-4">
        <Input
          size="lg"
          label="Address Line 1"
          placeholder="Street address"
          value={addressLine1}
          onValueChange={onAddressLine1Change}
        />
        <Input
          size="lg"
          label="Address Line 2"
          placeholder="Apartment, suite, etc. (optional)"
          value={addressLine2}
          onValueChange={onAddressLine2Change}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            size="lg"
            label="City"
            placeholder="City"
            value={city}
            onValueChange={onCityChange}
          />
          <Input
            size="lg"
            label="State/Country"
            placeholder="State or Country"
            value={stateCountry}
            onValueChange={onStateCountryChange}
          />
        </div>
      </div>
    </div>
  );
}

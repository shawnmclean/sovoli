import { Input } from "@sovoli/ui/components/input";

interface ContactDetailsProps {
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactRole: string;
  onContactNameChange: (value: string) => void;
  onContactPhoneChange: (value: string) => void;
  onContactEmailChange: (value: string) => void;
  onContactRoleChange: (value: string) => void;
}

export function ContactDetails({
  contactName,
  contactPhone,
  contactEmail,
  contactRole,
  onContactNameChange,
  onContactPhoneChange,
  onContactEmailChange,
  onContactRoleChange,
}: ContactDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          size="lg"
          label="Full name"
          placeholder="Primary contact at the school"
          value={contactName}
          onValueChange={onContactNameChange}
        />
        <Input
          size="lg"
          label="Contact number"
          type="tel"
          placeholder="e.g. 876-555-0123"
          value={contactPhone}
          onValueChange={onContactPhoneChange}
        />
      </div>
      <Input
        size="lg"
        type="email"
        label="Email (optional)"
        placeholder="name@school.edu"
        value={contactEmail}
        onValueChange={onContactEmailChange}
      />
      <Input
        size="lg"
        label="Role or title"
        placeholder="Principal, administrator, etc."
        value={contactRole}
        onValueChange={onContactRoleChange}
      />
    </div>
  );
}


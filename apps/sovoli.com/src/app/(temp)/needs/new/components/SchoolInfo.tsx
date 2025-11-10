import { Input } from "@sovoli/ui/components/input";

interface SchoolInfoProps {
  schoolName: string;
  schoolType: string;
  onSchoolNameChange: (value: string) => void;
  onSchoolTypeChange: (value: string) => void;
}

export function SchoolInfo({
  schoolName,
  schoolType,
  onSchoolNameChange,
  onSchoolTypeChange,
}: SchoolInfoProps) {
  return (
    <div className="space-y-6">
      <Input
        size="lg"
        label="School or organisation name"
        placeholder="e.g. Portmore Primary School"
        value={schoolName}
        onValueChange={onSchoolNameChange}
      />
      <Input
        size="lg"
        label="School type (optional)"
        placeholder="Primary, Secondary, Early Childhood..."
        value={schoolType}
        onValueChange={onSchoolTypeChange}
      />
    </div>
  );
}


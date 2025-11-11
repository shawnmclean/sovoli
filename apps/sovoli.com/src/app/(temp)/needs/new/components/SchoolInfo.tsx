import { Input } from "@sovoli/ui/components/input";

interface SchoolInfoProps {
  schoolName: string;
  onSchoolNameChange: (value: string) => void;
}

export function SchoolInfo({
  schoolName,
  onSchoolNameChange,
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
    </div>
  );
}

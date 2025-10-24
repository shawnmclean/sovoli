import { Alert } from "@sovoli/ui/components/alert";

export function MobileOnlyAlert() {
  return (
    <div className="flex items-center justify-center w-full">
      <Alert
        className="hidden md:flex"
        variant="flat"
        color="warning"
        title="Website optimized for mobile devices. Use your phone please."
      />
    </div>
  );
}

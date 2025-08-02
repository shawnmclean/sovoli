import { Divider } from "@sovoli/ui/components/divider";

interface ProgramSectionsWrapperProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function ProgramSectionsWrapper({
  children,
  className,
  onClick,
}: ProgramSectionsWrapperProps) {
  return (
    <section
      className={className}
      onClick={onClick}
      style={onClick ? { cursor: "pointer" } : undefined}
    >
      {children}
      <Divider className="mx-auto max-w-2xl my-6" />
    </section>
  );
}

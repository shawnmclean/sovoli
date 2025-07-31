import { Divider } from "@sovoli/ui/components/divider";

interface ProgramSectionsWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function ProgramSectionsWrapper({
  children,
  className,
}: ProgramSectionsWrapperProps) {
  return (
    <section className={className}>
      {children}
      <Divider className="mx-auto max-w-2xl my-6" />
    </section>
  );
}

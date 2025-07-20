import { Divider } from "@sovoli/ui/components/divider";

interface ProgramSectionsWrapperProps {
  children: React.ReactNode;
}

export function ProgramSectionsWrapper({
  children,
}: ProgramSectionsWrapperProps) {
  return (
    <section>
      <div>{children}</div>
      <Divider className="mx-auto max-w-2xl my-6" />
    </section>
  );
}

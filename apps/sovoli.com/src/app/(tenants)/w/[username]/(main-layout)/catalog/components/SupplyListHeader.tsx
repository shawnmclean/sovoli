import Image from "next/image";
import type { OrgInstance } from "~/modules/organisations/types";
import type { Program } from "~/modules/academics/types";

interface SupplyListHeaderProps {
  school: OrgInstance;
  program: Program;
}

export function SupplyListHeader({ school, program }: SupplyListHeaderProps) {
  const programName =
    program.name ?? program.standardProgramVersion?.program.name;

  return (
    <div className="bg-card">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex items-center gap-4 mb-6">
          {school.org.logo && (
            <Image
              src={school.org.logo}
              alt={`${school.org.name} logo`}
              width={64}
              height={64}
              className="rounded-lg object-cover"
            />
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Supply List for {programName}
            </h1>
            <p className="text-lg text-muted-foreground mt-1">
              {school.org.name}
            </p>
          </div>
        </div>
        <p className="text-base text-muted-foreground">
          Find all the supplies you need for this program from our catalog
        </p>
      </div>
    </div>
  );
}

"use client";

import { Tab, Tabs } from "@sovoli/ui/components/tabs";
import type { OrgInstance } from "~/modules/organisations/types";
import { usePathname } from "next/navigation";

export interface AdminSchoolNavigationProps {
  orgInstance: OrgInstance;
}

export function AdminSchoolNavigation({
  orgInstance,
}: AdminSchoolNavigationProps) {
  const pathname = usePathname();

  return (
    <Tabs
      aria-label="Navigation"
      variant="underlined"
      selectedKey={pathname}
      fullWidth
      className="border-t border-default-200 py-2"
    >
      <Tab
        key={`/orgs/${orgInstance.org.username}/dashboard`}
        title="Overview"
        href={`/orgs/${orgInstance.org.username}/dashboard`}
      />
      <Tab
        key={`/orgs/${orgInstance.org.username}/dashboard/growth`}
        title="Growth"
        href={`/orgs/${orgInstance.org.username}/dashboard/growth`}
      />
    </Tabs>
  );
}

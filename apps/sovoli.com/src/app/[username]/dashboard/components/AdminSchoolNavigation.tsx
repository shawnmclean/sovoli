"use client";

import { Tab, Tabs } from "@sovoli/ui/components/tabs";
import { usePathname } from "next/navigation";
import type { OrgInstance } from "~/modules/organisations/types";

export interface AdminSchoolNavigationProps {
  orgInstance: OrgInstance;
}

export function AdminSchoolNavigation({
  orgInstance,
}: AdminSchoolNavigationProps) {
  const pathname = usePathname();
  const baseDashboardPath = `/${orgInstance.org.username}/dashboard`;
  const selectedKey = pathname.startsWith(`${baseDashboardPath}/programs`)
    ? `${baseDashboardPath}/programs`
    : pathname.startsWith(`${baseDashboardPath}/leads`)
      ? `${baseDashboardPath}/leads`
      : pathname;

  return (
    <Tabs
      aria-label="Navigation"
      variant="underlined"
      selectedKey={selectedKey}
      fullWidth
      className="border-t border-default-200 py-2"
    >
      <Tab key={baseDashboardPath} title="Overview" href={baseDashboardPath} />
      <Tab
        key={`${baseDashboardPath}/receivables`}
        title="Information Needed"
        href={`${baseDashboardPath}/receivables`}
      />
      <Tab
        key={`${baseDashboardPath}/programs`}
        title="Programs"
        href={`${baseDashboardPath}/programs`}
      />
      <Tab
        key={`${baseDashboardPath}/leads`}
        title="Leads"
        href={`${baseDashboardPath}/leads`}
      />
    </Tabs>
  );
}

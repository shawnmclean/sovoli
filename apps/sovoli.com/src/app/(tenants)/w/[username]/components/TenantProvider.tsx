"use client";

import { createContext, useContext } from "react";
import type { OrgInstanceWithWebsite } from "~/modules/organisations/types";

interface TenantContextValue {
  tenant: string;
  orgInstance: OrgInstanceWithWebsite;
}

const TenantContext = createContext<TenantContextValue | null>(null);

export function TenantProvider({
  children,
  tenant,
  orgInstance,
}: {
  children: React.ReactNode;
  tenant: string;
  orgInstance: OrgInstanceWithWebsite;
}) {
  return (
    <TenantContext.Provider value={{ tenant, orgInstance }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within TenantProvider");
  }
  return context;
}

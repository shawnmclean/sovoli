"use client";

import { useRouter } from "next/navigation";
import { UIProviders } from "@sovoli/ui/providers";

import { QueryProviders } from "~/api/react";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <UIProviders navigate={(href) => router.push(href)}>
        <QueryProviders>{children}</QueryProviders>
    </UIProviders>
  );
}

"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@sovoli/ui/components/button";

export function AdminLinkButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Button as={Link} href={href} radius="full" variant="flat">
      {children}
    </Button>
  );
}


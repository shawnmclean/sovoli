"use client";

import Link from "next/link";
import { Button } from "@sovoli/ui/components/button";
import type { ComponentProps } from "react";

interface ButtonLinkProps
  extends Omit<ComponentProps<typeof Button>, "as">,
    Pick<ComponentProps<typeof Link>, "href"> {
  href: string;
}

/**
 * A Button component that acts as a Link.
 * Use this in MDX files instead of `Button as={Link}` to avoid
 * passing functions to Client Components from Server Components.
 */
export function ButtonLink({ href, ...buttonProps }: ButtonLinkProps) {
  return (
    <Button as={Link} href={href} {...buttonProps} />
  );
}

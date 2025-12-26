import Link from "next/link";
import type { ComponentProps } from "react";

interface GuideLinkProps extends Omit<ComponentProps<typeof Link>, "href"> {
  href: string;
  children: React.ReactNode;
}

/**
 * Custom component for linking between guides and reference docs.
 * Use this in MDX files to create links to other documentation pages.
 */
export function GuideLink({ href, children, ...props }: GuideLinkProps) {
  // Ensure href starts with /docs
  const normalizedHref = href.startsWith("/docs") ? href : `/docs${href}`;

  return (
    <Link href={normalizedHref} {...props}>
      {children}
    </Link>
  );
}


import type { MDXComponents } from "mdx/types";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Alert } from "@sovoli/ui/components/alert";
import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { GuideLink } from "~/app/(marketing)/docs/components/GuideLink";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Map HTML elements to custom components
    a: (
      props: AnchorHTMLAttributes<HTMLAnchorElement> & { children?: ReactNode },
    ) => {
      const { href, children, ...restProps } = props;
      const hrefStr = typeof href === "string" ? href : "";
      // Use GuideLink for internal docs links
      if (
        hrefStr &&
        (hrefStr.startsWith("/docs") || hrefStr.startsWith("docs/"))
      ) {
        return (
          <GuideLink href={hrefStr} {...restProps}>
            {children}
          </GuideLink>
        );
      }
      // Use regular anchor for external links
      return (
        <a href={hrefStr} {...restProps}>
          {children}
        </a>
      );
    },
    // Provide UI components
    Alert,
    Button,
    Card,
    CardBody,
    CardHeader,
    GuideLink,
    Link,
    // Allow overrides from components prop
    ...components,
  };
}

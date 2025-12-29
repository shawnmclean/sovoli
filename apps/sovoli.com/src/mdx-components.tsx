import type { MDXComponents } from "mdx/types";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import React from "react";
import { Alert } from "@sovoli/ui/components/alert";
import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { GuideLink } from "~/app/(marketing)/docs/components/GuideLink";
import { ButtonLink } from "~/app/(marketing)/docs/components/ButtonLink";
import { DeviceTabs } from "~/app/(marketing)/docs/components/DeviceTabs";
import Link from "next/link";
import { slugify } from "~/utils/slugify";

/**
 * Extracts text content from React children recursively
 */
function getTextFromChildren(children: ReactNode): string {
  if (typeof children === "string") {
    return children;
  }
  if (typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(getTextFromChildren).join("");
  }
  if (React.isValidElement(children)) {
    const props = children.props as { children?: ReactNode };
    if (props.children !== undefined) {
      return getTextFromChildren(props.children);
    }
  }
  return "";
}

/**
 * Creates a heading component with auto-generated ID from text content
 */
function createHeadingComponent(Tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") {
  return ({
    children,
    className = "",
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = getTextFromChildren(children);
    const id = slugify(text);
    return (
      <Tag id={id} className={`scroll-mt-20 ${className}`} {...props}>
        {children}
      </Tag>
    );
  };
}

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
    // Auto-generate IDs for headings to enable hash links
    h1: createHeadingComponent("h1"),
    h2: createHeadingComponent("h2"),
    h3: createHeadingComponent("h3"),
    h4: createHeadingComponent("h4"),
    h5: createHeadingComponent("h5"),
    h6: createHeadingComponent("h6"),
    // Provide UI components
    Alert,
    Button,
    ButtonLink,
    Card,
    CardBody,
    CardHeader,
    DeviceTabs,
    GuideLink,
    Link,
    // Allow overrides from components prop
    ...components,
  };
}

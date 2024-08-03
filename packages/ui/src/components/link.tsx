import type { ComponentProps } from "react";
import type { TextLink } from "solito/link";
import { Link as SolitoLink } from "solito/link";

type LinkProps = ComponentProps<typeof TextLink>;

export const Link = ({ children, ...props }: LinkProps) => {
  return <SolitoLink {...props}>{children}</SolitoLink>;
};

import { TextLink as SolitoTextLink, Link as SolitoLink } from "solito/link";
import { ComponentProps } from "react";

type LinkProps = ComponentProps<typeof SolitoTextLink>;

export const Link = ({ className, children, ...props }: LinkProps) => {
  return <SolitoLink {...props}>{children}</SolitoLink>;
};

import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import React from "react";

import { hstackStyle } from "./styles";

type IHStackProps = React.ComponentProps<"div"> &
  VariantProps<typeof hstackStyle>;

const HStack = React.forwardRef<HTMLDivElement, IHStackProps>(
  ({ className, space, reversed, ...props }, ref) => {
    return (
      <div
        className={hstackStyle({ space, reversed, class: className })}
        {...props}
        ref={ref}
      />
    );
  },
);

HStack.displayName = "HStack";

export { HStack };

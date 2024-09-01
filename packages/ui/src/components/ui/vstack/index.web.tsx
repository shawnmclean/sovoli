import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import React from "react";

import { vstackStyle } from "./styles";

type IVStackProps = React.ComponentProps<"div"> &
  VariantProps<typeof vstackStyle>;

const VStack = React.forwardRef<HTMLDivElement, IVStackProps>(
  ({ className, space, reversed, ...props }, ref) => {
    return (
      <div
        className={vstackStyle({ space, reversed, class: className })}
        {...props}
        ref={ref}
      />
    );
  },
);

VStack.displayName = "VStack";

export { VStack };

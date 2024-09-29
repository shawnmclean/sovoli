"use client";

import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import React from "react";
import { View } from "react-native";
import { createDivider } from "@gluestack-ui/divider";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import { cssInterop } from "nativewind";

const dividerStyle = tva({
  base: "bg-background-200",
  variants: {
    orientation: {
      vertical: "w-px h-full",
      horizontal: "h-px w-full",
    },
  },
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const UIDivider = createDivider({ Root: View });

cssInterop(UIDivider, { className: "style" });

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
type IUIDividerProps = React.ComponentPropsWithoutRef<typeof UIDivider> &
  VariantProps<typeof dividerStyle>;

const Divider = React.forwardRef<
  React.ElementRef<typeof UIDivider>,
  IUIDividerProps
>(({ className, orientation = "horizontal", ...props }, ref) => {
  return (
    <UIDivider
      ref={ref}
      {...props}
      className={dividerStyle({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        orientation,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        class: className,
      })}
    />
  );
});

Divider.displayName = "Divider";

export { Divider };

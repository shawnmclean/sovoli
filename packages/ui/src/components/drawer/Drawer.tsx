"use client";

import React from "react";
import type { DrawerProps } from "@heroui/drawer";
import { Drawer as HeroUIDrawer } from "@heroui/drawer";
import { tv } from "tailwind-variants";

const drawer = tv({
  slots: {
    wrapper: "h-(--visual-viewport-height)",
  },
});

export interface CustomDrawerProps extends DrawerProps {
  /**
   * Additional CSS classes to apply to the drawer
   */
  className?: string;
}

export const Drawer = React.forwardRef<HTMLDivElement, CustomDrawerProps>(
  ({ className, classNames, ...props }, ref) => {
    const { wrapper } = drawer();

    return (
      <HeroUIDrawer
        ref={ref}
        className={className}
        classNames={{
          ...classNames,
          // Override wrapper with visual-viewport Tailwind 4 types
          wrapper: wrapper({ className: classNames?.wrapper }),
        }}
        {...props}
      />
    );
  },
);

Drawer.displayName = "Drawer";

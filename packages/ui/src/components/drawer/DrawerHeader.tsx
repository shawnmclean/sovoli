"use client";

import React from "react";
import { forwardRef } from "@heroui/system";
import { useDOMRef } from "@heroui/react-utils";
import { tv } from "tailwind-variants";
import { ChevronLeftIcon } from "lucide-react";

const drawerHeader = tv({
  slots: {
    base: "flex flex-col items-start gap-4 p-4",
    title: "text-lg font-semibold text-foreground",
    // Complete button styling including expanded hit area and visual appearance
    backButton:
      "relative p-0 w-auto h-auto min-w-0 min-h-0 before:absolute before:inset-0 before:-m-3 before:rounded-full before:bg-transparent before:content-[''] before:z-10 bg-transparent border-none cursor-pointer flex items-center justify-center rounded-full text-current",
  },
  variants: {
    size: {
      sm: {
        base: "gap-3 p-3",
        title: "text-base font-medium",
      },
      md: {
        base: "gap-4 p-4",
        title: "text-lg font-semibold",
      },
      lg: {
        base: "gap-5 p-5",
        title: "text-xl font-bold",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface DrawerHeaderProps {
  /**
   * The title to display in the header
   */
  title?: string;
  /**
   * Whether to show a back button
   */
  showBackButton?: boolean;
  /**
   * Callback when back button is pressed
   */
  onBackPress?: () => void;
  /**
   * Size variant of the header
   */
  size?: "sm" | "md" | "lg";
  /**
   * CSS classes for different parts of the component
   */
  classNames?: {
    base?: string;
    title?: string;
    backButton?: string;
  };
  /**
   * Custom back button icon
   */
  backButtonIcon?: React.ReactNode;
  /**
   * Children to render in the header
   */
  children?: React.ReactNode;
}

export const DrawerHeader = forwardRef<"header", DrawerHeaderProps>(
  (props, ref) => {
    const {
      title,
      showBackButton = false,
      onBackPress,
      size = "md",
      classNames,
      backButtonIcon = <ChevronLeftIcon size={24} />,
      children,
      ...otherProps
    } = props;

    const domRef = useDOMRef(ref);
    const { base, title: titleSlot, backButton } = drawerHeader({ size });

    return (
      <header
        ref={domRef}
        className={base({ className: classNames?.base })}
        {...otherProps}
      >
        {showBackButton && onBackPress && (
          <button
            aria-label="Close"
            type="button"
            onClick={onBackPress}
            className={backButton({ className: classNames?.backButton })}
          >
            {backButtonIcon}
          </button>
        )}

        {title && (
          <h3 className={titleSlot({ className: classNames?.title })}>
            {title}
          </h3>
        )}

        {children}
      </header>
    );
  },
);

DrawerHeader.displayName = "DrawerHeader";

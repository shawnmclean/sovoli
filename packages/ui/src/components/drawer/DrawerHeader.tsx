"use client";

import { useDOMRef } from "@heroui/react-utils";
import { forwardRef } from "@heroui/system";
import { ChevronLeftIcon } from "lucide-react";
import type React from "react";
import { tv } from "tailwind-variants";

const drawerHeader = tv({
  slots: {
    base: "flex flex-row items-center justify-between gap-4 p-4",
    title: "text-lg font-semibold text-foreground flex-1 text-center",
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
    start?: string;
    end?: string;
  };
  /**
   * Custom back button icon
   */
  backButtonIcon?: React.ReactNode;
  /**
   * Content to render at the start of the header
   */
  startContent?: React.ReactNode;
  /**
   * Content to render at the end of the header
   */
  endContent?: React.ReactNode;
  /**
   * Children to render in the header (deprecated, use startContent/endContent instead)
   */
  children?: React.ReactNode;
  /**
   * Additional CSS classes for the root element
   */
  className?: string;
}

export const DrawerHeader = forwardRef<"header", DrawerHeaderProps>(
  (props, ref) => {
    const {
      title,
      showBackButton = false,
      onBackPress,
      size = "md",
      classNames,
      className,
      backButtonIcon = <ChevronLeftIcon size={24} />,
      startContent,
      endContent,
      children,
      ...otherProps
    } = props;

    const domRef = useDOMRef(ref);
    const { base, title: titleSlot, backButton } = drawerHeader({ size });

    // Build start content (back button + startContent)
    const startItems = (
      <div className={`flex items-center gap-2 ${classNames?.start ?? ""}`}>
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
        {startContent}
        {children && !startContent && !endContent && children}
      </div>
    );

    // Build end content
    const endItems = endContent && (
      <div className={`flex items-center gap-2 ${classNames?.end ?? ""}`}>
        {endContent}
      </div>
    );

    return (
      <header
        ref={domRef}
        className={base({
          className: [classNames?.base, className].filter(Boolean).join(" "),
        })}
        {...otherProps}
      >
        {startItems}

        {title && (
          <h3 className={titleSlot({ className: classNames?.title })}>
            {title}
          </h3>
        )}

        {endItems}
      </header>
    );
  },
);

DrawerHeader.displayName = "DrawerHeader";

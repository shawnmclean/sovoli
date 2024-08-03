import type { SlottableViewProps } from "@rn-primitives/types";
import type { VariantProps } from "class-variance-authority";
import { View } from "react-native";
import * as Slot from "@rn-primitives/slot";
import { cva } from "class-variance-authority";

import { cn } from "../lib/utils";
import { TextClassContext } from "./text";

const badgeVariants = cva(
  "border-border web:focus:ring-ring items-center rounded-full border px-2.5 py-0.5 web:inline-flex web:transition-colors web:focus:outline-none web:focus:ring-2 web:focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary border-transparent active:opacity-80 web:hover:opacity-80",
        secondary:
          "bg-secondary border-transparent active:opacity-80 web:hover:opacity-80",
        destructive:
          "bg-destructive border-transparent active:opacity-80 web:hover:opacity-80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const badgeTextVariants = cva("text-xs font-semibold", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive-foreground",
      outline: "text-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type BadgeProps = SlottableViewProps & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, asChild, ...props }: BadgeProps) {
  const Component = asChild ? Slot.View : View;
  return (
    <TextClassContext.Provider value={badgeTextVariants({ variant })}>
      <Component
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export { Badge, badgeTextVariants, badgeVariants };
export type { BadgeProps };

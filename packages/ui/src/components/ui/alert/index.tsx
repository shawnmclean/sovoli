import * as React from "react";
import { tv } from "tailwind-variants";

// Tailwind Variants for Alert Container
const alertContainer = tv({
  base: "relative w-full rounded-lg border p-4 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  variants: {
    variant: {
      default: "bg-background text-foreground",
      danger:
        "border-danger/50 text-danger dark:border-danger [&>svg]:text-danger",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const alertTitleStyles = tv({
  base: "mb-1 font-medium leading-none tracking-tight",
});

const alertDescriptionStyles = tv({
  base: "text-sm [&_p]:leading-relaxed",
});

// Alert Component
const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "danger" }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={alertContainer({ variant, className })}
    {...props}
  />
));
Alert.displayName = "Alert";

// AlertTitle Component
const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5 ref={ref} className={alertTitleStyles({ className })} {...props} />
));
AlertTitle.displayName = "AlertTitle";

// AlertDescription Component
const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={alertDescriptionStyles({ className })} {...props} />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };

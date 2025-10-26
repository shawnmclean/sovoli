import { Input as BaseInput } from "@heroui/input";
import { extendVariants } from "@heroui/system";

export const Input = extendVariants(BaseInput, {
  variants: {
    // <- modify/add variants
    size: {
      xs: {
        inputWrapper: "h-6 min-h-6 px-1",
        input: "text-tiny",
      },
      md: {
        inputWrapper: "h-10 min-h-10",
        input: "text-small",
      },
      xl: {
        inputWrapper: "h-14 min-h-14",
        input: "text-medium",
      },
    },
    radius: {
      xs: {
        inputWrapper: "rounded-sm",
      },
      sm: {
        inputWrapper: "rounded-[4px]",
      },
    },
    textSize: {
      base: {
        input: "text-lg",
      },
    },
  },
  defaultVariants: {
    textSize: "base",
  },
}) as typeof BaseInput;

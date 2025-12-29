import "@ncdai/react-wheel-picker/style.css";

import * as WheelPickerPrimitive from "@ncdai/react-wheel-picker";
import type React from "react";
import { tv } from "tailwind-variants";

type WheelPickerOption = WheelPickerPrimitive.WheelPickerOption;
type WheelPickerClassNames = WheelPickerPrimitive.WheelPickerClassNames;

const wheelPickerWrapper = tv({
  base: [
    "w-56 rounded-lg border border-zinc-200 bg-white px-1 shadow-xs dark:border-zinc-700/80 dark:bg-zinc-900",
    "*:data-rwp:first:*:data-rwp-highlight-wrapper:rounded-s-md",
    "*:data-rwp:last:*:data-rwp-highlight-wrapper:rounded-e-md",
  ],
});

interface WheelPickerWrapperProps
  extends React.ComponentPropsWithoutRef<
    typeof WheelPickerPrimitive.WheelPickerWrapper
  > {
  className?: string;
}

function WheelPickerWrapper({ className, ...props }: WheelPickerWrapperProps) {
  const Wrapper =
    WheelPickerPrimitive.WheelPickerWrapper as unknown as React.ElementType<WheelPickerWrapperProps>;
  return <Wrapper className={wheelPickerWrapper({ className })} {...props} />;
}

const wheelPicker = tv({
  slots: {
    optionItem: "text-zinc-400 dark:text-zinc-500",
    highlightWrapper:
      "bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50",
  },
});

interface WheelPickerProps
  extends React.ComponentPropsWithoutRef<
    typeof WheelPickerPrimitive.WheelPicker
  > {
  classNames?: WheelPickerClassNames;
}

function WheelPicker({ classNames, ...props }: WheelPickerProps) {
  const { optionItem, highlightWrapper } = wheelPicker();
  const Picker =
    WheelPickerPrimitive.WheelPicker as unknown as React.ElementType<WheelPickerProps>;

  return (
    <Picker
      classNames={{
        optionItem: optionItem(),
        highlightWrapper: highlightWrapper(),
        ...classNames,
      }}
      {...props}
    />
  );
}

export { WheelPicker, WheelPickerWrapper };
export type { WheelPickerClassNames, WheelPickerOption };

export * from "@heroui/radio";

import type { RadioProps } from "@heroui/radio";
import { Radio } from "@heroui/radio";
import { tv } from "tailwind-variants";

const customRadioStyles = tv({
  base: [
    "inline-flex m-0 items-center justify-between",
    "flex-row-reverse max-w-full cursor-pointer rounded-xl gap-4 p-4 border border-default-200",
    "data-[selected=true]:border-primary",
  ],
});

const customRadioInlineStyles = tv({
  base: [
    "inline-flex m-0 items-center justify-between",
    "flex-row-reverse max-w-full cursor-pointer rounded-xl gap-4 px-4 py-3 border border-default-200",
    "data-[selected=true]:border-primary",
  ],
});

export const CustomRadio = (props: RadioProps) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: customRadioStyles(),
      }}
    >
      {children}
    </Radio>
  );
};

export const CustomRadioInline = (props: RadioProps) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: customRadioInlineStyles(),
      }}
    >
      {children}
    </Radio>
  );
};

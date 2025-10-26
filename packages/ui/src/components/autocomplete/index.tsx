import type { ForwardedRef, ReactElement } from "react";

import { forwardRef } from "@heroui/system";
import { FreeSoloPopover } from "@heroui/popover";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { ChevronDownIcon, CloseIcon } from "@heroui/shared-icons";
import { Listbox } from "@heroui/listbox";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { AnimatePresence } from "framer-motion";

import { useAutocomplete } from "@heroui/autocomplete";

// Extract UseAutocompleteProps from the useAutocomplete hook parameters
type UseAutocompleteProps<T extends object = object> = Parameters<
  typeof useAutocomplete<T>
>[0];

interface Props<T extends object = object> extends UseAutocompleteProps<T> {
  footer?: React.ReactNode;
}

export type AutocompleteProps<T extends object = object> = Props<T>;

const Autocomplete = forwardRef(function Autocomplete<
  T extends object = object,
>(
  props: AutocompleteProps<T>,
  ref: ForwardedRef<HTMLInputElement>,
): ReactElement {
  const { footer, ...restProps } = props;

  const {
    Component,
    isOpen,
    disableAnimation,
    selectorIcon = <ChevronDownIcon />,
    clearIcon = <CloseIcon />,
    endContent,
    getBaseProps,
    getSelectorButtonProps,
    getInputProps,
    getListBoxProps,
    getPopoverProps,
    getEmptyPopoverProps,
    getClearButtonProps,
    getListBoxWrapperProps,
    getEndContentWrapperProps,
  } = useAutocomplete<T>({ ...restProps, ref });

  const listboxProps = getListBoxProps();

  const popoverContent = isOpen ? (
    <FreeSoloPopover {...getPopoverProps()}>
      <ScrollShadow {...getListBoxWrapperProps()}>
        <Listbox {...listboxProps} />
      </ScrollShadow>
      {footer && (
        <div className="border-t border-default-200 bg-default-50 p-3 flex-shrink-0 w-full">
          {footer}
        </div>
      )}
    </FreeSoloPopover>
  ) : listboxProps.state?.collection.size === 0 ? (
    <div {...getEmptyPopoverProps()} />
  ) : null;

  return (
    <Component {...getBaseProps()}>
      <Input
        {...getInputProps()}
        endContent={
          <div {...getEndContentWrapperProps()}>
            {endContent ?? (
              <Button {...getClearButtonProps()}>{clearIcon}</Button>
            )}
            {selectorIcon && (
              <Button {...getSelectorButtonProps()}>{selectorIcon}</Button>
            )}
          </div>
        }
      />
      {disableAnimation ? (
        popoverContent
      ) : (
        <AnimatePresence>{popoverContent}</AnimatePresence>
      )}
    </Component>
  );
}) as <T extends object = object>(props: AutocompleteProps<T>) => ReactElement;

export { Autocomplete };

export * from "@heroui/autocomplete";

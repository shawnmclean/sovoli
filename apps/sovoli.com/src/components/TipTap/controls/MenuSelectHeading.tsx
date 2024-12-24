"use client";

import type { Editor } from "@tiptap/core";
import React, { useCallback, useMemo } from "react";
import { Button } from "@sovoli/ui/components/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@sovoli/ui/components/dropdown";
import { ChevronDownIcon } from "lucide-react";

export interface MenuSelectHeadingProps {
  editor: Editor;
}

const options = [
  {
    key: "paragraph",
    label: "Paragraph",
    className: "text-base",
  },
  {
    key: 1,
    label: "Heading 1",
    className: "font-bold text-3xl",
  },
  {
    key: 2,
    label: "Heading 2",
    className: "font-bold text-2xl",
  },
  {
    key: 3,
    label: "Heading 3",
    className: "font-bold text-xl",
  },
  {
    key: 4,
    label: "Heading 4",
    className: "font-bold text-lg",
  },
  {
    key: 5,
    label: "Heading 5",
    className: "font-bold text-base",
  },
  {
    key: 6,
    label: "Heading 6",
    className: "font-bold text-sm",
  },
] as const;

export const MenuSelectHeading = ({ editor }: MenuSelectHeadingProps) => {
  const isH1 = editor.isActive("heading", { level: 1 });
  const isH2 = editor.isActive("heading", { level: 2 });
  const isH3 = editor.isActive("heading", { level: 3 });
  const isH4 = editor.isActive("heading", { level: 4 });
  const isH5 = editor.isActive("heading", { level: 5 });
  const isH6 = editor.isActive("heading", { level: 6 });

  console.log(isH1, isH2, isH3, isH4, isH5, isH6);

  const current = useMemo(() => {
    let key: string | number = "paragraph";
    if (isH1) key = 1;
    if (isH2) key = 2;
    if (isH3) key = 3;
    if (isH4) key = 4;
    if (isH5) key = 5;
    if (isH6) key = 6;

    const option = options.find((option) => option.key === key);
    if (!option) {
      throw new Error(`Key "${key}" is missing from options`);
    }
    return option;
  }, [isH1, isH2, isH3, isH4, isH5, isH6]);

  const onHeadingSelect = useCallback(
    (key: string | undefined) => {
      const normalizedKey = isNaN(Number(key)) ? key : Number(key);
      const option = options.find((option) => option.key === normalizedKey);
      if (!option) {
        throw new Error(`Key "${key}" is missing from options`);
      }
      if (option.key === "paragraph") {
        editor.chain().setParagraph().focus().run();
      } else {
        editor.chain().setHeading({ level: option.key }).focus().run();
      }
    },
    [editor],
  );
  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button endContent={<ChevronDownIcon />}>{current.label}</Button>
      </DropdownTrigger>
      <DropdownMenu
        items={options}
        disallowEmptySelection
        aria-label="Single selection example"
        selectedKeys={[current.key]}
        selectionMode="single"
        variant="flat"
        onSelectionChange={({ currentKey }) => {
          onHeadingSelect(currentKey);
        }}
      >
        {(item) => (
          <DropdownItem
            key={item.key}
            classNames={{
              title: item.className,
            }}
          >
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

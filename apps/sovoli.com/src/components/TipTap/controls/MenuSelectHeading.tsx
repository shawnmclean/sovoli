"use client";

import type { Editor } from "@tiptap/core";
import React, { useCallback } from "react";
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
    key: "1",
    label: "Heading 1",
    className: "font-bold text-3xl",
  },
  {
    key: "2",
    label: "Heading 2",
    className: "font-bold text-2xl",
  },
  {
    key: "3",
    label: "Heading 3",
    className: "font-bold text-xl",
  },
  {
    key: "4",
    label: "Heading 4",
    className: "font-bold text-lg",
  },
  {
    key: "5",
    label: "Heading 5",
    className: "font-bold text-base",
  },
  {
    key: "6",
    label: "Heading 6",
    className: "font-bold text-sm",
  },
] as const;

export const MenuSelectHeading = ({ editor }: MenuSelectHeadingProps) => {
  const [selectedKey, setSelectedKey] = React.useState("paragraph");

  const onHeadingSelect = useCallback(
    (level: string) => {
      if (level === "paragraph") {
        editor.chain().setParagraph().focus().run();
      } else {
        editor
          .chain()
          .setHeading({ level: parseInt(level) })
          .focus()
          .run();
      }
      setSelectedKey(level);
    },
    [editor],
  );
  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button endContent={<ChevronDownIcon />}>{selectedKey}</Button>
      </DropdownTrigger>
      <DropdownMenu
        items={options}
        disallowEmptySelection
        aria-label="Single selection example"
        selectedKeys={[selectedKey]}
        selectionMode="single"
        variant="flat"
        onSelectionChange={(key) =>
          onHeadingSelect(key.currentKey ?? "paragraph")
        }
      >
        {(item) => <DropdownItem key={item.key}>{item.label}</DropdownItem>}
      </DropdownMenu>
    </Dropdown>
  );
};

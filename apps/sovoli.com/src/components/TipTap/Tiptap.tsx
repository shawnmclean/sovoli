"use client";

import { ButtonGroup } from "@sovoli/ui/components/button";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { tv } from "tailwind-variants";

import { MenuButtonRedo } from "./controls/MenuButtonRedo";
import { MenuButtonUndo } from "./controls/MenuButtonUndo";
import { MenuSelectHeading } from "./controls/MenuSelectHeading";

const editorContainer = tv({
  base: "w-full flex-row items-center gap-3 rounded-large border-2 border-default-200 px-3 shadow-sm hover:border-default-400 focus-within:border-default-foreground",
  variants: {
    focused: {
      true: "border-default-foreground !important",
    },
  },
});

export const Tiptap = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class:
          "w-full max-w-full py-6 px-8 prose prose-base prose-blue prose-headings:scroll-mt-[80px] focus:outline-none",
      },
    },
    content: "<p>Start writing...</p>",
  });

  if (!editor) return null;

  return (
    <div className="w-full flex-row items-center gap-3 rounded-large border-2 border-default-200 px-3 shadow-sm focus-within:border-default-foreground hover:border-default-400 hover:focus-within:border-default-foreground">
      <div>
        <ButtonGroup variant="light">
          <MenuButtonUndo editor={editor} />
          <MenuButtonRedo editor={editor} />
        </ButtonGroup>
        <MenuSelectHeading editor={editor} />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

"use client";

import type {
  EditorOptions,
  Editor as EditorType,
  JSONContent,
} from "@tiptap/react";
import { useEffect, useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { EditorMenu } from "./controls/EditorMenu";

export interface EditorProps extends Partial<EditorOptions> {
  name: string;
  defaultValue?: string;
  ref?: React.RefObject<EditorType | null>;
}

export const Editor = ({ name, defaultValue, ref, ...rest }: EditorProps) => {
  const jsonContent = useMemo(() => {
    try {
      return defaultValue
        ? (JSON.parse(defaultValue) as JSONContent)
        : { type: "doc", content: [] };
    } catch (error) {
      console.error("Invalid JSON content provided to the editor:", error);
      return { type: "doc", content: [] };
    }
  }, [defaultValue]);

  const [editorValue, setEditorValue] = useState(JSON.stringify(jsonContent));

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class:
          "w-full max-w-full py-6 px-8 prose prose-base prose-blue prose-headings:scroll-mt-[80px] focus:outline-none",
      },
    },
    content: jsonContent,
    ...rest,
    onUpdate: ({ editor }) => {
      // TODO: performance issues may arise here, use debounce later
      setEditorValue(JSON.stringify(editor.getJSON()));
    },
  });

  useEffect(() => {
    if (editor && ref && "current" in ref) {
      ref.current = editor;
    }
  }, [editor, ref]);
  if (!editor) {
    return null;
  }

  return (
    <div className="w-full flex-row items-center gap-3 rounded-large border-2 border-default-200 shadow-sm focus-within:border-default-foreground hover:border-default-400 hover:focus-within:border-default-foreground">
      <EditorMenu editor={editor} />
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={editorValue} />
    </div>
  );
};

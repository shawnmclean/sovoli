import type { JSONContent } from "@tiptap/react";
import { useMemo, useState } from "react";

export function useEditorContent(defaultValue?: string) {
  // Parse initial JSON content
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

  // Manage editor value state
  const [editorValue, setEditorValue] = useState(JSON.stringify(jsonContent));

  return {
    jsonContent,
    editorValue,
    setEditorValue,
  };
}

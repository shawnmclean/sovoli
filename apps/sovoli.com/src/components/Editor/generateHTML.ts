import type { JSONContent } from "@tiptap/core";
import { generateHTML as tiptapGenerateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";

export const generateHTML = (content: JSONContent) => {
  return tiptapGenerateHTML(content, [StarterKit]);
};

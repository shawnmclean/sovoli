import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";

export const extensions = [
  StarterKit,
  Link.configure({
    openOnClick: false,
  }),
];

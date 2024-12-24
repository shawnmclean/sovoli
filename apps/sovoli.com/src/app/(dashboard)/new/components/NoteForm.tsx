import { Form } from "@sovoli/ui/components/form";
import { Input } from "@sovoli/ui/components/input";

import { Tiptap } from "~/components/TipTap/Tiptap";

export const NoteForm = () => {
  return (
    <Form className="w-full">
      <Input
        placeholder="Title"
        name="title"
        fullWidth
        size="lg"
        variant="bordered"
        classNames={{
          input: "font-bold text-3xl",
        }}
      />

      <Input
        name="description"
        placeholder="Description"
        fullWidth
        variant="bordered"
      />
      <Tiptap />
    </Form>
  );
};

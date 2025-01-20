import { useActionState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Form } from "@sovoli/ui/components/form";
import { Input } from "@sovoli/ui/components/input";

import type { State } from "../../actions/updateTitleAction";
import { Editor } from "~/components/Editor/Editor";
import { updateContentAction } from "../../actions/updateContentAction";

export interface ContentUpdateFormProps {
  id: string;
  description: string;
  content: string;
  onCancel: () => void;
  onSubmitted: (newDescription: string, newContent: string) => void;
}

export function ContentUpdateForm({
  id,
  description,
  content,
  onCancel,
  onSubmitted,
}: ContentUpdateFormProps) {
  const [state, formAction, pending] = useActionState<State, FormData>(
    async (_, formData) => {
      try {
        const result = await updateContentAction(null, formData);

        if (result?.status === "success") {
          const updatedDescription = formData.get("description") as string
          const updatedContent = formData.get("content") as string;
          onSubmitted(updatedDescription, updatedContent)
        }
        return result;
      } catch (error) {
        return { status: "error", message: "Failed" }
      }

    },
    null,
  );

  return (
    <Form className="flex w-full flex-col gap-4" action={formAction}>
      <input type="hidden" name="id" value={id} />
      <Input
        name="description"
        placeholder="Description"
        fullWidth
        variant="bordered"
        defaultValue={description}
      />
      <Editor name="content" defaultValue={content} />
      {state?.status === "error" && (
        <div className="flex items-center gap-2">
          <span className="text-danger-500">Error:</span>
          <span>{state.message}</span>
        </div>
      )}
      <div className="flex justify-end gap-2">
        <Button variant="solid" type="submit" isLoading={pending}>
          Save
        </Button>
        <Button variant="bordered" onPress={() => onCancel()}>
          Cancel
        </Button>
      </div>
    </Form>
  );
}

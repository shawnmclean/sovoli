import { useActionState } from "react";
import { Button } from "@sovoli/ui/components/button";
import { Form } from "@sovoli/ui/components/form";
import { Input } from "@sovoli/ui/components/input";

import type { State } from "../../actions/updateTitleAction";
import { updateTitleAction } from "../../actions/updateTitleAction";

export interface TitleUpdateFormProps {
  id: string;
  title: string;
  onCancel: () => void;
  onSubmitted: (newTitle: string) => void;
}

export function TitleUpdateForm({
  id,
  title,
  onCancel,
  onSubmitted,
}: TitleUpdateFormProps) {
  const [state, formAction, pending] = useActionState<State, FormData>(
    async (_, formData) => {
      try {
        const result = await updateTitleAction(null, formData);

        if (result?.status === "success") {
          const updatedTitle = formData.get("title") as string;
          onSubmitted(updatedTitle);
        }

        return result;
      } catch (error) {
        console.error("Error during form action:", error);
        return { status: "error", message: "Failed to update title." };
      }
    },
    null,
  );

  return (
    <Form
      className="align-center flex w-full flex-row items-center justify-between"
      action={formAction}
    >
      <input type="hidden" name="id" value={id} />
      <Input
        name="title"
        variant="bordered"
        placeholder="Title"
        classNames={{
          input: "text-2xl font-bold",
        }}
        defaultValue={title}
      />
      <div className="flex gap-2">
        <Button variant="solid" type="submit" isLoading={pending}>
          Save
        </Button>
        <Button variant="bordered" onPress={() => onCancel()}>
          Cancel
        </Button>
      </div>
      {state?.status === "error" && (
        <div className="flex items-center gap-2">
          <span className="text-danger-500">Error:</span>
          <span>{state.message}</span>
        </div>
      )}
    </Form>
  );
}

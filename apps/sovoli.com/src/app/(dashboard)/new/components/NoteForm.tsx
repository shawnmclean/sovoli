"use client";

import { useActionState } from "react";
import { Alert } from "@sovoli/ui/components/alert";
import { Button } from "@sovoli/ui/components/button";
import { Form } from "@sovoli/ui/components/form";
import { Input } from "@sovoli/ui/components/input";

import type { State } from "../actions/newNoteAction";
import { Editor } from "~/components/Editor/Editor";
import { newNoteAction } from "../actions/newNoteAction";
import { AssetManager } from "./AssetManager";

export interface NoteFormProps {
  title?: string;
  description?: string;
  content?: string;
}

export const NoteForm = ({ title, description, content }: NoteFormProps) => {
  const [state, formAction, pending] = useActionState<State, FormData>(
    newNoteAction,
    null,
  );

  return (
    <Form className="w-full" action={formAction}>
      <AssetManager
        onFileUploaded={(file, id, path) => console.log(file, id, path)}
      />
      <Input
        placeholder="Title"
        name="title"
        fullWidth
        size="lg"
        variant="bordered"
        classNames={{
          input: "font-bold text-3xl",
        }}
        defaultValue={title}
      />
      <Input
        name="description"
        placeholder="Description"
        fullWidth
        variant="bordered"
        defaultValue={description}
      />
      <Editor name="content" defaultValue={content} />
      <div className="flex w-full justify-between gap-2">
        <div className="w-full">
          {state?.status === "error" && (
            <Alert
              title={state.message}
              color="danger"
              description={
                <ul>
                  {Object.entries(state.errors ?? {}).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}</strong>: {value}
                    </li>
                  ))}
                </ul>
              }
            />
          )}
        </div>
        <div className="flex gap-2">
          <Button color="primary" type="submit" isLoading={pending}>
            Create
          </Button>
        </div>
      </div>
    </Form>
  );
};

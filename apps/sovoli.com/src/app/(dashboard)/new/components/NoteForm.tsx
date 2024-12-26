"use client";

import { useActionState } from "react";
import { Alert } from "@sovoli/ui/components/alert";
import { Button } from "@sovoli/ui/components/button";
import { Form } from "@sovoli/ui/components/form";
import { Input } from "@sovoli/ui/components/input";

import type { State } from "../actions/newNoteAction";
import { Editor } from "~/components/Editor/Editor";
import { newNoteAction } from "../actions/newNoteAction";

export const NoteForm = () => {
  const [state, formAction, pending] = useActionState<State, FormData>(
    newNoteAction,
    null,
  );
  const json = `{
    "type": "doc",
    "content": [
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "Example "
          },
          {
            "type": "text",
            "marks": [
              {
                "type": "bold"
              }
            ],
            "text": "Text"
          }
        ]
      }
    ]
  }`;

  return (
    <Form className="w-full" action={formAction}>
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
      <Editor name="content" value={json} />
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

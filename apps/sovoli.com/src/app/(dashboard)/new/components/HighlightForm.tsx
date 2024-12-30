"use client";

import { useActionState } from "react";
import { Alert } from "@sovoli/ui/components/alert";
import { Button } from "@sovoli/ui/components/button";
import { Form } from "@sovoli/ui/components/form";

import type { State } from "../actions/newNoteAction";
import { newHighlightAction } from "../actions/newHighlightAction";

export const HighlightForm = () => {
  const [state, formAction, pending] = useActionState<State, FormData>(
    newHighlightAction,
    null,
  );

  return (
    <Form className="w-full" action={formAction}>
      <div className="flex w-full justify-between gap-2">
        <div className="w-full">
          <input type="file" id="image" name="image" />
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

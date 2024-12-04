"use client";

import { Button } from "@sovoli/ui/components/ui/button";
import { useFormState } from "react-dom";

import type { State } from "./action";
import { testAction } from "./action";

export default function TestPage() {
  const [state, testFormAction] = useFormState<State, FormData>(
    testAction,
    null,
  );

  const formAction = (formData: FormData) => {
    console.log("sending form data");
    testFormAction(formData);
  };
  return (
    <div>
      <h1>Test Page</h1>
      <form method="post" action={formAction}>
        <input type="text" name="id" />
        <input type="submit" value="Submit" />
        <Button onPress={() => console.log("pressed")}>Test</Button>
      </form>
      {state?.message && <p>{state.message}</p>}
    </div>
  );
}

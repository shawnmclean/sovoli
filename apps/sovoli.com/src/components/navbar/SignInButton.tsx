import Form from "next/form";
import { Button } from "@sovoli/ui/components/button";

import { signInAction } from "~/actions/signInAction";

export const SignInButton = () => {
  return (
    <Form action={signInAction}>
      <Button color="primary" type="submit">
        Sign In
      </Button>
    </Form>
  );
};

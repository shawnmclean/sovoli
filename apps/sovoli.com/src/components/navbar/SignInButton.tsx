import { Button } from "@sovoli/ui/components/button";

import { signInAction } from "~/actions/signInAction";

export function SignInButton() {
  return (
    <form action={signInAction}>
      <Button color="primary" type="submit">
        Sign In
      </Button>
    </form>
  );
}

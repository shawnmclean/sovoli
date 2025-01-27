import { redirect } from "next/navigation";
import { Button } from "@sovoli/ui/components/button";

import { auth } from "~/core/auth";
import { signOutAction } from "./actions/signOutAction";

export default async function SigninPage() {
  const session = await auth();

  if (!session) {
    return redirect("/");
  }

  return (
    <div className="mx-auto max-w-7xl p-4">
      <h1>Sign Out</h1>

      <form action={signOutAction}>
        <Button type="submit" color="danger">
          Sign Out
        </Button>
      </form>
    </div>
  );
}

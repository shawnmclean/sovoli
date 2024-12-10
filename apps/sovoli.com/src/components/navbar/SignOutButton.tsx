import { signOutAction } from "~/actions/signOutAction";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button type="submit">Sign Out</button>
    </form>
  );
}

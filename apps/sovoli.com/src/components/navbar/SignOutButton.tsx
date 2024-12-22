import { signOutAction } from "~/actions/signOutAction";

export const SignOutButton = () => {
  return (
    <form action={signOutAction}>
      <button type="submit">Sign Out</button>
    </form>
  );
};

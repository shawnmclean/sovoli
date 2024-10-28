import type { SelectUserSchema } from "@sovoli/db/schema";

import { Link } from "../ui/link";

export interface NavbarContextProps {
  user?: SelectUserSchema;
}
export const NavbarContext = ({ user }: NavbarContextProps) => {
  return (
    <Link href={`/${user?.username}`} color="foreground">
      {user?.username}
    </Link>
  );
};

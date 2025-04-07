import { Navbar } from "~/components/navbar/Navbar";
import { UserProfileNavbarAppLinks } from "../(profile)/components/UserProfileNavbarAppLinks";

interface Props {
  children: React.ReactNode;
}

export default function EditLayout({ children }: Props) {
  return (
    <div>
      <Navbar AppLinks={<UserProfileNavbarAppLinks />} />
      {children}
    </div>
  );
}

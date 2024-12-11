import { Navbar } from "~/components/navbar/Navbar";
import { UserProfileNavbarAppLinks } from "./components/UserProfileNavbarAppLinks";
import { UserProfileSidebar } from "./components/UserProfileSidebar";
import { UserSubmenu } from "./components/UserSubmenu";

interface Props {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}
export default function Layout({ children }: Props) {
  return (
    <div>
      <Navbar AppLinks={<UserProfileNavbarAppLinks />} />
      <main className="flex-1">
        <div className="flex w-full flex-col">
          <UserSubmenu />
        </div>
        <div className="mx-auto flex max-w-7xl flex-col justify-center py-5 md:flex-row">
          <div className="w-full p-5 md:w-1/3">
            <UserProfileSidebar />
          </div>

          <div className="mt-5 w-full p-5 md:ml-5 md:mt-0 md:w-2/3">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

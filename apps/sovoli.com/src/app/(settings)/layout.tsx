import { auth } from "@sovoli/auth";

import { Navbar } from "~/components/navbar/Navbar";
import { NavbarAppLinks } from "~/components/navbar/NavbarAppLinks";
import { Sidebar } from "./components/SideBar";

interface Props {
  children: React.ReactNode;
}
export default async function Layout({ children }: Props) {
  const session = await auth();
  if (!session?.user)
    throw new Error("You must be logged in to access this page");
  return (
    <div>
      <Navbar
        AppLinks={
          <NavbarAppLinks items={[{ href: "/settings", name: "Settings" }]} />
        }
      />
      <main>
        <div className="mx-auto max-w-7xl p-4">
          <h1 className="text-lg font-semibold">
            User Settings for {session.user.username}
          </h1>
          <div className="flex flex-col justify-between gap-4 py-4 md:flex-row">
            <nav className="w-full border-1 md:w-1/4">
              <Sidebar />
            </nav>

            <div className="w-full border-1 md:w-3/4">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}

import { Footer } from "~/components/footer/Footer";
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
      <main>
        <div className="mb-4 flex w-full flex-col">
          <UserSubmenu />
        </div>
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 p-4 md:flex-row">
          <div className="w-full md:w-1/3">
            <UserProfileSidebar />
          </div>

          <div className="w-full md:w-3/4">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

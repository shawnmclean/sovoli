import { UserSubmenu } from "../submenu/UserSubmenu";
import { UserProfileSidebar } from "../UserProfileSidebar";

export interface UserLayoutProps {
  username: string;
  children: React.ReactNode;
}

export const UserLayout = ({ children, username }: UserLayoutProps) => {
  return (
    <main className="flex-1">
      <div className="flex w-full flex-col">
        <UserSubmenu username={username} />
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
  );
};

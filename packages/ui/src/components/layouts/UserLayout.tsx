import { UserSubmenu } from "../submenu/UserSubmenu";

export const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex-1">
      <div className="flex w-full flex-col">
        <UserSubmenu />
      </div>
      {children}
    </main>
  );
};

import type { User } from "@sovoli/auth";

import { Navbar } from "../navbar";
import { Sidebar } from "../sidebar/Sidebar";

export interface SettingsLayoutProps {
  user: User;
  children: React.ReactNode;
}

export const SettingsLayout = ({ children, user }: SettingsLayoutProps) => {
  return (
    <div>
      <Navbar />
      <main className="flex-1">
        <div className="flex w-full flex-col">
          <h1>User Settings for {user.username}</h1>
        </div>
        <div className="mx-auto flex max-w-7xl flex-col justify-center py-5 md:flex-row">
          <nav className="w-full p-5 md:w-1/4">
            <Sidebar />
          </nav>

          <div className="mt-5 w-full p-5 md:ml-5 md:mt-0 md:w-3/4">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

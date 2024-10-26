import { Navbar } from "../Navbar_";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
};

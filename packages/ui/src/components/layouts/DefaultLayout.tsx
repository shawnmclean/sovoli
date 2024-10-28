import { Navbar } from "../navbar";

export interface DefaultLayoutProps {
  children: React.ReactNode;
}

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <div>
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
};

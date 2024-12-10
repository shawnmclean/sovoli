import { Navbar } from "~/components/navbar/Navbar";

interface Props {
  children: React.ReactNode;
}
export default function Layout({ children }: Props) {
  return (
    <div>
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}

import { Footer } from "./components/Footer";
import { TenantNavbar } from "./components/navbar/TenantNavbar";

interface Props {
  children: React.ReactNode;
}
export default function Layout({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <TenantNavbar />

      {children}
      <Footer />
    </div>
  );
}

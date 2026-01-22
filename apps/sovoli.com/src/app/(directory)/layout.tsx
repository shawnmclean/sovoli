import { Footer } from "~/components/footer/Footer";
import { MobileOnlyAlert } from "~/components/MobileOnlyAlert";
import { DirectoryNavbar } from "./components/DirectoryNavbar/DirectoryNavbar";

interface Props {
  children: React.ReactNode;
}
export default function Layout({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <DirectoryNavbar />
      <MobileOnlyAlert />
      {children}

      <Footer />
    </div>
  );
}

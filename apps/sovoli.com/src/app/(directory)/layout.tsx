import { Footer } from "~/components/footer/Footer";
import { DirectoryNavbar } from "./components/DirectoryNavbar/DirectoryNavbar";
import { MobileOnlyAlert } from "~/components/MobileOnlyAlert";

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

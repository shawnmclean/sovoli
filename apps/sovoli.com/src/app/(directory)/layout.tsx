import { Footer } from "~/components/footer/Footer";
import { DirectoryNavbar } from "./components/DirectoryNavbar/DirectoryNavbar";
import { Alert } from "@sovoli/ui/components/alert";

interface Props {
  children: React.ReactNode;
}
export default function Layout({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <DirectoryNavbar />
      <Alert
        className="hidden md:flex"
        variant="flat"
        color="warning"
        title="Website optimized for mobile devices. Use your phone please."
      />

      {children}

      <Footer />
    </div>
  );
}

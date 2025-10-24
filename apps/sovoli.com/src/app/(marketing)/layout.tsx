import { Footer } from "~/components/footer/Footer";
import { MarketingNavbar } from "./components/navbar/MarketingNavbar";

interface Props {
  children: React.ReactNode;
}
export default function Layout({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNavbar />
      {children}
      <Footer />
    </div>
  );
}

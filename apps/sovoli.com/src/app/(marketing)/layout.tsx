import { Footer } from "~/components/footer/Footer";
import { Navbar } from "~/components/navbar/Navbar";

interface Props {
  children: React.ReactNode;
}
export default function Layout({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {children}

      <Footer />
    </div>
  );
}

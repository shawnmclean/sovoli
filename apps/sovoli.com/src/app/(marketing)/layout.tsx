import { Footer } from "~/components/footer/Footer";

interface Props {
  children: React.ReactNode;
}
export default function Layout({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      {children}

      <Footer />
    </div>
  );
}

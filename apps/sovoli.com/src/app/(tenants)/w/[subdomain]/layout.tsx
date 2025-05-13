import type { Metadata } from "next";

import { Footer } from "./components/Footer";
import { TenantNavbar } from "./components/navbar/TenantNavbar";

export const metadata: Metadata = {
  title: {
    absolute: "Modern Academy",
    template: `%s | Modern Academy`,
  },
  description: "The Modern Academy private school",
  icons: {
    icon: "/favicon.ico",
  },
};

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

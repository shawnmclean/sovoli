import { notFound } from "next/navigation";

import { Footer } from "../components/footer/Footer";
import { TenantNavbar } from "../components/navbar/TenantNavbar";
import { getOrgInstanceByUsername } from "../lib/getOrgInstanceByUsername";
import { MobileFooter } from "../components/footer/MobileFooter";
import { Alert } from "@sovoli/ui/components/alert";

const retreiveOrgInstance = async (username: string) => {
  const result = await getOrgInstanceByUsername(username);
  if (!result) return notFound();
  return result;
};

interface Props {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}

export default async function Layout({ children, params }: Props) {
  const { username } = await params;
  const orgInstance = await retreiveOrgInstance(username);

  return (
    <div className="flex min-h-screen flex-col">
      <TenantNavbar orgInstance={orgInstance} />
      <Alert
        className="hidden md:flex"
        variant="flat"
        color="warning"
        title="Website optimized for mobile devices. Use your phone please."
      />
      {children}

      <Footer orgInstance={orgInstance} />
      <MobileFooter />
    </div>
  );
}

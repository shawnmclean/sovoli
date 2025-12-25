import { notFound } from "next/navigation";

import { Footer } from "../components/footer/Footer";
import { getOrgInstanceByUsername } from "../lib/getOrgInstanceByUsername";
import { MobileFooter } from "../components/footer/MobileFooter";
import { MobileOnlyAlert } from "~/components/MobileOnlyAlert";

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
      <MobileOnlyAlert />
      {children}

      <Footer orgInstance={orgInstance} />
      <MobileFooter orgInstance={orgInstance} />
    </div>
  );
}

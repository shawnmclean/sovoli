import { auth } from "@sovoli/auth";
import { SettingsLayout } from "@sovoli/ui/components/layouts/SettingsLayout";

interface Props {
  children: React.ReactNode;
}
export default async function Layout({ children }: Props) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in to access this page");
  return <SettingsLayout user={session.user}>{children}</SettingsLayout>;
}

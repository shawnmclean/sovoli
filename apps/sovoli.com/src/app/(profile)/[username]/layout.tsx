import { notFound } from "next/navigation";
import { UserLayout } from "@sovoli/ui/components/layouts/UserLayout";

import { getUserProfile, preload } from "../_lib/getUserProfile";

interface Props {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}
export default async function Layout({ children, params }: Props) {
  const { username } = await params;
  preload(username);

  const user = await getUserProfile(username);

  if (!user) return notFound();

  return <UserLayout user={user}>{children}</UserLayout>;
}

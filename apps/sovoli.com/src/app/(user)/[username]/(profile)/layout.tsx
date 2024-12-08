import { notFound } from "next/navigation";
import { UserLayout } from "@sovoli/ui/components/layouts/UserLayout";

import { getUserProfile, preload } from "../lib/getUserProfile";

interface Props {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  const user = await getUserProfile(username);
  if (!user) return {};

  const defaultTitle = user.name
    ? `${user.username} (${user.name})`
    : user.username;
  return {
    title: {
      default: defaultTitle,
      template: `${defaultTitle} / %s`,
    },
  };
}

export default async function Layout({ children, params }: Props) {
  const { username } = await params;
  preload(username);

  const user = await getUserProfile(username);

  if (!user) return notFound();

  return <UserLayout user={user}>{children}</UserLayout>;
}

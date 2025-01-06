import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { UserProfileProvider } from "./context/UserProfileContext";
import { getUserProfile, preload } from "./lib/getUserProfile";

interface Props {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}

const retreiveUserProfile = async (username: string) => {
  const user = await getUserProfile(username);
  if (!user) return notFound();
  return user;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const user = await retreiveUserProfile(username);

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
  const user = await retreiveUserProfile(username);

  return (
    <UserProfileProvider userProfile={user}>{children}</UserProfileProvider>
  );
}

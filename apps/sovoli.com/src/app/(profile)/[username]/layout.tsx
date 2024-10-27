import { UserLayout } from "@sovoli/ui/components/layouts/UserLayout";

interface Props {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}
export default async function Layout({ children, params }: Props) {
  const { username } = await params;
  return <UserLayout username={username}>{children}</UserLayout>;
}

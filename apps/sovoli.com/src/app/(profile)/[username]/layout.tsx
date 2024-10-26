import { UserLayout } from "@sovoli/ui/components/layouts/UserLayout";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <UserLayout>{children}</UserLayout>;
}

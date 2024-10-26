import { UserLayout } from "@sovoli/ui/components/layouts/UserLayout";

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <UserLayout>{children}</UserLayout>;
}

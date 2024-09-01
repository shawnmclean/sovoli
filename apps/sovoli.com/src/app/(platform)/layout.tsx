import { MainLayout } from "@sovoli/ui/components/MainLayout";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}

import { DefaultLayout } from "@sovoli/ui/components/layouts/DefaultLayout";

interface Props {
  children: React.ReactNode;
}
export default function Layout({ children }: Props) {
  return <DefaultLayout>{children}</DefaultLayout>;
}

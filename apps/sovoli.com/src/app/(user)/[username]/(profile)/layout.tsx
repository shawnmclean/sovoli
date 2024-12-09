import { UserLayout } from "./components/UserLayout";

interface Props {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}
export default function Layout({ children }: Props) {
  return <UserLayout>{children}</UserLayout>;
}

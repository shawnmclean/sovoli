import { Layout } from "nextra-theme-docs";
import { getPageMap } from "nextra/page-map";

interface Props {
  children: React.ReactNode;
}
export default async function DocsLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <Layout pageMap={await getPageMap()}>{children}</Layout>
    </div>
  );
}

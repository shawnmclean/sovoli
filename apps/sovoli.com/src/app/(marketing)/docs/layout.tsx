import { DocsNavbar } from "./components/DocsNavbar";

interface Props {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: Props) {
  return (
    <>
      <DocsNavbar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>
    </>
  );
}

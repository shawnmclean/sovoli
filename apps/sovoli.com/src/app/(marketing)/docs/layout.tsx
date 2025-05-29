import { DocsSidebar } from "./components/DocsSidebar";


interface Props {
  children: React.ReactNode;
}
export default function DocsLayout({ children }: Props) {
  return (
    <div className="flex flex-1 overflow-hidden">
        <DocsSidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className="max-w-4xl mx-auto prose">
          {children}
          </div></main>
    </div>
  );
}

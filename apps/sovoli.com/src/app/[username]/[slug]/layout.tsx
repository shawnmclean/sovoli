import { notFound, permanentRedirect } from "next/navigation";

import { Navbar } from "~/components/navbar/Navbar";
import { KnowledgeNavbarAppLinks } from "./components/KnowledgeNavbarAppLinks";
import { KnowledgeSubmenu } from "./components/KnowledgeSubmenu";
import { KnowledgeProvider } from "./context/KnowledgeContext";
import { preload, retreiveKnowledgeBySlug } from "./lib/getKnowledge";

interface Props {
  children: React.ReactNode;
  params: Promise<{ username: string; slug: string }>;
}
export default async function Layout({ params, children }: Props) {
  const { username, slug } = await params;

  // temp hack since I no longer have a chatgpt account and using my account instead (migrated data)
  if (username.toLowerCase() === "chatgpt") {
    return permanentRedirect("/shawn/" + slug);
  }

  preload({
    params: { slug, username },
    searchParams: { page: 1, pageSize: 30 },
  });

  const response = await retreiveKnowledgeBySlug({
    params: { slug, username },
    searchParams: { page: 1, pageSize: 30 },
  });

  if (!response) return notFound();

  if (response.knowledge.id === slug && response.knowledge.slug) {
    return permanentRedirect(`/${username}/${response.knowledge.slug}`);
  }

  return (
    <KnowledgeProvider knowledge={response.knowledge}>
      <Navbar
        AppLinks={<KnowledgeNavbarAppLinks knowledge={response.knowledge} />}
      />

      <main>
        <div className="mb-4 flex w-full flex-col">
          <KnowledgeSubmenu
            username={response.knowledge.User?.username ?? ""}
            slug={response.knowledge.slug ?? ""}
          />
        </div>
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 p-4 md:flex-row">
          <div className="w-full">{children}</div>
        </div>
      </main>
    </KnowledgeProvider>
  );
}

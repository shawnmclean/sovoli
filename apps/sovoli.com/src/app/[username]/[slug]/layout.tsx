import { permanentRedirect } from "next/navigation";

import { Navbar } from "~/components/navbar/Navbar";
import { KnowledgeNavbarAppLinks } from "./components/KnowledgeNavbarAppLinks";
import { KnowledgeSubmenu } from "./components/KnowledgeSubmenu";
import { preload, retreiveKnowledgeBySlug } from "./lib/getKnowledge";

interface Props {
  children: React.ReactNode;
  params: Promise<{ username: string; slug: string }>;
}
export default async function Layout(props: Props) {
  const params = await props.params;

  const {
    children
  } = props;

  const { username, slug } = await params;

  // temp hack since I no longer have a chatgpt account and using my account instead (migrated data)
  if (username.toLowerCase() === "chatgpt") {
    return permanentRedirect("/shawn/" + slug);
  }

  preload({
    params: { slug, username },
    searchParams: { page: 1, pageSize: 30 },
  });

  const { knowledge } = await retreiveKnowledgeBySlug({
    params: { slug, username },
    searchParams: { page: 1, pageSize: 30 },
  });

  return (
    <div>
      <Navbar AppLinks={<KnowledgeNavbarAppLinks knowledge={knowledge} />} />

      <main>
        <div className="mb-4 flex w-full flex-col">
          <KnowledgeSubmenu
            username={knowledge.User?.username ?? ""}
            slug={knowledge.slug ?? ""}
          />
        </div>
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 p-4 md:flex-row">
          <div className="w-full">{children}</div>
        </div>
      </main>
    </div>
  );
}

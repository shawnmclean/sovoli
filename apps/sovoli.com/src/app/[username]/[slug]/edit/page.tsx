export interface KnowledgeEditPageProps {
  params: Promise<{
    username: string;
    slug: string;
  }>;
}

export default async function KnowledgeEditPage(props: KnowledgeEditPageProps) {
  const params = await props.params;
  return (
    <div>
      Edit Page: {params.username}/{params.slug}
    </div>
  );
}

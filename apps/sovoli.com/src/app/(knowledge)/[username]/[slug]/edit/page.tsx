export interface KnowledgeEditPageProps {
  params: {
    username: string;
    slug: string;
  };
}

export default function KnowledgeEditPage({ params }: KnowledgeEditPageProps) {
  return (
    <div>
      Edit Page: {params.username}/{params.slug}
    </div>
  );
}

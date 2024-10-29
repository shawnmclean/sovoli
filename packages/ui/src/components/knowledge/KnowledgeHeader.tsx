export interface KnowledgeHeaderProps {
  title: string;
  description: string;
}

export function KnowledgeHeader({ title, description }: KnowledgeHeaderProps) {
  return (
    <div className="flex flex-col justify-start px-6">
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="text-muted-foreground text-lg">{description}</p>
    </div>
  );
}

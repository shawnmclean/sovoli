import { ClipboardListIcon } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface ProjectHeroSectionProps {
  title: string;
  description?: string | null;
  updatedAt?: string;
}

export const ProjectHeroSection = ({
  title,
  description,
  updatedAt,
}: ProjectHeroSectionProps) => {
  return (
    <section className="mb-6 sm:mb-8">
      <h1 className="my-4 text-center text-2xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
        {title}
      </h1>
      {description && (
        <article className="prose prose-lg max-w-none text-default-600 prose-p:text-default-600 prose-li:text-default-600 prose-strong:text-default-700 dark:prose-invert">
          <Markdown remarkPlugins={[remarkGfm]}>{description}</Markdown>
        </article>
      )}
      {updatedAt && (
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <ClipboardListIcon className="h-4 w-4" />
            Updated {updatedAt}
          </span>
        </div>
      )}
    </section>
  );
};

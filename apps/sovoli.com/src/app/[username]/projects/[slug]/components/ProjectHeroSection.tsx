import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface ProjectHeroSectionProps {
  title: string;
  description?: string | null;
}

export const ProjectHeroSection = ({
  title,
  description,
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
    </section>
  );
};

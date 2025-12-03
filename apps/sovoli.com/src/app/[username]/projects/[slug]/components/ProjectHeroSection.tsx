import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDate(value?: string | null) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return DATE_FORMATTER.format(parsed);
}

export interface ProjectHeroSectionProps {
  title: string;
  description?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export const ProjectHeroSection = ({
  title,
  description,
  createdAt,
  updatedAt,
}: ProjectHeroSectionProps) => {
  const formattedCreatedAt = formatDate(createdAt);
  const formattedUpdatedAt = formatDate(updatedAt);
  const timestampsMatch =
    createdAt && updatedAt
      ? new Date(createdAt).getTime() === new Date(updatedAt).getTime()
      : false;
  const showCreatedDate = Boolean(formattedCreatedAt);
  const showUpdatedDate = Boolean(formattedUpdatedAt && !timestampsMatch);
  const showDates = showCreatedDate || showUpdatedDate;

  return (
    <section className="mb-6 sm:mb-8">
      <h1 className="my-4 text-center text-2xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
        {title}
      </h1>
      {showDates && (
        <p className="mb-4 text-center text-sm text-default-500">
          {showCreatedDate && (
            <>
              Created {formattedCreatedAt}
            </>
          )}
          {showCreatedDate && showUpdatedDate && (
            <span className="mx-2 text-default-300">•</span>
          )}
          {showUpdatedDate && (
            <>
              Updated {formattedUpdatedAt}
            </>
          )}
        </p>
      )}
      {description && (
        <article className="prose prose-lg max-w-none text-default-600 prose-p:text-default-600 prose-li:text-default-600 prose-strong:text-default-700 dark:prose-invert">
          <Markdown remarkPlugins={[remarkGfm]}>{description}</Markdown>
        </article>
      )}
    </section>
  );
};

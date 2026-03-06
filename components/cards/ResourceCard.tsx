import Link from "next/link";
import { FileText, ExternalLink } from "lucide-react";

export type ResourceCardProps = {
  id: string;
  title: string;
  description: string;
  category: string;
  type?: "guide" | "template" | "article" | "video" | "tool";
  href?: string;
  external?: boolean;
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  guide: FileText,
  template: FileText,
  article: FileText,
  video: FileText,
  tool: FileText,
};

const TYPE_LABELS: Record<string, string> = {
  guide: "Guide",
  template: "Template",
  article: "Article",
  video: "Video",
  tool: "Tool",
};

export function ResourceCard({
  id,
  title,
  description,
  category,
  type = "guide",
  href = "#",
  external = false,
}: ResourceCardProps) {
  const Icon = TYPE_ICONS[type] ?? FileText;

  const content = (
    <article className="card-hover flex flex-col p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="inline-block rounded-full bg-earth-100 px-2.5 py-0.5 text-xs font-medium text-earth-600">
            {category}
          </span>
          <h3 className="mt-2 font-semibold text-earth-900 line-clamp-2">{title}</h3>
          <p className="mt-1 text-sm text-earth-600 line-clamp-2">{description}</p>
          {type && (
            <span className="mt-2 inline-block text-xs font-medium text-primary-600">
              {TYPE_LABELS[type]}
              {external && <ExternalLink className="ml-1 inline h-3 w-3" />}
            </span>
          )}
        </div>
      </div>
    </article>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return <Link href={href}>{content}</Link>;
}

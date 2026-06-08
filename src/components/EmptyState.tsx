import Link from "next/link";
import { CirclePlus } from "lucide-react";

type EmptyStateProps = {
  title: string;
  text: string;
  href?: string;
  action?: string;
};

export function EmptyState({ title, text, href, action }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-white p-8 text-center">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-zinc-600">{text}</p>
      {href && action ? (
        <Link
          href={href}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-moss px-4 py-3 text-sm font-semibold text-white hover:bg-ink"
        >
          <CirclePlus className="h-4 w-4" aria-hidden="true" />
          {action}
        </Link>
      ) : null}
    </div>
  );
}

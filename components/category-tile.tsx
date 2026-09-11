import Image from "next/image";
import Link from "next/link";
import { getSampleProject, type Category } from "@/lib/categories";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="h-3.5 w-3.5" fill="none">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CategoryTile({
  item,
  priority = false,
}: {
  item: Category;
  priority?: boolean;
}) {
  const sample = getSampleProject(item);
  const cover = sample?.cover ?? sample?.images[0];
  const count = item.projects.length;
  const subs = item.subcategories.map((sub) => sub.name).join(" · ");

  return (
    <Link
      href={`/categories/${item.slug}`}
      className="group relative isolate flex h-72 w-full min-w-0 flex-none overflow-hidden bg-surface transition-[flex] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-80 md:h-full md:min-h-0 md:flex-1 md:hover:flex-[3.4] md:focus-visible:flex-[3.4] motion-reduce:transition-none"
    >
      {cover ? (
        <Image
          src={cover}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/45 to-ink/10" />

      <div className="absolute inset-x-0 bottom-0 z-10 grid grid-rows-[1rem_4.875rem_2.75rem_1rem] gap-y-2 p-5 transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:grid-rows-[1rem_4.875rem_0fr_1rem] sm:p-6 sm:group-hover:grid-rows-[1rem_4.875rem_2.75rem_1rem] sm:group-focus-visible:grid-rows-[1rem_4.875rem_2.75rem_1rem] motion-reduce:transition-none motion-reduce:grid-rows-[1rem_4.875rem_2.75rem_1rem]">
        <p className="truncate font-mono text-[11px] leading-4 tracking-[0.22em] text-cream/70">
          {String(count).padStart(2, "0")}
          <span className="ml-2 uppercase tracking-[0.28em]">
            {count === 1 ? "project" : "projects"}
          </span>
        </p>
        <h2 className="self-start overflow-hidden font-serif text-[1.375rem] leading-[1.625rem] tracking-tight text-cream">
          {item.category}
        </h2>
        <p className="min-h-0 overflow-hidden text-sm leading-6 text-cream/70 opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100 motion-reduce:opacity-100">
          {subs}
        </p>
        <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-cream transition-[gap] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:gap-3">
          View projects
          <span className="inline-block transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 motion-reduce:transform-none">
            <ArrowIcon />
          </span>
        </p>
      </div>
    </Link>
  );
}

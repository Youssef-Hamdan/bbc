import Image from "next/image";
import Link from "next/link";
import {
  getSubcategoryName,
  projectHref,
  type Project,
} from "@/lib/categories";

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

function projectCaption(project: Project) {
  const place = shortPlace(project.place);
  return [place, project.year, project.surface].filter(Boolean).join(" · ");
}

function shortPlace(place?: string) {
  if (!place) return undefined;
  if (place.length <= 28) return place;
  if (/kinshasa/i.test(place)) {
    return /gombe/i.test(place) ? "Gombe, Kinshasa" : "Kinshasa";
  }
  const parts = place
    .split(/[,–—]/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.slice(-2).join(", ") || place;
}

export function ProjectCard({
  project,
  featured = false,
  index,
  showType = false,
  priority = false,
}: {
  project: Project;
  featured?: boolean;
  index?: number;
  showType?: boolean;
  priority?: boolean;
}) {
  const cover = project.cover ?? project.images[0];
  const typeLabel = showType
    ? getSubcategoryName(project.subcategorySlug)
    : undefined;
  const caption = projectCaption(project);

  return (
    <li className={featured ? "sm:col-span-2" : undefined}>
      <Link
        href={projectHref(project)}
        className={`group relative isolate block overflow-hidden bg-surface ${
          featured
            ? "aspect-[16/10] sm:aspect-[2/1]"
            : "aspect-[4/3] sm:aspect-[5/4]"
        }`}
      >
        {cover ? (
          <Image
            src={cover}
            alt={project.name}
            fill
            priority={priority}
            sizes={
              featured
                ? "(min-width: 1024px) 80vw, 100vw"
                : "(min-width: 640px) 42vw, 100vw"
            }
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-5 sm:p-7 lg:p-8">
          <div className="min-w-0">
            {index != null ? (
              <p className="font-mono text-[11px] tracking-[0.22em] text-cream/55">
                {String(index).padStart(2, "0")}
              </p>
            ) : null}
            {typeLabel ? (
              <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-cream/70">
                {typeLabel}
              </p>
            ) : null}
            <h3
              className={`mt-2 font-serif leading-[1.08] tracking-tight text-cream ${
                featured
                  ? "text-3xl sm:text-5xl"
                  : "text-2xl sm:text-3xl"
              }`}
            >
              {project.name}
            </h3>
            {caption ? (
              <p className="mt-3 line-clamp-1 text-sm leading-6 text-cream/70">
                {caption}
              </p>
            ) : project.summary ? (
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-cream/70">
                {project.summary}
              </p>
            ) : null}
            <p className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-cream opacity-80 transition-opacity duration-500 group-hover:opacity-100 sm:translate-y-1 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
              View project
              <ArrowIcon />
            </p>
          </div>
        </div>
      </Link>
    </li>
  );
}

export function ProjectGrid({
  projects,
  featuredFirst = true,
  showType = false,
  startIndex = 1,
}: {
  projects: Project[];
  featuredFirst?: boolean;
  showType?: boolean;
  startIndex?: number;
}) {
  const featureLead =
    projects.length === 1 || (featuredFirst && projects.length >= 3);

  return (
    <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.slug}
          project={project}
          featured={featureLead && index === 0}
          index={startIndex + index}
          showType={showType}
          priority={index < 2}
        />
      ))}
    </ul>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ProjectGrid } from "@/components/project-card";
import {
  categoryParams,
  getCategory,
} from "@/lib/categories";

export function generateStaticParams() {
  return categoryParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getCategory(slug);
  if (!item) return { title: "Category — BBC Construction" };

  return {
    title: `${item.category} — BBC Construction`,
    description: `Projects in ${item.category.toLowerCase()}.`,
  };
}

export default async function CategoryProjectsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getCategory(slug);
  if (!item) notFound();

  const groups =
    item.kind === "parent"
      ? item.subcategories
          .map((sub) => ({
            ...sub,
            projects: item.projects.filter(
              (project) => project.subcategorySlug === sub.slug,
            ),
          }))
          .filter((group) => group.projects.length > 0)
      : [{ slug: item.slug, name: item.category, projects: item.projects }];

  const parentView = item.parent ? getCategory(item.parent.slug) : undefined;
  const filters =
    item.kind === "parent"
      ? item.subcategories
      : parentView?.subcategories ?? [];

  return (
    <>
      <Nav />
      <main>
        <section
          className="min-h-dvh bg-background page-gutter pt-[calc(var(--nav-height)+1.5rem)] pb-16 sm:pt-[calc(var(--nav-height)+2.5rem)] sm:pb-24"
          data-scroll-theme-light="theme-cream"
          data-scroll-theme-dark="theme-cream"
        >
          <div className="mx-auto max-w-7xl">
            <Link
              href={item.parent ? `/categories/${item.parent.slug}` : "/categories"}
              className="btn-pill"
            >
              <span aria-hidden>←</span>
              {item.parent ? item.parent.category : "All categories"}
            </Link>

            {item.parent ? (
              <p className="mt-10 text-[11px] uppercase tracking-[0.32em] text-muted">
                {item.parent.category}
              </p>
            ) : (
              <p className="mt-10 text-[11px] uppercase tracking-[0.32em] text-muted">
                Category
              </p>
            )}
            <h1 className="mt-3 font-serif text-3xl leading-[1.05] tracking-tight sm:text-6xl">
              {item.category}
            </h1>
            <p className="mt-4 font-mono text-[11px] tracking-[0.22em] text-muted">
              {String(item.projects.length).padStart(2, "0")} /{" "}
              {item.projects.length === 1 ? "project" : "projects"}
            </p>

            {filters.length > 1 ? (
              <ul className="mt-8 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:mt-10 sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden">
                <li className="shrink-0">
                  <Link
                    href={
                      item.parent
                        ? `/categories/${item.parent.slug}`
                        : `/categories/${item.slug}`
                    }
                    className={`btn-pill ${item.kind === "parent" ? "btn-pill-active" : ""}`}
                  >
                    All
                    <span className="font-mono tracking-[0.18em]">
                      {String(
                        item.kind === "parent"
                          ? item.projects.length
                          : (parentView?.projects.length ?? item.projects.length),
                      ).padStart(2, "0")}
                    </span>
                  </Link>
                </li>
                {filters.map((sub) => {
                  const active = sub.slug === item.slug;
                  return (
                    <li key={sub.slug} className="shrink-0">
                      <Link
                        href={`/categories/${sub.slug}`}
                        className={`btn-pill ${active ? "btn-pill-active" : ""}`}
                      >
                        {sub.name}
                        <span className="font-mono tracking-[0.18em]">
                          {String(sub.count).padStart(2, "0")}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : null}

            <div className="mt-10 space-y-12 sm:mt-14 sm:space-y-16">
              {groups.map((group) => (
                <div key={group.slug}>
                  {item.kind === "parent" && groups.length > 1 ? (
                    <div className="mb-6 flex items-end justify-between gap-4">
                      <h2 className="text-[11px] uppercase tracking-[0.28em] text-muted">
                        {group.name}
                      </h2>
                      <Link
                        href={`/categories/${group.slug}`}
                        className="btn-pill"
                      >
                        View all
                      </Link>
                    </div>
                  ) : null}

                  <ProjectGrid projects={group.projects} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

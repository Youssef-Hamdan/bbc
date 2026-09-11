import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ProjectCard } from "@/components/project-card";
import { ProjectGallery } from "@/components/project-gallery";
import { ProjectHero } from "@/components/project-hero";
import { getProject, projectHref, projectParams } from "@/lib/categories";

export function generateStaticParams() {
  return projectParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; project: string }>;
}): Promise<Metadata> {
  const { slug, project: projectSlug } = await params;
  const result = getProject(slug, projectSlug);
  if (!result) return { title: "Project — BBC Construction" };

  return {
    title: `${result.project.name} — BBC Construction`,
    description: result.project.overview ?? result.project.name,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string; project: string }>;
}) {
  const { slug, project: projectSlug } = await params;
  const result = getProject(slug, projectSlug);
  if (!result) notFound();

  const { category, subcategory, project } = result;
  const cover = project.cover ?? project.images[0];
  const gallery = project.images.filter((src) => src !== cover);

  const facts = [
    project.client ? { label: "Client", value: project.client } : null,
    project.place ? { label: "Place", value: project.place } : null,
    project.surface ? { label: "Surface", value: project.surface } : null,
    project.year ? { label: "Year", value: project.year } : null,
    project.duration ? { label: "Duration", value: project.duration } : null,
  ].filter((fact): fact is { label: string; value: string } => fact !== null);

  const heroMeta = [project.place, project.year, project.surface]
    .filter(Boolean)
    .join(" · ");

  const index = category.projects.findIndex((item) => item.slug === project.slug);
  const prev = index > 0 ? category.projects[index - 1] : undefined;
  const next =
    index >= 0 && index < category.projects.length - 1
      ? category.projects[index + 1]
      : undefined;

  const typeLabel = subcategory?.name ?? category.category;

  return (
    <>
      <Nav />
      <main>
        <ProjectHero
          name={project.name}
          typeLabel={typeLabel}
          heroMeta={heroMeta}
          summary={project.summary}
          cover={cover}
        />

        <section
          className="bg-background page-gutter py-12 sm:py-24"
          data-scroll-theme-light="theme-cream"
          data-scroll-theme-dark="theme-cream"
        >
          <div className="mx-auto max-w-7xl">
            <Link
              href={`/categories/${category.slug}`}
              className="btn-pill"
            >
              <span aria-hidden>←</span>
              {category.category}
            </Link>

            {project.summary ? (
              <p className="mt-8 max-w-3xl text-[15px] leading-7 text-muted sm:mt-10 sm:text-[17px] sm:leading-8">
                {project.summary}
              </p>
            ) : null}

            {facts.length ? (
              <dl className="mt-10 grid gap-6 border-y border-foreground/15 py-8 [grid-template-columns:repeat(auto-fit,minmax(9.5rem,1fr))] sm:mt-14 sm:gap-8 sm:py-10 sm:[grid-template-columns:repeat(auto-fit,minmax(11rem,1fr))]">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-[11px] uppercase tracking-[0.28em] text-muted">
                      {fact.label}
                    </dt>
                    <dd className="mt-3 text-[15px] leading-7">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {project.overview ? (
              <p className="mt-10 max-w-3xl font-serif text-xl leading-snug tracking-tight sm:mt-16 sm:text-3xl">
                {project.overview}
              </p>
            ) : null}

            {project.challenges || project.solution ? (
              <div className="mt-10 grid gap-10 sm:mt-16 lg:grid-cols-2 lg:gap-12">
                {project.challenges ? (
                  <article>
                    <h2 className="text-[11px] uppercase tracking-[0.28em] text-muted">
                      Challenges
                    </h2>
                    <p className="mt-5 text-[15px] leading-7 text-muted">
                      {project.challenges}
                    </p>
                  </article>
                ) : null}
                {project.solution ? (
                  <article>
                    <h2 className="text-[11px] uppercase tracking-[0.28em] text-muted">
                      Solution
                    </h2>
                    <p className="mt-5 text-[15px] leading-7 text-muted">
                      {project.solution}
                    </p>
                  </article>
                ) : null}
              </div>
            ) : null}

            {project.scope?.length || project.results?.length ? (
              <div className="mt-10 grid gap-3 sm:mt-16 lg:grid-cols-2">
                {project.scope?.length ? (
                  <div className="bg-surface px-6 py-8 sm:px-8 sm:py-10">
                    <h2 className="text-[11px] uppercase tracking-[0.28em] text-muted">
                      Scope of works
                    </h2>
                    <ul className="mt-6 space-y-4 text-[15px] leading-7">
                      {project.scope.map((entry, entryIndex) => (
                        <li key={entry} className="flex gap-4">
                          <span className="font-mono text-[11px] tracking-[0.18em] text-accent">
                            {String(entryIndex + 1).padStart(2, "0")}
                          </span>
                          {entry}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {project.results?.length ? (
                  <div className="bg-surface px-6 py-8 sm:px-8 sm:py-10">
                    <h2 className="text-[11px] uppercase tracking-[0.28em] text-muted">
                      Results
                    </h2>
                    <ul className="mt-6 space-y-4 text-[15px] leading-7">
                      {project.results.map((entry) => (
                        <li key={entry} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent" />
                          {entry}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}

            {gallery.length ? (
              <div className="mt-14">
                <h2 className="text-[11px] uppercase tracking-[0.28em] text-muted">
                  Gallery
                </h2>
                <div className="mt-6">
                  <ProjectGallery images={gallery} projectName={project.name} />
                </div>
              </div>
            ) : null}

            {prev || next ? (
              <div className="mt-16 sm:mt-24">
                <p className="text-[11px] uppercase tracking-[0.28em] text-muted">
                  More in {category.category}
                </p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4">
                  {prev ? (
                    <ProjectCard
                      project={prev}
                      featured={!next}
                      index={index}
                    />
                  ) : null}
                  {next ? (
                    <ProjectCard
                      project={next}
                      featured={!prev}
                      index={index + 2}
                    />
                  ) : null}
                </ul>
                <div className="mt-6 flex justify-between gap-6 text-[11px] uppercase tracking-[0.28em]">
                  {prev ? (
                    <Link
                      href={projectHref(prev)}
                      className="btn-pill"
                    >
                      ← Previous
                    </Link>
                  ) : (
                    <span />
                  )}
                  {next ? (
                    <Link
                      href={projectHref(next)}
                      className="btn-pill ml-auto"
                    >
                      Next →
                    </Link>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

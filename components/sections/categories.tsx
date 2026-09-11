"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  preloadProjectModel,
  ProjectModel,
} from "@/components/project-model";
import TextAnimation from "@/components/ui/scroll-text";
import {
  categories,
  getFeaturedModelProjects,
  projectHref,
} from "@/lib/categories";

const featured = getFeaturedModelProjects();
const firstSample = featured[0];
if (firstSample?.src) {
  preloadProjectModel(firstSample.src, firstSample.mobileSrc);
}

export function Categories() {
  const [active, setActive] = useState(0);
  const project = featured[active];
  if (!project) return null;

  const category =
    categories.find((item) => item.slug === project.parentSlug)?.category ??
    project.parentSlug;

  const go = (direction: -1 | 1) => {
    setActive((index) => (index + direction + featured.length) % featured.length);
  };

  const cover = project.cover ?? project.images[0];

  return (
    <section
      id="categories"
      className="relative isolate overflow-hidden bg-background [contain:paint] max-sm:min-h-dvh max-sm:pt-[var(--nav-height)] sm:h-dvh"
      aria-label="Categories"
      aria-roledescription="carousel"
      data-scroll-theme-light="theme-cream"
      data-scroll-theme-dark="theme-cream"
    >
      <div className="pointer-events-none relative z-20 px-5 pt-4 text-center sm:absolute sm:inset-x-0 sm:top-0 sm:px-6 sm:pt-5">
        <p className="text-[11px] uppercase tracking-[0.32em] text-muted">
          Our categories
        </p>
        <TextAnimation
          as="h2"
          text="Work, by type."
          direction="left"
          classname="mt-1 font-serif text-3xl leading-[1.05] tracking-tight normal-case sm:text-5xl"
        />
      </div>

      <div className="relative z-20 flex flex-col px-5 pb-10 sm:absolute sm:inset-x-0 sm:top-[calc(var(--nav-height)+5.5rem)] sm:bottom-24 sm:flex-row sm:items-center sm:px-24 lg:px-40 xl:px-48">
        <div className="order-2 mt-5 w-full text-left sm:order-none sm:mt-0 sm:w-[min(32vw,20rem)] sm:shrink-0 sm:pr-6">
          <p className="text-[11px] uppercase tracking-[0.32em] text-muted">
            {category}
          </p>
          <p className="mt-2 font-serif text-2xl leading-tight sm:text-4xl">
            {project.name}
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:mt-5 sm:block sm:space-y-3">
            {project.client ? (
              <div>
                <dt className="text-[10px] uppercase tracking-[0.28em] text-muted">
                  Client
                </dt>
                <dd className="mt-1 text-sm">{project.client}</dd>
              </div>
            ) : null}
            {project.place ? (
              <div>
                <dt className="text-[10px] uppercase tracking-[0.28em] text-muted">
                  Place
                </dt>
                <dd className="mt-1 text-sm leading-6">{project.place}</dd>
              </div>
            ) : null}
            {project.surface ? (
              <div>
                <dt className="text-[10px] uppercase tracking-[0.28em] text-muted">
                  Surface
                </dt>
                <dd className="mt-1 text-sm leading-6">{project.surface}</dd>
              </div>
            ) : null}
            {project.year ? (
              <div>
                <dt className="text-[10px] uppercase tracking-[0.28em] text-muted">
                  Year
                </dt>
                <dd className="mt-1 text-sm">{project.year}</dd>
              </div>
            ) : null}
          </dl>
          {project.summary || project.overview ? (
            <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted sm:mt-5">
              {project.summary ?? project.overview}
            </p>
          ) : (
            <p className="mt-4 text-sm leading-6 text-muted sm:mt-5">
              {category}
            </p>
          )}
          <Link
            href={projectHref(project)}
            className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-foreground transition-colors hover:text-accent"
          >
            See more
            <ArrowIcon className="h-3 w-3" />
          </Link>
          <p className="mt-4 font-mono text-[11px] tracking-[0.22em] text-muted sm:mt-5">
            <span>{String(active + 1).padStart(2, "0")}</span>
            <span className="text-foreground/30"> / </span>
            {String(featured.length).padStart(2, "0")}
          </p>
        </div>

        <div className="relative h-[min(46vh,20rem)] w-full sm:h-full sm:min-h-[22rem] sm:flex-1">
          <div className="absolute inset-0 overflow-hidden">
            {project.src && project.cameraPosition && project.cameraTarget ? (
              <ProjectModel
                src={project.src}
                mobileSrc={project.mobileSrc}
                cameraPosition={project.cameraPosition}
                cameraTarget={project.cameraTarget}
                yaw={project.yaw}
                pitchUp={project.pitchUp}
                priority={active === 0}
                className="h-full w-full scale-[1.05]"
              />
            ) : cover ? (
              <Image
                src={cover}
                alt={project.name}
                fill
                priority={active === 0}
                sizes="(min-width: 1024px) 50vw, 90vw"
                className="object-cover"
              />
            ) : null}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between sm:hidden">
            <button
              type="button"
              aria-label="Previous project"
              onClick={() => go(-1)}
              className="btn-pill btn-pill-icon pointer-events-auto"
            >
              <ArrowIcon className="rotate-180" />
            </button>
            <button
              type="button"
              aria-label="Next project"
              onClick={() => go(1)}
              className="btn-pill btn-pill-icon pointer-events-auto"
            >
              <ArrowIcon />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-9 z-20 hidden items-center justify-center gap-2 sm:flex">
        <button
          type="button"
          aria-label="Previous project"
          onClick={() => go(-1)}
          className="btn-pill btn-pill-icon"
        >
          <ArrowIcon className="rotate-180" />
        </button>
        <button
          type="button"
          aria-label="Next project"
          onClick={() => go(1)}
          className="btn-pill btn-pill-icon"
        >
          <ArrowIcon />
        </button>
      </div>
    </section>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className={`h-4 w-4 ${className}`}
      fill="none"
    >
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

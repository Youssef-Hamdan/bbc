"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ProjectHero({
  name,
  typeLabel,
  heroMeta,
  summary,
  cover,
}: {
  name: string;
  typeLabel: string;
  heroMeta?: string;
  summary?: string;
  cover?: string;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const root = rootRef.current;
    const media = mediaRef.current;
    const copy = copyRef.current;
    if (!root || !media) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const desktop = window.matchMedia("(min-width: 640px)").matches;

      if (desktop) {
        gsap.fromTo(
          media,
          { yPercent: -14 },
          {
            yPercent: 14,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      if (copy) {
        gsap.fromTo(
          copy,
          { y: 0 },
          {
            y: desktop ? 96 : 40,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative isolate h-[24rem] overflow-hidden bg-ink sm:h-[min(92vh,56rem)]"
      data-scroll-theme-light="theme-cream"
      data-scroll-theme-dark="theme-cream"
      data-nav-on="dark"
    >
      <div
        ref={mediaRef}
        className="absolute inset-0 z-10 w-full sm:-top-[14%] sm:h-[128%] sm:will-change-transform"
      >
        {cover ? (
          <Image
            src={cover}
            alt={name}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : (
          <div className="h-full w-full bg-surface" />
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-ink via-ink/45 to-transparent" />
      <div
        ref={copyRef}
        className="absolute inset-x-0 bottom-0 z-30 page-gutter pb-6 will-change-transform sm:pb-14"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] uppercase tracking-[0.32em] text-cream/70 sm:text-[11px]">
            {typeLabel}
          </p>
          <h1 className="mt-2 max-w-6xl text-pretty break-words font-serif text-[1.7rem] leading-[1.08] tracking-tight text-cream sm:mt-3 sm:text-7xl sm:leading-[0.95] lg:text-8xl xl:text-9xl">
            {name}
          </h1>
          {heroMeta ? (
            <p className="mt-2.5 max-w-2xl text-[13px] leading-5 text-cream/75 sm:mt-4 sm:text-sm sm:leading-6">
              {heroMeta}
            </p>
          ) : summary ? (
            <p className="mt-2.5 max-w-2xl text-[13px] leading-5 text-cream/75 sm:mt-4 sm:text-sm sm:leading-6">
              {summary}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

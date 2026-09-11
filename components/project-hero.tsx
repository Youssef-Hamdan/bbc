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

      if (copy) {
        gsap.fromTo(
          copy,
          { y: 0 },
          {
            y: 96,
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
      className="relative isolate h-[min(78vh,56rem)] overflow-hidden bg-background sm:h-[min(92vh,56rem)]"
      data-scroll-theme-light="theme-cream"
      data-scroll-theme-dark="theme-cream"
      data-nav-on="dark"
    >
      <div
        ref={mediaRef}
        className="absolute inset-x-0 -top-[14%] z-10 h-[128%] w-full will-change-transform"
      >
        {cover ? (
          <Image
            src={cover}
            alt={name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-surface" />
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
      <div
        ref={copyRef}
        className="absolute inset-x-0 bottom-0 z-30 page-gutter pb-8 will-change-transform sm:pb-14"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] uppercase tracking-[0.32em] text-cream/70">
            {typeLabel}
          </p>
          <h1 className="mt-3 max-w-6xl text-pretty break-words font-serif text-[2.35rem] leading-[0.95] tracking-tight text-cream sm:text-7xl lg:text-8xl xl:text-9xl">
            {name}
          </h1>
          {heroMeta ? (
            <p className="mt-4 max-w-2xl text-sm leading-6 text-cream/75">
              {heroMeta}
            </p>
          ) : summary ? (
            <p className="mt-4 max-w-2xl text-sm leading-6 text-cream/75">
              {summary}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

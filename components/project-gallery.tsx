"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { getAppLenis } from "@/lib/lenis";

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

export function ProjectGallery({
  images,
  projectName,
}: {
  images: string[];
  projectName: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const total = images.length;

  const close = useCallback(() => setActive(null), []);
  const show = useCallback(
    (index: number) => setActive(((index % total) + total) % total),
    [total],
  );

  useEffect(() => {
    if (active == null) return;

    const lenis = getAppLenis();
    lenis?.stop();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") show(active + 1);
      if (event.key === "ArrowLeft") show(active - 1);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      lenis?.start();
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, show]);

  if (!total) return null;

  const featured = total >= 3;

  return (
    <>
      <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        {images.map((src, index) => {
          const isLead = featured && index === 0;
          return (
            <li
              key={src}
              className={isLead ? "sm:col-span-2" : undefined}
            >
              <button
                type="button"
                onClick={() => setActive(index)}
                className={`group relative block w-full cursor-zoom-in overflow-hidden bg-surface ${
                  isLead ? "aspect-[16/10] sm:aspect-[2/1]" : "aspect-[4/3]"
                }`}
              >
                <Image
                  src={src}
                  alt={`${projectName} — ${index + 1}`}
                  fill
                  sizes={
                    isLead
                      ? "(min-width: 1024px) 80vw, 100vw"
                      : "(min-width: 640px) 42vw, 100vw"
                  }
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <span className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/20" />
                <span className="pointer-events-none absolute bottom-4 right-4 font-mono text-[11px] tracking-[0.22em] text-cream opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {active != null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${projectName} gallery`}
          className="fixed inset-0 z-[100] bg-ink text-cream"
        >
          <button
            type="button"
            aria-label="Close gallery"
            onClick={close}
            className="absolute inset-0 cursor-zoom-out"
          />
          <button
            type="button"
            onClick={close}
            className="btn-pill btn-pill-light absolute right-4 top-[max(1.25rem,env(safe-area-inset-top))] z-10 sm:right-5 sm:top-5"
          >
            Close
          </button>

          {total > 1 ? (
            <div className="absolute inset-x-0 bottom-[max(4.25rem,calc(env(safe-area-inset-bottom)+3.25rem))] z-10 flex justify-center gap-2 sm:inset-x-8 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:justify-between">
              <button
                type="button"
                aria-label="Previous image"
                onClick={() => show(active - 1)}
                className="btn-pill btn-pill-icon btn-pill-light"
              >
                <ArrowIcon className="rotate-180" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={() => show(active + 1)}
                className="btn-pill btn-pill-icon btn-pill-light"
              >
                <ArrowIcon />
              </button>
            </div>
          ) : null}

          <div className="pointer-events-none absolute inset-0 px-4 py-24 sm:px-24 sm:py-20">
            <div className="relative h-full w-full">
              <Image
                src={images[active]}
                alt={`${projectName} — ${active + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>

          <p className="pointer-events-none absolute inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] text-center font-mono text-[11px] tracking-[0.22em] text-cream/70">
            {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
        </div>
      ) : null}
    </>
  );
}

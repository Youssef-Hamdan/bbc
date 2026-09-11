"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import TextAnimation from "@/components/ui/scroll-text";
import { useMediaQuery } from "@/hooks/use-media-query";
import { machines } from "@/lib/machines";
import { cn } from "@/lib/utils";

function pad(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function Fleet() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const namesRef = useRef<HTMLOListElement>(null);
  const swipeX = useRef<number | null>(null);
  const canHover = useMediaQuery("(hover: hover)");
  const machine = machines[active];

  const go = (direction: -1 | 1) => {
    setActive((index) => (index + direction + machines.length) % machines.length);
  };

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || paused) return;
    const id = window.setInterval(() => {
      setActive((index) => (index + 1) % machines.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [active, paused]);

  useEffect(() => {
    const scroller = thumbsRef.current;
    if (!scroller) return;
    const thumb = scroller.querySelector<HTMLElement>('[data-active="true"]');
    if (!thumb) return;
    scroller.scrollTo({
      left: Math.max(0, thumb.offsetLeft - 16),
      behavior: "smooth",
    });
  }, [active]);

  useEffect(() => {
    const list = namesRef.current;
    if (!list || list.clientHeight === 0) return;
    const item = list.querySelector<HTMLElement>('[data-active="true"]');
    if (!item) return;

    const listRect = list.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    let delta = 0;
    if (itemRect.top < listRect.top) {
      delta = itemRect.top - listRect.top;
    } else if (itemRect.bottom > listRect.bottom) {
      delta = itemRect.bottom - listRect.bottom;
    }
    if (!delta) return;

    list.scrollTo({ top: list.scrollTop + delta, behavior: "smooth" });
  }, [active]);

  return (
    <section
      id="flotte"
      className="py-16 sm:py-24 lg:py-32"
      data-scroll-theme-light="theme-sand"
      data-scroll-theme-dark="theme-sand"
      onMouseEnter={() => {
        if (canHover) setPaused(true);
      }}
      onMouseLeave={() => {
        if (canHover) setPaused(false);
      }}
    >
      <div className="page-gutter flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.32em] text-muted">
            Notre parc
          </p>
          <h2 className="mt-3 font-serif text-[2rem] leading-[1.05] tracking-tight sm:mt-4 sm:text-5xl lg:text-6xl">
            <span className="block">
              <TextAnimation
                as="span"
                text="Notre Flotte"
                direction="left"
                classname="font-serif text-[2rem] leading-[1.05] tracking-tight normal-case sm:text-5xl lg:text-6xl"
              />
            </span>
            <span className="block italic">
              <TextAnimation
                as="span"
                text="d'Engins."
                direction="left"
                classname="font-serif text-[2rem] leading-[1.05] tracking-tight normal-case italic sm:text-5xl lg:text-6xl"
              />
            </span>
          </h2>
        </div>
        <p className="max-w-md text-[15px] leading-6 text-muted sm:text-base sm:leading-7 lg:max-w-sm lg:text-right">
          Un parc matériel moderne pour répondre à tous les défis techniques.
        </p>
      </div>

      <div className="page-gutter mt-8 grid min-w-0 items-stretch gap-5 sm:mt-12 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] lg:gap-8 xl:grid-cols-[minmax(0,1.55fr)_minmax(18rem,22rem)] xl:gap-10">
        <div className="relative min-w-0 overflow-hidden rounded-2xl bg-cream">
          <div
            className="relative h-[min(42vh,17.5rem)] w-full touch-pan-y sm:h-[min(46vh,24rem)] lg:h-[min(56vh,34rem)]"
            onPointerDown={(event) => {
              swipeX.current = event.clientX;
            }}
            onPointerUp={(event) => {
              if (swipeX.current == null) return;
              const delta = event.clientX - swipeX.current;
              swipeX.current = null;
              if (Math.abs(delta) < 48) return;
              go(delta < 0 ? 1 : -1);
            }}
            onPointerCancel={() => {
              swipeX.current = null;
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-[10%] bottom-[6%] h-[16%] rounded-[100%] bg-ink/10 blur-2xl"
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={machine.id}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 1.02 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={machine.image}
                  alt={machine.name}
                  fill
                  sizes="(min-width: 1280px) 55vw, (min-width: 1024px) 58vw, 100vw"
                  className="pointer-events-none object-contain object-center p-4 sm:p-8 lg:p-10"
                  priority={machine.id === "1"}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex items-end justify-between gap-3 border-t border-ink/10 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
            <div className="min-w-0">
              <p className="text-[11px] tracking-[0.28em] text-muted">
                {pad(active)} / {String(machines.length).padStart(2, "0")}
              </p>
              <p className="mt-1 font-serif text-lg leading-snug sm:text-2xl lg:text-3xl">
                {machine.name}
              </p>
            </div>
            <p className="hidden shrink-0 text-[11px] uppercase tracking-[0.28em] text-muted sm:block">
              {machines.length} engins
            </p>
          </div>
        </div>

        <div className="hidden min-w-0 lg:flex lg:flex-col lg:justify-center">
          <ol
            ref={namesRef}
            className="max-h-[min(56vh,34rem)] divide-y divide-ink/10 overflow-y-auto border-y border-ink/10 scrollbar-none"
          >
            {machines.map((item, index) => {
              const selected = index === active;
              return (
                <li key={item.id} data-active={selected || undefined}>
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    className={cn(
                      "group flex w-full items-baseline gap-3 py-2.5 text-left transition-colors duration-300 xl:gap-4",
                      selected ? "text-ink" : "text-muted hover:text-ink",
                    )}
                  >
                    <span
                      className={cn(
                        "w-7 shrink-0 text-[11px] tracking-[0.22em] transition-colors",
                        selected ? "text-accent" : "text-muted group-hover:text-ink",
                      )}
                    >
                      {pad(index)}
                    </span>
                    <span
                      className={cn(
                        "min-w-0 font-serif text-[0.95rem] leading-snug transition-transform duration-300 xl:text-base",
                        selected && "translate-x-1",
                      )}
                    >
                      {item.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="page-gutter mt-5 sm:mt-7 lg:mt-8">
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent sm:w-16"
          />
          <div
            ref={thumbsRef}
            className="scrollbar-none flex snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain py-2 touch-pan-x sm:gap-3"
          >
            {machines.map((item, index) => {
              const selected = index === active;
              return (
                <button
                  key={item.id}
                  type="button"
                  data-active={selected}
                  onClick={() => setActive(index)}
                  aria-label={item.name}
                  aria-current={selected ? "true" : undefined}
                  className={cn(
                    "relative h-[4.5rem] w-[6.25rem] shrink-0 snap-start overflow-hidden rounded-xl bg-cream transition-[transform,opacity] duration-300 sm:h-24 sm:w-32 lg:h-[6.5rem] lg:w-36",
                    selected
                      ? "ring-2 ring-ink ring-offset-2 ring-offset-background"
                      : "opacity-70 hover:opacity-100",
                  )}
                >
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="144px"
                    className="object-contain p-1.5 sm:p-2"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

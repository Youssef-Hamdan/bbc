"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import {
  ProgressSlider,
  SliderBtn,
  SliderBtnGroup,
  SliderContent,
  SliderWrapper,
  useProgressSliderContext,
} from "@/components/ui/progressive-carousel";
import TextAnimation from "@/components/ui/scroll-text";
import { useMediaQuery } from "@/hooks/use-media-query";

const services = [
  {
    num: "01",
    title: "Concrete Plant",
    body: "Batching and supply for pours that stay on spec.",
    image: "/services/services-1.webp",
    alt: "Aerial view of a concrete batching plant with silos and mixer trucks",
    sliderName: "concrete-plant",
  },
  {
    num: "02",
    title: "Brick Factory",
    body: "Bricks produced in-house, from kiln to wall.",
    image: "/services/services-2.webp",
    alt: "Covered brick factory with conveyor and production machinery",
    sliderName: "brick-factory",
  },
  {
    num: "03",
    title: "Foundations on Pieux",
    body: "Deep piles where the ground will not hold on its own.",
    image: "/services/services-3.webp",
    alt: "Foundation piles driven into the ground on a construction site",
    sliderName: "foundations-on-pieux",
  },
  {
    num: "04",
    title: "Palplanches",
    body: "Sheet piling that keeps the excavation true.",
    image: "/services/services-4.webp",
    alt: "Deep excavation retained with interlocking steel sheet piles",
    sliderName: "palplanches",
  },
  {
    num: "05",
    title: "Architectural Plans",
    body: "Drawings that survive contact with the site.",
    image: "/services/services-5.webp",
    alt: "Architectural rendering of Kinshasa Mall",
    sliderName: "architectural-plans",
  },
  {
    num: "06",
    title: "Construction Work",
    body: "Structure raised with the discipline of a long project.",
    image: "/services/services-6.webp",
    alt: "Multi-storey concrete building under construction",
    sliderName: "construction-work",
  },
  {
    num: "07",
    title: "Mechanical and Electrical Work",
    body: "The systems behind the walls, installed to last.",
    image: "/services/services-7.webp",
    alt: "Exposed ceiling mechanical and electrical installations",
    sliderName: "mechanical-electrical",
  },
  {
    num: "08",
    title: "Finish",
    body: "Floors, light, and the rooms people actually use.",
    image: "/services/services-8.webp",
    alt: "Finished commercial interior with escalators and lighting",
    sliderName: "finish",
  },
  {
    num: "09",
    title: "Routes",
    body: "Roads built for traffic, weather, and years.",
    image: "/services/services-9.webp",
    alt: "Road under construction with a freshly paved asphalt lane",
    sliderName: "routes",
  },
] as const;

export function Services() {
  const isDesktop = useMediaQuery("(min-width: 640px)");

  return (
    <section
      id="services"
      className="py-16 sm:py-32"
      data-scroll-theme-light="theme-sand"
      data-scroll-theme-dark="theme-sand"
    >
      <div className="page-gutter flex flex-col justify-between gap-5 sm:flex-row sm:items-end sm:gap-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-muted">
            Our services
          </p>
          <h2 className="mt-3 font-serif text-3xl tracking-tight sm:mt-4 sm:text-6xl">
            <span className="block">
              <TextAnimation
                as="span"
                text="From the plant"
                direction="left"
                classname="font-serif text-3xl tracking-tight normal-case sm:text-6xl"
              />
            </span>
            <span className="block italic">
              <TextAnimation
                as="span"
                text="to the finished floor."
                direction="left"
                classname="font-serif text-3xl tracking-tight normal-case italic sm:text-6xl"
              />
            </span>
          </h2>
        </div>
        <p className="max-w-sm text-[15px] leading-6 text-muted sm:text-base sm:leading-7">
          Concrete, structure, systems, and the road that gets you there — one
          company across every trade.
        </p>
      </div>

      <div className="page-gutter mt-10 sm:mt-16">
        <ProgressSlider
          vertical={isDesktop}
          fastDuration={300}
          duration={4000}
          activeSlider="concrete-plant"
          className="flex flex-col-reverse overflow-hidden rounded-2xl bg-background sm:h-[min(72vh,46rem)] sm:flex-row"
        >
          <ServicesTabs />
          <SliderContent className="relative h-[min(58vh,24rem)] w-full sm:h-full">
            {services.map((item) => (
              <SliderWrapper
                className="absolute inset-0"
                key={item.sliderName}
                value={item.sliderName}
              >
                <Image
                  className="object-cover"
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 640px) 60vw, 100vw"
                  priority={item.sliderName === "concrete-plant"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="text-[11px] tracking-[0.28em] text-white/70"
                  >
                    {item.num}
                  </motion.p>
                  <motion.h3
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.55,
                      delay: 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="mt-3 font-serif text-2xl leading-tight sm:text-4xl"
                  >
                    {item.title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.16,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="mt-3 max-w-md text-sm leading-6 text-white/80"
                  >
                    {item.body}
                  </motion.p>
                </div>
              </SliderWrapper>
            ))}
          </SliderContent>
        </ProgressSlider>
      </div>
    </section>
  );
}

function ServicesTabs() {
  const { active } = useProgressSliderContext();
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || window.matchMedia("(min-width: 640px)").matches) return;
    const button = scroller.querySelector<HTMLElement>('[data-active="true"]');
    if (!button) return;
    scroller.scrollTo({
      left: Math.max(0, button.offsetLeft - 12),
      behavior: "smooth",
    });
  }, [active]);

  return (
    <div className="relative sm:contents">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 bg-gradient-to-l from-background to-transparent sm:hidden"
      />
      <div
        ref={scrollerRef}
        className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-pl-0 pr-10 sm:contents sm:pr-0"
      >
        <SliderBtnGroup className="relative z-10 flex min-w-max bg-background/90 backdrop-blur-md sm:h-full sm:min-w-0 sm:w-80 sm:flex-col sm:overflow-hidden lg:w-96">
          {services.map((item) => (
            <SliderBtn
              key={item.sliderName}
              value={item.sliderName}
              className="w-[8.5rem] shrink-0 snap-start overflow-hidden border border-foreground/10 p-3 text-left data-[active=true]:bg-ink data-[active=true]:text-cream sm:w-auto sm:flex-1 sm:border-x-0 sm:border-t-0 sm:border-b sm:px-5 sm:py-0"
              progressBarClass="bottom-0 left-0 h-1 bg-accent sm:top-0 sm:h-full sm:w-1"
            >
              <p className="relative z-10 text-[10px] tracking-[0.28em] text-muted group-data-[active=true]:text-accent">
                {item.num}
              </p>
              <h3 className="relative z-10 mt-1 line-clamp-2 font-serif text-sm leading-tight sm:line-clamp-none sm:text-base">
                {item.title}
              </h3>
            </SliderBtn>
          ))}
        </SliderBtnGroup>
      </div>
    </div>
  );
}

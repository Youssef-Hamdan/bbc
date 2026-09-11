"use client";

import TextAnimation from "@/components/ui/scroll-text";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

const stats = [
  { value: 10, suffix: "+", label: "Years of experience" },
  { value: 50, suffix: "+", label: "Projects carried out" },
  { value: 500, suffix: "+", label: "Employees" },
];

function CountUp({
  to,
  suffix = "+",
}: {
  to: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.textContent = `${to}${suffix}`;
      return;
    }

    const counter = { value: 0 };
    const tween = gsap.to(counter, {
      value: to,
      duration: 1.8,
      ease: "power3.out",
      paused: true,
      onUpdate: () => {
        el.textContent = `${Math.round(counter.value)}${suffix}`;
      },
    });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => tween.play(),
    });

    return () => {
      trigger.kill();
      tween.kill();
    };
  }, [to, suffix]);

  return (
    <span
      ref={ref}
      className="text-5xl font-medium tabular-nums tracking-tight text-foreground sm:text-7xl xl:text-8xl"
    >
      0{suffix}
    </span>
  );
}

export function About() {
  return (
    <section
      id="about"
      className="relative bg-cream sm:bg-transparent"
      data-scroll-theme-light="theme-cream"
      data-scroll-theme-dark="theme-cream"
    >
      <div className="page-gutter flex items-center justify-center py-12 text-center sm:min-h-[42vh] sm:py-20">
        <TextAnimation
          text="We are building the future with excellence."
          direction="left"
          classname="w-full max-w-4xl text-center text-[1.85rem] font-medium normal-case leading-[1.15] sm:text-6xl lg:text-7xl"
        />
      </div>

      <div className="page-gutter flex items-center justify-center py-8 text-center sm:min-h-[32vh] sm:py-12">
        <TextAnimation
          as="p"
          text="BBC Sarlu is the DRC's reference partner for complex, sustainable projects."
          direction="left"
          stagger={0.05}
          classname="w-full max-w-4xl text-center text-[1.85rem] font-medium normal-case leading-[1.15] sm:text-6xl lg:text-7xl"
        />
      </div>

      <div className="page-gutter flex items-center justify-center py-12 text-center sm:min-h-[42vh] sm:py-20">
        <div className="grid w-full max-w-6xl gap-8 sm:grid-cols-3 sm:gap-8">
          {stats.map((stat) => (
            <div key={stat.label}>
              <CountUp to={stat.value} suffix={stat.suffix} />
              <p className="mt-4 text-[11px] uppercase tracking-[0.28em] text-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

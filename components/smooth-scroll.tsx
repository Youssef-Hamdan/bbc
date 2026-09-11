"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { getAppLenis, setAppLenis } from "@/lib/lenis";

function scrollToTop() {
  const lenis = getAppLenis();
  lenis?.scrollTo(0, { immediate: true });
  window.scrollTo(0, 0);
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    setAppLenis(lenis);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      setAppLenis(undefined);
    };
  }, []);

  useLayoutEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const target = document.getElementById(hash);
      if (target) {
        const go = () => {
          getAppLenis()?.scrollTo(target, { immediate: true });
          target.scrollIntoView();
        };
        go();
        const raf = requestAnimationFrame(go);
        return () => cancelAnimationFrame(raf);
      }
    }

    scrollToTop();
    const raf = requestAnimationFrame(scrollToTop);
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return <>{children}</>;
}

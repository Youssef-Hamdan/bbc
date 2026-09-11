"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { getAppLenis } from "@/lib/lenis";

const SUB_THEME_PREFIX = "theme-";
const THEME_SELECTOR =
  "[data-scroll-theme-light], [data-scroll-theme-dark], [data-scroll-theme]";
const NAV_ON_ATTR = "data-nav-on";

function isDarkMode() {
  return document.documentElement.classList.contains("dark");
}

function subThemeClassFor(el: HTMLElement) {
  const keyed = isDarkMode()
    ? el.getAttribute("data-scroll-theme-dark")
    : el.getAttribute("data-scroll-theme-light");
  return keyed ?? el.getAttribute("data-scroll-theme");
}

function applySubTheme(theme: string) {
  const html = document.documentElement;
  const stale: string[] = [];
  html.classList.forEach((cls) => {
    if (cls.startsWith(SUB_THEME_PREFIX) && cls !== theme) stale.push(cls);
  });
  stale.forEach((cls) => html.classList.remove(cls));
  html.classList.add(theme);
}

function clearSubThemes() {
  const html = document.documentElement;
  const stale: string[] = [];
  html.classList.forEach((cls) => {
    if (cls.startsWith(SUB_THEME_PREFIX)) stale.push(cls);
  });
  stale.forEach((cls) => html.classList.remove(cls));
}

function applyNavOn(value: "dark" | "light") {
  document.documentElement.setAttribute(NAV_ON_ATTR, value);
}

function navOnFor(el: HTMLElement, theme: string | null): "dark" | "light" {
  const explicit = el.getAttribute(NAV_ON_ATTR);
  if (explicit === "dark" || explicit === "light") return explicit;
  return theme === "theme-ink" ? "dark" : "light";
}

export function ScrollThemeController() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>(THEME_SELECTOR);
    if (!nodes.length) {
      applyNavOn("light");
      return;
    }

    const pick = () => {
      const triggerY = window.innerHeight * 0.06;
      let current: HTMLElement | null = null;
      let passed: HTMLElement | null = null;

      nodes.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerY) passed = el;
        if (rect.top <= triggerY && rect.bottom > triggerY) current = el;
      });

      const active = current ?? passed;
      if (!active) {
        clearSubThemes();
        applyNavOn("light");
        return;
      }

      const theme = subThemeClassFor(active);
      if (theme) applySubTheme(theme);
      else clearSubThemes();
      applyNavOn(navOnFor(active, theme));
    };

    const observer = new IntersectionObserver(pick, {
      rootMargin: "-6% 0px -6% 0px",
      threshold: Array.from({ length: 21 }, (_, i) => i / 20),
    });
    nodes.forEach((node) => observer.observe(node));

    const onScroll = () => pick();
    window.addEventListener("scroll", onScroll, { passive: true });

    let attachedLenis = getAppLenis();
    attachedLenis?.on("scroll", onScroll);
    const raf = requestAnimationFrame(() => {
      if (attachedLenis) return;
      attachedLenis = getAppLenis();
      attachedLenis?.on("scroll", onScroll);
    });

    pick();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      attachedLenis?.off("scroll", onScroll);
      clearSubThemes();
    };
  }, [pathname]);

  return null;
}

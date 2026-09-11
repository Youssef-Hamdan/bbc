"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Drawer } from "vaul";
import { getAppLenis } from "@/lib/lenis";
import { useMediaQuery } from "@/hooks/use-media-query";

const links = [
  { href: "/categories", label: "View our work", kind: "primary" as const },
  { href: "/#flotte", label: "Notre flotte", kind: "secondary" as const },
  { href: "tel:+243826200240", label: "Book a call", kind: "secondary" as const },
  { href: "/#contact", label: "Contact us", kind: "secondary" as const },
] as const;

const menuList = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const menuItem = {
  hidden: { opacity: 0, y: -12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Nav() {
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [navAway, setNavAway] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 640px)");

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const syncHeight = () => {
      document.documentElement.style.setProperty(
        "--nav-height",
        `${header.offsetHeight}px`,
      );
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isDesktop) setOpen(false);
  }, [isDesktop]);

  useEffect(() => {
    let lastY = 0;
    let ticking = false;

    const update = (y: number) => {
      if (window.matchMedia("(min-width: 640px)").matches) {
        setNavAway(false);
        lastY = y;
        return;
      }

      const goingDown = y > lastY + 2;
      const goingUp = y < lastY - 2;
      lastY = y;

      if (y < 32) {
        setNavAway(false);
        return;
      }
      if (goingDown) setNavAway(true);
      if (goingUp) setNavAway(false);
    };

    const onScroll = (event?: { scroll?: number }) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update(event?.scroll ?? getAppLenis()?.scroll ?? window.scrollY);
      });
    };
    const onWindowScroll = () => onScroll();

    window.addEventListener("scroll", onWindowScroll, { passive: true });
    let attached = getAppLenis();
    attached?.on("scroll", onScroll);
    const retry = window.setTimeout(() => {
      const next = getAppLenis();
      if (!next || next === attached) return;
      attached?.off("scroll", onScroll);
      next.on("scroll", onScroll);
      attached = next;
    }, 80);

    return () => {
      window.removeEventListener("scroll", onWindowScroll);
      attached?.off("scroll", onScroll);
      window.clearTimeout(retry);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const lenis = getAppLenis();
    lenis?.stop();
    return () => {
      lenis?.start();
    };
  }, [open]);

  return (
    <Drawer.Root
      open={open}
      onOpenChange={setOpen}
      direction="top"
      shouldScaleBackground={false}
      setBackgroundColorOnScale={false}
    >
      <header
        ref={headerRef}
        className="site-nav fixed inset-x-0 top-0 z-[70] bg-transparent pt-[env(safe-area-inset-top)]"
      >
        <nav className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-5 lg:px-6">
          <a
            href="/"
            onClick={() => setOpen(false)}
            className={`relative block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:translate-x-0 ${open || !navAway ? "translate-x-0" : "pointer-events-none -translate-x-[calc(100%+1.5rem)]"}`}
          >
            <Image
              src="/logo-dark.png"
              alt="Best Building Company"
              width={320}
              height={213}
              sizes="320px"
              loading="eager"
              className="nav-logo-dark h-12 w-auto sm:h-20 lg:h-24"
            />
            <Image
              src="/logo-light.png"
              alt=""
              aria-hidden
              width={320}
              height={213}
              sizes="320px"
              loading="eager"
              className="nav-logo-light pointer-events-none absolute left-0 top-0 h-12 w-auto sm:h-20 lg:h-24"
            />
          </a>

          <div className="hidden flex-col items-end leading-none sm:flex">
            <Link
              href="/categories"
              className="site-nav-work group relative inline-flex items-center pb-1.5 font-serif text-[15px] tracking-tight transition-[padding] duration-300 ease-out hover:pr-5 sm:text-lg"
            >
              <span className="relative">
                View our work
                <span className="absolute inset-x-0 -bottom-[0.375rem] h-px bg-current transition-[right] duration-300 ease-out group-hover:-right-5" />
              </span>
              <svg
                viewBox="0 0 16 16"
                aria-hidden
                className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
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
            </Link>
            <a
              href="tel:+243826200240"
              className="site-nav-link relative mt-2 text-[10px] uppercase tracking-[0.28em] opacity-80 transition-[color,opacity] duration-300 after:absolute after:right-0 after:bottom-[-3px] after:h-px after:w-0 after:bg-current after:transition-[width] after:duration-300 hover:opacity-100 hover:after:w-full sm:text-[11px]"
            >
              Book a call
            </a>
            <a
              href="/#contact"
              className="site-nav-link relative mt-1.5 text-[10px] uppercase tracking-[0.28em] opacity-80 transition-[color,opacity] duration-300 after:absolute after:right-0 after:bottom-[-3px] after:h-px after:w-0 after:bg-current after:transition-[width] after:duration-300 hover:opacity-100 hover:after:w-full sm:text-[11px]"
            >
              Contact us
            </a>
          </div>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
            className={`site-nav relative flex h-11 w-11 items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:hidden sm:translate-x-0 ${open || !navAway ? "translate-x-0" : "pointer-events-none translate-x-[calc(100%+1.5rem)]"}`}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span
              className={`absolute h-px w-5 bg-current transition-transform duration-300 ${open ? "translate-y-0 rotate-45" : "-translate-y-1.5"}`}
            />
            <span
              className={`absolute h-px w-5 bg-current transition-opacity duration-300 ${open ? "opacity-0" : "opacity-100"}`}
            />
            <span
              className={`absolute h-px w-5 bg-current transition-transform duration-300 ${open ? "translate-y-0 -rotate-45" : "translate-y-1.5"}`}
            />
          </button>
        </nav>
      </header>

      {!isDesktop ? (
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-[60] bg-ink/35 backdrop-blur-sm" />
          <Drawer.Content
            id="mobile-nav"
            className="fixed inset-x-0 top-0 z-[60] flex h-fit flex-col rounded-b-[1.75rem] bg-cream outline-none"
          >
            <Drawer.Title className="sr-only">Menu</Drawer.Title>
            <Drawer.Description className="sr-only">
              Site navigation
            </Drawer.Description>
            <motion.div
              className="flex flex-col gap-3 px-4 pb-5 pt-[calc(var(--nav-height)+0.75rem)]"
              initial="hidden"
              animate={open ? "show" : "hidden"}
              variants={menuList}
            >
              {links.map((link) => (
                <motion.div key={link.href} variants={menuItem}>
                  <MenuLink
                    href={link.href}
                    kind={link.kind}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </MenuLink>
                </motion.div>
              ))}
            </motion.div>
            <Drawer.Handle className="mx-auto mb-3 bg-ink/25" />
          </Drawer.Content>
        </Drawer.Portal>
      ) : null}
    </Drawer.Root>
  );
}

function MenuLink({
  href,
  kind,
  onClick,
  children,
}: {
  href: string;
  kind: "primary" | "secondary";
  onClick: () => void;
  children: string;
}) {
  const className =
    kind === "primary"
      ? "group flex min-h-14 w-full items-center justify-between gap-4 rounded-2xl bg-ink px-5 py-4 text-cream shadow-[0_10px_24px_rgba(22,19,17,0.16)] transition-colors duration-200 active:bg-accent"
      : "group flex min-h-14 w-full items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-white/50 px-5 py-4 text-ink shadow-[0_6px_16px_rgba(22,19,17,0.06)] transition-colors duration-200 active:border-transparent active:bg-ink active:text-cream";

  const inner = (
    <>
      <span
        className={
          kind === "primary"
            ? "font-serif text-2xl tracking-tight"
            : "text-[12px] uppercase tracking-[0.22em]"
        }
      >
        {children}
      </span>
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-active:translate-x-0.5 ${kind === "primary" ? "bg-cream/15 text-cream" : "bg-ink/10 text-ink group-active:bg-cream/15 group-active:text-cream"}`}
      >
        <ArrowIcon />
      </span>
    </>
  );

  if (href.startsWith("tel:") || href.startsWith("/#")) {
    return (
      <motion.a
        href={href}
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
        className={className}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.div whileTap={{ scale: 0.98 }}>
      <Link href={href} onClick={onClick} className={className}>
        {inner}
      </Link>
    </motion.div>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="h-4 w-4" fill="none">
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

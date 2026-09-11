"use client";

import { FormEvent } from "react";
import TextAnimation from "@/components/ui/scroll-text";

export function Cta() {
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <section
      id="contact"
      className="page-gutter py-16 sm:py-32"
      data-scroll-theme-light="theme-cream"
      data-scroll-theme-dark="theme-cream"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-muted">
            Start a conversation
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-[1.05] tracking-tight sm:text-6xl">
            <span className="block">
              <TextAnimation
                as="span"
                text="Let's raise"
                direction="left"
                classname="font-serif text-3xl leading-[1.05] tracking-tight normal-case sm:text-6xl"
              />
            </span>
            <span className="block italic">
              <TextAnimation
                as="span"
                text="the skyline."
                direction="left"
                classname="font-serif text-3xl leading-[1.05] tracking-tight normal-case italic sm:text-6xl"
              />
            </span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-7 text-muted sm:mt-8 sm:text-lg sm:leading-8">
            Tell us about the site, the brief, or the building you cannot stop
            thinking about. We will be in touch within two working days.
          </p>
          <div className="mt-10 space-y-4 text-sm leading-6">
            <p className="max-w-md text-muted">
              N°2, Avenue des Poids Lourds, Quartier Ndanu, C/ Limete – Kinshasa,
              RD Congo
            </p>
            <p className="flex flex-col gap-2 sm:block">
              <a
                href="tel:+243826200240"
                className="underline decoration-foreground/20 underline-offset-4 hover:decoration-accent"
              >
                +243 826 200 240
              </a>
              <span className="mx-2 hidden text-muted sm:inline">/</span>
              <a
                href="tel:+243829884283"
                className="underline decoration-foreground/20 underline-offset-4 hover:decoration-accent"
              >
                +243 829 884 283
              </a>
            </p>
            <p>
              <a
                href="mailto:info@bestbuilding.co"
                className="underline decoration-foreground/20 underline-offset-4 hover:decoration-accent"
              >
                info@bestbuilding.co
              </a>
            </p>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl bg-surface p-5 sm:p-10"
        >
          <label className="block text-sm">
            Name
            <input
              name="name"
              autoComplete="name"
              className="mt-2 w-full rounded-lg border border-foreground/10 bg-background px-4 py-3 text-base outline-none ring-accent/30 focus:ring-2"
            />
          </label>
          <label className="mt-5 block text-sm">
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              className="mt-2 w-full rounded-lg border border-foreground/10 bg-background px-4 py-3 text-base outline-none ring-accent/30 focus:ring-2"
            />
          </label>
          <label className="mt-5 block text-sm">
            Project
            <textarea
              name="project"
              rows={4}
              className="mt-2 w-full resize-none rounded-lg border border-foreground/10 bg-background px-4 py-3 text-base outline-none ring-accent/30 focus:ring-2"
            />
          </label>
          <button
            type="submit"
            className="btn-pill mt-6 w-full !normal-case !tracking-normal !text-sm sm:w-auto"
          >
            Send a note
          </button>
        </form>
      </div>
    </section>
  );
}

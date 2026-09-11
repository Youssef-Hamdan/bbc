import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CategoryTile } from "@/components/category-tile";
import { categories } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Our work — BBC Construction",
  description:
    "Work by type: bâtiments, construction métallique, ouvrage d’art, and route et VRD.",
};

export default function CategoriesPage() {
  return (
    <>
      <Nav />
      <main>
        <section
          className="min-h-dvh bg-background page-gutter pt-[calc(var(--nav-height)+1.5rem)] pb-16 sm:pt-[calc(var(--nav-height)+2.5rem)] sm:pb-24"
          data-scroll-theme-light="theme-cream"
          data-scroll-theme-dark="theme-cream"
        >
          <div className="mx-auto max-w-7xl">
            <p className="text-[11px] uppercase tracking-[0.32em] text-muted">
              Our work
            </p>
            <h1 className="mt-3 font-serif text-3xl leading-[1.05] tracking-tight sm:text-6xl">
              Work, by type.
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-7 text-muted">
              Choose a category to see the projects we have carried out in that
              field.
            </p>
          </div>

          <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-3 md:h-[min(72vh,42rem)] md:flex-row md:gap-2">
            {categories.map((item, index) => (
              <CategoryTile
                key={item.slug}
                item={item}
                priority={index === 0}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

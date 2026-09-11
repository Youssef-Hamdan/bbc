import Image from "next/image";

export function Footer() {
  return (
    <footer
      className="border-t border-foreground/10 px-5 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-8 sm:py-12"
      data-scroll-theme-light="theme-cream"
      data-scroll-theme-dark="theme-cream"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-10 sm:flex-row sm:justify-between">
        <div>
          <Image
            src="/logo-dark.png"
            alt="Best Building Company"
            width={280}
            height={186}
            sizes="280px"
            className="h-16 w-auto sm:h-20"
          />
          <p className="mt-3 max-w-xs text-sm leading-6 text-muted">
            BBC Sarlu
            <br />
            N°2, Avenue des Poids Lourds
            <br />
            Quartier Ndanu, C/ Limete
            <br />
            Kinshasa, RD Congo
          </p>
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted">
            <a href="tel:+243826200240" className="hover:text-foreground">
              +243 826 200 240
            </a>
            <br />
            <a href="tel:+243829884283" className="hover:text-foreground">
              +243 829 884 283
            </a>
            <br />
            <a href="mailto:info@bestbuilding.co" className="hover:text-foreground">
              info@bestbuilding.co
            </a>
          </p>
        </div>
        <div className="flex gap-16 text-sm">
          <div className="flex flex-col gap-2">
            <a href="/#about" className="text-muted hover:text-foreground">
              About
            </a>
            <a href="/categories" className="text-muted hover:text-foreground">
              Categories
            </a>
            <a href="/#services" className="text-muted hover:text-foreground">
              Services
            </a>
            <a href="/#flotte" className="text-muted hover:text-foreground">
              Flotte
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <a href="/#contact" className="text-muted hover:text-foreground">
              Contact
            </a>
            <a href="/" className="text-muted hover:text-foreground">
              Back to top
            </a>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-7xl text-xs text-muted sm:mt-12">
        © {new Date().getFullYear()} BBC Sarlu. All rights reserved.
      </p>
    </footer>
  );
}

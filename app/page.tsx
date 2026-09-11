import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { About } from "@/components/sections/about";
import { Services } from "@/components/sections/services";
import { Categories } from "@/components/sections/categories";
import { Fleet } from "@/components/sections/fleet";
import { Cta } from "@/components/sections/cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Services />
        <Categories />
        <Fleet />
        <Cta />
      </main>
      <Footer />
    </>
  );
}

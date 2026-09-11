"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const BUILDING_END_SCALE = 1.15;
const BBC_CLIP_HIDDEN = "inset(-0.22em 100% -0.18em -0.16em)";
const BBC_CLIP_SHOWN = "inset(-0.22em -0.32em -0.18em -0.16em)";

function getBuildingEndY() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  return !reduceMotion && isMobile ? "-4vh" : "-12vh";
}

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const sloganRef = useRef<HTMLDivElement>(null);
  const buildingRef = useRef<HTMLDivElement>(null);
  const mistRef = useRef<HTMLDivElement>(null);
  const mistBackRef = useRef<HTMLDivElement>(null);
  const centerCloudRef = useRef<HTMLDivElement>(null);
  const sloganCloudLeftRef = useRef<HTMLDivElement>(null);
  const sloganCloudRightRef = useRef<HTMLDivElement>(null);
  const buildingWrapRef = useRef<HTMLDivElement>(null);
  const bbcWrapRef = useRef<HTMLDivElement>(null);
  const bbcStrokeRef = useRef<HTMLDivElement>(null);
  const bbcFillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const root = rootRef.current;
    const sky = skyRef.current;
    const slogan = sloganRef.current;
    const building = buildingRef.current;
    const mist = mistRef.current;
    const mistBack = mistBackRef.current;
    const centerCloud = centerCloudRef.current;
    const sloganCloudLeft = sloganCloudLeftRef.current;
    const sloganCloudRight = sloganCloudRightRef.current;
    const bbcWrap = bbcWrapRef.current;
    const bbcStroke = bbcStrokeRef.current;
    if (
      !root ||
      !sky ||
      !slogan ||
      !building ||
      !mist ||
      !mistBack ||
      !centerCloud ||
      !sloganCloudLeft ||
      !sloganCloudRight ||
      !bbcWrap ||
      !bbcStroke
    ) {
      return;
    }

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(building, {
        y: getBuildingEndY(),
        scale: BUILDING_END_SCALE,
        opacity: 0,
        transformOrigin: "50% 100%",
      });
      gsap.set(sky, { scale: 1.06 });
      gsap.set(slogan, { opacity: 0.85 });
      gsap.set(mist, { scale: 1.4, yPercent: -4, transformOrigin: "50% 100%" });
      gsap.set(mistBack, { scale: 1.3, yPercent: -2, transformOrigin: "50% 100%" });
      gsap.set(centerCloud, { y: "0vh", scale: 1, transformOrigin: "50% 100%" });
      gsap.set(sloganCloudLeft, { x: "-8vw", opacity: 0.12, scale: 0.82 });
      gsap.set(sloganCloudRight, { x: "8vw", opacity: 0.18, scale: 1.08 });
      gsap.set(bbcWrap, { opacity: 1 });
      gsap.set(bbcStroke, { clipPath: BBC_CLIP_SHOWN });
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;

      gsap.set(bbcWrap, { opacity: 0 });
      gsap.set(bbcStroke, { clipPath: BBC_CLIP_HIDDEN });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: isMobile ? "+=180%" : "+=230%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      tl.fromTo(
          sky,
          { scale: 1 },
          { scale: 1.12, ease: "none", duration: 0.5 },
          0,
        )
        .fromTo(
          building,
          { y: isMobile ? "2vh" : "14vh", scale: 1, transformOrigin: "50% 100%" },
          { y: getBuildingEndY(), scale: BUILDING_END_SCALE, transformOrigin: "50% 100%", ease: "none", duration: 0.5 },
          0,
        )
        .fromTo(
          slogan,
          { opacity: 1, y: 0 },
          { opacity: 0, y: isMobile ? -24 : -48, ease: "none", duration: 0.22 },
          0.08,
        )
        .fromTo(
          sloganCloudLeft,
          { x: 0, y: 0, opacity: 0.12, scale: 0.82 },
          { x: isMobile ? "-55vw" : "-70vw", y: "-6vh", opacity: 0, scale: 0.82, ease: "none", duration: 0.32 },
          0,
        )
        .fromTo(
          sloganCloudRight,
          { x: 0, y: 0, opacity: 0.18, scale: 1.08 },
          { x: isMobile ? "55vw" : "70vw", y: "4vh", opacity: 0, scale: 1.08, ease: "none", duration: 0.32 },
          0,
        )
        .fromTo(
          mist,
          { xPercent: -6, y: isMobile ? "2vh" : "9vh", scale: 0.9, transformOrigin: "50% 70%" },
          { xPercent: 16, y: "1vh", scale: 1, transformOrigin: "50% 70%", ease: "none", duration: 0.5 },
          0,
        )
        .fromTo(
          mistBack,
          { xPercent: 0, y: isMobile ? "1vh" : "8vh", scale: 0.5, transformOrigin: "50% 70%" },
          { xPercent: 8, y: "1vh", scale: 1.5, transformOrigin: "50% 70%", ease: "none", duration: 0.5 },
          0,
        )
        .fromTo(
          centerCloud,
          { y: isMobile ? "2vh" : "8vh", scale: 0.88, transformOrigin: "50% 100%" },
          { y: "0vh", scale: 1, transformOrigin: "50% 100%", ease: "none", duration: 0.5 },
          0,
        )
        .fromTo(
          bbcWrap,
          { opacity: 0 },
          { opacity: 1, ease: "none", duration: 0.04 },
          0.5,
        )
        .fromTo(
          bbcStroke,
          { clipPath: BBC_CLIP_HIDDEN },
          { clipPath: BBC_CLIP_SHOWN, ease: "none", duration: 0.28 },
          0.52,
        )
        .fromTo(
          building,
          { opacity: 1 },
          { opacity: 0, ease: "none", duration: 0.28 },
          0.52,
        )
        .to(bbcWrap, { opacity: 1, ease: "none", duration: 0.24 }, 0.8);

      return () => {
        tl.kill();
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  useLayoutEffect(() => {
    const fill = bbcFillRef.current;
    const wrap = buildingWrapRef.current;
    if (!fill || !wrap) return;

    const syncBbcFill = () => {
      const wrapRect = wrap.getBoundingClientRect();
      const fillRect = fill.getBoundingClientRect();
      if (wrapRect.width === 0 || fillRect.width === 0) return;

      const yPx = (parseFloat(getBuildingEndY()) / 100) * window.innerHeight;
      const width = wrapRect.width * BUILDING_END_SCALE;
      const height = wrapRect.height * BUILDING_END_SCALE;
      const left = wrapRect.left + wrapRect.width / 2 - width / 2;
      const top = wrapRect.bottom - height + yPx;

      fill.style.backgroundSize = `${width}px ${height}px`;
      fill.style.backgroundPosition = `${left - fillRect.left}px ${top - fillRect.top}px`;
    };

    syncBbcFill();

    const observer = new ResizeObserver(syncBbcFill);
    observer.observe(wrap);
    observer.observe(fill);
    if (rootRef.current) observer.observe(rootRef.current);

    window.addEventListener("resize", syncBbcFill);
    ScrollTrigger.addEventListener("refresh", syncBbcFill);
    const media = [
      window.matchMedia("(max-width: 768px)"),
      window.matchMedia("(prefers-reduced-motion: reduce)"),
    ];
    for (const mq of media) mq.addEventListener("change", syncBbcFill);
    void document.fonts?.ready.then(syncBbcFill);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncBbcFill);
      ScrollTrigger.removeEventListener("refresh", syncBbcFill);
      for (const mq of media) mq.removeEventListener("change", syncBbcFill);
    };
  }, []);

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative h-dvh overflow-hidden bg-cream sm:bg-white"
      aria-label="BBC Construction hero"
      data-scroll-theme-light="theme-white"
      data-scroll-theme-dark="theme-white"
    >
      <div
        ref={skyRef}
        className="absolute inset-0 z-0 h-full w-full bg-cover bg-center will-change-transform"
        style={{ backgroundImage: "url('/hero/sky.webp')" }}
        aria-hidden
      />

      <div
        ref={sloganCloudLeftRef}
        className="pointer-events-none absolute left-[-6%] top-[2%] z-[8] h-[16vh] w-[38vw] max-w-[380px] will-change-transform sm:left-[4%] sm:top-[3%] sm:h-[20vh] sm:w-[24vw]"
      >
        <Image
          src="/hero/cloud-single.png"
          alt=""
          fill
          priority
          sizes="30vw"
          className="object-contain object-center select-none"
          style={{ filter: "brightness(1.12) contrast(1.05) sepia(0.28) hue-rotate(-12deg) saturate(1.2)" }}
        />
      </div>
      <div
        ref={sloganCloudRightRef}
        className="pointer-events-none absolute right-[-4%] top-[12%] z-[9] h-[24vh] w-[50vw] max-w-[560px] will-change-transform sm:right-[1%] sm:top-[22%] sm:h-[32vh] sm:w-[34vw]"
      >
        <Image
          src="/hero/cloud-2.png"
          alt=""
          fill
          priority
          sizes="40vw"
          className="object-contain object-center select-none -scale-x-100"
          style={{ filter: "brightness(1.08) contrast(1.08) sepia(0.32) hue-rotate(-15deg) saturate(1.3)" }}
        />
      </div>

      <div
        ref={sloganRef}
        className="absolute inset-x-0 top-[calc(var(--nav-height)+0.5rem)] z-10 flex flex-col items-center px-5 text-center text-ink will-change-transform sm:top-[calc(var(--nav-height)+1.25rem)] sm:px-6"
      >
        <h1 className="[text-shadow:0_2px_28px_rgba(255,247,232,0.45)]">
          <span className="mb-4 block text-[11px] uppercase tracking-[0.38em] text-ink/80 sm:mb-6">
            BBC Construction
          </span>
          <span className="block font-sans text-[11.5vw] font-bold leading-[0.9] tracking-tight sm:text-[7.5vw] lg:text-[6.4rem]">
            We build
            <br />
            <em className="italic">toward the sky.</em>
          </span>
        </h1>
        <Link href="/categories" className="btn-pill btn-pill-cta relative z-10 mt-6 pointer-events-auto sm:mt-10">
          View projects
          <span className="btn-pill-arrow" aria-hidden>
            <svg viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Link>
      </div>

      <div
        ref={buildingWrapRef}
        className="pointer-events-none absolute bottom-[6%] left-1/2 z-20 w-[140%] -translate-x-1/2 sm:bottom-[-8%] sm:w-[100%] lg:w-[86%]"
      >
        <div
          ref={buildingRef}
          className="will-change-transform origin-bottom translate-y-[14vh] max-sm:translate-y-[2vh]"
        >
          <Image
            src="/hero/buildings.webp"
            alt="Glass towers rising into the sky"
            width={1424}
            height={754}
            priority
            className="h-auto w-full select-none"
          />
        </div>
      </div>

      <div
        ref={mistBackRef}
        className="pointer-events-none absolute inset-x-[-26%] bottom-[-8%] z-30 flex w-[190%] origin-bottom scale-[0.95] will-change-transform opacity-90 sm:bottom-[-14%] sm:w-[160%]"
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`relative h-[32vh] w-[42%] shrink-0 sm:h-[32vh] ${i > 0 ? "-ml-[18%]" : ""} ${i >= 2 ? "scale-110" : ""} ${i === 3 ? "-translate-x-[4%]" : ""} ${i >= 4 ? "max-sm:block hidden" : ""}`}
          >
            <Image
              src={i % 2 === 0 ? "/hero/cloud-single.png" : "/hero/cloud-2.png"}
              alt=""
              fill
              priority
              sizes="40vw"
              className={`object-contain object-bottom select-none ${i % 2 === 1 ? "-scale-x-100" : ""}`}
              style={{ filter: "brightness(1.1) contrast(1.1) sepia(0.35) hue-rotate(-15deg) saturate(1.4)" }}
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[34] h-[40vh] bg-gradient-to-t from-cream from-30% via-cream/85 to-transparent sm:hidden" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 hidden h-[18vh] bg-gradient-to-t from-white/80 via-white/50 to-transparent sm:block" />

      <div
        ref={centerCloudRef}
        className="pointer-events-none absolute inset-x-0 bottom-[-4%] z-30 flex justify-center will-change-transform sm:bottom-[2%]"
      >
        <div className="relative h-[18vh] w-[42vw] min-w-[200px] max-w-[420px] sm:h-[16vh] sm:w-[34vw]">
          <Image
            src="/hero/cloud-single.png"
            alt=""
            fill
            priority
            sizes="34vw"
            className="object-contain object-bottom select-none"
            style={{ filter: "brightness(1.08) contrast(1.08) sepia(0.32) hue-rotate(-15deg) saturate(1.35)" }}
          />
        </div>
        <div className="relative -ml-[10%] h-[17vh] w-[36vw] min-w-[180px] max-w-[360px] -translate-y-3 sm:h-[15vh] sm:w-[28vw] sm:translate-y-2">
          <Image
            src="/hero/cloud-2.png"
            alt=""
            fill
            priority
            sizes="28vw"
            className="object-contain object-bottom select-none -scale-x-100"
            style={{ filter: "brightness(1.08) contrast(1.08) sepia(0.32) hue-rotate(-15deg) saturate(1.35)" }}
          />
        </div>
        <div className="relative -ml-[12%] h-[16vh] w-[38vw] -translate-y-6 sm:hidden">
          <Image
            src="/hero/cloud-single.png"
            alt=""
            fill
            sizes="38vw"
            className="object-contain object-bottom select-none -scale-x-100"
            style={{ filter: "brightness(1.08) contrast(1.08) sepia(0.32) hue-rotate(-15deg) saturate(1.35)" }}
          />
        </div>
        <div className="relative -ml-[14%] h-[15vh] w-[32vw] translate-y-1 sm:hidden">
          <Image
            src="/hero/cloud-2.png"
            alt=""
            fill
            sizes="32vw"
            className="object-contain object-bottom select-none"
            style={{ filter: "brightness(1.08) contrast(1.08) sepia(0.32) hue-rotate(-15deg) saturate(1.35)" }}
          />
        </div>
      </div>

      <div
        ref={mistRef}
        className="pointer-events-none absolute inset-x-[-18%] bottom-[-10%] z-30 flex w-[175%] origin-bottom scale-[1.05] will-change-transform sm:bottom-[-16%] sm:w-[145%]"
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`relative h-[40vh] w-[46%] shrink-0 sm:h-[42vh] ${i > 0 ? "-ml-[22%]" : ""} ${i % 2 === 1 ? "translate-y-4" : "-translate-y-1"} ${i >= 2 ? "scale-115" : ""} ${i === 3 ? "-translate-x-[6%]" : ""} ${i >= 4 ? "max-sm:block hidden" : ""}`}
          >
            <Image
              src={i % 2 === 1 ? "/hero/cloud-single.png" : "/hero/cloud-2.png"}
              alt=""
              fill
              priority
              sizes="40vw"
              className={`object-contain object-bottom select-none ${i % 2 === 1 ? "-scale-x-100" : ""}`}
              style={{ filter: "brightness(1.1) contrast(1.1) sepia(0.35) hue-rotate(-15deg) saturate(1.4)" }}
            />
          </div>
        ))}
      </div>

      <div
        ref={bbcWrapRef}
        className="pointer-events-none absolute inset-x-0 top-[28%] z-[35] flex justify-center overflow-visible opacity-0 will-change-transform sm:top-[30%]"
        aria-hidden
      >
        <div
          ref={bbcStrokeRef}
          className="relative overflow-visible font-sans text-[38vw] font-bold leading-[0.92] tracking-tighter sm:text-[24vw] lg:text-[20vw]"
          style={{ clipPath: BBC_CLIP_HIDDEN }}
        >
          <span
            className="absolute inset-0 block py-[0.1em] pl-[0.14em] pr-[0.28em]"
            style={{
              WebkitMaskImage:
                "radial-gradient(ellipse 120% 95% at 48% 50%, #000 42%, transparent 88%)",
              maskImage:
                "radial-gradient(ellipse 120% 95% at 48% 50%, #000 42%, transparent 88%)",
            }}
          >
            <span
              ref={bbcFillRef}
              className="block text-transparent"
              style={{
                backgroundImage: "url('/hero/buildings.webp')",
                backgroundRepeat: "no-repeat",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              BBC
            </span>
          </span>
          <span className="relative block py-[0.1em] pl-[0.14em] pr-[0.28em] text-transparent drop-shadow-[0_10px_32px_rgba(40,20,10,0.3)] [-webkit-text-fill-color:transparent] [-webkit-text-stroke:2px_#00639e]">
            BBC
          </span>
        </div>
      </div>
    </section>
  );
}

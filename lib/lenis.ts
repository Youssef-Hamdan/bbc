import type Lenis from "lenis";

let instance: Lenis | undefined;

export function setAppLenis(lenis: Lenis | undefined) {
  instance = lenis;
}

export function getAppLenis() {
  return instance;
}

"use client";

import { Suspense, useCallback, useEffect, useLayoutEffect, useState, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls, useGLTF } from "@react-three/drei";
import { Box3, Vector3, type Group } from "three";
import { getAppLenis } from "@/lib/lenis";
import { cn } from "@/lib/utils";

const DESKTOP_SRC = "/residence-r-plus-4.glb";
const MOBILE_QUERY = "(max-width: 768px), (pointer: coarse)";
const TARGET_SIZE = 1.55;
const DEFAULT_CAMERA_POSITION = [2.56, 3.13, 2.56] as [number, number, number];
const DEFAULT_CAMERA_TARGET = [0, 0.32, 0] as [number, number, number];
const DEG = Math.PI / 180;

function orbitLimits(
  position: [number, number, number],
  target: [number, number, number],
  yawDeg = 90,
  pitchUpDeg = 90,
) {
  const offsetX = position[0] - target[0];
  const offsetY = position[1] - target[1];
  const offsetZ = position[2] - target[2];
  const azimuth = Math.atan2(offsetX, offsetZ);
  const radius = Math.hypot(offsetX, offsetY, offsetZ);
  const polar = Math.acos(Math.min(1, Math.max(-1, offsetY / radius)));
  const yaw = yawDeg * DEG;
  const pitchUp = pitchUpDeg * DEG;

  return {
    minAzimuthAngle: azimuth - yaw,
    maxAzimuthAngle: azimuth + yaw,
    minPolarAngle: Math.max(0, polar - pitchUp),
    maxPolarAngle: polar,
  };
}

function pausePageScroll() {
  getAppLenis()?.stop();
}

function resumePageScroll() {
  getAppLenis()?.start();
}

function RenderWhenReady() {
  const invalidate = useThree((state) => state.invalidate);
  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => invalidate());
    return () => cancelAnimationFrame(frame);
  });
  return null;
}

function FittedModel({ src }: { src: string }) {
  const { scene } = useGLTF(src, true, true);
  const groupRef = useRef<Group>(null);
  const invalidate = useThree((state) => state.invalidate);

  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    group.position.set(0, 0, 0);
    group.scale.set(1, 1, 1);
    group.updateWorldMatrix(true, true);

    const box = new Box3().setFromObject(scene, true);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const longest = Math.max(size.x, size.y, size.z, 0.0001);
    const scale = TARGET_SIZE / longest;

    group.scale.setScalar(scale);
    group.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
    invalidate();
  }, [scene, invalidate]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

function ModelSpinner() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 grid place-items-center"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading model</span>
      <span className="h-9 w-9 animate-spin rounded-full border-[1.5px] border-foreground/15 border-t-foreground" />
    </div>
  );
}

function ReadySignal({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    let frame2 = 0;
    const frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(onReady);
    });
    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
    };
  }, [onReady]);
  return null;
}

export function preloadProjectModel(src: string, mobileSrc?: string) {
  if (typeof window === "undefined") return;
  useGLTF.preload(src, true, true);
  if (mobileSrc) useGLTF.preload(mobileSrc, true, true);
}

export function ProjectModel({
  src = DESKTOP_SRC,
  mobileSrc,
  cameraPosition = DEFAULT_CAMERA_POSITION,
  cameraTarget = DEFAULT_CAMERA_TARGET,
  yaw = 90,
  pitchUp = 90,
  priority = false,
  className = "h-[min(44vh,440px)] w-[min(82vw,520px)]",
}: {
  src?: string;
  mobileSrc?: string;
  cameraPosition?: [number, number, number];
  cameraTarget?: [number, number, number];
  yaw?: number;
  pitchUp?: number;
  priority?: boolean;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const loadedSrcs = useRef(new Set<string>());
  const [visible, setVisible] = useState(priority);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [pending, setPending] = useState(true);

  useLayoutEffect(() => {
    setIsMobile(window.matchMedia(MOBILE_QUERY).matches);
  }, []);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const sync = () => setIsMobile(media.matches);
    media.addEventListener("change", sync);

    if (priority) {
      return () => media.removeEventListener("change", sync);
    }

    const node = rootRef.current;
    if (!node) return () => media.removeEventListener("change", sync);

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "0px", threshold: 0.15 },
    );
    observer.observe(node);
    return () => {
      media.removeEventListener("change", sync);
      observer.disconnect();
    };
  }, [priority]);

  const modelSrc = isMobile ? (mobileSrc ?? src) : src;
  const ready = visible && isMobile !== null;

  useLayoutEffect(() => {
    if (!ready) return;
    useGLTF.preload(modelSrc, true, true);
    setPending(!loadedSrcs.current.has(modelSrc));
  }, [ready, modelSrc]);

  const markReady = useCallback(() => {
    loadedSrcs.current.add(modelSrc);
    setPending(false);
  }, [modelSrc]);

  return (
    <div
      ref={rootRef}
      className={cn("relative pointer-events-auto touch-none", className)}
      onPointerDown={(event) => {
        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);
        pausePageScroll();
      }}
      onPointerUp={resumePageScroll}
      onPointerCancel={resumePageScroll}
      onLostPointerCapture={resumePageScroll}
    >
      {pending ? <ModelSpinner /> : null}
      {ready ? (
        <Canvas
          key={`${modelSrc}:${cameraPosition.join(",")}:${cameraTarget.join(",")}`}
          camera={{ position: cameraPosition, fov: 30 }}
          dpr={[1, 1.5]}
          gl={{
            alpha: true,
            antialias: !isMobile,
            powerPreference: isMobile ? "low-power" : "high-performance",
            stencil: false,
          }}
        >
          <ambientLight intensity={0.9} />
          <directionalLight position={[2, 5, 5]} intensity={1.35} />
          <directionalLight position={[-3, 2, 2]} intensity={0.3} />
          <Suspense fallback={null}>
            <FittedModel src={modelSrc} />
            {!isMobile ? (
              <ContactShadows
                position={[0, 0, 0]}
                opacity={0.22}
                scale={2.4}
                blur={2.2}
                far={1.4}
              />
            ) : null}
            <OrbitControls
              key={modelSrc}
              makeDefault
              target={cameraTarget}
              enableDamping
              dampingFactor={0.08}
              enablePan={false}
              enableZoom={false}
              {...orbitLimits(cameraPosition, cameraTarget, yaw, pitchUp)}
            />
            <ReadySignal onReady={markReady} />
            <RenderWhenReady />
          </Suspense>
        </Canvas>
      ) : null}
    </div>
  );
}

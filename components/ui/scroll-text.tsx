"use client";

import { cn } from "@/lib/utils";
import { type HTMLMotionProps, type Variants, motion } from "motion/react";
import type React from "react";
import type { JSX } from "react";

type Direction = "up" | "down" | "left" | "right";

const defaultStagger = 0.1;

const generateVariants = (direction: Direction): Variants => {
  const offset = direction === "right" || direction === "down" ? 100 : -100;
  const hidden =
    direction === "left" || direction === "right"
      ? { x: offset }
      : { y: offset };

  return {
    hidden: {
      filter: "blur(10px)",
      opacity: 0,
      ...hidden,
    },
    visible: {
      filter: "blur(0px)",
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };
};

const defaultViewport = { amount: 0.3, margin: "0px 0px 0px 0px" };

export default function TextAnimation({
  as = "h1",
  text,
  classname = "",
  viewport = defaultViewport,
  variants,
  direction = "down",
  letterAnime = false,
  lineAnime = false,
  stagger = defaultStagger,
}: {
  text: string;
  classname?: string;
  as?: keyof JSX.IntrinsicElements;
  viewport?: {
    amount?: number;
    margin?: string;
    once?: boolean;
  };
  variants?: Variants;
  direction?: Direction;
  letterAnime?: boolean;
  lineAnime?: boolean;
  stagger?: number;
}) {
  const modifiedVariants = variants ?? generateVariants(direction);
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
      },
    },
  };

  const MotionComponent = motion[as as keyof typeof motion] as React.ComponentType<
    HTMLMotionProps<any>
  >;

  return (
    <MotionComponent
      whileInView="visible"
      initial="hidden"
      variants={containerVariants}
      viewport={viewport}
      className={cn("inline-block text-foreground", classname)}
    >
      {lineAnime ? (
        <motion.span className="inline-block" variants={modifiedVariants}>
          {text}
        </motion.span>
      ) : (
        text.split(" ").map((word: string, index: number) => (
          <motion.span
            key={`${word}-${index}`}
            className="inline-block"
            variants={letterAnime ? undefined : modifiedVariants}
          >
            {letterAnime ? (
              <>
                {word.split("").map((letter: string, letterIndex: number) => (
                  <motion.span
                    key={letterIndex}
                    className="inline-block"
                    variants={modifiedVariants}
                  >
                    {letter}
                  </motion.span>
                ))}
                &nbsp;
              </>
            ) : (
              <>{word}&nbsp;</>
            )}
          </motion.span>
        ))
      )}
    </MotionComponent>
  );
}

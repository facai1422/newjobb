"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

interface RevealTextProps {
  text: string;
  textColor?: string;
  overlayColor?: string;
  fontSize?: string;
  letterDelay?: number;
  overlayDelay?: number;
  overlayDuration?: number;
  springDuration?: number;
  letterImages?: string[];
}

export const RevealText: React.FC<RevealTextProps> = ({
  text,
  textColor = "text-gray-800",
  overlayColor = "text-yellow-400",
  fontSize = "text-4xl",
  letterDelay = 0.1,
  overlayDelay = 0.08,
  overlayDuration = 0.5,
  springDuration = 800,
  letterImages = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });
  const mainControls = useAnimation();
  const overlayControls = useAnimation();
  const [letters, setLetters] = useState<string[]>([]);

  useEffect(() => {
    setLetters(text.split(""));
  }, [text]);

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
      overlayControls.start("visible");
    }
  }, [isInView, mainControls, overlayControls]);

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        duration: springDuration / 1000,
        bounce: 0.4
      }
    }
  };

  const overlayVariants = {
    hidden: { 
      opacity: 0,
      scale: 1.2
    },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: {
        duration: overlayDuration,
        ease: "easeOut"
      }
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      <motion.div
        className={`${fontSize} font-bold ${textColor} relative z-10`}
        initial="hidden"
        animate={mainControls}
        variants={{
          visible: {
            transition: {
              staggerChildren: letterDelay,
            },
          },
        }}
      >
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            className="inline-block relative"
            style={{
              backgroundImage: letterImages[index % letterImages.length] 
                ? `url(${letterImages[index % letterImages.length]})` 
                : undefined,
              backgroundSize: "cover",
              backgroundClip: letterImages[index % letterImages.length] ? "text" : undefined,
              WebkitBackgroundClip: letterImages[index % letterImages.length] ? "text" : undefined,
              color: letterImages[index % letterImages.length] ? "transparent" : undefined,
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.div>
      
      <motion.div
        className={`absolute inset-0 ${fontSize} font-bold ${overlayColor} z-20 pointer-events-none`}
        initial="hidden"
        animate={overlayControls}
        variants={{
          visible: {
            transition: {
              staggerChildren: overlayDelay,
              delayChildren: 0.2,
            },
          },
        }}
      >
        {letters.map((letter, index) => (
          <motion.span
            key={`overlay-${index}`}
            variants={overlayVariants}
            className="inline-block"
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};
import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedHeaderBgProps {
  className?: string;
  gradient?: boolean;
  blur?: boolean;
  height?: string;
}

const AnimatedHeaderBg = React.forwardRef<HTMLDivElement, AnimatedHeaderBgProps>(
  (
    {
      className,
      gradient = true,
      blur = true,
      height = "h-32",
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative z-[100] flex w-full items-center justify-center overflow-hidden bg-transparent",
          height,
          className,
        )}
        {...props}
      >
        {gradient && (
          <div className="absolute top-0 isolate z-0 flex w-full flex-1 items-start justify-center">
            {blur && (
              <div className="absolute top-0 z-50 h-full w-full bg-transparent opacity-10 backdrop-blur-md" />
            )}

            {/* Main glow */}
            <div className="absolute inset-auto z-50 h-24 w-[20rem] -translate-y-[-30%] rounded-full bg-blue-400/60 opacity-80 blur-3xl" />

            {/* Lamp effect */}
            <motion.div
              initial={{ width: "6rem" }}
              viewport={{ once: true }}
              transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
              whileInView={{ width: "12rem" }}
              className="absolute top-0 z-30 h-24 -translate-y-[20%] rounded-full bg-blue-400/60 blur-2xl"
            />

            {/* Top line */}
            <motion.div
              initial={{ width: "10rem" }}
              viewport={{ once: true }}
              transition={{ ease: "easeInOut", delay: 0.3, duration: 0.8 }}
              whileInView={{ width: "20rem" }}
              className="absolute inset-auto z-50 h-0.5 -translate-y-[-10%] bg-blue-400/80"
            />

            {/* Left gradient cone */}
            <motion.div
              initial={{ opacity: 0.3, width: "10rem" }}
              whileInView={{ opacity: 0.6, width: "20rem" }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              style={{
                backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
              }}
              className="absolute inset-auto right-1/2 h-32 overflow-visible w-[20rem] bg-gradient-conic from-blue-500/30 via-transparent to-transparent [--conic-position:from_70deg_at_center_top]"
            >
              <div className="absolute w-[100%] left-0 bg-transparent h-20 bottom-0 z-20 [mask-image:linear-gradient(to_top,transparent,transparent)]" />
              <div className="absolute w-20 h-[100%] left-0 bg-transparent bottom-0 z-20 [mask-image:linear-gradient(to_right,transparent,transparent)]" />
            </motion.div>

            {/* Right gradient cone */}
            <motion.div
              initial={{ opacity: 0.3, width: "10rem" }}
              whileInView={{ opacity: 0.6, width: "20rem" }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              style={{
                backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
              }}
              className="absolute inset-auto left-1/2 h-32 w-[20rem] bg-gradient-conic from-transparent via-transparent to-blue-500/30 [--conic-position:from_290deg_at_center_top]"
            >
              <div className="absolute w-20 h-[100%] right-0 bg-transparent bottom-0 z-20 [mask-image:linear-gradient(to_left,transparent,transparent)]" />
              <div className="absolute w-[100%] right-0 bg-transparent h-20 bottom-0 z-20 [mask-image:linear-gradient(to_top,transparent,transparent)]" />
            </motion.div>
          </div>
        )}
      </div>
    )
  },
)
AnimatedHeaderBg.displayName = "AnimatedHeaderBg"

export { AnimatedHeaderBg }

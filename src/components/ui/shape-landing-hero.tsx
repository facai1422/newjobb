"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Circle } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Component as ImageAutoSlider } from "@/components/ui/image-auto-slider";
import { SplitText } from "@/components/ui/split-text";
import { useLanguage } from "@/i18n/LanguageContext";


function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
}: {
    className?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    gradient?: string;
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                style={{
                    width,
                    height,
                }}
                className="relative"
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r to-transparent",
                        gradient,
                        "backdrop-blur-[2px] border-2 border-white/[0.15]",
                        "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
                        "after:absolute after:inset-0 after:rounded-full",
                        "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
                    )}
                />
            </motion.div>
        </motion.div>
    );
}

function HeroGeometric({
    badge = "Hirely",
    title1 = "Find Your Next",
    title2 = "Career Opportunity",
    compact = false,
    className,
}: {
    badge?: string;
    title1?: string;
    title2?: string;
    compact?: boolean;
    className?: string;
}) {
    const { t } = useLanguage();
    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.5 + i * 0.2,
                ease: [0.25, 0.4, 0.25, 1],
            },
        }),
    };

    return (
        <div className={cn(
            "relative w-full flex items-start justify-center overflow-hidden bg-transparent pt-20 md:pt-32",
            compact ? "min-h-[60vh]" : "min-h-[80vh]",
            className
        )}>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

            {/* 简化背景装饰 - 移除重型动画但保持美观 */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute left-[-10%] md:left-[-5%] top-[15%] md:top-[20%] w-[600px] h-[140px] rounded-full bg-gradient-to-r from-indigo-500/[0.08] to-transparent border border-white/5 blur-sm opacity-60" />
                <div className="absolute right-[-5%] md:right-[0%] top-[70%] md:top-[75%] w-[500px] h-[120px] rounded-full bg-gradient-to-r from-rose-500/[0.08] to-transparent border border-white/5 blur-sm opacity-50" />
                <div className="absolute left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%] w-[300px] h-[80px] rounded-full bg-gradient-to-r from-violet-500/[0.08] to-transparent border border-white/5 blur-sm opacity-40" />
                <div className="absolute right-[15%] md:right-[20%] top-[10%] md:top-[15%] w-[200px] h-[60px] rounded-full bg-gradient-to-r from-amber-500/[0.08] to-transparent border border-white/5 blur-sm opacity-30" />
                <div className="absolute left-[20%] md:left-[25%] top-[5%] md:top-[10%] w-[150px] h-[40px] rounded-full bg-gradient-to-r from-cyan-500/[0.08] to-transparent border border-white/5 blur-sm opacity-35" />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6 -mt-144 md:-mt-160">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        custom={0}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12"
                    >
                        <Circle className="h-2 w-2 fill-rose-500/80" />
                        <span className="text-sm text-white/60 tracking-wide">
                            {badge}
                        </span>
                    </motion.div>

                    <motion.div
                        custom={1}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <h1 className={cn(
                            "font-bold mb-6 md:mb-8 tracking-tight",
                            compact ? "text-3xl sm:text-4xl md:text-5xl" : "text-4xl sm:text-6xl md:text-8xl"
                        )}>
                            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                                {title1}
                            </span>
                            <br />
                            <span
                                className={cn(
                                    "bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 "
                                )}
                            >
                                {title2}
                            </span>
                        </h1>
                    </motion.div>

                    <motion.div
                        custom={2}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <p className={cn(
                            "text-white/40 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4",
                            compact ? "text-sm sm:text-base" : "text-base sm:text-lg md:text-xl"
                        )}>
                            Connect with top companies worldwide and discover your perfect role. 
                            Start your career journey today.
                        </p>
                    </motion.div>

                    {/* 图片自动滚动组件 - 添加在标题文字下方 */}
                    <motion.div
                        custom={3}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="mt-12 md:mt-16"
                    >
                        <div className="w-full max-w-5xl mx-auto">
                            <ImageAutoSlider />
                        </div>
                    </motion.div>

                    {/* 招聘文字动画 - 减少间距 */}
                    <motion.div
                        custom={4}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="mt-6 md:mt-8 mb-0"
                    >
                        <div className="w-full max-w-4xl mx-auto px-4">
                            <SplitText
                                text={t('recruitment.title') || '寻找理想工作机会 连接优秀企业与人才 专业招聘服务平台为您开启职业新篇章'}
                                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center text-white leading-relaxed break-words whitespace-normal"
                                delay={30}
                                animationFrom={{ opacity: 0, transform: 'translate3d(0, 40px, 0)' }}
                                animationTo={{ opacity: 1, transform: 'translate3d(0, 0, 0)' }}
                                easing="easeOutCubic"
                                threshold={0.2}
                                rootMargin="-50px"
                                textAlign="center"
                            />
                        </div>
                    </motion.div>

                </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none" />
        </div>
    );
}

export { HeroGeometric }
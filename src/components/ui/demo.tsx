"use client";

import { Search, Gift } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect"; // 重新启用但禁用动画
import { cn } from "@/lib/utils";

export function GlowingEffectDemo() {
  const handleOpenLottery = () => {
    window.location.href = '/lottery';
  };

  return (
    <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-2 lg:gap-6">
      <GridItem
        area=""
        icon={<Gift className="h-5 w-5 text-purple-400" />}
        title="Invite Friends"
        description="Invite your friends to join our platform and get exclusive lottery wheel opportunities! Share with friends and win amazing prizes together."
        hasButton={true}
        buttonText="🎰 Lucky Wheel"
        onButtonClick={handleOpenLottery}
      />
      <GridItem
        area=""
        icon={<Search className="h-5 w-5 text-blue-400" />}
        title="Smart Job Search"
        description="Advanced AI-powered job search engine that matches you with perfect career opportunities based on your skills and preferences."
      />
    </ul>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  hasButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
}

const GridItem = ({ area, icon, title, description, hasButton, buttonText, onButtonClick }: GridItemProps) => {
  return (
    <li className={cn("min-h-[16rem] list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-gray-700 p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow={false}
          disabled={true}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col rounded-xl border-[0.75px] bg-gray-900 p-4 md:p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] hover:bg-gray-800 transition-colors">
          <div className="flex-1 flex flex-col gap-4">
            <div className="w-fit rounded-lg border-[0.75px] border-gray-600 bg-gray-800 p-2">
              {icon}
            </div>
            <div className="flex-1 space-y-3">
              <h3 className="pt-0.5 text-lg leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-xl md:leading-[1.875rem] text-balance text-white">
                {title}
              </h3>
              <p className="font-sans text-sm leading-[1.125rem] md:text-sm md:leading-[1.25rem] text-gray-300">
                {description}
              </p>
            </div>
          </div>
          {hasButton && buttonText && onButtonClick && (
            <div className="mt-4 pt-2">
              <button
                onClick={onButtonClick}
                className="w-full px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-sm rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
              >
                {buttonText}
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
};



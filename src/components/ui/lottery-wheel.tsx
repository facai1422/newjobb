"use client";
import React from "react";
import { ContainerScroll } from "./container-scroll-animation";
import { RevealText } from "./reveal-text";
import { useLanguage } from "@/i18n/LanguageContext";

export const LotteryWheel = () => {
  const { t } = useLanguage();

  return (
    <ContainerScroll
      titleComponent={
        <>
          <h1 className="text-4xl font-semibold text-white mb-8">
            {t('lottery.inviteFriends') || '邀请好友加入'}
          </h1>
          <div className="mb-8">
            <RevealText 
              text={t('lottery.spinWheel') || '转盘抽奖'}
              textColor="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
              overlayColor="text-yellow-400"
              fontSize="text-[3rem] md:text-[6rem]"
              letterDelay={0.1}
              overlayDelay={0.08}
              overlayDuration={0.5}
              springDuration={800}
            />
          </div>
          <p className="text-xl md:text-2xl text-white/80 mt-6 max-w-2xl mx-auto">
            {t('lottery.shareWithFriends') || '分享给朋友，一起赢取丰厚奖品！'}
          </p>
        </>
      }
    >
      <div className="h-full w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 animate-pulse"></div>
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
        
        {/* Main lottery wheel container */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg">
          
          {/* Lottery Wheel */}
          <div className="relative w-80 h-80 md:w-96 md:h-96 mb-8">
            
            {/* Pointer/Arrow */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-20">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-400 drop-shadow-lg"></div>
            </div>
            
            {/* Spinning wheel */}
            <div className="relative w-full h-full rounded-full border-8 border-yellow-400 shadow-2xl hover:animate-spin-slow bg-gradient-to-br from-white to-gray-100">
              
              {/* Wheel segments */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <style jsx>{`
                  .segment-1 { clip-path: polygon(50% 50%, 50% 0%, 87.5% 12.5%); }
                  .segment-2 { clip-path: polygon(50% 50%, 87.5% 12.5%, 100% 50%); }
                  .segment-3 { clip-path: polygon(50% 50%, 100% 50%, 87.5% 87.5%); }
                  .segment-4 { clip-path: polygon(50% 50%, 87.5% 87.5%, 50% 100%); }
                  .segment-5 { clip-path: polygon(50% 50%, 50% 100%, 12.5% 87.5%); }
                  .segment-6 { clip-path: polygon(50% 50%, 12.5% 87.5%, 0% 50%); }
                  .segment-7 { clip-path: polygon(50% 50%, 0% 50%, 12.5% 12.5%); }
                  .segment-8 { clip-path: polygon(50% 50%, 12.5% 12.5%, 50% 0%); }
                `}</style>
                {/* Segment 1 - 现金红包 */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 segment-1">
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center">
                    <div className="text-2xl">💰</div>
                    <div className="text-xs text-white font-bold">现金</div>
                  </div>
                </div>
                
                {/* Segment 2 - 面试直通 */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 segment-2">
                  <div className="absolute top-1/4 right-12 text-center">
                    <div className="text-2xl">🎯</div>
                    <div className="text-xs text-white font-bold">面试</div>
                  </div>
                </div>
                
                {/* Segment 3 - 数码产品 */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 segment-3">
                  <div className="absolute bottom-12 right-1/4 text-center">
                    <div className="text-2xl">📱</div>
                    <div className="text-xs text-white font-bold">数码</div>
                  </div>
                </div>
                
                {/* Segment 4 - VIP会员 */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 segment-4">
                  <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center">
                    <div className="text-2xl">🏆</div>
                    <div className="text-xs text-white font-bold">VIP</div>
                  </div>
                </div>
                
                {/* Segment 5 - 优惠券 */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-600 segment-5">
                  <div className="absolute bottom-1/4 left-12 text-center">
                    <div className="text-2xl">🎫</div>
                    <div className="text-xs text-white font-bold">优惠</div>
                  </div>
                </div>
                
                {/* Segment 6 - 内推机会 */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-pink-600 segment-6">
                  <div className="absolute top-1/3 left-8 text-center">
                    <div className="text-2xl">🚀</div>
                    <div className="text-xs text-white font-bold">内推</div>
                  </div>
                </div>
                
                {/* Segment 7 - 培训课程 */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 segment-7">
                  <div className="absolute top-12 left-1/4 text-center">
                    <div className="text-2xl">📚</div>
                    <div className="text-xs text-white font-bold">课程</div>
                  </div>
                </div>
                
                {/* Segment 8 - 再来一次 */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 segment-8">
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
                    <div className="text-2xl">🔄</div>
                    <div className="text-xs text-white font-bold">再抽</div>
                  </div>
                </div>
              </div>
              
              {/* Center circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full shadow-lg flex items-center justify-center border-4 border-white">
                <span className="text-2xl">🎲</span>
              </div>
            </div>
          </div>
          
          {/* Spin Button */}
          <button className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white font-bold py-4 px-8 rounded-full text-xl shadow-2xl hover:shadow-yellow-500/50 transform hover:scale-105 transition-all duration-300 border-4 border-yellow-300">
            🎯 {t('lottery.startDraw') || '开始抽奖'} 🎯
          </button>
          
          {/* Prize info */}
          <div className="mt-6 text-center">
            <p className="text-white/80 text-sm mb-2">
              {t('lottery.inviteToWin') || '邀请好友注册即可获得抽奖机会'}
            </p>
            <p className="text-yellow-400 font-semibold">
              {t('lottery.dailyLimit') || '每日限抽3次'}
            </p>
          </div>
        </div>
      </div>
    </ContainerScroll>
  );
};

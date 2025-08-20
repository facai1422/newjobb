"use client";
import React, { useState } from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { useLanguage } from "@/i18n/LanguageContext";

export function WheelScrollDemo() {
  const { t } = useLanguage();
  const [isSpinning, setIsSpinning] = useState(false);

  const prizes = [
    { name: t('lottery.prizes.cash') || '现金红包', emoji: '💰', color: 'from-red-500 to-red-600' },
    { name: t('lottery.prizes.interview') || '面试直通', emoji: '🎯', color: 'from-blue-500 to-blue-600' },
    { name: t('lottery.prizes.digital') || '数码产品', emoji: '📱', color: 'from-green-500 to-green-600' },
    { name: t('lottery.prizes.vip') || 'VIP会员', emoji: '🏆', color: 'from-purple-500 to-purple-600' },
    { name: t('lottery.prizes.coupon') || '优惠券', emoji: '🎫', color: 'from-yellow-500 to-yellow-600' },
    { name: t('lottery.prizes.referral') || '内推机会', emoji: '🚀', color: 'from-pink-500 to-pink-600' },
    { name: t('lottery.prizes.course') || '培训课程', emoji: '📚', color: 'from-indigo-500 to-indigo-600' },
    { name: t('lottery.prizes.tryAgain') || '再来一次', emoji: '🔄', color: 'from-orange-500 to-orange-600' }
  ];

  const getSegmentPosition = (index: number) => {
    const positions = [
      'top-12 left-1/2 transform -translate-x-1/2',
      'top-1/4 right-12',
      'bottom-12 right-1/4',
      'bottom-12 left-1/2 transform -translate-x-1/2',
      'bottom-1/4 left-12',
      'top-1/3 left-8',
      'top-12 left-1/4',
      'top-8 left-1/2 transform -translate-x-1/2'
    ];
    return positions[index] || '';
  };

  const handleSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    
    // 模拟转盘旋转
    setTimeout(() => {
      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
      setIsSpinning(false);
      alert(`🎉 恭喜您获得: ${randomPrize.name}! ${randomPrize.emoji}`);
    }, 3000);
  };

  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              {t('lottery.inviteFriends') || '邀请好友加入'}
            </h1>
            <div className="mb-6">
              <span className="text-4xl md:text-[6rem] font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent leading-none">
                {t('lottery.spinWheel') || '转盘抽奖'}
              </span>
            </div>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              {t('lottery.shareWithFriends') || '分享给朋友，一起赢取丰厚奖品！'}
            </p>
          </>
        }
      >
        <div className="mx-auto w-full h-full bg-gradient-to-br from-slate-800 via-purple-900 to-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 animate-pulse rounded-2xl"></div>
          <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-10 w-16 h-16 bg-blue-400/20 rounded-full blur-lg"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-pink-400/20 rounded-full blur-xl"></div>
          
          {/* Main content */}
          <div className="relative z-10 w-full max-w-md mx-auto">
            {/* Custom Wheel */}
            <div className="relative w-80 h-80 mx-auto mb-8">
              
              {/* Pointer/Arrow */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-20">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-400 drop-shadow-lg"></div>
              </div>
              
              {/* Spinning wheel */}
              <div className={`relative w-full h-full rounded-full border-8 border-yellow-400 shadow-2xl bg-gradient-to-br from-white to-gray-100 transition-transform duration-3000 ${isSpinning ? 'animate-spin' : ''}`}>
                
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
                  
                  {prizes.map((prize, index) => (
                    <div key={index} className={`absolute inset-0 bg-gradient-to-r ${prize.color} segment-${index + 1}`}>
                      <div className={`absolute ${getSegmentPosition(index)} text-center`}>
                        <div className="text-2xl mb-1">{prize.emoji}</div>
                        <div className="text-xs text-white font-bold">{prize.name.split(' ')[0]}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Center circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full shadow-lg flex items-center justify-center border-4 border-white">
                  <span className="text-2xl">🎲</span>
                </div>
              </div>
            </div>
            
            {/* Spin Button */}
            <button 
              onClick={handleSpin}
              disabled={isSpinning}
              className={`bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white font-bold py-4 px-8 rounded-full text-xl shadow-2xl hover:shadow-yellow-500/50 transform hover:scale-105 transition-all duration-300 border-4 border-yellow-300 ${isSpinning ? 'animate-pulse cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
            >
              {isSpinning ? '🎲 转盘旋转中...' : `🎯 ${t('lottery.startDraw') || '开始抽奖'} 🎯`}
            </button>
          </div>

          {/* Prize info */}
          <div className="mt-8 text-center relative z-10">
            <p className="text-white/90 text-sm mb-3 font-medium">
              {t('lottery.inviteToWin') || '邀请好友注册即可获得抽奖机会'}
            </p>
            <p className="text-yellow-400 font-bold text-lg bg-black/20 px-4 py-2 rounded-full border border-yellow-400/30">
              {t('lottery.dailyLimit') || '每日限抽3次'}
            </p>
          </div>

          {/* Additional info */}
          <div className="mt-6 grid grid-cols-2 gap-4 text-center relative z-10">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <div className="text-2xl mb-1">🎁</div>
              <div className="text-white/80 text-xs">丰富奖品</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <div className="text-2xl mb-1">👥</div>
              <div className="text-white/80 text-xs">邀请好友</div>
            </div>
          </div>
        </div>
      </ContainerScroll>
    </div>
  );
}

import React, { useState, useRef } from 'react';
import { LuckyWheel } from '@lucky-canvas/react';
import { useLanguage } from '@/i18n/LanguageContext';

interface LuckyWheelComponentProps {
  onPrizeWon?: (prize: any) => void;
  disabled?: boolean;
}

export const LuckyWheelComponent: React.FC<LuckyWheelComponentProps> = ({ 
  onPrizeWon, 
  disabled = false 
}) => {
  const { t } = useLanguage();
  const myLucky = useRef<any>();

  // 转盘背景配置
  const [blocks] = useState([
    { padding: '10px', background: '#7c3aed' }
  ]);

  // 奖品配置
  const [prizes] = useState([
    { 
      background: '#a855f7', 
      fonts: [{ text: '10 USDT', fontSize: '14px', fontColor: '#fff', fontWeight: 'bold' }] 
    },
    { 
      background: '#8b5cf6', 
      fonts: [{ text: '5 USDT', fontSize: '14px', fontColor: '#fff', fontWeight: 'bold' }] 
    },
    { 
      background: '#a855f7', 
      fonts: [{ text: 'Thanks', fontSize: '12px', fontColor: '#fff', fontWeight: 'bold' }] 
    },
    { 
      background: '#8b5cf6', 
      fonts: [{ text: '20 USDT', fontSize: '14px', fontColor: '#fff', fontWeight: 'bold' }] 
    },
    { 
      background: '#a855f7', 
      fonts: [{ text: '1 USDT', fontSize: '14px', fontColor: '#fff', fontWeight: 'bold' }] 
    },
    { 
      background: '#8b5cf6', 
      fonts: [{ text: 'Thanks', fontSize: '12px', fontColor: '#fff', fontWeight: 'bold' }] 
    },
    { 
      background: '#a855f7', 
      fonts: [{ text: '50 USDT', fontSize: '14px', fontColor: '#fff', fontWeight: 'bold' }] 
    },
    { 
      background: '#8b5cf6', 
      fonts: [{ text: '2 USDT', fontSize: '14px', fontColor: '#fff', fontWeight: 'bold' }] 
    },
  ]);

  // 按钮配置
  const [buttons] = useState([
    { radius: '45%', background: '#4c1d95' },
    { radius: '40%', background: '#6d28d9' },
    {
      radius: '35%', 
      background: '#7c3aed',
      pointer: true,
      fonts: [{ 
        text: t('lottery.spin') || 'SPIN', 
        fontSize: '16px', 
        fontColor: '#fff', 
        fontWeight: 'bold',
        top: '-8px' 
      }]
    }
  ]);

  const handleStart = () => {
    if (disabled) return;
    
    // 开始转动
    myLucky.current?.play();
    
    // 模拟抽奖结果
    setTimeout(() => {
      // 权重系统：Thanks占60%，小奖品占35%，大奖品占5%
      const rand = Math.random();
      let index;
      
      if (rand < 0.6) {
        // 60% 概率抽中 Thanks
        index = Math.random() < 0.5 ? 2 : 5;
      } else if (rand < 0.95) {
        // 35% 概率抽中小奖品 (1, 2, 5 USDT)
        const smallPrizes = [1, 4, 7]; // 对应 5 USDT, 1 USDT, 2 USDT
        index = smallPrizes[Math.floor(Math.random() * smallPrizes.length)];
      } else {
        // 5% 概率抽中大奖品 (10, 20, 50 USDT)
        const bigPrizes = [0, 3, 6]; // 对应 10 USDT, 20 USDT, 50 USDT
        index = bigPrizes[Math.floor(Math.random() * bigPrizes.length)];
      }
      
      myLucky.current?.stop(index);
    }, 2500);
  };

  const handleEnd = (prize: any) => {
    const prizeText = prize.fonts[0].text;
    
    if (prizeText === 'Thanks') {
      alert(t('lottery.thankYou') || '谢谢参与！继续努力！');
    } else {
      alert(`${t('lottery.congratulations') || '恭喜您抽中'} ${prizeText}!`);
    }
    
    onPrizeWon?.(prize);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4">
        <LuckyWheel
          ref={myLucky}
          width="280px"
          height="280px"
          blocks={blocks}
          prizes={prizes}
          buttons={buttons}
          onStart={handleStart}
          onEnd={handleEnd}
          className={disabled ? 'opacity-50 pointer-events-none' : ''}
        />
      </div>
      
      {disabled && (
        <p className="text-gray-400 text-sm text-center">
          {t('lottery.noChances') || '暂无抽奖机会'}
        </p>
      )}
    </div>
  );
};

export default LuckyWheelComponent;

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

  // 转盘背景配置 - 使用SVG背景
  const [blocks] = useState([
    { 
      padding: '0px', 
      background: 'transparent',
      imgs: [
        {
          src: '/1.svg', // 转盘背景SVG
          width: '100%',
          height: '100%',
          top: '0%',
          left: '0%'
        }
      ]
    }
  ]);

  // 奖品配置
  const [prizes] = useState([
    { 
      background: 'transparent', // 使用透明背景，依赖SVG背景
      fonts: [{ 
        text: '10', 
        fontSize: '16px', 
        fontColor: '#fff', 
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        top: '40%'
      }],
      imgs: [
        {
          src: '/icons8.svg', // USDT图标
          width: '30%',
          height: '30%',
          top: '15%'
        }
      ]
    },
    { 
      background: 'transparent',
      fonts: [{ 
        text: '5', 
        fontSize: '16px', 
        fontColor: '#fff', 
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        top: '40%'
      }],
      imgs: [
        {
          src: '/icons8.svg', // USDT图标
          width: '30%',
          height: '30%',
          top: '15%'
        }
      ]
    },
    { 
      background: 'transparent',
      fonts: [{ 
        text: 'Thanks', 
        fontSize: '14px', 
        fontColor: '#fff', 
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        top: '40%'
      }],
      imgs: [
        {
          src: '/xiexiee.png', // 谢谢图标
          width: '25%',
          height: '25%',
          top: '15%'
        }
      ]
    },
    { 
      background: 'transparent',
      fonts: [{ 
        text: '20', 
        fontSize: '16px', 
        fontColor: '#fff', 
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        top: '40%'
      }],
      imgs: [
        {
          src: '/icons8.svg', // USDT图标
          width: '30%',
          height: '30%',
          top: '15%'
        }
      ]
    },
    { 
      background: 'transparent',
      fonts: [{ 
        text: '1', 
        fontSize: '16px', 
        fontColor: '#fff', 
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        top: '40%'
      }],
      imgs: [
        {
          src: '/icons8.svg', // USDT图标
          width: '30%',
          height: '30%',
          top: '15%'
        }
      ]
    },
    { 
      background: 'transparent',
      fonts: [{ 
        text: 'Thanks', 
        fontSize: '14px', 
        fontColor: '#fff', 
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        top: '40%'
      }],
      imgs: [
        {
          src: '/xiexiee.png', // 谢谢图标
          width: '25%',
          height: '25%',
          top: '15%'
        }
      ]
    },
    { 
      background: 'transparent',
      fonts: [{ 
        text: '50', 
        fontSize: '16px', 
        fontColor: '#fff', 
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        top: '40%'
      }],
      imgs: [
        {
          src: '/icons8.svg', // USDT图标
          width: '30%',
          height: '30%',
          top: '15%'
        }
      ]
    },
    { 
      background: 'transparent',
      fonts: [{ 
        text: '2', 
        fontSize: '16px', 
        fontColor: '#fff', 
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        top: '40%'
      }],
      imgs: [
        {
          src: '/icons8.svg', // USDT图标
          width: '30%',
          height: '30%',
          top: '15%'
        }
      ]
    },
  ]);

  // 按钮配置 - 使用SVG中心按钮
  const [buttons] = useState([
    {
      radius: '60px', 
      background: 'transparent',
      pointer: true,
      imgs: [
        {
          src: '/2.svg', // 中心按钮SVG
          width: '100%',
          height: '100%',
          top: '0%'
        }
      ],
      fonts: [{ 
        text: t('lottery.spin') || 'SPIN', 
        fontSize: '18px', 
        fontColor: '#fff', 
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        top: '0px' 
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
      <div className="mb-4 relative">
        {/* 转盘指针 */}
        <div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none w-12 h-12"
        >
          <img src="/3.svg" alt="pointer" className="w-full h-full" />
        </div>
        
        <LuckyWheel
          ref={myLucky}
          width="350px"
          height="350px"
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

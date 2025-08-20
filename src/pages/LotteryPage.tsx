'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Star, Trophy, Zap, Crown, Diamond, Sparkles, Target, ArrowLeft, Wallet, Copy, DollarSign, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';

// Utility function
const cn = (...classes: (string | undefined | null | boolean)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Text Shimmer Component
interface TextShimmerProps {
  children: string;
  className?: string;
  duration?: number;
}

function TextShimmer({ children, className, duration = 2 }: TextShimmerProps) {
  return (
    <motion.div
      className={cn(
        'relative inline-block bg-[length:250%_100%,auto] bg-clip-text',
        'text-transparent [--base-color:#ffd700] [--base-gradient-color:#ffffff]',
        '[--bg:linear-gradient(90deg,#0000_calc(50%-20px),var(--base-gradient-color),#0000_calc(50%+20px))] [background-repeat:no-repeat,padding-box]',
        className
      )}
      initial={{ backgroundPosition: '100% center' }}
      animate={{ backgroundPosition: '0% center' }}
      transition={{
        repeat: Infinity,
        duration,
        ease: 'linear',
      }}
      style={{
        backgroundImage: `var(--bg), linear-gradient(var(--base-color), var(--base-color))`,
      }}
    >
      {children}
    </motion.div>
  );
}

// Prize Interface
interface Prize {
  id: string;
  name: string;
  amount: number;
  icon: React.ElementType;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  probability: number;
}

// User Data Interface
interface UserData {
  balance: number;
  withdrawableBalance: number;
  freeChances: number;
  bonusChances: number;
  totalInvitations: number;
  withdrawalAddress?: string;
}

// Wheel Component
interface WheelProps {
  prizes: Prize[];
  isSpinning: boolean;
  rotation: number;
  onSpin: () => void;
  disabled: boolean;
}

function Wheel({ prizes, isSpinning, rotation, onSpin, disabled }: WheelProps) {
  const segmentAngle = 360 / prizes.length;

  return (
    <div className="relative flex items-center justify-center">
      {/* 轮盘背景图片 */}
      <motion.div
        className="relative w-96 h-96 rounded-full shadow-2xl shadow-yellow-500/30"
        style={{
          backgroundImage: 'url(/zphd_bj_s3.avif)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        animate={{ rotate: rotation }}
        transition={{ duration: 4, ease: 'easeOut' }}
      >
        {prizes.map((prize, index) => {
          const angle = index * segmentAngle;
          
          return (
            <div
              key={prize.id}
              className="absolute w-full h-full"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              {/* 奖品区域 */}
              <div
                className="absolute flex flex-col items-center justify-center text-center"
                style={{
                  top: '40px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px',
                }}
              >
                {/* 奖品图标 - 金币图标 */}
                <div className="mb-1">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-yellow-300 flex items-center justify-center shadow-md">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
                
                {/* 奖品金额 - 直接显示在轮盘上 */}
                <p 
                  className="text-white font-bold leading-none"
                  style={{
                    fontSize: '12px',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                    transform: 'rotate(0deg)',
                  }}
                >
                  {prize.amount > 0 ? `${prize.amount}` : 'Thanks'}
                </p>
              </div>
            </div>
          );
        })}

        {/* 轮盘中间装饰图片 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full z-10">
          <img 
            src="/zphd_ljcj_s3.avif" 
            alt="轮盘中心装饰" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* SPIN 按钮 - 轮盘中心 */}
        <motion.button
          onClick={onSpin}
          disabled={disabled || isSpinning}
          className={cn(
            'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50',
            'w-20 h-20 rounded-full font-bold text-base',
            'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900',
            'border-4 border-yellow-300 shadow-xl transition-all duration-200',
            'flex items-center justify-center',
            disabled || isSpinning
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:scale-110 hover:shadow-2xl active:scale-95'
          )}
          whileHover={!disabled && !isSpinning ? { scale: 1.1 } : {}}
          whileTap={!disabled && !isSpinning ? { scale: 0.95 } : {}}
        >
          {isSpinning ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-8 h-8" />
            </motion.div>
          ) : (
            'SPIN'
          )}
        </motion.button>
      </motion.div>

      {/* 轮盘指针图片 */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 z-20">
        <img 
          src="/zphd_zz_s1.avif" 
          alt="轮盘指针" 
          className="w-10 h-14 object-contain"
        />
      </div>
    </div>
  );
}

export default function LotteryPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [userData, setUserData] = useState<UserData>({
    balance: 0,
    withdrawableBalance: 0,
    freeChances: 3,
    bonusChances: 0,
    totalInvitations: 0
  });
  const [invitationLink, setInvitationLink] = useState('');

  // USDT图标组件
  const USDTIcon = ({ className }: { className?: string }) => (
    <img src="/icons8.svg" alt="USDT" className={className || "w-6 h-6"} />
  );

  // Better Luck Next Time 图标组件  
  const ThanksIcon = ({ className }: { className?: string }) => (
    <img src="/xiexiee.png" alt="Better Luck Next Time" className={className || "w-6 h-6"} />
  );

  // Icon mapping
  const iconMap = {
    'Gift': Gift,
    'Star': Star,
    'Trophy': Trophy,
    'Zap': Zap,
    'Crown': Crown,
    'Diamond': Diamond,
    'Sparkles': Sparkles,
    'Target': Target,
    'USDT': USDTIcon,
    'Thanks': ThanksIcon,
    'X': Gift
  };

  useEffect(() => {
    loadUserData();
    loadPrizes();
    generateInvitationCode();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // 初始化用户数据
      await supabase.from('user_balances').upsert([{ user_id: user.id }]);
      await supabase.from('user_lottery_chances').upsert([{ user_id: user.id }]);

      // 加载用户数据
      const [balanceResult, chancesResult] = await Promise.all([
        supabase.from('user_balances').select('*').eq('user_id', user.id).single(),
        supabase.from('user_lottery_chances').select('*').eq('user_id', user.id).single()
      ]);

      setUserData({
        balance: balanceResult.data?.balance || 0,
        withdrawableBalance: balanceResult.data?.withdrawable_balance || 0,
        freeChances: chancesResult.data?.free_chances || 3,
        bonusChances: chancesResult.data?.bonus_chances || 0,
        totalInvitations: chancesResult.data?.total_invitations || 0
      });

    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPrizes = async () => {
    try {
      const { data } = await supabase
        .from('lottery_prizes')
        .select('*')
        .eq('is_active', true)
        .order('amount', { ascending: true });

      if (data) {
        const formattedPrizes: Prize[] = data.map(prize => ({
          id: prize.id,
          name: prize.name,
          amount: prize.amount,
          icon: iconMap[prize.icon as keyof typeof iconMap] || Gift,
          color: prize.color,
          rarity: prize.rarity,
          probability: prize.probability
        }));
        setPrizes(formattedPrizes);
      }
    } catch (error) {
      console.error('Error loading prizes:', error);
    }
  };

  const generateInvitationCode = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const code = user.id.substring(0, 8).toUpperCase();
        
        // 生成邀请链接
        const baseUrl = window.location.origin;
        const link = `${baseUrl}/register?ref=${code}`;
        setInvitationLink(link);
      }
    } catch (error) {
      console.error('Error generating invitation code:', error);
    }
  };

  const selectRandomPrize = () => {
    const random = Math.random();
    let cumulative = 0;
    
    for (const prize of prizes) {
      cumulative += prize.probability;
      if (random <= cumulative) {
        return prize;
      }
    }
    
    return prizes[0];
  };

  const handleSpin = async () => {
    const totalChances = userData.freeChances + userData.bonusChances;
    if (isSpinning || totalChances <= 0) return;

    setIsSpinning(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const prize = selectRandomPrize();
      const prizeIndex = prizes.findIndex(p => p.id === prize.id);
      const segmentAngle = 360 / prizes.length;
      const targetAngle = prizeIndex * segmentAngle + segmentAngle / 2;
      const spins = 5;
      const finalRotation = rotation + spins * 360 + (360 - targetAngle);

      setRotation(finalRotation);

      // 记录抽奖结果并更新余额
      if (prize.amount > 0) {
        await supabase.rpc('add_lottery_prize', {
          p_user_id: user.id,
          p_prize_name: prize.name,
          p_prize_amount: prize.amount
        });
      }

      // 更新抽奖次数
      if (userData.freeChances > 0) {
        await supabase
          .from('user_lottery_chances')
          .update({ free_chances: userData.freeChances - 1 })
          .eq('user_id', user.id);
        
        setUserData(prev => ({
          ...prev,
          freeChances: prev.freeChances - 1,
          balance: prev.balance + prize.amount,
          withdrawableBalance: prev.withdrawableBalance + prize.amount
        }));
      } else {
        await supabase
          .from('user_lottery_chances')
          .update({ bonus_chances: userData.bonusChances - 1 })
          .eq('user_id', user.id);
        
        setUserData(prev => ({
          ...prev,
          bonusChances: prev.bonusChances - 1,
          balance: prev.balance + prize.amount,
          withdrawableBalance: prev.withdrawableBalance + prize.amount
        }));
      }

      setTimeout(() => {
        setSelectedPrize(prize);
        setShowResult(true);
        setIsSpinning(false);
      }, 4000);

    } catch (error) {
      console.error('Error during spin:', error);
      setIsSpinning(false);
    }
  };

  const copyInvitationLink = () => {
    navigator.clipboard.writeText(invitationLink);
    alert(t('lottery.inviteSection.linkCopied') || '邀请链接已复制到剪贴板！');
  };

  const totalChances = userData.freeChances + userData.bonusChances;

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Sparkles className="w-8 h-8 animate-spin text-yellow-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>{t('lottery.backToHome') || '返回首页'}</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-400/20 border border-yellow-400/30 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-bold">
                  {userData.balance.toFixed(4)} USDT
                </span>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/withdrawal')}
              disabled={userData.withdrawableBalance < 20}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-all",
                userData.withdrawableBalance >= 20
                  ? "bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              )}
            >
              <DollarSign className="w-4 h-4 inline mr-1" />
              {t('lottery.withdraw') || '提现'}
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <TextShimmer className="text-6xl font-bold mb-4">
              {t('lottery.title') || '幸运转盘'}
            </TextShimmer>
            <p className="text-xl text-gray-300 mb-6">
              {t('lottery.description') || '转动转盘，赢取丰厚奖励！'}
            </p>
            
            <div className="inline-flex items-center bg-gradient-to-r from-yellow-600/20 to-yellow-400/20 border border-yellow-400/30 rounded-full px-6 py-3">
              <Sparkles className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="text-yellow-400 font-bold">
                {t('lottery.spinsLeft') || '剩余次数'}: {totalChances}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Wheel
              prizes={prizes}
              isSpinning={isSpinning}
              rotation={rotation}
              onSpin={handleSpin}
              disabled={totalChances <= 0}
            />
          </motion.div>

          {/* Invitation Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-md w-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6"
          >
            <h3 className="text-xl font-bold text-yellow-400 mb-4 text-center">
              {t('lottery.inviteSection.title') || '邀请好友获得更多机会'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  {t('lottery.inviteSection.codeLabel') || '您的邀请链接'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={invitationLink}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    title={t('lottery.inviteSection.codeLabel') || '您的邀请链接'}
                    aria-label={t('lottery.inviteSection.codeLabel') || '您的邀请链接'}
                  />
                  <button
                    onClick={copyInvitationLink}
                    className="px-3 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                    title={t('lottery.inviteSection.copyLink') || '复制链接'}
                    aria-label={t('lottery.inviteSection.copyLink') || '复制链接'}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">
                  {t('lottery.inviteSection.invitedFriends') || '已邀请好友'}:
                </span>
                <span className="text-yellow-400 font-bold flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {userData.totalInvitations}
                </span>
              </div>

              <p className="text-xs text-gray-500 text-center">
                {t('lottery.inviteSection.description') || '每邀请一个好友注册可获得1次额外抽奖机会'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && selectedPrize && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowResult(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-400 rounded-2xl p-8 max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                <selectedPrize.icon className="w-12 h-12" style={{ color: selectedPrize.color }} />
              </div>

              <TextShimmer className="text-3xl font-bold mb-2">
                {t('lottery.congratulations') || '恭喜获得!'}
              </TextShimmer>

              <h3 className="text-2xl font-bold text-white mb-2">{selectedPrize.name}</h3>
              
              {selectedPrize.amount > 0 && (
                <p className="text-lg text-yellow-400 mb-4">+{selectedPrize.amount} USDT</p>
              )}

              <motion.button
                onClick={() => setShowResult(false)}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 font-bold py-3 px-8 rounded-full hover:from-yellow-300 hover:to-yellow-500 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('lottery.claimReward') || '领取奖励'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Wallet, DollarSign, AlertCircle, CheckCircle, Clock, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';

interface WithdrawalRequest {
  id: string;
  amount: number;
  withdrawal_address: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  admin_notes?: string;
}

interface UserBalance {
  balance: number;
  withdrawable_balance: number;
}

export default function WithdrawalPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userBalance, setUserBalance] = useState<UserBalance>({ balance: 0, withdrawable_balance: 0 });
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form states
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadUserData();
    loadWithdrawalRequests();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: balance } = await supabase
        .from('user_balances')
        .select('balance, withdrawable_balance')
        .eq('user_id', user.id)
        .single();

      if (balance) {
        setUserBalance(balance);
      }

      // 加载保存的提现地址
      const { data: savedAddress } = await supabase
        .from('withdrawal_addresses')
        .select('address')
        .eq('user_id', user.id)
        .eq('address_type', 'USDT')
        .single();

      if (savedAddress) {
        setAddress(savedAddress.address);
      }

    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWithdrawalRequests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setWithdrawalRequests(data);
      }
    } catch (error) {
      console.error('Error loading withdrawal requests:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const withdrawAmount = parseFloat(amount);
      
      if (!address.trim()) {
        setError(t('withdrawal.errors.addressRequired') || '请输入提现地址');
        return;
      }

      if (withdrawAmount < 20) {
        setError(t('withdrawal.errors.minAmount') || '最低提现金额为 20 USDT');
        return;
      }

      if (withdrawAmount > userBalance.withdrawable_balance) {
        setError(t('withdrawal.errors.insufficientBalance') || '余额不足');
        return;
      }

      // 保存/更新提现地址
      await supabase
        .from('withdrawal_addresses')
        .upsert([{
          user_id: user.id,
          address: address,
          address_type: 'USDT',
          updated_at: new Date().toISOString()
        }]);

      // 创建提现申请
      const { error: requestError } = await supabase
        .from('withdrawal_requests')
        .insert([{
          user_id: user.id,
          amount: withdrawAmount,
          withdrawal_address: address,
          status: 'pending'
        }]);

      if (requestError) throw requestError;

      // 重新加载数据
      await loadWithdrawalRequests();
      
      setShowForm(false);
      setAmount('');
      alert(t('withdrawal.requestSubmitted') || '提现申请已提交，请等待审核');
      
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      setError(t('withdrawal.requestFailed') || '提现申请失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'rejected':
        return <X className="w-5 h-5 text-red-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return t('withdrawal.status.pending') || '待审核';
      case 'approved':
        return t('withdrawal.status.approved') || '已通过';
      case 'rejected':
        return t('withdrawal.status.rejected') || '已拒绝';
      default:
        return '未知';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400';
      case 'approved':
        return 'text-green-400';
      case 'rejected':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>{t('withdrawal.backToHome') || '返回首页'}</span>
          </button>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            {t('withdrawal.title') || '提现管理'}
          </h1>
        </div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                {t('withdrawal.accountBalance') || '账户余额'}
              </h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-300">
                    {t('withdrawal.totalBalance') || '总余额'}: 
                  </span>
                  <span className="text-yellow-400 font-bold">{userBalance.balance.toFixed(4)} USDT</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">
                    {t('withdrawal.withdrawableBalance') || '可提现'}: 
                  </span>
                  <span className="text-green-400 font-bold">{userBalance.withdrawable_balance.toFixed(4)} USDT</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowForm(true)}
              disabled={userBalance.withdrawable_balance < 20}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                userBalance.withdrawable_balance >= 20
                  ? 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {t('withdrawal.applyWithdrawal') || '申请提现'}
            </button>
          </div>
          
          {userBalance.withdrawable_balance < 20 && (
            <div className="mt-4 p-3 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 text-sm">
                  {t('withdrawal.minWithdrawal') || '最低提现金额为 20 USDT'}
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Withdrawal History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">
            {t('withdrawal.withdrawalHistory') || '提现记录'}
          </h2>
          
          {withdrawalRequests.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                {t('withdrawal.noRecords') || '暂无提现记录'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {withdrawalRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-gray-800/50 border border-gray-600 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(request.status)}
                      <div>
                        <p className="font-bold text-white">{request.amount.toFixed(4)} USDT</p>
                        <p className="text-sm text-gray-400">
                          {new Date(request.created_at).toLocaleString('zh-CN')}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                      {getStatusText(request.status)}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-400">
                    <p>
                      <span className="font-medium">
                        {t('withdrawal.withdrawalAddress') || '提现地址'}:
                      </span> {request.withdrawal_address}
                    </p>
                    {request.admin_notes && (
                      <p className="mt-2">
                        <span className="font-medium">
                          {t('withdrawal.notes') || '备注'}:
                        </span> {request.admin_notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Withdrawal Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-400 rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                {t('withdrawal.applyWithdrawal') || '申请提现'}
              </h3>
              
              <div className="mb-6 p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  {t('withdrawal.withdrawableBalance') || '可提现余额'}: {userBalance.withdrawable_balance.toFixed(4)} USDT
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {t('withdrawal.minWithdrawal') || '最低提现金额: 20 USDT'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-white mb-2">
                    {t('withdrawal.amount') || '提现金额 (USDT)'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="20"
                    max={userBalance.withdrawable_balance}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                    placeholder={t('withdrawal.enterAmount') || '输入提现金额'}
                    required
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">
                    {t('withdrawal.usdtAddress') || 'USDT 地址'}
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:outline-none"
                    placeholder={t('withdrawal.enterAddress') || '输入 USDT 钱包地址'}
                    required
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    {t('withdrawal.cancel') || '取消'}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 font-bold rounded-lg hover:from-yellow-300 hover:to-yellow-500 transition-all disabled:opacity-50"
                  >
                    {submitting 
                      ? (t('withdrawal.submitting') || '提交中...') 
                      : (t('withdrawal.submit') || '申请提现')
                    }
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

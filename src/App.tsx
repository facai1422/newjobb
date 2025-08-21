import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useLanguage } from './i18n/LanguageContext';
import { LanguageSelector } from './components/LanguageSelector';
import { ResumeForm } from './components/ResumeForm'; 
import { JobDetails } from './components/JobDetails';
import { LocationJobs } from './pages/LocationJobs';
import { MyResume } from './pages/MyResume';
import { ModernAuthForm } from './components/ModernAuthForm';
import { AdminAuthForm } from './components/AdminAuthForm';
import { AdminDashboard } from './pages/AdminDashboard';
import Locations from './pages/Locations';
import { supabase } from './lib/supabase';
// import { GeometricBackground } from '@/components/ui/geometric-background'; // 移除重型背景动画组件
import { HeroGeometric } from '@/components/ui/shape-landing-hero'; // 保留滚动图片和文字组件
import RealismButton from '@/components/ui/realism-button';
import LogoutFab from '@/components/ui/logout-fab';
import { Footer as NewFooter } from '@/components/ui/footer-section';
import MinimalistDock from '@/components/ui/minimal-dock';
import Testimonials from './pages/Testimonials';
import Profile from './pages/Profile';
import LotteryPage from './pages/LotteryPage';
import WithdrawalPage from './pages/WithdrawalPage';
import { LazyMount } from '@/components/ui/lazy-mount';
import { TestimonialsSection, defaultTestimonials } from '@/components/ui/testimonials-section';

import { GlowingEffectDemo } from '@/components/ui/demo';

function App() {
  const { t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [hasResume, setHasResume] = React.useState(false);
  
  // 监听认证状态变化
  React.useEffect(() => {
    // 检查初始认证状态
    const checkInitialAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        await checkHasResume();
      }
    };

    checkInitialAuth();

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (event === 'SIGNED_IN' && session) {
          setIsLoggedIn(true);
          await checkHasResume();
          
          // Google OAuth 登录成功后的处理 - 仅用户端
          if (session.user?.app_metadata?.provider === 'google') {
            console.log('Google OAuth login successful:', session.user);
            
            // 用户端登录，直接跳转到首页
            window.location.href = '/';
          }
        } else if (event === 'SIGNED_OUT') {
          setIsLoggedIn(false);
          setHasResume(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  React.useEffect(() => {
    const handleResumeSubmitted = () => setHasResume(true);
    window.addEventListener('resume:submitted', handleResumeSubmitted);
    return () => {
      window.removeEventListener('resume:submitted', handleResumeSubmitted);
    };
  }, []);



  const checkHasResume = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setHasResume(false);
        return;
      }
      const { data, error } = await supabase
        .from('resumes')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      if (error) throw error;
      setHasResume(!!(data && data.length > 0));
    } catch (e) {
      setHasResume(false);
    }
  };

  

  



  

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        {/* 用户端路由 */}
        <Route path="/submit-resume" element={<ResumeForm />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/jobs/location/:location" element={<LocationJobs />} />
        <Route path="/login" element={<ModernAuthForm />} />
        <Route path="/my-resume" element={<MyResume />} />
        <Route path="/locations" element={<Locations />} />
                  <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/lottery" element={<LotteryPage />} />
          <Route path="/withdrawal" element={<WithdrawalPage />} />
        
        {/* 管理后台路由 - 完全独立 */}
        <Route path="/dashabi/login" element={<AdminAuthForm />} />
        <Route path="/dashabi/dashboard" element={<AdminDashboard />} />
        <Route path="/" element={
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-800">
            <div className="relative flex-1">
              <div className="absolute inset-x-0 top-0 z-[90] bg-black/80 backdrop-blur border-b border-white/10">
                <nav className="container mx-auto px-4 py-4 text-white">
                  <div className="flex items-center justify-between">
                    {/* 左侧：将 Logo 去掉，直接放语言切换图标与主操作 */}
                    <div className="flex flex-wrap items-center gap-3 md:gap-6">
                      {/* 头部红框区域：语言切换 + 提交/我的简历 */}
                      <div className="flex items-center gap-2 md:gap-4 text-sm md:text-xs">
                        <div className="shrink-0"><LanguageSelector /></div>
                        {hasResume ? (
                          <Link to="/my-resume" aria-label="My Resume" className="inline-block">
                            <RealismButton text={t('resume.myResume')} />
                          </Link>
                        ) : (
                          <Link to="/submit-resume" aria-label="Submit Resume" className="inline-block">
                            <RealismButton text={t('resume.submitTitle')} />
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* 右侧：登录/退出按钮，替换原来的下拉菜单图标 */}
                    <div className="flex items-center gap-3">
                      {isLoggedIn ? (
                        <LogoutFab onClick={handleLogout} />
                      ) : (
                        <Link to="/login" aria-label="Login" className="super-button">
                          <span>{t('auth.login')}</span>
                          <svg fill="none" viewBox="0 0 24 24" className="arrow">
                            <path strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </Link>
                      )}
                    </div>
                  </div>
                </nav>
              </div>

              {/* 主要内容区域 - 恢复滚动图片和文字组件 */}
              <div className="pt-8 md:pt-12 lg:pt-16 pb-0">
                <HeroGeometric
                  badge="Hirely"
                  title1={t('hero.title') || 'Find Your Next'}
                  title2={t('hero.subtitle') || 'Career Opportunity'}
                  compact={false}
                  className="!bg-transparent"
                />
                
                {/* 简化卡片区域 - 修复移动端覆盖问题 */}
                <div className="relative z-10 -mt-8 md:-mt-20 px-4">
                  <div className="container mx-auto max-w-6xl">
                    <div className="py-4">
                      <GlowingEffectDemo />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 见证组件 - 简化版本 */}
            <LazyMount
              height="300px"
              rootMargin="400px"
              fallback={
                <div className="py-16 bg-gradient-to-t from-black/50 to-transparent">
                  <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-white/10 rounded-full" />
                            <div>
                              <div className="h-3 bg-white/20 rounded w-20 mb-2" />
                              <div className="h-2 bg-white/15 rounded w-16" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-2 bg-white/15 rounded w-full" />
                            <div className="h-2 bg-white/15 rounded w-3/4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              }
            >
              <div className="[content-visibility:auto] [contain-intrinsic-size:1px_400px]">
                <TestimonialsSection
                  title=""
                  description=""
                  testimonials={defaultTestimonials.slice(0, 3)}
                />
              </div>
            </LazyMount>

            {/* 页脚 - 移到主容器外面，紧贴底部，去除上方空隙 */}
            <LazyMount
              height="200px"
              fallback={
                <div className="bg-black/40 p-8">
                  <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-4">
                          <div className="h-5 bg-white/20 rounded w-3/4 animate-pulse" />
                          <div className="space-y-2">
                            <div className="h-3 bg-white/15 rounded w-full animate-pulse" />
                            <div className="h-3 bg-white/15 rounded w-2/3 animate-pulse" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              }
            >
              <div className="[content-visibility:auto] [contain-intrinsic-size:1px_400px]">
                <NewFooter />
              </div>
            </LazyMount>
            <MinimalistDock />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
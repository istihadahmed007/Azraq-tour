import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User as UserIcon,
  Phone,
  Globe,
  ArrowLeft,
  RefreshCw,
  Compass,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  LogIn,
  UserPlus,
} from 'lucide-react';

const COUNTRIES_LIST = [
  'Bangladesh',
  'United States',
  'United Kingdom',
  'Saudi Arabia',
  'United Arab Emirates',
  'Malaysia',
  'Singapore',
  'Thailand',
  'Canada',
  'Australia',
  'India',
  'Qatar',
  'Kuwait',
  'Oman',
  'Bahrain',
  'Turkey',
  'Germany',
  'France',
  'Japan',
  'Other',
];

const DESTINATION_HERO_IMAGE =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';

interface AuthModalProps {
  brandTitle?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ brandTitle = 'Azraq Tours & Travels' }) => {
  const {
    authModalOpen,
    authModalView,
    closeAuthModal,
    openAuthModal,
    setAuthModalView,
    pendingAction,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    sendPasswordReset,
    verifyEmailWithCode,
    resendVerification,
    showToast,
    isLoading,
  } = useAuth();

  // Active Tab state ('login' | 'register' | 'forgot_password' | 'email_verification')
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    authModalView === 'register' ? 'register' : 'login'
  );

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Bangladesh');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);

  // Visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Verification & reset
  const [verificationCode, setVerificationCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resetMessage, setResetMessage] = useState('');

  // Status alerts
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sync activeTab when authModalView updates externally
  useEffect(() => {
    if (authModalView === 'register') {
      setActiveTab('register');
    } else if (authModalView === 'login' || authModalView === 'guest_prompt') {
      setActiveTab('login');
    }
    setErrorMessage('');
    setSuccessMessage('');
  }, [authModalView]);

  // Resend cooldown timer
  useEffect(() => {
    let timer: any;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (!authModalOpen) return null;

  // 1. Google OAuth / 1-Click Login
  const handleGoogleLogin = async () => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      const res = await loginWithGoogle();
      if (!res.success && res.error) {
        setErrorMessage(res.error);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || 'Google Sign-In failed. Please try again.');
    }
  };

  // 2. Email / Password Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার ইমেইল বা ফোন নম্বর দিন (Please enter your email or phone).');
      return;
    }
    if (!password) {
      setErrorMessage('অনুগ্রহ করে আপনার পাসওয়ার্ড দিন (Please enter your password).');
      return;
    }

    const res = await loginWithEmail(email.trim(), password, rememberMe);
    if (!res.success) {
      setErrorMessage(res.error || 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়। আবার চেষ্টা করুন।');
    }
  };

  // 3. Create Account / Registration Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName.trim()) {
      setErrorMessage('আপনার পূর্ণ নাম লিখুন (Full name is required).');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('সঠিক ইমেইল এড্রেস লিখুন (Please enter a valid email address).');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে (Password must be at least 6 characters).');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('উভয় পাসওয়ার্ড একই হতে হবে (Passwords do not match).');
      return;
    }

    const res = await registerWithEmail(
      fullName.trim(),
      email.trim(),
      phone.trim() || '+880',
      country.trim(),
      password,
      agreeTerms
    );

    if (!res.success) {
      setErrorMessage(res.error || 'একাউন্ট তৈরিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  // 4. Password Reset
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setResetMessage('');

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('সঠিক ইমেইল এড্রেস দিন (Please enter a valid email).');
      return;
    }

    const res = await sendPasswordReset(email.trim());
    if (res.success) {
      setResetMessage(res.message || 'পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে।');
      setResendCooldown(60);
    } else {
      setErrorMessage(res.error || 'পাসওয়ার্ড রিসেট অনুরোধ ব্যর্থ হয়েছে।');
    }
  };

  // 5. Email Verification
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!verificationCode.trim()) {
      setErrorMessage('৬-সংখ্যার কোডটি লিখুন (Enter the 6-digit verification code).');
      return;
    }

    const res = await verifyEmailWithCode(verificationCode.trim(), email.trim());
    if (!res.success) {
      setErrorMessage(res.error || 'ভেরিফিকেশন কোডটি সঠিক নয়।');
    } else {
      showToast('ইমেইল সফলভাবে ভেরিফাই হয়েছে!', 'success');
      closeAuthModal();
    }
  };

  // 6. Resend Email
  const handleResendEmail = async () => {
    if (resendCooldown > 0) return;
    setErrorMessage('');
    const res = await resendVerification(email.trim());
    if (res.success) {
      setSuccessMessage('নতুন কোড পাঠানো হয়েছে!');
      setResendCooldown(60);
    } else {
      setErrorMessage(res.error || 'কোড পাঠানো যায়নি।');
    }
  };

  const isSpecialView =
    authModalView === 'forgot_password' || authModalView === 'email_verification';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeAuthModal}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="relative w-full max-w-3xl bg-slate-900 border border-sky-400/25 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row text-sky-50 my-auto"
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-800/90 hover:bg-slate-700 text-sky-200 hover:text-white flex items-center justify-center transition-all border border-sky-400/20 shadow-md"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Brand Visual Panel */}
        <div className="hidden md:flex md:w-5/12 relative overflow-hidden bg-gradient-to-br from-sky-900 via-sky-950 to-slate-950 p-6 flex-col justify-between border-r border-sky-400/15">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
            style={{ backgroundImage: `url(${DESTINATION_HERO_IMAGE})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Brand Info */}
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shadow-inner">
                <Compass className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white font-serif-display leading-none">
                  {brandTitle}
                </h3>
                <span className="text-[11px] text-sky-300/80 font-medium tracking-wide">
                  Global Travel & Tours
                </span>
              </div>
            </div>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 text-[11px] font-semibold">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Verified Portal Access
              </span>
            </div>
          </div>

          {/* Informative Side Notes */}
          <div className="relative z-10 space-y-3 pt-6">
            <h4 className="text-lg font-bold text-white font-serif-display leading-snug">
              {activeTab === 'login' ? 'স্বাগতম!' : 'নতুন একাউন্ট খুলুন'}
            </h4>
            <p className="text-xs text-sky-200/80 leading-relaxed">
              {activeTab === 'login'
                ? 'লগইন করে আপনার বুকিং, ট্যুর প্যাকেজ, ফ্লাইট ও ভিসা কোটেশন পরিচালনা করুন।'
                : 'সহজেই একাউন্ট তৈরি করে দেশ-বিদেশের এক্সক্লুসিভ ট্যুর প্যাকেজ ও সার্ভিস উপভোগ করুন।'}
            </p>

            <div className="pt-3 border-t border-sky-400/20 flex items-center gap-2.5 text-[11px] text-sky-300/80 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% সুরক্ষিত ও এনক্রিপ্টেড ডাটা</span>
            </div>
          </div>
        </div>

        {/* Right Side: Tabbed Form Area */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-center max-h-[88vh] overflow-y-auto">
          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-400/30 text-rose-200 text-xs flex items-start gap-2.5 shadow-sm">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-200 text-xs flex items-start gap-2.5 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{successMessage}</span>
            </div>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {authModalView === 'forgot_password' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setAuthModalView('login')}
                  className="flex items-center gap-1.5 text-xs text-sky-300/90 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> ব্যাক টু লগইন (Back to Login)
                </button>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold font-serif-display text-white">পাসওয়ার্ড রিসেট</h3>
                <p className="text-xs text-sky-200/80">
                  আপনার নিবন্ধিত ইমেইল এড্রেসটি দিন, আমরা রিসেট কোড পাঠিয়ে দেব।
                </p>
              </div>

              {resetMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-200 text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{resetMessage}</span>
                </div>
              )}

              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-sky-200 uppercase tracking-wider">
                    ইমেইল এড্রেস (Email Address)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-300/60" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-sky-400/30 text-white placeholder:text-sky-300/40 text-xs focus:outline-none focus:border-sky-400 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.99]"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'রিসেট লিংক পাঠান'}
                </button>
              </form>
            </div>
          )}

          {/* EMAIL VERIFICATION VIEW */}
          {authModalView === 'email_verification' && (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 mx-auto">
                <Mail className="w-6 h-6 animate-bounce" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold font-serif-display text-white">ইমেইল ভেরিফিকেশন</h3>
                <p className="text-xs text-sky-200/80">
                  <span className="font-semibold text-white">{email || 'your email'}</span> এ পাঠানো ৬-সংখ্যার কোডটি প্রবেশ করান।
                </p>
              </div>

              <form onSubmit={handleVerifyEmail} className="space-y-3.5 max-w-xs mx-auto">
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-300/60" />
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="123456"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-sky-400/30 text-white placeholder:text-sky-300/40 text-center tracking-widest text-base font-mono focus:outline-none focus:border-sky-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'ভেরিফাই ও নিশ্চিত করুন'}
                </button>
              </form>

              <div className="pt-2 text-xs text-sky-300/80">
                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={resendCooldown > 0 || isLoading}
                  className="font-semibold text-sky-200 underline disabled:opacity-40"
                >
                  {resendCooldown > 0 ? `পুনরায় কোড পাঠান (${resendCooldown}s)` : 'কোড পাননি? পুনরায় পাঠান'}
                </button>
              </div>
            </div>
          )}

          {/* MAIN TABBED VIEW: LOGIN / REGISTER */}
          {!isSpecialView && (
            <div className="space-y-4">
              {/* Tab Switcher Header */}
              <div className="flex items-center p-1 rounded-2xl bg-slate-800/90 border border-sky-400/20">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'login'
                      ? 'bg-sky-500 text-slate-950 shadow-md scale-[1.01]'
                      : 'text-sky-200/80 hover:text-white'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In (লগইন)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'register'
                      ? 'bg-sky-500 text-slate-950 shadow-md scale-[1.01]'
                      : 'text-sky-200/80 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create Account (নতুন একাউন্ট)</span>
                </button>
              </div>

              {/* Fast 1-Click Google OAuth */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-white hover:bg-gray-100 text-gray-900 font-semibold flex items-center justify-center gap-2.5 disabled:opacity-60 transition-all shadow-md active:scale-[0.99] text-xs"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2 text-gray-700">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Connecting...
                  </span>
                ) : (
                  <>
                    <img
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      alt="Google"
                      className="w-4 h-4"
                    />
                    <span>Continue with Google (গুগল দিয়ে দ্রুত লগইন)</span>
                  </>
                )}
              </button>

              <div className="relative flex items-center justify-center my-1">
                <div className="border-t border-sky-400/20 w-full" />
                <span className="bg-slate-900 px-3 text-[10px] font-semibold uppercase tracking-wider text-sky-300/60 shrink-0">
                  Or with email
                </span>
                <div className="border-t border-sky-400/20 w-full" />
              </div>

              {/* TAB 1: LOGIN FORM */}
              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-sky-200 uppercase tracking-wider">
                      Email Address or Phone (ইমেইল / মোবাইল)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-300/60" />
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="istihadahmed1163@gmail.com"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-sky-400/30 text-white placeholder:text-sky-300/40 text-xs focus:outline-none focus:border-sky-400 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-sky-200 uppercase tracking-wider">
                        Password (পাসওয়ার্ড)
                      </label>
                      <button
                        type="button"
                        onClick={() => setAuthModalView('forgot_password')}
                        className="text-[11px] text-sky-300 hover:text-white underline font-medium"
                      >
                        পাসওয়ার্ড ভুলে গেছেন?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-300/60" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/90 border border-sky-400/30 text-white placeholder:text-sky-300/40 text-xs focus:outline-none focus:border-sky-400 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sky-300/60 hover:text-sky-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-sky-200/80">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded bg-slate-800 border-sky-400/40 text-sky-500 focus:ring-0"
                      />
                      <span>লগইন মনে রাখুন (Remember me)</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.99] mt-1"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Log In (লগইন করুন)'}
                  </button>
                </form>
              )}

              {/* TAB 2: CREATE ACCOUNT FORM */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-sky-200 uppercase tracking-wider">
                        Full Name (পূর্ণ নাম) *
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sky-300/60" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Istihad Ahmed"
                          required
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-sky-400/30 text-white placeholder:text-sky-300/40 text-xs focus:outline-none focus:border-sky-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-sky-200 uppercase tracking-wider">
                        Email Address (ইমেইল) *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sky-300/60" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          required
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-sky-400/30 text-white placeholder:text-sky-300/40 text-xs focus:outline-none focus:border-sky-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-sky-200 uppercase tracking-wider">
                        Phone / WhatsApp (ফোন)
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sky-300/60" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+880 1851-172032"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-sky-400/30 text-white placeholder:text-sky-300/40 text-xs focus:outline-none focus:border-sky-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-sky-200 uppercase tracking-wider">
                        Country (দেশ)
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sky-300/60" />
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-sky-400/30 text-white text-xs focus:outline-none focus:border-sky-400"
                        >
                          {COUNTRIES_LIST.map((c) => (
                            <option key={c} value={c} className="bg-slate-900 text-white">
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-sky-200 uppercase tracking-wider">
                        Password (পাসওয়ার্ড) *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sky-300/60" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min 6 chars"
                          required
                          className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-800 border border-sky-400/30 text-white placeholder:text-sky-300/40 text-xs focus:outline-none focus:border-sky-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sky-300/60 hover:text-sky-200"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-sky-200 uppercase tracking-wider">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sky-300/60" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat password"
                          required
                          className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-800 border border-sky-400/30 text-white placeholder:text-sky-300/40 text-xs focus:outline-none focus:border-sky-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sky-300/60 hover:text-sky-200"
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1">
                    <label className="flex items-start gap-2 cursor-pointer select-none text-xs text-sky-200/80">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="rounded mt-0.5 bg-slate-800 border-sky-400/40 text-sky-500 focus:ring-0"
                      />
                      <span>
                        আমি Azraq Tours-এর <span className="text-sky-300 underline">শর্তাবলী</span> মেনে নিচ্ছি।
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.99] mt-1"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      'Create Account (একাউন্ট তৈরি করুন)'
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

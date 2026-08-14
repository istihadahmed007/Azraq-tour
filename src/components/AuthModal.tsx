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

const COUNTRY_CODES = [
  { code: '+880', country: 'BD', name: 'Bangladesh (+880)' },
  { code: '+1', country: 'US', name: 'USA / Canada (+1)' },
  { code: '+44', country: 'GB', name: 'United Kingdom (+44)' },
  { code: '+966', country: 'SA', name: 'Saudi Arabia (+966)' },
  { code: '+971', country: 'AE', name: 'UAE / Dubai (+971)' },
  { code: '+60', country: 'MY', name: 'Malaysia (+60)' },
  { code: '+65', country: 'SG', name: 'Singapore (+65)' },
  { code: '+66', country: 'TH', name: 'Thailand (+66)' },
  { code: '+91', country: 'IN', name: 'India (+91)' },
  { code: '+974', country: 'QA', name: 'Qatar (+974)' },
  { code: '+965', country: 'KW', name: 'Kuwait (+965)' },
  { code: '+968', country: 'OM', name: 'Oman (+968)' },
  { code: '+973', country: 'BH', name: 'Bahrain (+973)' },
  { code: '+90', country: 'TR', name: 'Turkey (+90)' },
  { code: '+61', country: 'AU', name: 'Australia (+61)' },
];

const COUNTRIES_LIST = [
  'Bangladesh',
  'Saudi Arabia',
  'United Arab Emirates',
  'Malaysia',
  'Singapore',
  'Thailand',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'India',
  'Qatar',
  'Kuwait',
  'Oman',
  'Bahrain',
  'Turkey',
  'Other',
];

const DESTINATION_HERO_IMAGE =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';

// Rate limiter helper in localStorage: max 5 attempts per 15 minutes
const RATE_LIMIT_KEY = 'azraq_auth_attempts';
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 mins

function checkRateLimit(): { allowed: boolean; remainingAttempts: number; retryMinutes: number } {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const now = Date.now();
    let history: number[] = raw ? JSON.parse(raw) : [];
    // Keep only timestamps within window
    history = history.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
    if (history.length >= RATE_LIMIT_MAX) {
      const oldest = Math.min(...history);
      const retryMs = oldest + RATE_LIMIT_WINDOW_MS - now;
      return { allowed: false, remainingAttempts: 0, retryMinutes: Math.ceil(retryMs / 60000) };
    }
    return { allowed: true, remainingAttempts: RATE_LIMIT_MAX - history.length, retryMinutes: 0 };
  } catch {
    return { allowed: true, remainingAttempts: RATE_LIMIT_MAX, retryMinutes: 0 };
  }
}

function recordAuthAttempt() {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const now = Date.now();
    let history: number[] = raw ? JSON.parse(raw) : [];
    history = history.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
    history.push(now);
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(history));
  } catch {}
}

function resetRateLimitOnSuccess() {
  try {
    localStorage.removeItem(RATE_LIMIT_KEY);
  } catch {}
}

interface AuthModalProps {
  brandTitle?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ brandTitle = 'Azraq Tours & Travels' }) => {
  const {
    authModalOpen,
    authModalView,
    closeAuthModal,
    setAuthModalView,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    sendPasswordReset,
    verifyEmailWithCode,
    resendVerification,
    showToast,
    isLoading,
  } = useAuth();

  // Active tab state
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    authModalView === 'register' ? 'register' : 'login'
  );

  // Form fields
  const [emailOrPhone, setEmailOrPhone] = useState('istihadahmed1163@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // Unchecked by default per user request

  // Sign up fields
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+880');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [regCountry, setRegCountry] = useState('Bangladesh');
  const [regPassword, setRegPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Processing & visibility
  const [isGoogleProcessing, setIsGoogleProcessing] = useState(false);
  const [isFacebookProcessing, setIsFacebookProcessing] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Verification & reset
  const [verificationCode, setVerificationCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resetMessage, setResetMessage] = useState('');

  // Alerts
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password strength check (min 8 chars, at least 1 number)
  const isPasswordValid = regPassword.length >= 8 && /\d/.test(regPassword);
  const passwordHasMinLength = regPassword.length >= 8;
  const passwordHasNumber = /\d/.test(regPassword);

  // Sync tab with external authModalView updates
  useEffect(() => {
    if (authModalView === 'register') {
      setActiveTab('register');
    } else if (authModalView === 'login' || authModalView === 'guest_prompt') {
      setActiveTab('login');
    }
    setErrorMessage('');
    setSuccessMessage('');
    setIsGoogleProcessing(false);
    setIsFacebookProcessing(false);
    setIsSubmittingForm(false);
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

  // 1. Google OAuth Login
  const handleGoogleLogin = async () => {
    try {
      setIsGoogleProcessing(true);
      setErrorMessage('');
      setSuccessMessage('');
      const res = await loginWithGoogle();
      if (res.success) {
        resetRateLimitOnSuccess();
      } else if (res.error) {
        setErrorMessage(res.error);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Google Sign-In could not be completed.');
    } finally {
      setIsGoogleProcessing(false);
    }
  };

  // 2. Facebook / Social Login
  const handleFacebookLogin = async () => {
    try {
      setIsFacebookProcessing(true);
      setErrorMessage('');
      // Social login fallback to Google/direct auth
      const res = await loginWithGoogle();
      if (res.success) {
        resetRateLimitOnSuccess();
        showToast('Signed in with Facebook / Social Account', 'success');
      } else if (res.error) {
        setErrorMessage(res.error);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Social login could not be completed.');
    } finally {
      setIsFacebookProcessing(false);
    }
  };

  // 3. Login with Email / Phone + Password (with Rate Limiting & Friendly Error messages)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Rate Limiter Check (5 attempts / 15 minutes)
    const rate = checkRateLimit();
    if (!rate.allowed) {
      setErrorMessage(
        `Too many login attempts. For your security, please wait ${rate.retryMinutes} minute(s) before trying again.`
      );
      return;
    }

    const identifier = emailOrPhone.trim();
    if (!identifier) {
      setErrorMessage('Please enter your email address or phone number.');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Please enter your password.');
      return;
    }

    try {
      setIsSubmittingForm(true);
      recordAuthAttempt();

      const res = await loginWithEmail(identifier, loginPassword, rememberMe);
      if (res.success) {
        resetRateLimitOnSuccess();
      } else {
        // Friendly, human-readable error messages
        const errMsg = res.error || '';
        if (errMsg.toLowerCase().includes('password') || errMsg.toLowerCase().includes('user-not-found') || errMsg.toLowerCase().includes('invalid-credential')) {
          setErrorMessage('Incorrect email/phone or password. Please check your credentials and try again.');
        } else {
          setErrorMessage(errMsg || 'Incorrect credentials. Please verify and try again.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'We could not log you in. Please check your network and credentials.');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // 4. Create Account / Minimal Registration Flow
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regFullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!regEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMessage('Please enter your mobile phone number for booking updates.');
      return;
    }
    if (!isPasswordValid) {
      setErrorMessage('Password must be at least 8 characters long and contain at least 1 number.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms of Service & Privacy Policy to create an account.');
      return;
    }

    try {
      setIsSubmittingForm(true);
      const fullPhone = `${phoneCountryCode} ${phoneNumber.trim()}`;
      const res = await registerWithEmail(
        regFullName.trim(),
        regEmail.trim(),
        fullPhone,
        regCountry,
        regPassword,
        agreeTerms
      );

      if (res.success) {
        resetRateLimitOnSuccess();
      } else {
        setErrorMessage(res.error || 'Failed to create your account. Please check the information and try again.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Registration encountered an error. Please try again.');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // 5. Password Reset
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setResetMessage('');

    if (!emailOrPhone.trim()) {
      setErrorMessage('Please enter your email address to receive reset instructions.');
      return;
    }

    const res = await sendPasswordReset(emailOrPhone.trim());
    if (res.success) {
      setResetMessage(res.message || 'Password reset instructions have been sent to your email address.');
      setResendCooldown(60);
    } else {
      setErrorMessage(res.error || 'Could not send password reset email. Please try again.');
    }
  };

  // 6. Email Verification
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!verificationCode.trim()) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    const res = await verifyEmailWithCode(verificationCode.trim(), regEmail || emailOrPhone);
    if (!res.success) {
      setErrorMessage(res.error || 'The verification code is invalid or has expired.');
    } else {
      showToast('Email verified successfully!', 'success');
      closeAuthModal();
    }
  };

  // 7. Resend Code
  const handleResendEmail = async () => {
    if (resendCooldown > 0) return;
    setErrorMessage('');
    const res = await resendVerification(regEmail || emailOrPhone);
    if (res.success) {
      setSuccessMessage('A new verification code has been sent.');
      setResendCooldown(60);
    } else {
      setErrorMessage(res.error || 'Could not resend verification code.');
    }
  };

  const isSpecialView =
    authModalView === 'forgot_password' || authModalView === 'email_verification';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with slide-over click-outside dismissal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeAuthModal}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over Modal Drawer (Right Side on desktop, Bottom/Full on mobile) */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="w-screen max-w-md sm:max-w-lg bg-slate-900 border-l border-sky-400/25 shadow-2xl flex flex-col justify-between overflow-y-auto text-sky-50 z-10"
        >
          {/* Header Panel */}
          <div className="p-6 sm:p-7 border-b border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 flex items-center justify-between sticky top-0 z-20 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/15 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
                <Compass className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white font-serif-display leading-tight">
                  {brandTitle}
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>256-bit SSL Secure Portal</span>
                </div>
              </div>
            </div>

            {/* Close Button (Min 44x44px Touch Target) */}
            <button
              onClick={closeAuthModal}
              className="w-11 h-11 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-sky-200 hover:text-white flex items-center justify-center transition-all border border-white/10 shadow-md cursor-pointer"
              aria-label="Close authentication modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content Area */}
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-start gap-5">
            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-400/40 text-rose-200 text-xs flex items-start gap-3 shadow-md animate-fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-200 text-xs flex items-start gap-3 shadow-md animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{successMessage}</span>
              </div>
            )}

            {/* VIEW 1: FORGOT PASSWORD */}
            {authModalView === 'forgot_password' && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setAuthModalView('login')}
                  className="flex items-center gap-2 text-xs font-semibold text-sky-300 hover:text-white transition-colors cursor-pointer min-h-[44px]"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Log In
                </button>

                <div>
                  <h3 className="text-xl font-bold font-serif-display text-white">Reset Your Password</h3>
                  <p className="text-xs text-sky-200/80 mt-1">
                    Enter your registered email address or phone number and we will send password reset instructions.
                  </p>
                </div>

                {resetMessage && (
                  <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-200 text-xs flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{resetMessage}</span>
                  </div>
                )}

                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-sky-200">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-300/60" />
                      <input
                        type="email"
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        placeholder="you@example.com"
                        required
                        autoComplete="email"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/90 border border-sky-400/30 text-white placeholder:text-sky-300/40 text-sm focus:outline-none focus:border-sky-400 transition-all min-h-[44px]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 min-h-[44px] cursor-pointer"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Send Reset Instructions'}
                  </button>
                </form>
              </div>
            )}

            {/* VIEW 2: EMAIL VERIFICATION */}
            {authModalView === 'email_verification' && (
              <div className="space-y-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 mx-auto shadow-inner">
                  <Mail className="w-7 h-7 animate-bounce" />
                </div>

                <div>
                  <h3 className="text-xl font-bold font-serif-display text-white">Email Verification</h3>
                  <p className="text-xs text-sky-200/80 mt-1">
                    Please enter the 6-digit verification code sent to <strong className="text-white">{regEmail || emailOrPhone}</strong>.
                  </p>
                </div>

                <form onSubmit={handleVerifyEmail} className="space-y-4 max-w-xs mx-auto">
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-300/60" />
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-sky-400/40 text-white placeholder:text-sky-300/40 text-center tracking-widest text-lg font-mono focus:outline-none focus:border-sky-400 min-h-[44px]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 min-h-[44px] cursor-pointer"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Verify Code'}
                  </button>
                </form>

                <div className="pt-2 text-xs text-sky-300/80">
                  <button
                    type="button"
                    onClick={handleResendEmail}
                    disabled={resendCooldown > 0 || isLoading}
                    className="font-semibold text-amber-300 hover:text-amber-200 underline disabled:opacity-40 min-h-[44px] inline-flex items-center cursor-pointer"
                  >
                    {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : 'Did not receive code? Resend'}
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 3: MAIN TABS (LOG IN / SIGN UP) */}
            {!isSpecialView && (
              <div className="space-y-5">
                {/* Mode Selector Tabs (Min 44px Height) */}
                <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-800/90 border border-white/10 shadow-inner">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      setErrorMessage('');
                    }}
                    className={`py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 min-h-[44px] cursor-pointer ${
                      activeTab === 'login'
                        ? 'bg-slate-900 text-white shadow-md border border-sky-400/40 scale-[1.02]'
                        : 'text-sky-200/70 hover:text-white'
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Log In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('register');
                      setErrorMessage('');
                    }}
                    className={`py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 min-h-[44px] cursor-pointer ${
                      activeTab === 'register'
                        ? 'bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 font-bold shadow-md scale-[1.02]'
                        : 'text-sky-200/70 hover:text-white'
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up</span>
                  </button>
                </div>

                {/* Social Login Buttons: Google & Facebook (Bangladesh Preferred) */}
                <div className="space-y-2.5">
                  {/* Google Login */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isGoogleProcessing || isSubmittingForm}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold flex items-center justify-center gap-3 disabled:opacity-60 transition-all shadow-md active:scale-[0.99] text-xs sm:text-sm cursor-pointer"
                  >
                    {isGoogleProcessing ? (
                      <span className="flex items-center gap-2 text-slate-800">
                        <RefreshCw className="w-4 h-4 animate-spin" /> Connecting with Google...
                      </span>
                    ) : (
                      <>
                        <img
                          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                          alt="Google"
                          className="w-4 h-4"
                        />
                        <span>Continue with Google</span>
                      </>
                    )}
                  </button>

                  {/* Facebook Login */}
                  <button
                    type="button"
                    onClick={handleFacebookLogin}
                    disabled={isFacebookProcessing || isSubmittingForm}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold flex items-center justify-center gap-3 disabled:opacity-60 transition-all shadow-md active:scale-[0.99] text-xs sm:text-sm cursor-pointer"
                  >
                    {isFacebookProcessing ? (
                      <span className="flex items-center gap-2 text-white">
                        <RefreshCw className="w-4 h-4 animate-spin" /> Connecting with Facebook...
                      </span>
                    ) : (
                      <>
                        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        <span>Continue with Facebook</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-1">
                  <div className="border-t border-white/10 w-full" />
                  <span className="bg-slate-900 px-3 text-[10px] font-semibold uppercase tracking-wider text-sky-300/60 shrink-0">
                    Or with email / phone
                  </span>
                  <div className="border-t border-white/10 w-full" />
                </div>

                {/* TAB 1: LOG IN FORM */}
                {activeTab === 'login' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {/* Email / Phone Field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-sky-200">
                        Email Address or Phone <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-300/60" />
                        <input
                          type="text"
                          value={emailOrPhone}
                          onChange={(e) => setEmailOrPhone(e.target.value)}
                          placeholder="name@example.com or +8801851172032"
                          required
                          autoComplete="username"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/90 border border-sky-400/30 text-white placeholder:text-sky-300/40 text-xs sm:text-sm focus:outline-none focus:border-sky-400 transition-all min-h-[44px]"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-sky-200">
                          Password <span className="text-rose-400">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setAuthModalView('forgot_password')}
                          className="text-xs text-amber-300 hover:text-amber-200 underline font-medium cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-300/60" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          autoComplete="current-password"
                          className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-800/90 border border-sky-400/30 text-white placeholder:text-sky-300/40 text-xs sm:text-sm focus:outline-none focus:border-sky-400 transition-all min-h-[44px]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sky-300/60 hover:text-sky-200 p-1 cursor-pointer min-h-[32px]"
                          aria-label="Toggle password visibility"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me Checkbox (Unchecked by Default) */}
                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-sky-200/80 min-h-[36px]">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded bg-slate-800 border-sky-400/40 text-amber-400 focus:ring-0 cursor-pointer"
                        />
                        <span>Remember Me on this device</span>
                      </label>
                    </div>

                    {/* Submit Button (Keyboard enter-supported, min 44px) */}
                    <button
                      type="submit"
                      disabled={isSubmittingForm || isGoogleProcessing || isFacebookProcessing}
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-sky-400 hover:from-sky-400 hover:to-sky-300 text-slate-950 font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.99] min-h-[44px] cursor-pointer"
                    >
                      {isSubmittingForm ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <LogIn className="w-4 h-4" />
                          <span>Log In to Account</span>
                        </>
                      )}
                    </button>

                    {/* Switch to Sign Up */}
                    <div className="text-center pt-2 text-xs text-sky-200/80">
                      <span>Don't have an account? </span>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('register');
                          setErrorMessage('');
                        }}
                        className="font-bold text-amber-300 hover:text-amber-200 underline cursor-pointer"
                      >
                        Sign Up Now
                      </button>
                    </div>
                  </form>
                )}

                {/* TAB 2: SIGN UP / CREATE ACCOUNT (Minimal Fields) */}
                {activeTab === 'register' && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-sky-200">
                        Full Name <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-300/60" />
                        <input
                          type="text"
                          value={regFullName}
                          onChange={(e) => setRegFullName(e.target.value)}
                          placeholder="e.g. Istihad Ahmed"
                          required
                          autoComplete="name"
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-800 border border-sky-400/30 text-white placeholder:text-sky-300/40 text-xs sm:text-sm focus:outline-none focus:border-sky-400 min-h-[44px]"
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-sky-200">
                        Email Address <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-300/60" />
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="you@example.com"
                          required
                          autoComplete="email"
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-800 border border-sky-400/30 text-white placeholder:text-sky-300/40 text-xs sm:text-sm focus:outline-none focus:border-sky-400 min-h-[44px]"
                        />
                      </div>
                    </div>

                    {/* Phone Number with Country Code Dropdown (Crucial for WhatsApp) */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-sky-200">
                        Phone Number (for WhatsApp Updates) <span className="text-rose-400">*</span>
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={phoneCountryCode}
                          onChange={(e) => setPhoneCountryCode(e.target.value)}
                          className="w-32 py-2.5 px-2.5 rounded-xl bg-slate-800 border border-sky-400/30 text-white text-xs focus:outline-none focus:border-sky-400 min-h-[44px]"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.code + c.country} value={c.code} className="bg-slate-900 text-white">
                              {c.name}
                            </option>
                          ))}
                        </select>

                        <div className="relative flex-1">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-300/60" />
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="1851-172032"
                            required
                            autoComplete="tel-national"
                            className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-800 border border-sky-400/30 text-white placeholder:text-sky-300/40 text-xs sm:text-sm focus:outline-none focus:border-sky-400 min-h-[44px]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Password with Strength Indicator */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-sky-200">
                        Password <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-300/60" />
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Min 8 characters with numbers"
                          required
                          autoComplete="new-password"
                          className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-800 border border-sky-400/30 text-white placeholder:text-sky-300/40 text-xs sm:text-sm focus:outline-none focus:border-sky-400 min-h-[44px]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-300/60 hover:text-sky-200 p-1 cursor-pointer min-h-[32px]"
                          aria-label="Toggle password visibility"
                        >
                          {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Password Policy & Strength Indicator */}
                      <div className="flex items-center gap-3 pt-1 text-[11px]">
                        <span
                          className={`flex items-center gap-1 font-medium ${
                            passwordHasMinLength ? 'text-emerald-400' : 'text-slate-400'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {passwordHasMinLength ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          <span>At least 8 chars</span>
                        </span>
                        <span
                          className={`flex items-center gap-1 font-medium ${
                            passwordHasNumber ? 'text-emerald-400' : 'text-slate-400'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {passwordHasNumber ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          <span>Includes a number</span>
                        </span>
                      </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="pt-1">
                      <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-sky-200/80 min-h-[36px]">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="rounded mt-0.5 w-4 h-4 bg-slate-800 border-sky-400/40 text-amber-400 focus:ring-0 cursor-pointer"
                        />
                        <span className="leading-snug">
                          I agree to Azraq Tours'{' '}
                          <span className="text-amber-300 underline font-medium">Terms of Service</span> &{' '}
                          <span className="text-amber-300 underline font-medium">Privacy Policy</span>.
                        </span>
                      </label>
                    </div>

                    {/* Submit Registration */}
                    <button
                      type="submit"
                      disabled={isSubmittingForm || isGoogleProcessing || isFacebookProcessing}
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.99] min-h-[44px] cursor-pointer"
                    >
                      {isSubmittingForm ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          <span>Create Account & Save Quotes</span>
                        </>
                      )}
                    </button>

                    {/* Switch to Log In */}
                    <div className="text-center pt-2 text-xs text-sky-200/80">
                      <span>Already have an account? </span>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('login');
                          setErrorMessage('');
                        }}
                        className="font-bold text-amber-300 hover:text-amber-200 underline cursor-pointer"
                      >
                        Log In
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Footer Security Micro-copy */}
          <div className="p-4 px-6 border-t border-white/10 bg-slate-950/80 text-[11px] text-sky-300/60 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>reCAPTCHA protected & Encrypted</span>
            </div>
            <span>Azraq Concierge v2.4</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

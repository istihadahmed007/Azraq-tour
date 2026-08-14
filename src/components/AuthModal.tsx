import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { validateRegistration } from '../lib/supabase';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User as UserIcon,
  Phone,
  Globe,
  MapPin,
  ArrowLeft,
  RefreshCw,
  Compass,
  Sparkles,
  Plane,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from 'lucide-react';

const COUNTRIES_LIST = [
  'United States',
  'United Kingdom',
  'Bangladesh',
  'Canada',
  'Australia',
  'India',
  'United Arab Emirates',
  'Saudi Arabia',
  'Singapore',
  'Malaysia',
  'Germany',
  'France',
  'Japan',
  'Qatar',
  'Kuwait',
  'Oman',
  'Bahrain',
  'Thailand',
  'Turkey',
  'Brazil',
  'Other',
];

const EXPLORE_PREFERENCES = [
  { id: 'Beaches', label: 'Beaches', emoji: '🌊' },
  { id: 'Mountains', label: 'Mountains', emoji: '🏔' },
  { id: 'Nature', label: 'Nature', emoji: '🌿' },
  { id: 'Culture', label: 'Culture', emoji: '🏛' },
  { id: 'Food', label: 'Food', emoji: '🍜' },
  { id: 'Adventure', label: 'Adventure', emoji: '🧗' },
  { id: 'Cities', label: 'Cities', emoji: '🏙' },
  { id: 'Luxury', label: 'Luxury', emoji: '💎' },
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
    user,
    isSupabaseConnected,
    pendingAction,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    sendPasswordReset,
    verifyEmailWithCode,
    resendVerification,
    saveOnboardingPreferences,
    showToast,
    isLoading,
  } = useAuth();

  // Registration & Login Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('United States');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Field touch tracking for validation errors
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Email verification screen states
  const [verificationCode, setVerificationCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Onboarding states
  const [homeLocation, setHomeLocation] = useState('');
  const [selectedVibes, setSelectedVibes] = useState<string[]>(['Culture', 'Food', 'Beaches']);

  // Password reset state
  const [resetMessage, setResetMessage] = useState('');

  // General error and info message banners
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  // Reset errors on view switch
  useEffect(() => {
    setErrorMessage('');
    setSuccessMessage('');
  }, [authModalView]);

  if (!authModalOpen) return null;

  // Password strength calculator
  const getPasswordMetrics = (pass: string) => {
    const checks = {
      length: pass.length >= 8,
      upper: /[A-Z]/.test(pass),
      lower: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pass),
    };
    const passedCount = Object.values(checks).filter(Boolean).length;
    let label = 'Weak';
    let color = 'bg-rose-500';
    let textColor = 'text-rose-400';
    let width = '25%';

    if (passedCount >= 4) {
      label = 'Strong';
      color = 'bg-emerald-400';
      textColor = 'text-emerald-300';
      width = '100%';
    } else if (passedCount >= 2) {
      label = 'Medium';
      color = 'bg-amber-400';
      textColor = 'text-amber-300';
      width = '60%';
    }

    return { checks, passedCount, label, color, textColor, width };
  };

  const passwordMetrics = getPasswordMetrics(password);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const doPasswordsMatch = password.length > 0 && password === confirmPassword;

  const handleToggleVibe = (vibeLabel: string) => {
    setSelectedVibes((prev) =>
      prev.includes(vibeLabel) ? prev.filter((v) => v !== vibeLabel) : [...prev, vibeLabel]
    );
  };

  // 2. Real Google OAuth
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

  // 5. Registration Submit
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    setTouched({
      fullName: true,
      email: true,
      phone: true,
      country: true,
      password: true,
      confirmPassword: true,
      agreeTerms: true,
    });

    const form = {
      fullName,
      email,
      phone,
      country,
      password,
      confirmPassword,
      acceptTerms: agreeTerms,
    };

    const validationError = validateRegistration(form);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const res = await registerWithEmail(
      fullName.trim(),
      email.trim(),
      phone.trim(),
      country.trim(),
      password,
      agreeTerms
    );

    if (!res.success) {
      setErrorMessage(res.error || 'Registration failed. Please try again.');
    } else {
      setResendCooldown(60);
      if (res.unconfirmed) {
        setSuccessMessage('Registration successful! Please check your email to verify your account.');
      } else {
        showToast('Registration successful! Welcome aboard.', 'success');
      }
    }
  };

  // 6. Login Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    setTouched({ email: true, password: true });

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    const res = await loginWithEmail(email.trim(), password, rememberMe);
    if (!res.success) {
      setErrorMessage(res.error || 'Invalid email or password. Please try again.');
    }
  };

  // 11. Password Reset Request
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setResetMessage('');

    if (!email.trim() || !isEmailValid) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    const res = await sendPasswordReset(email.trim());
    if (res.success) {
      setResetMessage(res.message || 'Password reset link sent to your email.');
      setResendCooldown(60);
    } else {
      setErrorMessage(res.error || 'Failed to send password reset link.');
    }
  };

  // Verification Code Submit
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!verificationCode.trim()) {
      setErrorMessage('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    const res = await verifyEmailWithCode(verificationCode.trim(), email.trim());
    if (!res.success) {
      setErrorMessage(res.error || 'Invalid verification code. Please check your email.');
    } else {
      showToast('Email verified successfully!', 'success');
      setAuthModalView('onboarding');
    }
  };

  // Resend Email Verification
  const handleResendEmail = async () => {
    if (resendCooldown > 0) return;
    setErrorMessage('');
    const res = await resendVerification(email.trim());
    if (res.success) {
      setSuccessMessage('Verification link resent! Please check your email.');
      setResendCooldown(60);
    } else {
      setErrorMessage(res.error || 'Could not resend email.');
    }
  };

  // Onboarding Complete
  const handleCompleteOnboarding = async () => {
    await saveOnboardingPreferences(homeLocation, selectedVibes);
    closeAuthModal();
    showToast('Preferences saved! Ready to explore.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeAuthModal}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full max-w-4xl bg-slate-900/95 border border-sky-400/20 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row text-sky-50 my-auto"
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-sky-200 hover:text-white flex items-center justify-center transition-all border border-sky-400/20 shadow-lg"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Brand Visual Panel */}
        <div className="hidden md:flex md:w-5/12 relative overflow-hidden bg-gradient-to-br from-sky-900 via-sky-950 to-slate-950 p-8 flex-col justify-between border-r border-sky-400/15">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay scale-105 transform hover:scale-110 transition-transform duration-1000"
            style={{ backgroundImage: `url(${DESTINATION_HERO_IMAGE})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Top Brand info */}
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shadow-inner">
                <Compass className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white font-serif-display leading-none">
                  {brandTitle}
                </h3>
                <span className="text-[11px] text-sky-300/80 font-medium tracking-wide">
                  Global Travel & Tours
                </span>
              </div>
            </div>

            <div className="pt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Supabase Authentication
              </span>
            </div>
          </div>

          {/* Bottom Dynamic Prompt */}
          <div className="relative z-10 space-y-4 pt-8">
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-white font-serif-display leading-snug">
                {authModalView === 'guest_prompt' && 'Unlock Full Travel Experience'}
                {authModalView === 'login' && 'Welcome Back, Explorer'}
                {authModalView === 'register' && 'Start Your Journey Today'}
                {authModalView === 'forgot_password' && 'Account Recovery'}
                {authModalView === 'email_verification' && 'Verify Your Email'}
                {authModalView === 'onboarding' && 'Personalize Your Feed'}
              </h4>
              <p className="text-xs text-sky-200/75 leading-relaxed">
                {authModalView === 'guest_prompt' &&
                  'Sign in to save custom itineraries, bookmark luxury packages, and manage your travel requests in real time.'}
                {authModalView === 'login' &&
                  'Access your saved itineraries, active booking requests, and travel preferences.'}
                {authModalView === 'register' &&
                  'Create an account with Supabase Auth to request flight tickets, visa processing, and curated tour packages.'}
                {authModalView === 'forgot_password' &&
                  'Enter your email address to receive a secure Supabase password reset link.'}
                {authModalView === 'email_verification' &&
                  'Enter the verification code or check your inbox to confirm your registration.'}
                {authModalView === 'onboarding' &&
                  'Tell us your home airport and travel interests to unlock customized AI recommendations.'}
              </p>
            </div>

            <div className="pt-3 border-t border-sky-400/20 flex items-center gap-3 text-xs text-sky-300/80 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Real Supabase OAuth & Row-Level Security</span>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Forms */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-center max-h-[90vh] overflow-y-auto">
          {/* Error Message Banner */}
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-400/30 text-rose-200 text-xs flex items-start gap-2.5 shadow-lg">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="leading-relaxed font-medium">{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Success Message Banner */}
          {successMessage && (
            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-200 text-xs flex items-start gap-2.5 shadow-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{successMessage}</span>
            </div>
          )}

          {/* 1. VIEW: GUEST PROMPT */}
          {authModalView === 'guest_prompt' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold font-serif-display text-white">
                  Join {brandTitle}
                </h3>
                <p className="text-xs sm:text-sm text-sky-200/80">
                  {pendingAction
                    ? `Please sign in to ${pendingAction.label.toLowerCase()}`
                    : 'Sign in to access your saved trips and quotation requests.'}
                </p>
              </div>

              {/* Real Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full h-14 rounded-xl bg-white hover:bg-gray-100 text-gray-900 font-semibold flex items-center justify-center gap-3 disabled:opacity-60 transition-all shadow-md active:scale-[0.99]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2 text-sm text-gray-700">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Connecting...
                  </span>
                ) : (
                  <>
                    <img
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      alt="Google"
                      className="w-5 h-5"
                    />
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-sky-400/20 w-full" />
                <span className="bg-slate-900 px-3 text-[11px] font-semibold uppercase tracking-wider text-sky-300/60 shrink-0">
                  Or continue with email
                </span>
                <div className="border-t border-sky-400/20 w-full" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="py-3 px-4 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-100 text-xs font-semibold text-center transition-all flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4 text-sky-300" />
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold text-center transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Create Account
                </button>
              </div>
            </div>
          )}

          {/* 2. VIEW: LOGIN */}
          {authModalView === 'login' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setAuthModalView('guest_prompt')}
                  className="flex items-center gap-1.5 text-xs text-sky-300/80 hover:text-sky-200 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <span className="text-xs text-sky-300/60 font-medium">Supabase Login</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold font-serif-display text-white">
                  Welcome Back
                </h3>
                <p className="text-xs text-sky-200/80">
                  Sign in with your email address or Google account.
                </p>
              </div>

              {/* Real Google Sign-In */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-white hover:bg-gray-100 text-gray-900 font-semibold flex items-center justify-center gap-3 disabled:opacity-60 transition-all shadow-md active:scale-[0.99] text-xs sm:text-sm"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2 text-gray-700">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Connecting...
                  </span>
                ) : (
                  <>
                    <img
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      alt="Google"
                      className="w-5 h-5"
                    />
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-sky-400/20 w-full" />
                <span className="bg-slate-900 px-3 text-[10px] font-semibold uppercase tracking-wider text-sky-300/60 shrink-0">
                  Or with email & password
                </span>
                <div className="border-t border-sky-400/20 w-full" />
              </div>

              <form onSubmit={handleLogin} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-sky-200 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-300/60" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-sky-400/30 text-white placeholder:text-sky-300/40 text-xs focus:outline-none focus:border-sky-400 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-sky-200 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setAuthModalView('forgot_password')}
                      className="text-[11px] text-sky-300 hover:text-sky-200 underline font-medium"
                    >
                      Forgot password?
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
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/80 border border-sky-400/30 text-white placeholder:text-sky-300/40 text-xs focus:outline-none focus:border-sky-400 transition-all"
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

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-sky-200/80">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-slate-800 border-sky-400/40 text-sky-500 focus:ring-0"
                    />
                    <span>Remember this device</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.99]"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Sign In'}
                </button>
              </form>

              <div className="text-center pt-2 border-t border-sky-400/15 text-xs text-sky-200/80">
                Don&apos;t have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalView('register')}
                  className="text-sky-300 hover:text-white font-semibold underline ml-1"
                >
                  Create one now
                </button>
              </div>
            </div>
          )}

          {/* 3. VIEW: REGISTER */}
          {authModalView === 'register' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setAuthModalView('login')}
                  className="flex items-center gap-1.5 text-xs text-sky-300/80 hover:text-sky-200 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </button>
                <span className="text-xs text-sky-300/60 font-medium">Create Account</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold font-serif-display text-white">
                  Create Your Account
                </h3>
                <p className="text-xs text-sky-200/80">
                  Join {brandTitle} for custom trip plans, flight quotes, and visa support.
                </p>
              </div>

              {/* Real Google OAuth */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-white hover:bg-gray-100 text-gray-900 font-semibold flex items-center justify-center gap-3 disabled:opacity-60 transition-all shadow-md active:scale-[0.99] text-xs"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2 text-gray-700">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Connecting...
                  </span>
                ) : (
                  <>
                    <img
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      alt="Google"
                      className="w-4 h-4"
                    />
                    <span>Sign up with Google</span>
                  </>
                )}
              </button>

              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-sky-400/20 w-full" />
                <span className="bg-slate-900 px-3 text-[10px] font-semibold uppercase tracking-wider text-sky-300/60 shrink-0">
                  Or register with details
                </span>
                <div className="border-t border-sky-400/20 w-full" />
              </div>

              <form onSubmit={handleRegister} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-sky-200 uppercase tracking-wider">
                      Full Name *
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sky-300/60" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/80 border border-sky-400/30 text-white placeholder:text-sky-300/40 text-xs focus:outline-none focus:border-sky-400 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-sky-200 uppercase tracking-wider">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sky-300/60" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/80 border border-sky-400/30 text-white placeholder:text-sky-300/40 text-xs focus:outline-none focus:border-sky-400 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-sky-200 uppercase tracking-wider">
                      Phone / WhatsApp *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sky-300/60" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        required
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/80 border border-sky-400/30 text-white placeholder:text-sky-300/40 text-xs focus:outline-none focus:border-sky-400 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-sky-200 uppercase tracking-wider">
                      Country *
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sky-300/60" />
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-sky-400/30 text-white text-xs focus:outline-none focus:border-sky-400 transition-all"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-sky-200 uppercase tracking-wider">
                      Password (min 8 chars) *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sky-300/60" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-800/80 border border-sky-400/30 text-white placeholder:text-sky-300/40 text-xs focus:outline-none focus:border-sky-400 transition-all"
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
                        placeholder="••••••••"
                        required
                        className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-800/80 border border-sky-400/30 text-white placeholder:text-sky-300/40 text-xs focus:outline-none focus:border-sky-400 transition-all"
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

                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-sky-300/70">Password strength:</span>
                      <span className={`font-semibold ${passwordMetrics.textColor}`}>
                        {passwordMetrics.label}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordMetrics.color} transition-all duration-300`}
                        style={{ width: passwordMetrics.width }}
                      />
                    </div>
                  </div>
                )}

                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer select-none text-xs text-sky-200/80">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      required
                      className="rounded mt-0.5 bg-slate-800 border-sky-400/40 text-sky-500 focus:ring-0"
                    />
                    <span>
                      I accept the{' '}
                      <span className="text-sky-300 underline">Terms of Service</span> and{' '}
                      <span className="text-sky-300 underline">Privacy Policy</span>.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.99] mt-2"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Create Account'}
                </button>
              </form>

              <div className="text-center pt-2 border-t border-sky-400/15 text-xs text-sky-200/80">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalView('login')}
                  className="text-sky-300 hover:text-white font-semibold underline ml-1"
                >
                  Sign in
                </button>
              </div>
            </div>
          )}

          {/* 4. VIEW: FORGOT PASSWORD */}
          {authModalView === 'forgot_password' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setAuthModalView('login')}
                  className="flex items-center gap-1.5 text-xs text-sky-300/80 hover:text-sky-200 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </button>
                <span className="text-xs text-sky-300/60 font-medium">Supabase Auth</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold font-serif-display text-white">
                  Reset Password
                </h3>
                <p className="text-xs text-sky-200/80">
                  Enter your registered email address and we&apos;ll send you a secure password reset link.
                </p>
              </div>

              {resetMessage && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-200 text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{resetMessage}</span>
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-sky-200 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-300/60" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-sky-400/30 text-white placeholder:text-sky-300/40 text-xs focus:outline-none focus:border-sky-400 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.99]"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Send Reset Link'}
                </button>
              </form>
            </div>
          )}

          {/* 5. VIEW: EMAIL VERIFICATION */}
          {authModalView === 'email_verification' && (
            <div className="space-y-5 text-center">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 mx-auto">
                <Mail className="w-7 h-7 animate-bounce" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold font-serif-display text-white">
                  Check Your Inbox
                </h3>
                <p className="text-xs text-sky-200/80 max-w-sm mx-auto">
                  We sent a confirmation link and code to{' '}
                  <span className="font-semibold text-white">{email || 'your email'}</span>.
                </p>
              </div>

              <form onSubmit={handleVerifyEmail} className="space-y-4 max-w-xs mx-auto">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-sky-200 uppercase tracking-wider">
                    Enter Verification Code
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-300/60" />
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="6-digit code"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-sky-400/30 text-white placeholder:text-sky-300/40 text-center tracking-widest text-sm focus:outline-none focus:border-sky-400 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Confirm & Continue'}
                </button>
              </form>

              <div className="pt-2 text-xs text-sky-300/80 space-y-2">
                <p>Didn&apos;t receive the email?</p>
                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={resendCooldown > 0 || isLoading}
                  className="font-semibold text-sky-200 underline disabled:opacity-40"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Click here to resend'}
                </button>
              </div>
            </div>
          )}

          {/* 6. VIEW: ONBOARDING */}
          {authModalView === 'onboarding' && (
            <div className="space-y-5">
              <div className="space-y-1 text-center">
                <span className="text-2xl">✨</span>
                <h3 className="text-xl sm:text-2xl font-bold font-serif-display text-white">
                  Personalize Your Travel Feed
                </h3>
                <p className="text-xs text-sky-200/80">
                  Select your favorite travel styles to tailor itineraries and deals.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-sky-200 uppercase tracking-wider">
                  Home City / Airport (Optional)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-300/60" />
                  <input
                    type="text"
                    value={homeLocation}
                    onChange={(e) => setHomeLocation(e.target.value)}
                    placeholder="e.g. New York (JFK), London (LHR), Dhaka (DAC)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-sky-400/30 text-white placeholder:text-sky-300/40 text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-sky-200 uppercase tracking-wider">
                  Travel Vibes
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {EXPLORE_PREFERENCES.map((vibe) => {
                    const isSelected = selectedVibes.includes(vibe.label);
                    return (
                      <button
                        key={vibe.id}
                        type="button"
                        onClick={() => handleToggleVibe(vibe.label)}
                        className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold shadow-md'
                            : 'bg-slate-800/60 text-sky-200 border-sky-400/20 hover:border-sky-400/50'
                        }`}
                      >
                        <span>{vibe.emoji}</span>
                        <span>{vibe.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCompleteOnboarding}
                className="w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 mt-4"
              >
                Complete & Explore
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

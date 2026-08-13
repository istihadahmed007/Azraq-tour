import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Check,
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
  Camera,
  Compass,
  Sparkles,
  Plane,
  ShieldCheck,
  CheckCircle2,
  CheckSquare,
  Square,
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
  'Germany',
  'France',
  'Japan',
  'Singapore',
  'Saudi Arabia',
  'Malaysia',
  'Thailand',
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

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
];

// Immersive Left Panel Destination Photo
const DESTINATION_HERO_IMAGE =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';

interface AuthModalProps {
  brandTitle?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ brandTitle = 'GlobeTrotter AI' }) => {
  const {
    authModalOpen,
    authModalView,
    closeAuthModal,
    openAuthModal,
    setAuthModalView,
    user,
    pendingAction,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    sendPasswordReset,
    resetPasswordWithCode,
    verifyEmail,
    verifyEmailWithCode,
    resendVerification,
    sendPhoneOtp,
    verifyPhoneOtp,
    saveOnboardingPreferences,
    showToast,
    isLoading,
    isSupabaseConnected,
    isFirebaseConnected,
    demoVerificationCode,
    demoPhoneOtp,
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
  const [photoURL, setPhotoURL] = useState(PRESET_AVATARS[0]);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Micro-interaction field focus tracking
  const [focusedField, setFocusedField] = useState<'email' | 'password' | 'confirmPassword' | 'fullName' | 'phone' | 'country' | null>(null);

  // Onboarding states
  const [homeLocation, setHomeLocation] = useState('');
  const [selectedVibes, setSelectedVibes] = useState<string[]>(['Culture', 'Food', 'Beaches']);

  // Password reset state (2-step reset flow)
  const [resetStep, setResetStep] = useState<1 | 2>(1);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  // Messages & Verification Codes
  const [verificationCode, setVerificationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // Password Strength Calculator
  const getPasswordMetrics = (pass: string) => {
    const checks = {
      length: pass.length >= 8,
      upper: /[A-Z]/.test(pass),
      lower: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass),
    };
    const passedCount = Object.values(checks).filter(Boolean).length;
    let label = 'Weak';
    let color = 'bg-rose-500';
    let textColor = 'text-rose-400';

    if (passedCount >= 4) {
      label = 'Strong';
      color = 'bg-emerald-400';
      textColor = 'text-emerald-300';
    } else if (passedCount >= 2) {
      label = 'Medium';
      color = 'bg-amber-400';
      textColor = 'text-amber-300';
    }

    return { checks, passedCount, label, color, textColor };
  };

  const passwordMetrics = getPasswordMetrics(password);

  // Phone OTP state
  const [phoneOtp, setPhoneOtp] = useState('');

  const handleVerifyEmailCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!verificationCode.trim()) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }
    const res = await verifyEmailWithCode(verificationCode.trim(), email || user?.email);
    if (!res.success) {
      setErrorMessage(res.error || 'Failed to verify email code.');
    }
  };

  const handleVerifyPhoneOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!phoneOtp.trim()) {
      setErrorMessage('Please enter the 6-digit mobile OTP code.');
      return;
    }
    const res = await verifyPhoneOtp(phoneOtp.trim());
    if (res.success) {
      openAuthModal('onboarding');
    } else {
      setErrorMessage(res.error || 'Invalid OTP code.');
    }
  };

  if (!authModalOpen) return null;

  const handleToggleVibe = (vibeLabel: string) => {
    setSelectedVibes((prev) =>
      prev.includes(vibeLabel) ? prev.filter((v) => v !== vibeLabel) : [...prev, vibeLabel]
    );
  };

  const handleGoogleLogin = async () => {
    setErrorMessage('');
    setInfoMessage('');
    const res = await loginWithGoogle(email, fullName);
    if (!res.success && res.error) {
      setErrorMessage(res.error);
    } else if (res.success) {
      showToast('Signed in & verified by Google! 🎉', 'success');
      closeAuthModal();
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 6) {
      setErrorMessage('Please enter a valid Phone / WhatsApp number.');
      return;
    }
    if (!country.trim()) {
      setErrorMessage('Please select or enter your Country.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Your password needs at least 8 characters for security.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('You must agree to the Terms of Service & Privacy Policy.');
      return;
    }

    const res = await registerWithEmail(fullName, email, phone, country, password, agreeTerms, photoURL);
    if (!res.success) {
      setErrorMessage(res.error || 'Registration failed.');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your account password.");
      return;
    }

    const res = await loginWithEmail(email, password, rememberMe);
    if (!res.success) {
      setErrorMessage(res.error || "We couldn't find an account matching those credentials.");
    }
  };

  const handleRequestResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setResetMessage('');
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    const res = await sendPasswordReset(email);
    if (res.success) {
      setResetStep(2);
      if (res.demoCode) {
        setResetCode(res.demoCode);
      }
      setResetMessage(res.message || `Reset code generated for ${email}. Please enter it below along with your new password.`);
    } else {
      setErrorMessage(res.error || 'Error sending password reset request.');
    }
  };

  const handleConfirmResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!resetCode.trim()) {
      setErrorMessage('Please enter the reset code.');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }

    const res = await resetPasswordWithCode(email, resetCode, newPassword);
    if (res.success) {
      showToast('Password reset successfully! You can now log in.', 'success');
      setPassword(newPassword);
      openAuthModal('login');
      setResetStep(1);
    } else {
      setErrorMessage(res.error || 'Failed to reset password. Check your code and try again.');
    }
  };

  const handleResendEmail = async () => {
    setInfoMessage('');
    const res = await resendVerification();
    if (res.success) {
      setInfoMessage('Verification code resent! Check your inbox.');
    }
  };

  const handleVerifyEmailNow = async () => {
    await verifyEmail();
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveOnboardingPreferences(homeLocation, selectedVibes);
    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl lg:max-w-5xl bg-slate-900/95 border border-sky-300/30 rounded-3xl shadow-2xl text-white backdrop-blur-2xl overflow-hidden my-auto flex flex-col md:flex-row min-h-[620px]"
      >
        {/* Close Modal Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-30 p-2 rounded-full text-sky-200/80 hover:text-white hover:bg-white/10 transition-colors bg-slate-900/40 backdrop-blur-sm"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COMPOSITION PANEL */}
        <div className="hidden md:flex md:w-5/12 lg:w-1/2 relative flex-col justify-between p-8 overflow-hidden border-r border-sky-300/20 select-none">
          <div
            className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out ${
              focusedField === 'password' ? 'scale-110 brightness-95' : 'scale-100 brightness-90'
            }`}
            style={{ backgroundImage: `url(${DESTINATION_HERO_IMAGE})` }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-950/30 pointer-events-none" />

          {/* Animated Flight Path */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-75"
            viewBox="0 0 400 600"
            fill="none"
          >
            <path
              d="M 60 120 Q 200 250 140 420 T 340 500"
              stroke="rgba(56, 189, 248, 0.4)"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              className={focusedField === 'email' ? 'animate-pulse stroke-amber-300' : ''}
            />
            <circle cx="60" cy="120" r="5" fill="#38bdf8" />
            <circle cx="60" cy="120" r="10" fill="rgba(56, 189, 248, 0.2)" className="animate-ping" />
            <circle cx="140" cy="420" r="5" fill="#f59e0b" />
            <circle cx="140" cy="420" r="10" fill="rgba(245, 158, 11, 0.2)" className="animate-ping" />
            <circle cx="340" cy="500" r="5" fill="#38bdf8" />
          </svg>

          {/* Floating Badges */}
          <div className="relative z-20 flex flex-col gap-3 items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/60 border border-sky-400/40 backdrop-blur-md text-xs font-semibold text-sky-200 shadow-lg">
              <Compass className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
              <span>Discover → Connect → Travel</span>
            </div>

            <motion.div
              animate={focusedField === 'email' ? { y: [0, -4, 0] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-[11px] font-medium text-white shadow-md"
            >
              <MapPin className="w-3 h-3 text-rose-400" />
              <span>Amalfi Coast, Italy</span>
            </motion.div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-[11px] font-medium text-white shadow-md ml-8">
              <Plane className="w-3 h-3 text-sky-400" />
              <span>Tokyo • Kyoto • Bali</span>
            </div>
          </div>

          <div className="relative z-20 mt-auto pt-10">
            <div className="flex items-center gap-1 text-amber-300 mb-2 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Original Travel Experience</span>
            </div>

            <h2 className="font-serif-display text-2xl lg:text-3xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
              YOUR NEXT ADVENTURE STARTS HERE
            </h2>

            <p className="text-xs lg:text-sm text-sky-100/80 leading-relaxed mt-2 max-w-sm">
              Connect with fellow global explorers, curate AI itineraries, and request customized flight and visa quotations.
            </p>

            <div className="mt-4 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-sky-200/70">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {isFirebaseConnected
                  ? 'Firebase Firestore & Auth'
                  : isSupabaseConnected
                  ? 'Supabase Authentication'
                  : 'Secure Hashed Password Auth'}
              </span>
              <span className="flex items-center gap-1 font-mono text-[10px]">
                {isFirebaseConnected ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                    🔥 Firebase Live
                  </span>
                ) : isSupabaseConnected ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    ⚡ Supabase Live
                  </span>
                ) : (
                  <span>100% Free Account</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="w-full md:w-7/12 lg:w-1/2 p-5 sm:p-6 lg:p-7 flex flex-col justify-center relative z-20 bg-slate-900/90 overflow-y-auto max-h-[85vh] md:max-h-[90vh] [scrollbar-width:thin] [scrollbar-color:rgba(56,189,248,0.3)_transparent]">
          {/* Mobile Travel Header Badge */}
          <div className="md:hidden flex items-center gap-2 mb-2 pb-2 border-b border-sky-300/20">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-300/40 flex items-center justify-center text-sm">
              🌍
            </div>
            <div>
              <span className="text-xs font-bold text-white block">{brandTitle}</span>
              <span className="text-[10px] text-sky-200/70">Discover → Connect → Travel</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* VIEW 1: REGISTRATION */}
            {authModalView === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-2.5"
              >
                <div>
                  <h3 className="font-serif-display text-2xl font-bold text-white tracking-tight">
                    Start Your Journey
                  </h3>
                  <p className="text-xs text-sky-200/80 mt-0.5">
                    Create your account to unlock trip planning, quotes, and saved destinations.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs font-medium text-center">
                    {errorMessage}
                  </div>
                )}

                {/* Continue with Google */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full py-2 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs transition-all flex items-center justify-center gap-2.5 shadow-md active:scale-98"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.23v3.15C3.21 21.32 7.31 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.23C.44 8.16 0 9.98 0 12s.44 3.84 1.23 5.42l4.05-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.21 2.68 1.23 6.58l4.05 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="relative flex items-center justify-center my-0.5">
                  <div className="border-t border-sky-300/20 w-full" />
                  <span className="bg-slate-900 px-2.5 text-[10px] text-sky-200/60 uppercase tracking-widest font-semibold shrink-0">
                    OR REGISTER WITH EMAIL
                  </span>
                  <div className="border-t border-sky-300/20 w-full" />
                </div>

                {/* REGISTRATION FORM */}
                <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-2 text-xs">
                  {/* Full Name & Email Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-sky-100 mb-0.5">Full Name *</label>
                      <div className="relative">
                        <UserIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-sky-300/70" />
                        <input
                          type="text"
                          required
                          placeholder="Alex Mercer"
                          value={fullName}
                          onFocus={() => setFocusedField('fullName')}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/10 border border-sky-300/30 text-white text-xs placeholder-sky-200/40 focus:outline-none focus:border-sky-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-sky-100 mb-0.5">Email Address *</label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-sky-300/70" />
                        <input
                          type="email"
                          required
                          placeholder="alex@example.com"
                          value={email}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/10 border border-sky-300/30 text-white text-xs placeholder-sky-200/40 focus:outline-none focus:border-sky-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone / WhatsApp & Country Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-sky-100 mb-0.5">Phone / WhatsApp *</label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-sky-300/70" />
                        <input
                          type="tel"
                          required
                          placeholder="+1 (555) 019-2834"
                          value={phone}
                          onFocus={() => setFocusedField('phone')}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/10 border border-sky-300/30 text-white text-xs placeholder-sky-200/40 focus:outline-none focus:border-sky-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-sky-100 mb-0.5">Country *</label>
                      <div className="relative">
                        <Globe className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-sky-300/70" />
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800 border border-sky-300/30 text-white text-xs focus:outline-none focus:border-sky-400"
                        >
                          {COUNTRIES_LIST.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Passwords Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-sky-100 mb-0.5">Password *</label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-sky-300/70" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          minLength={8}
                          placeholder="Min 8 chars"
                          value={password}
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-white/10 border border-sky-300/30 text-white text-xs placeholder-sky-200/40 focus:outline-none focus:border-sky-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sky-300/70 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-sky-100 mb-0.5">Confirm Password *</label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-sky-300/70" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          minLength={8}
                          placeholder="Repeat password"
                          value={confirmPassword}
                          onFocus={() => setFocusedField('confirmPassword')}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-white/10 border border-sky-300/30 text-white text-xs placeholder-sky-200/40 focus:outline-none focus:border-sky-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sky-300/70 hover:text-white"
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Password Strength Meter */}
                  {password.length > 0 && (
                    <div className="p-2 rounded-xl bg-white/5 border border-sky-300/20 text-[11px] flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sky-200/80 font-medium">Password Strength:</span>
                        <span className={`font-bold ${passwordMetrics.textColor}`}>
                          {passwordMetrics.label}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex gap-0.5">
                        <div
                          className={`h-full transition-all duration-300 ${
                            passwordMetrics.passedCount >= 1 ? passwordMetrics.color : 'bg-transparent'
                          }`}
                          style={{ width: '33.3%' }}
                        />
                        <div
                          className={`h-full transition-all duration-300 ${
                            passwordMetrics.passedCount >= 3 ? passwordMetrics.color : 'bg-transparent'
                          }`}
                          style={{ width: '33.3%' }}
                        />
                        <div
                          className={`h-full transition-all duration-300 ${
                            passwordMetrics.passedCount >= 4 ? passwordMetrics.color : 'bg-transparent'
                          }`}
                          style={{ width: '33.3%' }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] text-sky-200/70 pt-0.5">
                        <span className={passwordMetrics.checks.length ? 'text-emerald-300 flex items-center gap-1' : 'flex items-center gap-1'}>
                          {passwordMetrics.checks.length ? '✓ 8+ chars' : '○ 8+ chars'}
                        </span>
                        <span className={passwordMetrics.checks.upper ? 'text-emerald-300 flex items-center gap-1' : 'flex items-center gap-1'}>
                          {passwordMetrics.checks.upper ? '✓ Uppercase' : '○ Uppercase'}
                        </span>
                        <span className={passwordMetrics.checks.number ? 'text-emerald-300 flex items-center gap-1' : 'flex items-center gap-1'}>
                          {passwordMetrics.checks.number ? '✓ Number' : '○ Number'}
                        </span>
                        <span className={passwordMetrics.checks.special ? 'text-emerald-300 flex items-center gap-1' : 'flex items-center gap-1'}>
                          {passwordMetrics.checks.special ? '✓ Symbol (!@#)' : '○ Symbol (!@#)'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Checkbox: Agree to Terms */}
                  <div className="flex items-start gap-2 pt-0.5">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      required
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 w-3.5 h-3.5 rounded bg-white/10 border-sky-300/30 text-sky-500 focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="agreeTerms" className="text-[11px] text-sky-200/80 cursor-pointer select-none leading-tight">
                      I agree to the <span className="text-sky-300 underline">Terms of Service</span> & <span className="text-sky-300 underline">Privacy Policy</span>.
                    </label>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-1 py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Create Free Account'}
                  </button>
                </form>

                <div className="text-center pt-2 border-t border-sky-300/20 text-xs">
                  <span className="text-sky-200/80">Already have an account? </span>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="font-semibold text-sky-300 hover:text-white underline underline-offset-2"
                  >
                    Log in
                  </button>
                </div>
              </motion.div>
            )}

            {/* VIEW 1B: EMAIL VERIFICATION */}
            {authModalView === 'email_verification' && (
              <motion.div
                key="email_verification"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="flex flex-col gap-4 text-center items-center py-2"
              >
                <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-300/40 flex items-center justify-center text-sky-300 shadow-xl">
                  <Mail className="w-7 h-7" />
                </div>

                <div>
                  <h3 className="font-serif-display text-2xl font-bold text-white mb-1">
                    Verify Your Email Address
                  </h3>
                  <p className="text-xs text-sky-200/80 max-w-sm">
                    We&apos;ve sent a 6-digit verification code to{' '}
                    <strong className="text-white">{email || user?.email || 'your email'}</strong>.
                  </p>
                </div>

                {demoVerificationCode && (
                  <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-mono font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Demo Email Code: <span className="tracking-widest text-white">{demoVerificationCode}</span>
                  </div>
                )}

                {errorMessage && (
                  <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs font-medium w-full text-center">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleVerifyEmailCodeSubmit} className="w-full flex flex-col gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-sky-100 mb-1 text-left">
                      Enter 6-Digit Verification Code
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-300/70" />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="e.g. 123456"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/10 border border-sky-300/30 text-white text-base font-mono tracking-widest text-center focus:outline-none focus:border-sky-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Verify Email & Continue'}
                  </button>
                </form>

                <div className="w-full flex flex-col gap-2 pt-2 border-t border-sky-300/20 text-xs">
                  <button
                    onClick={async () => {
                      const res = await resendVerification(email || user?.email);
                      if (res.success) {
                        showToast(res.message || 'Verification code resent!', 'info');
                      }
                    }}
                    className="text-sky-300 hover:text-white font-semibold underline underline-offset-2"
                  >
                    Resend Verification Code
                  </button>
                  <div className="flex items-center justify-center gap-3 text-sky-200/60 pt-1">
                    <button
                      onClick={() => setAuthModalView('register')}
                      className="hover:text-white underline underline-offset-2"
                    >
                      Change Email
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => openAuthModal('login')}
                      className="hover:text-white underline underline-offset-2"
                    >
                      Back to Login
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW 1C: PHONE OTP VERIFICATION */}
            {authModalView === 'phone_otp' && (
              <motion.div
                key="phone_otp"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="flex flex-col gap-4 text-center items-center py-2"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shadow-xl">
                  <Phone className="w-7 h-7" />
                </div>

                <div>
                  <h3 className="font-serif-display text-2xl font-bold text-white mb-1">
                    Mobile Phone Verification
                  </h3>
                  <p className="text-xs text-sky-200/80 max-w-sm">
                    Enter the 6-digit OTP code sent to{' '}
                    <strong className="text-white">{phone || user?.phone || 'your mobile number'}</strong>.
                  </p>
                </div>

                {demoPhoneOtp && (
                  <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-mono font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Demo Phone OTP: <span className="tracking-widest text-white">{demoPhoneOtp}</span>
                  </div>
                )}

                {errorMessage && (
                  <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs font-medium w-full text-center">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleVerifyPhoneOtpSubmit} className="w-full flex flex-col gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-sky-100 mb-1 text-left">
                      Enter 6-Digit Mobile OTP
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-300/70" />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="e.g. 654321"
                        value={phoneOtp}
                        onChange={(e) => setPhoneOtp(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/10 border border-sky-300/30 text-white text-base font-mono tracking-widest text-center focus:outline-none focus:border-sky-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Verify Mobile Number'}
                  </button>
                </form>

                <div className="w-full flex items-center justify-between pt-2 border-t border-sky-300/20 text-xs">
                  <button
                    onClick={async () => {
                      const res = await sendPhoneOtp();
                      if (res.success) {
                        showToast(res.message || 'OTP resent!', 'info');
                      }
                    }}
                    className="text-sky-300 hover:text-white font-semibold underline underline-offset-2"
                  >
                    Resend Mobile OTP
                  </button>

                  <button
                    onClick={() => openAuthModal('onboarding')}
                    className="text-sky-200/70 hover:text-white"
                  >
                    Skip for now
                  </button>
                </div>
              </motion.div>
            )}

            {/* VIEW 2: LOGIN */}
            {authModalView === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4"
              >
                <div>
                  <h3 className="font-serif-display text-2xl lg:text-3xl font-bold text-white tracking-tight">
                    Welcome Back, Traveler
                  </h3>
                  <p className="text-xs sm:text-sm text-sky-200/80 mt-1">
                    Sign in to manage your bookings, quotes, and saved itineraries.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs font-medium text-center">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-sky-100 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-300/70" />
                      <input
                        type="email"
                        required
                        placeholder="alex@example.com"
                        value={email}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/10 border border-sky-300/30 text-white text-sm placeholder-sky-200/40 focus:outline-none focus:border-sky-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-sky-100">Password</label>
                      <button
                        type="button"
                        onClick={() => openAuthModal('forgot_password')}
                        className="text-[11px] text-sky-300 hover:text-white underline underline-offset-2"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-300/70" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={password}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white/10 border border-sky-300/30 text-white text-sm placeholder-sky-200/40 focus:outline-none focus:border-sky-400 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sky-300/70 hover:text-white transition-colors"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-0.5">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded bg-white/10 border-sky-300/30 text-sky-500 focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="rememberMe" className="text-xs text-sky-200/80 cursor-pointer select-none">
                      Remember me on this device
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Log In & Continue'}
                  </button>
                </form>

                <div className="relative flex items-center justify-center my-0.5">
                  <div className="border-t border-sky-300/20 w-full" />
                  <span className="bg-slate-900 px-3 text-[11px] text-sky-200/60 uppercase tracking-widest font-semibold shrink-0">
                    OR
                  </span>
                  <div className="border-t border-sky-300/20 w-full" />
                </div>

                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs transition-all flex items-center justify-center gap-2.5 shadow-md active:scale-98"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.23v3.15C3.21 21.32 7.31 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.23C.44 8.16 0 9.98 0 12s.44 3.84 1.23 5.42l4.05-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.21 2.68 1.23 6.58l4.05 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="text-center pt-3 border-t border-sky-300/20 text-xs">
                  <span className="text-sky-200/80">New here? </span>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="font-semibold text-sky-300 hover:text-white underline underline-offset-2"
                  >
                    Create your account
                  </button>
                </div>
              </motion.div>
            )}

            {/* VIEW 3: GUEST PROMPT */}
            {authModalView === 'guest_prompt' && (
              <motion.div
                key="guest_prompt"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="flex flex-col items-center text-center gap-5"
              >
                <div className="w-16 h-16 rounded-2xl bg-sky-500/20 border border-sky-300/40 flex items-center justify-center text-3xl shadow-xl">
                  🌍
                </div>

                <div>
                  <h3 className="font-serif-display text-2xl font-bold text-white mb-2">
                    Join the Travel Community 🌍
                  </h3>
                  <p className="text-xs sm:text-sm text-sky-100/80 leading-relaxed max-w-sm">
                    Sign up or log in to save places, manage custom flight & visa requests, and build itineraries.
                  </p>

                  {pendingAction && (
                    <div className="mt-3 px-3 py-1.5 rounded-xl bg-sky-950/80 border border-amber-400/40 text-xs text-sky-200 inline-flex items-center gap-1.5 shadow-md">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      Pending Action: <strong className="text-white">{pendingAction.label}</strong>
                    </div>
                  )}
                </div>

                <div className="w-full flex flex-col gap-3 mt-1">
                  <button
                    onClick={() => openAuthModal('register')}
                    className="w-full py-3.5 px-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all shadow-xl"
                  >
                    Create Free Account
                  </button>

                  <button
                    onClick={() => openAuthModal('login')}
                    className="w-full py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-all border border-white/10"
                  >
                    Log In Existing Account
                  </button>

                  <button
                    onClick={closeAuthModal}
                    className="w-full py-2 px-4 text-sky-200/80 text-xs font-medium hover:text-white"
                  >
                    Continue Browsing
                  </button>
                </div>
              </motion.div>
            )}

            {/* VIEW 4: PERSONALIZATION */}
            {authModalView === 'onboarding' && (
              <motion.div
                key="onboarding"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="flex flex-col gap-4"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-lg mb-2">
                    🧭
                  </div>
                  <h3 className="font-serif-display text-2xl font-bold text-white mb-1">
                    Tell us what you love to explore
                  </h3>
                  <p className="text-xs text-sky-200/80">
                    Select your favorite travel vibes so we can personalize your AI itineraries.
                  </p>
                </div>

                <form onSubmit={handleOnboardingSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {EXPLORE_PREFERENCES.map((pref) => {
                      const isSelected = selectedVibes.includes(pref.label);
                      return (
                        <button
                          key={pref.id}
                          type="button"
                          onClick={() => handleToggleVibe(pref.label)}
                          className={`p-2.5 rounded-2xl text-xs font-semibold transition-all border flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? 'bg-sky-500 border-sky-300 text-slate-950 shadow-lg scale-102 font-bold'
                              : 'bg-white/5 border-sky-300/20 text-sky-200 hover:bg-white/10'
                          }`}
                        >
                          <span className="text-sm">{pref.emoji}</span>
                          <span>{pref.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-sky-100 mb-1">
                      Where are you based? (Optional)
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-300/70" />
                      <input
                        type="text"
                        placeholder="e.g. San Francisco, USA or Dhaka, Bangladesh"
                        value={homeLocation}
                        onChange={(e) => setHomeLocation(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/10 border border-sky-300/30 text-white text-sm placeholder-sky-200/40 focus:outline-none focus:border-sky-400"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-1">
                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all shadow-xl"
                    >
                      Save Preferences & Get Started
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* VIEW 5: FORGOT PASSWORD (2-STEP RESET FLOW) */}
            {authModalView === 'forgot_password' && (
              <motion.div
                key="forgot_password"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="flex flex-col gap-4"
              >
                <button
                  onClick={() => {
                    setResetStep(1);
                    openAuthModal('login');
                  }}
                  className="text-xs text-sky-300 hover:text-white flex items-center gap-1 font-medium w-fit"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Log In</span>
                </button>

                <div>
                  <h3 className="font-serif-display text-2xl font-bold text-white mb-1">
                    Password Reset Service
                  </h3>
                  <p className="text-xs text-sky-200/80">
                    {resetStep === 1
                      ? 'Enter your registered email address to receive a secure 6-digit reset code.'
                      : 'Enter the 6-digit reset code sent to your email and set a new password.'}
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs font-medium text-center">
                    {errorMessage}
                  </div>
                )}

                {resetMessage && (
                  <div className="p-3 rounded-2xl bg-sky-500/20 border border-sky-400/40 text-sky-200 text-xs font-medium text-center">
                    {resetMessage}
                  </div>
                )}

                {resetStep === 1 ? (
                  <form onSubmit={handleRequestResetCode} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-sky-100 mb-1">Email Address *</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-300/70" />
                        <input
                          type="email"
                          required
                          placeholder="alex@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/10 border border-sky-300/30 text-white text-sm placeholder-sky-200/40 focus:outline-none focus:border-sky-400"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all shadow-xl"
                    >
                      Generate Reset Code
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleConfirmResetPassword} className="flex flex-col gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-sky-100 mb-1">6-Digit Reset Code *</label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-300/70" />
                        <input
                          type="text"
                          required
                          maxLength={6}
                          placeholder="e.g. 123456"
                          value={resetCode}
                          onChange={(e) => setResetCode(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/10 border border-sky-300/30 text-white text-sm font-mono tracking-widest focus:outline-none focus:border-sky-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-sky-100 mb-1">New Password (Min 8 chars) *</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-300/70" />
                        <input
                          type="password"
                          required
                          minLength={8}
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/10 border border-sky-300/30 text-white text-sm focus:outline-none focus:border-sky-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-sky-100 mb-1">Confirm New Password *</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-300/70" />
                        <input
                          type="password"
                          required
                          minLength={8}
                          placeholder="••••••••"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/10 border border-sky-300/30 text-white text-sm focus:outline-none focus:border-sky-400"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-xl"
                    >
                      Update Password & Sign In
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};


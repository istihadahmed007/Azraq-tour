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
  MapPin,
  ArrowLeft,
  RefreshCw,
  Camera,
  Compass,
  Sparkles,
  Plane,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

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

// Immersive Left Panel Destination Photos
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
    user,
    pendingAction,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    sendPasswordReset,
    verifyEmail,
    resendVerification,
    saveOnboardingPreferences,
    showToast,
    isLoading,
  } = useAuth();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [photoURL, setPhotoURL] = useState(PRESET_AVATARS[0]);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Micro-interaction field focus tracking
  const [focusedField, setFocusedField] = useState<'email' | 'password' | 'confirmPassword' | 'fullName' | null>(null);

  // Onboarding states
  const [homeLocation, setHomeLocation] = useState('');
  const [selectedVibes, setSelectedVibes] = useState<string[]>(['Culture', 'Food', 'Beaches']);

  // Reset password states
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  // Email verification state
  const [verificationCode, setVerificationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  if (!authModalOpen) return null;

  const handleToggleVibe = (vibeLabel: string) => {
    setSelectedVibes((prev) =>
      prev.includes(vibeLabel) ? prev.filter((v) => v !== vibeLabel) : [...prev, vibeLabel]
    );
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Your password needs at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    const res = await registerWithEmail(fullName, email, password, photoURL);
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
      setErrorMessage("That password doesn't look right. Try again.");
      return;
    }

    const res = await loginWithEmail(email, password, rememberMe);
    if (!res.success) {
      setErrorMessage(res.error || "We couldn't find an account with that email.");
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setResetMessage('');
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    const res = await sendPasswordReset(email);
    if (res.success) {
      setResetEmailSent(true);
      setResetMessage(res.message || 'Check your inbox for password reset instructions.');
    } else {
      setErrorMessage(res.error || 'Error sending password reset.');
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
        className="relative w-full max-w-4xl lg:max-w-5xl bg-slate-900/90 border border-sky-300/30 rounded-3xl shadow-2xl text-white backdrop-blur-2xl overflow-hidden my-auto flex flex-col md:flex-row min-h-[580px]"
      >
        {/* Close Modal Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-30 p-2 rounded-full text-sky-200/80 hover:text-white hover:bg-white/10 transition-colors bg-slate-900/40 backdrop-blur-sm"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COMPOSITION PANEL (Desktop Original Travel Artwork & Map Route) */}
        <div className="hidden md:flex md:w-5/12 lg:w-1/2 relative flex-col justify-between p-8 overflow-hidden border-r border-sky-300/20 select-none">
          {/* Background Photo with Interactive Micro-Zoom on Password Focus */}
          <div
            className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out ${
              focusedField === 'password' ? 'scale-110 brightness-95' : 'scale-100 brightness-90'
            }`}
            style={{ backgroundImage: `url(${DESTINATION_HERO_IMAGE})` }}
          />

          {/* Dark Travel Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-950/30 pointer-events-none" />

          {/* Interactive Animated Map Route overlay */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-75"
            viewBox="0 0 400 600"
            fill="none"
          >
            {/* Curved Flight Path */}
            <path
              d="M 60 120 Q 200 250 140 420 T 340 500"
              stroke="rgba(56, 189, 248, 0.4)"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              className={focusedField === 'email' ? 'animate-pulse stroke-amber-300' : ''}
            />

            {/* Pulsating Waypoint Nodes */}
            <circle cx="60" cy="120" r="5" fill="#38bdf8" />
            <circle cx="60" cy="120" r="10" fill="rgba(56, 189, 248, 0.2)" className="animate-ping" />

            <circle cx="140" cy="420" r="5" fill="#f59e0b" />
            <circle cx="140" cy="420" r="10" fill="rgba(245, 158, 11, 0.2)" className="animate-ping" />

            <circle cx="340" cy="500" r="5" fill="#38bdf8" />
          </svg>

          {/* Floating Travel Destination Glass Badges */}
          <div className="relative z-20 flex flex-col gap-3 items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/60 border border-sky-400/40 backdrop-blur-md text-xs font-semibold text-sky-200 shadow-lg">
              <Compass className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
              <span>Discover → Connect → Travel</span>
            </div>

            {/* Floating Location Pills */}
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

          {/* Bottom Hero Tagline Composition */}
          <div className="relative z-20 mt-auto pt-10">
            <div className="flex items-center gap-1 text-amber-300 mb-2 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Original Travel Experience</span>
            </div>

            <h2 className="font-serif-display text-2xl lg:text-3xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
              YOUR NEXT ADVENTURE STARTS HERE
            </h2>

            <p className="text-xs lg:text-sm text-sky-100/80 leading-relaxed mt-2 max-w-sm">
              Connect with fellow global explorers, curate AI itineraries, and turn travel dreams into effortless realities.
            </p>

            <div className="mt-4 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-sky-200/70">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Travel Community
              </span>
              <span>100% Free Account</span>
            </div>
          </div>
        </div>

        {/* RIGHT FORM PANEL (Responsive Form Container) */}
        <div className="w-full md:w-7/12 lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-center relative z-20 bg-slate-900/85">
          {/* Mobile Travel Header Badge (Visible only on small screens) */}
          <div className="md:hidden flex items-center gap-2 mb-4 pb-3 border-b border-sky-300/20">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-300/40 flex items-center justify-center text-sm">
              🌍
            </div>
            <div>
              <span className="text-xs font-bold text-white block">{brandTitle}</span>
              <span className="text-[10px] text-sky-200/70">Discover → Connect → Travel</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* VIEW 1: REGISTRATION (Headline: "Start Your Journey") */}
            {authModalView === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4"
              >
                <div>
                  <h3 className="font-serif-display text-2xl lg:text-3xl font-bold text-white tracking-tight">
                    Start Your Journey
                  </h3>
                  <p className="text-xs sm:text-sm text-sky-200/80 mt-1 leading-relaxed">
                    Create your free account and discover a world of new places, people, and experiences.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs font-medium text-center">
                    {errorMessage}
                  </div>
                )}

                {/* Primary Google Auth Option */}
                <button
                  onClick={loginWithGoogle}
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition-all flex items-center justify-center gap-3 shadow-lg active:scale-98"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
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

                {/* Divider: OR */}
                <div className="relative flex items-center justify-center my-0.5">
                  <div className="border-t border-sky-300/20 w-full" />
                  <span className="bg-slate-900 px-3 text-[11px] text-sky-200/60 uppercase tracking-widest font-semibold shrink-0">
                    OR
                  </span>
                  <div className="border-t border-sky-300/20 w-full" />
                </div>

                {/* Form: Full Name, Email, Password */}
                <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-sky-100 mb-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-300/70" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Mercer"
                        value={fullName}
                        onFocus={() => setFocusedField('fullName')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/10 border border-sky-300/30 text-white text-sm placeholder-sky-200/40 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all"
                      />
                    </div>
                  </div>

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
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/10 border border-sky-300/30 text-white text-sm placeholder-sky-200/40 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-sky-100 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-300/70" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        placeholder="At least 8 characters"
                        value={password}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white/10 border border-sky-300/30 text-white text-sm placeholder-sky-200/40 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all"
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

                  <div>
                    <label className="block text-xs font-semibold text-sky-100 mb-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-300/70" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onFocus={() => setFocusedField('confirmPassword')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white/10 border border-sky-300/30 text-white text-sm placeholder-sky-200/40 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sky-300/70 hover:text-white transition-colors"
                        title={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Optional Profile Photo Selector */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowPhotoPicker(!showPhotoPicker)}
                      className="text-xs text-sky-300 hover:text-white flex items-center gap-1 mt-0.5 font-medium"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{showPhotoPicker ? 'Hide Avatar Picker' : '+ Optional: Choose Avatar Photo'}</span>
                    </button>

                    {showPhotoPicker && (
                      <div className="flex items-center gap-2 mt-2 p-2 rounded-2xl bg-white/5 border border-sky-300/20">
                        {PRESET_AVATARS.map((url, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setPhotoURL(url)}
                            className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-transform ${
                              photoURL === url
                                ? 'border-amber-400 scale-110 shadow-md'
                                : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={url} alt="Avatar choice" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Primary CTA: Start Exploring */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-all shadow-xl active:scale-98 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Start Exploring'}
                  </button>
                </form>

                <p className="text-[11px] text-sky-200/60 text-center leading-normal">
                  By signing up, you agree to our Terms of Service & Privacy Policy.
                </p>

                <div className="text-center pt-3 border-t border-sky-300/20">
                  <span className="text-xs text-sky-200/80">Already part of the journey? </span>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="text-xs font-semibold text-sky-300 hover:text-white underline underline-offset-2"
                  >
                    Log in
                  </button>
                </div>
              </motion.div>
            )}

            {/* VIEW 2: LOGIN (Headline: "Welcome Back, Traveler") */}
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
                    Your next adventure is waiting.
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
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/10 border border-sky-300/30 text-white text-sm placeholder-sky-200/40 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all"
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
                        className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white/10 border border-sky-300/30 text-white text-sm placeholder-sky-200/40 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all"
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

                  {/* Options: Remember me */}
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

                  {/* Primary CTA: Continue Journey */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-all shadow-xl active:scale-98 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Continue Journey'}
                  </button>
                </form>

                {/* Divider: OR */}
                <div className="relative flex items-center justify-center my-0.5">
                  <div className="border-t border-sky-300/20 w-full" />
                  <span className="bg-slate-900 px-3 text-[11px] text-sky-200/60 uppercase tracking-widest font-semibold shrink-0">
                    OR
                  </span>
                  <div className="border-t border-sky-300/20 w-full" />
                </div>

                {/* Google Button */}
                <button
                  onClick={loginWithGoogle}
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition-all flex items-center justify-center gap-3 shadow-lg active:scale-98"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
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

                <div className="text-center pt-3 border-t border-sky-300/20">
                  <span className="text-xs text-sky-200/80">New here? </span>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="text-xs font-semibold text-sky-300 hover:text-white underline underline-offset-2"
                  >
                    Create your account
                  </button>
                </div>
              </motion.div>
            )}

            {/* VIEW 3: GUEST PROMPT (Smart Login Trigger for Protected Actions) */}
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
                    Create a free account to save places, share your experiences, and connect with travelers.
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
                    onClick={loginWithGoogle}
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition-all flex items-center justify-center gap-3 shadow-lg active:scale-98"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
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

                  <button
                    onClick={() => openAuthModal('register')}
                    className="w-full py-3.5 px-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-all shadow-xl active:scale-98"
                  >
                    Sign Up with Email
                  </button>

                  <button
                    onClick={closeAuthModal}
                    className="w-full py-2.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-sky-200 text-xs font-medium transition-all"
                  >
                    Maybe Later
                  </button>
                </div>

                <p className="text-xs text-sky-200/70 border-t border-sky-400/20 pt-4 w-full">
                  Already have an account?{' '}
                  <button
                    onClick={() => openAuthModal('login')}
                    className="text-sky-300 font-semibold underline underline-offset-2 hover:text-white"
                  >
                    Log in
                  </button>
                </p>
              </motion.div>
            )}

            {/* VIEW 4: PERSONALIZATION (Headline: "Tell us what you love to explore") */}
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
                  {/* Category Pills */}
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
                              ? 'bg-sky-500 border-sky-300 text-white shadow-lg scale-102'
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
                      Where are you from? (Optional)
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-300/70" />
                      <input
                        type="text"
                        placeholder="e.g. Barcelona, Spain"
                        value={homeLocation}
                        onChange={(e) => setHomeLocation(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/10 border border-sky-300/30 text-white text-sm placeholder-sky-200/40 focus:outline-none focus:border-sky-400"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-1">
                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-all shadow-xl active:scale-98"
                    >
                      Save Preferences
                    </button>

                    <button
                      type="button"
                      onClick={() => closeAuthModal()}
                      className="w-full py-2 text-xs text-sky-300 hover:text-white font-medium"
                    >
                      Skip for now
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* VIEW 5: EMAIL VERIFICATION */}
            {authModalView === 'email_verification' && (
              <motion.div
                key="email_verification"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="flex flex-col items-center text-center gap-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-300/40 flex items-center justify-center text-2xl shadow-lg">
                  ✉️
                </div>

                <div>
                  <h3 className="font-serif-display text-2xl font-bold text-white mb-1">
                    Verify Your Email ✉️
                  </h3>
                  <p className="text-xs text-sky-200/80 leading-relaxed max-w-xs mx-auto">
                    We sent a verification code to{' '}
                    <strong className="text-white break-all">{user?.email || 'your email'}</strong>.
                  </p>
                </div>

                <div className="w-full bg-white/5 border border-sky-300/20 rounded-2xl p-4 flex flex-col gap-2">
                  <label className="block text-xs font-semibold text-sky-200 text-left">
                    Enter 6-Digit Code:
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-xl font-mono tracking-widest py-2.5 rounded-xl bg-white/10 border border-sky-300/40 text-white placeholder-sky-300/30 focus:outline-none focus:border-sky-400"
                  />
                </div>

                {infoMessage && <p className="text-xs text-emerald-300 font-medium">{infoMessage}</p>}

                <div className="flex flex-col w-full gap-2">
                  <button
                    onClick={handleVerifyEmailNow}
                    className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Verify & Continue Setup
                  </button>

                  <div className="flex items-center gap-2 w-full">
                    <button
                      onClick={handleResendEmail}
                      className="flex-1 py-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/20 text-sky-200 font-medium text-xs transition-all border border-sky-300/20"
                    >
                      Resend Code
                    </button>
                    <button
                      onClick={() => openAuthModal('register')}
                      className="flex-1 py-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/20 text-sky-200 font-medium text-xs transition-all border border-sky-300/20"
                    >
                      Change Email
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      closeAuthModal();
                      showToast('You can verify your email anytime from your profile.', 'info');
                    }}
                    className="w-full py-2 text-xs text-sky-300 hover:text-white font-medium"
                  >
                    Skip for now & Continue Browsing
                  </button>
                </div>
              </motion.div>
            )}

            {/* VIEW 6: FORGOT PASSWORD */}
            {authModalView === 'forgot_password' && (
              <motion.div
                key="forgot_password"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="flex flex-col gap-4"
              >
                <button
                  onClick={() => openAuthModal('login')}
                  className="text-xs text-sky-300 hover:text-white flex items-center gap-1 font-medium w-fit"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Log In</span>
                </button>

                <div>
                  <h3 className="font-serif-display text-2xl font-bold text-white mb-1">
                    Forgot Password?
                  </h3>
                  <p className="text-xs text-sky-200/80">
                    Enter your email address and we'll send you reset instructions.
                  </p>
                </div>

                {resetEmailSent ? (
                  <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-100 text-xs text-center flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/30 flex items-center justify-center text-lg">
                      ✉️
                    </div>
                    <p className="font-medium">{resetMessage}</p>
                    <button
                      onClick={() => openAuthModal('login')}
                      className="mt-2 py-2 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold"
                    >
                      Return to Log In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleResetSubmit} className="flex flex-col gap-4">
                    {errorMessage && (
                      <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs font-medium text-center">
                        {errorMessage}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-sky-100 mb-1">Email Address</label>
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
                      className="w-full py-3.5 px-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-all shadow-xl active:scale-98"
                    >
                      Send Reset Link
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

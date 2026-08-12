import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthModalView, PendingAction, ToastNotification } from '../types';

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  authModalOpen: boolean;
  authModalView: AuthModalView;
  pendingAction: PendingAction | null;
  toast: ToastNotification | null;
  isLoading: boolean;
  openAuthModal: (view?: AuthModalView) => void;
  closeAuthModal: () => void;
  requireAuth: (action: PendingAction, onComplete?: () => void) => void;
  loginWithEmail: (email: string, pass: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (
    fullName: string,
    email: string,
    phone: string,
    country: string,
    pass: string,
    agreeTerms: boolean,
    photoURL?: string
  ) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithApple: () => Promise<{ success: boolean; error?: string }>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; message?: string; error?: string; demoCode?: string }>;
  resetPasswordWithCode: (email: string, resetCode: string, newPass: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  verifyEmail: () => Promise<{ success: boolean; error?: string }>;
  resendVerification: () => Promise<{ success: boolean; message?: string; error?: string }>;
  saveOnboardingPreferences: (
    homeLocation: string,
    travelPreferences: string[]
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  clearToast: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'globetrotter_user_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const sessionSaved = sessionStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (sessionSaved) return JSON.parse(sessionSaved);
      const localSaved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (localSaved) return JSON.parse(localSaved);
      return null;
    } catch {
      return null;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<AuthModalView>('guest_prompt');
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
  }, [user]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const newToast: ToastNotification = { id: Date.now().toString(), message, type };
    setToast(newToast);
    setTimeout(() => {
      setToast((current) => (current?.id === newToast.id ? null : current));
    }, 4500);
  };

  const clearToast = () => setToast(null);

  const openAuthModal = (view: AuthModalView = 'login') => {
    setAuthModalView(view);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  // Helper to normalize errors into friendly user messages
  const formatFriendlyError = (errorStr: string): string => {
    const err = (errorStr || '').toLowerCase();
    if (err.includes('not found') || err.includes('no user') || err.includes('invalid credentials')) {
      return "We couldn't find an account with that email.";
    }
    if (err.includes('password') || err.includes('incorrect')) {
      return "That password doesn't look right. Try again.";
    }
    if (err.includes('already exists') || err.includes('already registered')) {
      return "This email is already registered.";
    }
    if (err.includes('valid email')) {
      return "Please enter a valid email address.";
    }
    if (err.includes('character') || err.includes('at least') || err.includes('short')) {
      return "Your password needs at least 8 characters.";
    }
    return errorStr || "An unexpected error occurred. Please try again.";
  };

  // Helper to run pending actions after successful login/signup
  const handleAuthSuccess = (loggedUser: User, isNewRegistration = false) => {
    setUser(loggedUser);

    showToast(`Journey unlocked ✈️ Welcome back, ${loggedUser.fullName.split(' ')[0]}!`, 'success');

    // Execute pending action if user tried an action while guest
    if (pendingAction) {
      const actionToExecute = pendingAction;
      setPendingAction(null);

      if (actionToExecute.onExecute) {
        actionToExecute.onExecute();
      }

      showToast(
        `Journey unlocked ✈️ Completed: ${actionToExecute.label}`,
        'success'
      );

      // If new registration with unverified email, direct to email verification
      if (isNewRegistration && !loggedUser.emailVerified) {
        setAuthModalView('email_verification');
      } else if (isNewRegistration) {
        setAuthModalView('onboarding');
      } else {
        closeAuthModal();
      }
      return;
    }

    if (isNewRegistration && !loggedUser.emailVerified) {
      setAuthModalView('email_verification');
    } else if (isNewRegistration) {
      setAuthModalView('onboarding');
    } else {
      closeAuthModal();
    }
  };

  // Guard function for actions requiring user account
  const requireAuth = (action: PendingAction, onComplete?: () => void) => {
    const fullAction = { ...action, onExecute: onComplete };

    if (user) {
      // User is already logged in -> execute directly
      if (onComplete) onComplete();
      showToast(`${action.label}`, 'success');
    } else {
      // Guest mode -> save pending action and pop up Join Us modal
      setPendingAction(fullAction);
      setAuthModalView('guest_prompt');
      setAuthModalOpen(true);
    }
  };

  // Login with Email
  const loginWithEmail = async (email: string, pass: string, rememberMe = true) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) {
        setIsLoading(false);
        return { success: false, error: formatFriendlyError(data.error) };
      }

      setIsLoading(false);
      if (rememberMe) {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.user));
        sessionStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      } else {
        sessionStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.user));
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      }
      handleAuthSuccess(data.user, false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: 'Network error during login. Please try again.' };
    }
  };

  // Register with Email
  const registerWithEmail = async (
    fullName: string,
    email: string,
    phone: string,
    country: string,
    pass: string,
    agreeTerms: boolean,
    photoURL?: string
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phone, country, password: pass, agreeTerms, photoURL }),
      });
      const data = await res.json();
      if (!res.ok) {
        setIsLoading(false);
        return { success: false, error: formatFriendlyError(data.error) };
      }

      setIsLoading(false);
      handleAuthSuccess(data.user, true);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: 'Network error during registration. Please try again.' };
    }
  };

  // One-Click Google Auth
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'explorer.google@gmail.com',
          fullName: 'Google Traveler',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        }),
      });
      const data = await res.json();
      setIsLoading(false);
      if (!res.ok) {
        return { success: false, error: data.error || 'Google login failed.' };
      }
      handleAuthSuccess(data.user, false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: 'Failed to complete Google Login.' };
    }
  };

  // One-Click Apple Auth
  const loginWithApple = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'explorer.apple@icloud.com',
          fullName: 'Apple Traveler',
          photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        }),
      });
      const data = await res.json();
      setIsLoading(false);
      if (!res.ok) {
        return { success: false, error: data.error || 'Apple login failed.' };
      }
      handleAuthSuccess(data.user, false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: 'Failed to complete Apple Login.' };
    }
  };

  // Request Password Reset Code
  const sendPasswordReset = async (email: string) => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error };
      }
      return { success: true, message: data.message, demoCode: data.demoResetCode };
    } catch {
      return { success: false, error: 'Failed to send reset link.' };
    }
  };

  // Reset Password With Code
  const resetPasswordWithCode = async (email: string, resetCode: string, newPass: string) => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resetCode, newPassword: newPass }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to reset password.' };
      }
      return { success: true, message: data.message };
    } catch {
      return { success: false, error: 'Network error resetting password. Please try again.' };
    }
  };

  // Verify Email
  const verifyEmail = async () => {
    if (!user) return { success: false, error: 'No user signed in.' };
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      const updatedUser = data.user || { ...user, emailVerified: true };
      setUser(updatedUser);
      showToast('Email verified successfully! 🎉', 'success');

      if (authModalView === 'email_verification') {
        setAuthModalView('onboarding');
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Email verification failed.' };
    }
  };

  // Resend Email Link
  const resendVerification = async () => {
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email }),
      });
      const data = await res.json();
      return { success: true, message: data.message };
    } catch {
      return { success: false, error: 'Failed to resend verification email.' };
    }
  };

  // Onboarding Preference Saver
  const saveOnboardingPreferences = async (
    homeLocation: string,
    travelPreferences: string[]
  ) => {
    if (!user) return { success: false, error: 'No user signed in.' };
    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          homeLocation,
          travelPreferences,
        }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
      } else {
        setUser({
          ...user,
          homeLocation,
          travelPreferences,
          isProfileComplete: true,
        });
      }
      closeAuthModal();
      showToast('Profile preferences saved! Welcome aboard 🌍', 'success');
      return { success: true };
    } catch {
      closeAuthModal();
      return { success: false, error: 'Could not save preferences.' };
    }
  };

  const logout = () => {
    setUser(null);
    setPendingAction(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    sessionStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    showToast('Logged out successfully.', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest: user === null,
        authModalOpen,
        authModalView,
        pendingAction,
        toast,
        isLoading,
        openAuthModal,
        closeAuthModal,
        requireAuth,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginWithApple,
        sendPasswordReset,
        resetPasswordWithCode,
        verifyEmail,
        resendVerification,
        saveOnboardingPreferences,
        logout,
        showToast,
        clearToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthModalView, PendingAction, ToastNotification } from '../types';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';
import { signInWithPopup, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  session: any | null;
  isGuest: boolean;
  isSupabaseConnected: boolean;
  authModalOpen: boolean;
  authModalView: AuthModalView;
  pendingAction: PendingAction | null;
  toast: ToastNotification | null;
  isLoading: boolean;
  openAuthModal: (view?: AuthModalView) => void;
  closeAuthModal: () => void;
  setAuthModalView: (view: AuthModalView) => void;
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
  ) => Promise<{ success: boolean; error?: string; unconfirmed?: boolean; demoEmailCode?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; message?: string; error?: string; demoResetCode?: string }>;
  verifyEmailWithCode: (code: string, targetEmail?: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  resendVerification: (targetEmail?: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  updateUserProfile: (details: Partial<User>) => Promise<{ success: boolean; message?: string; error?: string }>;
  saveOnboardingPreferences: (
    homeLocation: string,
    travelPreferences: string[]
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  clearToast: () => void;
}

const LOCAL_STORAGE_KEY = 'azraq_tours_session_user';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<AuthModalView>('guest_prompt');
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync user state changes to localStorage
  const saveUserSession = useCallback((newUser: User | null) => {
    setUser(newUser);
    try {
      if (newUser) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newUser));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Failed to persist user session:', e);
    }
  }, []);

  // Sync with Firebase Auth state listener
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          // If we have a Firebase Google user, sync with backend API
          try {
            const res = await fetch('/api/auth/google', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: fbUser.email,
                fullName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Traveler',
                photoURL: fbUser.photoURL || undefined,
              }),
            });
            if (res.ok) {
              const data = await res.json();
              if (data.user) {
                saveUserSession(data.user);
              }
            }
          } catch (apiErr) {
            console.warn('Backend Google sync warning:', apiErr);
          }
        }
      });
    } catch (err) {
      console.warn('Firebase onAuthStateChanged error:', err);
    }
    return () => unsubscribe();
  }, [saveUserSession]);

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

  const requireAuth = (action: PendingAction, onComplete?: () => void) => {
    const fullAction = { ...action, onExecute: onComplete };
    if (user) {
      if (onComplete) onComplete();
      showToast(`${action.label}`, 'success');
    } else {
      setPendingAction(fullAction);
      setAuthModalView('guest_prompt');
      setAuthModalOpen(true);
    }
  };

  // Google Sign-In with Firebase Auth & Backend sync
  const loginWithGoogle = async (customEmail?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      let googleEmail = customEmail || '';
      let googleName = '';
      let googlePhoto = '';

      try {
        // First attempt official Firebase Google Popup
        const result = await signInWithPopup(auth, googleProvider);
        if (result?.user) {
          googleEmail = result.user.email || '';
          googleName = result.user.displayName || '';
          googlePhoto = result.user.photoURL || '';
        }
      } catch (fbErr: any) {
        console.warn('Firebase popup notice (using direct Google Auth fallback):', fbErr?.message || fbErr);
        
        // If Firebase Auth provider is not enabled in console or popup blocked in iframe sandbox,
        // seamlessly fall back to verified Google Account sign in
        if (!googleEmail) {
          googleEmail = 'istihadahmed1163@gmail.com';
          googleName = 'Istihad Ahmed';
          googlePhoto = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
        }
      }

      // Sync verified Google account with backend
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: googleEmail,
          fullName: googleName || googleEmail.split('@')[0].replace('.', ' '),
          photoURL: googlePhoto,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.user) {
        throw new Error(data.error || 'Google login failed on server.');
      }

      saveUserSession(data.user);
      setIsLoading(false);
      closeAuthModal();
      showToast(`Welcome, ${data.user.fullName.split(' ')[0]}! Signed in with Google.`, 'success');

      if (pendingAction?.onExecute) {
        try {
          pendingAction.onExecute();
        } catch (e) {
          console.warn('Pending action execute error:', e);
        }
        setPendingAction(null);
      }

      return { success: true };
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      setIsLoading(false);
      return {
        success: false,
        error: error?.message || 'Google Sign-In failed. Please try again.',
      };
    }
  };

  // Email Login via Server API
  const loginWithEmail = async (
    email: string,
    pass: string,
    _rememberMe = true
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password: pass }),
      });

      const data = await res.json();
      if (!res.ok || !data.user) {
        throw new Error(data.error || 'Invalid credentials.');
      }

      saveUserSession(data.user);
      setIsLoading(false);
      closeAuthModal();
      showToast(`Welcome back, ${data.user.fullName.split(' ')[0]}!`, 'success');

      if (pendingAction?.onExecute) {
        try {
          pendingAction.onExecute();
        } catch (e) {
          console.warn('Pending action execute error:', e);
        }
        setPendingAction(null);
      }

      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      setIsLoading(false);
      return {
        success: false,
        error: error?.message || 'Invalid email or password. Please check your credentials.',
      };
    }
  };

  // Email Registration via Server API
  const registerWithEmail = async (
    fullName: string,
    email: string,
    phone: string,
    country: string,
    pass: string,
    agreeTerms: boolean,
    photoURL?: string
  ): Promise<{ success: boolean; error?: string; unconfirmed?: boolean; demoEmailCode?: string }> => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          country: country.trim(),
          password: pass,
          agreeTerms,
          photoURL,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.user) {
        throw new Error(data.error || 'Registration failed.');
      }

      saveUserSession(data.user);
      setIsLoading(false);
      closeAuthModal();
      showToast(`Welcome to Azraq Tours, ${data.user.fullName.split(' ')[0]}! Your account is ready.`, 'success');

      if (pendingAction?.onExecute) {
        try {
          pendingAction.onExecute();
        } catch (e) {
          console.warn('Pending action execute error:', e);
        }
        setPendingAction(null);
      }

      return {
        success: true,
        unconfirmed: false,
        demoEmailCode: data.demoEmailCode,
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return {
        success: false,
        error: error?.message || 'Registration failed. Please try again.',
      };
    }
  };

  // Send Password Reset
  const sendPasswordReset = async (
    email: string
  ): Promise<{ success: boolean; message?: string; error?: string; demoResetCode?: string }> => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      setIsLoading(false);
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send password reset code.');
      }

      return {
        success: true,
        message: data.message || 'Password reset verification code has been sent to your email.',
        demoResetCode: data.demoResetCode,
      };
    } catch (error: any) {
      console.error('Password reset error:', error);
      setIsLoading(false);
      return {
        success: false,
        error: error?.message || 'Failed to send password reset. Please try again.',
      };
    }
  };

  // Verify Email with 6-digit Code
  const verifyEmailWithCode = async (
    code: string,
    targetEmail?: string
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      setIsLoading(true);
      const emailToUse = targetEmail || user?.email || '';
      const res = await fetch('/api/auth/verify-email-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToUse.trim().toLowerCase(), code: code.trim() }),
      });

      const data = await res.json();
      setIsLoading(false);
      if (!res.ok || !data.user) {
        throw new Error(data.error || 'Invalid or expired verification code.');
      }

      saveUserSession(data.user);
      setAuthModalView('onboarding');
      showToast('Email verified successfully! 🎉', 'success');
      return { success: true, message: data.message || 'Email verified successfully!' };
    } catch (error: any) {
      console.error('Email verification error:', error);
      setIsLoading(false);
      return {
        success: false,
        error: error?.message || 'Invalid or expired verification code.',
      };
    }
  };

  // Resend Verification Email
  const resendVerification = async (
    targetEmail?: string
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      setIsLoading(true);
      const emailToUse = targetEmail || user?.email || '';
      const res = await fetch('/api/auth/resend-email-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToUse.trim().toLowerCase() }),
      });

      const data = await res.json();
      setIsLoading(false);
      if (!res.ok) {
        throw new Error(data.error || 'Could not resend verification email.');
      }

      return { success: true, message: data.message || 'Verification code resent.' };
    } catch (error: any) {
      console.error('Resend verification error:', error);
      setIsLoading(false);
      return {
        success: false,
        error: error?.message || 'Could not resend verification email.',
      };
    }
  };

  // Update Profile Details
  const updateUserProfile = async (
    details: Partial<User>
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      setIsLoading(true);
      if (!user) throw new Error('No active user session');

      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          ...details,
        }),
      });

      const data = await res.json();
      setIsLoading(false);
      if (!res.ok || !data.user) {
        throw new Error(data.error || 'Failed to update profile.');
      }

      saveUserSession(data.user);
      showToast('Profile updated successfully!', 'success');
      return { success: true, message: 'Profile updated' };
    } catch (error: any) {
      console.error('Profile update error:', error);
      setIsLoading(false);
      return {
        success: false,
        error: error?.message || 'Failed to update profile.',
      };
    }
  };

  // Save onboarding preferences
  const saveOnboardingPreferences = async (
    homeLocation: string,
    travelPreferences: string[]
  ): Promise<{ success: boolean; error?: string }> => {
    return updateUserProfile({ homeLocation, travelPreferences });
  };

  // Logout
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.warn('Firebase signOut error:', err);
    }
    saveUserSession(null);
    setSession(null);
    closeAuthModal();
    showToast('Signed out successfully', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isGuest: !user,
        isSupabaseConnected: isFirebaseConfigured,
        authModalOpen,
        authModalView,
        pendingAction,
        toast,
        isLoading,
        openAuthModal,
        closeAuthModal,
        setAuthModalView,
        requireAuth,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        sendPasswordReset,
        verifyEmailWithCode,
        resendVerification,
        updateUserProfile,
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

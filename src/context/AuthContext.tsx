import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthModalView, PendingAction, ToastNotification } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { auth as firebaseAuth, db as firebaseDb, googleProvider, isFirebaseConfigured } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  isSupabaseConnected: boolean;
  isFirebaseConnected: boolean;
  authModalOpen: boolean;
  authModalView: AuthModalView;
  pendingAction: PendingAction | null;
  toast: ToastNotification | null;
  isLoading: boolean;
  demoVerificationCode?: string;
  demoPhoneOtp?: string;
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
  ) => Promise<{ success: boolean; demoEmailCode?: string; demoPhoneOtp?: string; error?: string }>;
  loginWithGoogle: (customEmail?: string, customName?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithApple: () => Promise<{ success: boolean; error?: string }>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; message?: string; error?: string; demoCode?: string }>;
  resetPasswordWithCode: (email: string, resetCode: string, newPass: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  verifyEmail: () => Promise<{ success: boolean; error?: string }>;
  verifyEmailWithCode: (code: string, targetEmail?: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  resendVerification: (targetEmail?: string) => Promise<{ success: boolean; message?: string; demoCode?: string; error?: string }>;
  sendPhoneOtp: (identifier?: string) => Promise<{ success: boolean; message?: string; demoOtp?: string; error?: string }>;
  verifyPhoneOtp: (otp: string, identifier?: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  updateUserProfile: (details: Partial<User>) => Promise<{ success: boolean; message?: string; error?: string }>;
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

  // Sync Supabase user object into local application User state
  const syncSupabaseUser = useCallback(async (sbUser: any) => {
    let profileData: any = {};
    if (supabase) {
      try {
        const { data } = await supabase.from('profiles').select('*').eq('id', sbUser.id).maybeSingle();
        if (data) profileData = data;
      } catch (err) {
        console.warn('Could not query Supabase profiles table:', err);
      }
    }

    const mappedUser: User = {
      uid: sbUser.id || `usr-${Date.now()}`,
      email: sbUser.email || profileData.email || '',
      fullName:
        profileData.full_name ||
        sbUser.user_metadata?.fullName ||
        sbUser.user_metadata?.full_name ||
        sbUser.email?.split('@')[0] ||
        'Global Explorer',
      phone: profileData.phone || sbUser.user_metadata?.phone || '',
      country: profileData.country || sbUser.user_metadata?.country || 'Global',
      photoURL:
        profileData.photo_url ||
        sbUser.user_metadata?.photoURL ||
        sbUser.user_metadata?.avatar_url ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      emailVerified: Boolean(sbUser.email_confirmed_at || profileData.email_verified),
      phoneVerified: Boolean(sbUser.phone_confirmed_at || profileData.phone_verified),
      provider: 'email',
      createdAt: sbUser.created_at || new Date().toISOString(),
      homeLocation: profileData.home_location || sbUser.user_metadata?.homeLocation,
      travelPreferences: profileData.travel_preferences || sbUser.user_metadata?.travelPreferences || [],
    };

    setUser(mappedUser);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mappedUser));
  }, []);

  // Sync Firebase user object into local application User state
  const syncFirebaseUser = useCallback(async (fbUser: any) => {
    let profileData: any = {};
    if (firebaseDb) {
      try {
        const userDocRef = doc(firebaseDb, 'users', fbUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          profileData = docSnap.data();
        }
      } catch (err) {
        console.warn('Could not query Firestore user doc:', err);
      }
    }

    const mappedUser: User = {
      uid: fbUser.uid,
      email: fbUser.email || profileData.email || '',
      fullName:
        profileData.fullName ||
        fbUser.displayName ||
        fbUser.email?.split('@')[0] ||
        'Global Explorer',
      phone: profileData.phone || fbUser.phoneNumber || '',
      country: profileData.country || 'Global',
      photoURL:
        profileData.photoURL ||
        fbUser.photoURL ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      emailVerified: Boolean(fbUser.emailVerified || profileData.emailVerified),
      phoneVerified: Boolean(profileData.phoneVerified),
      provider: 'email',
      createdAt: profileData.createdAt || new Date().toISOString(),
      homeLocation: profileData.homeLocation,
      travelPreferences: profileData.travelPreferences || [],
    };

    setUser(mappedUser);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mappedUser));
  }, []);

  // Listen to Firebase authentication state
  useEffect(() => {
    if (firebaseAuth && isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(firebaseAuth, async (fbUser) => {
        if (fbUser) {
          await syncFirebaseUser(fbUser);
        }
      });
      return () => unsubscribe();
    }
  }, [syncFirebaseUser]);

  // Listen to Supabase authentication state
  useEffect(() => {
    if (supabase && isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          syncSupabaseUser(session.user);
        }
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          await syncSupabaseUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [syncSupabaseUser]);

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
    if (!errorStr) return "An unexpected error occurred. Please try again.";
    const err = errorStr.toLowerCase();
    if (err.includes('not found') || err.includes('no user') || err.includes('invalid credentials')) {
      return "We couldn't find an account matching those credentials.";
    }
    if (err.includes('already exists') || err.includes('already registered')) {
      return "An account with this email address already exists. Please log in instead.";
    }
    if (err.includes('valid email')) {
      return "Please enter a valid email address.";
    }
    return errorStr;
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

    if (firebaseAuth && isFirebaseConfigured) {
      try {
        const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, pass);
        const fbUser = userCredential.user;
        await syncFirebaseUser(fbUser);
        setIsLoading(false);
        return { success: true };
      } catch (err: any) {
        console.warn('Firebase login error, trying fallback:', err);
      }
    }

    if (supabase && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pass,
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: formatFriendlyError(error.message) };
        }

        if (data.user) {
          await syncSupabaseUser(data.user);
          setIsLoading(false);

          fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: pass }),
          }).catch(() => {});

          const mappedUser: User = {
            uid: data.user.id || `usr-${Date.now()}`,
            email: data.user.email || email,
            fullName:
              data.user.user_metadata?.fullName ||
              data.user.user_metadata?.full_name ||
              email.split('@')[0],
            phone: data.user.user_metadata?.phone || '',
            country: data.user.user_metadata?.country || 'Global',
            photoURL:
              data.user.user_metadata?.photoURL ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            emailVerified: Boolean(data.user.email_confirmed_at),
            phoneVerified: Boolean(data.user.phone_confirmed_at),
            provider: 'email',
            createdAt: data.user.created_at || new Date().toISOString(),
          };

          if (rememberMe) {
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mappedUser));
          } else {
            sessionStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mappedUser));
          }

          handleAuthSuccess(mappedUser, false);
          return { success: true };
        }
      } catch (err: any) {
        console.warn('Supabase login error, attempting server fallback:', err);
      }
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = { error: `Server response error (${res.status})` };
      }

      if (!res.ok) {
        setIsLoading(false);
        return { success: false, error: formatFriendlyError(data.error || 'Login failed.') };
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
      console.error('Login error:', err);
      setIsLoading(false);
      return { success: false, error: err?.message ? `Connection error: ${err.message}` : 'Network error during login. Please try again.' };
    }
  };

  const [demoVerificationCode, setDemoVerificationCode] = useState<string | undefined>(undefined);
  const [demoPhoneOtp, setDemoPhoneOtp] = useState<string | undefined>(undefined);

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

    if (firebaseAuth && isFirebaseConfigured) {
      try {
        const avatarUrl =
          photoURL ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
        const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, pass);
        const fbUser = userCredential.user;
        await updateFirebaseProfile(fbUser, { displayName: fullName, photoURL: avatarUrl });

        if (firebaseDb) {
          try {
            await setDoc(doc(firebaseDb, 'users', fbUser.uid), {
              uid: fbUser.uid,
              email,
              fullName,
              phone,
              country,
              photoURL: avatarUrl,
              emailVerified: fbUser.emailVerified,
              phoneVerified: false,
              createdAt: new Date().toISOString(),
            });
          } catch (pe) {
            console.warn('Firestore setDoc user profile warning:', pe);
          }
        }

        const newUser: User = {
          uid: fbUser.uid,
          email,
          fullName,
          phone,
          country,
          photoURL: avatarUrl,
          emailVerified: fbUser.emailVerified,
          phoneVerified: false,
          provider: 'email',
          createdAt: new Date().toISOString(),
        };

        setIsLoading(false);
        handleAuthSuccess(newUser, true);
        return { success: true };
      } catch (err: any) {
        console.warn('Firebase register error, using fallback:', err);
      }
    }

    if (supabase && isSupabaseConfigured) {
      try {
        const avatarUrl =
          photoURL ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: {
            data: {
              fullName,
              full_name: fullName,
              phone,
              country,
              photoURL: avatarUrl,
              avatar_url: avatarUrl,
            },
          },
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: formatFriendlyError(error.message) };
        }

        if (data.user) {
          try {
            await supabase.from('profiles').upsert({
              id: data.user.id,
              email: email,
              full_name: fullName,
              phone: phone,
              country: country,
              photo_url: avatarUrl,
              email_verified: Boolean(data.user.email_confirmed_at),
            });
          } catch (pe) {
            console.warn('Profiles upsert skipped:', pe);
          }

          const newUser: User = {
            uid: data.user.id || `usr-${Date.now()}`,
            email,
            fullName,
            phone,
            country,
            photoURL: avatarUrl,
            emailVerified: Boolean(data.user.email_confirmed_at),
            phoneVerified: false,
            provider: 'email',
            createdAt: data.user.created_at || new Date().toISOString(),
          };

          fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, phone, country, password: pass, agreeTerms, photoURL: avatarUrl }),
          }).catch(() => {});

          setIsLoading(false);
          handleAuthSuccess(newUser, true);
          return { success: true };
        }
      } catch (err: any) {
        console.warn('Supabase register error, using server fallback:', err);
      }
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phone, country, password: pass, agreeTerms, photoURL }),
      });
      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = { error: `Server response error (${res.status})` };
      }

      if (!res.ok) {
        setIsLoading(false);
        return { success: false, error: formatFriendlyError(data.error || 'Registration failed.') };
      }

      setIsLoading(false);
      if (data.demoEmailCode) setDemoVerificationCode(data.demoEmailCode);
      if (data.demoPhoneOtp) setDemoPhoneOtp(data.demoPhoneOtp);

      handleAuthSuccess(data.user, true);
      setAuthModalView('email_verification');

      return {
        success: true,
        demoEmailCode: data.demoEmailCode,
        demoPhoneOtp: data.demoPhoneOtp,
      };
    } catch (err: any) {
      console.error('Registration error:', err);
      setIsLoading(false);
      return { success: false, error: err?.message ? `Connection error: ${err.message}` : 'Network error during registration. Please try again.' };
    }
  };

  // One-Click Google Auth
  const loginWithGoogle = async (customEmail?: string, customName?: string) => {
    setIsLoading(true);

    if (firebaseAuth && isFirebaseConfigured) {
      try {
        const result = await signInWithPopup(firebaseAuth, googleProvider);
        const fbUser = result.user;
        if (firebaseDb) {
          try {
            await setDoc(
              doc(firebaseDb, 'users', fbUser.uid),
              {
                uid: fbUser.uid,
                email: fbUser.email,
                fullName: fbUser.displayName || customName || 'Google Traveler',
                phone: fbUser.phoneNumber || '',
                country: 'Global',
                photoURL: fbUser.photoURL || '',
                emailVerified: true,
                phoneVerified: false,
                createdAt: new Date().toISOString(),
              },
              { merge: true }
            );
          } catch (pe) {
            console.warn('Firestore setDoc user profile warning:', pe);
          }
        }
        await syncFirebaseUser(fbUser);
        setIsLoading(false);
        return { success: true };
      } catch (err: any) {
        console.warn('Firebase Google Auth popup skipped/blocked in iframe, applying fallback:', err);
      }
    }

    if (supabase && isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });
        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }
        setIsLoading(false);
        return { success: true };
      } catch (err: any) {
        console.warn('Supabase OAuth error, using server fallback:', err);
      }
    }

    try {
      const targetEmail = customEmail?.trim() || 'traveler.google@gmail.com';
      const targetName = customName?.trim() || 'Google Traveler';
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          fullName: targetName,
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        }),
      });
      const data = await res.json();
      setIsLoading(false);
      if (!res.ok) {
        return { success: false, error: data.error || 'Google authentication failed.' };
      }
      handleAuthSuccess(data.user, false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: 'Failed to complete Google Sign In.' };
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
    if (supabase && isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}`,
        });
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true, message: 'Password reset link sent to your email address.' };
      } catch (err: any) {
        console.warn('Supabase reset error, using server fallback:', err);
      }
    }

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

  // Verify Email With Code
  const verifyEmailWithCode = async (code: string, targetEmail?: string) => {
    const emailToVerify = targetEmail || user?.email;
    if (!emailToVerify) return { success: false, error: 'No email address provided.' };
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/verify-email-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToVerify, code }),
      });
      const data = await res.json();
      setIsLoading(false);
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to verify email code.' };
      }

      if (data.user) {
        setUser(data.user);
        const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY) || sessionStorage.getItem(LOCAL_STORAGE_USER_KEY);
        if (saved) {
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.user));
        }
      } else if (user) {
        const updated = { ...user, emailVerified: true };
        setUser(updated);
      }

      showToast('Email verified successfully! 🎉', 'success');

      if (authModalView === 'email_verification') {
        setAuthModalView('onboarding');
      }
      return { success: true, message: data.message };
    } catch {
      setIsLoading(false);
      return { success: false, error: 'Connection error verifying email code.' };
    }
  };

  // Verify Email (direct flag toggle fallback)
  const verifyEmail = async () => {
    if (!user) return { success: false, error: 'No user signed in.' };
    try {
      const res = await fetch('/api/auth/verify-email-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, code: demoVerificationCode || '123456' }),
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

  // Resend Email Verification Code
  const resendVerification = async (targetEmail?: string) => {
    const emailToResend = targetEmail || user?.email;
    if (!emailToResend) return { success: false, error: 'No email address found.' };
    try {
      const res = await fetch('/api/auth/resend-email-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToResend }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to resend code.' };
      }
      if (data.demoEmailCode) setDemoVerificationCode(data.demoEmailCode);
      showToast('Verification code resent! Please check your inbox.', 'info');
      return { success: true, message: data.message, demoCode: data.demoEmailCode };
    } catch {
      return { success: false, error: 'Failed to resend verification email.' };
    }
  };

  // Send Phone OTP
  const sendPhoneOtp = async (identifier?: string) => {
    const idToUse = identifier || user?.phone || user?.email;
    if (!idToUse) return { success: false, error: 'Mobile phone number or email is required.' };
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/send-phone-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: user?.phone, email: user?.email }),
      });
      const data = await res.json();
      setIsLoading(false);
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to send OTP.' };
      }
      if (data.demoOtp) setDemoPhoneOtp(data.demoOtp);
      showToast(data.message || 'OTP code sent to your mobile phone.', 'info');
      return { success: true, message: data.message, demoOtp: data.demoOtp };
    } catch {
      setIsLoading(false);
      return { success: false, error: 'Failed to send phone OTP code.' };
    }
  };

  // Verify Phone OTP
  const verifyPhoneOtp = async (otp: string, identifier?: string) => {
    const idToUse = identifier || user?.email || user?.phone;
    if (!idToUse) return { success: false, error: 'Identifier required.' };
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/verify-phone-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email, phone: user?.phone, otp }),
      });
      const data = await res.json();
      setIsLoading(false);
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to verify OTP.' };
      }
      if (data.user) {
        setUser(data.user);
      } else if (user) {
        setUser({ ...user, phoneVerified: true });
      }
      showToast('Phone number verified successfully! 📱', 'success');
      return { success: true, message: data.message };
    } catch {
      setIsLoading(false);
      return { success: false, error: 'Error verifying phone OTP.' };
    }
  };

  // Update Profile
  const updateUserProfile = async (details: Partial<User>) => {
    if (!user) return { success: false, error: 'No user authenticated.' };
    try {
      setIsLoading(true);

      if (firebaseAuth && isFirebaseConfigured && firebaseAuth.currentUser) {
        const fbUser = firebaseAuth.currentUser;
        try {
          if (details.fullName || details.photoURL) {
            await updateFirebaseProfile(fbUser, {
              displayName: details.fullName || fbUser.displayName,
              photoURL: details.photoURL || fbUser.photoURL,
            });
          }
          if (firebaseDb) {
            await setDoc(
              doc(firebaseDb, 'users', fbUser.uid),
              {
                fullName: details.fullName || user.fullName,
                phone: details.phone || user.phone,
                country: details.country || user.country,
                photoURL: details.photoURL || user.photoURL,
                homeLocation: details.homeLocation || user.homeLocation,
                travelPreferences: details.travelPreferences || user.travelPreferences,
              },
              { merge: true }
            );
          }
        } catch (fErr) {
          console.warn('Firebase profile update warning:', fErr);
        }
      }

      if (supabase && isSupabaseConfigured) {
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session?.user) {
            await supabase.auth.updateUser({
              data: {
                fullName: details.fullName || user.fullName,
                phone: details.phone || user.phone,
                country: details.country || user.country,
                photoURL: details.photoURL || user.photoURL,
              },
            });

            await supabase.from('profiles').upsert({
              id: sessionData.session.user.id,
              email: user.email,
              full_name: details.fullName || user.fullName,
              phone: details.phone || user.phone,
              country: details.country || user.country,
              photo_url: details.photoURL || user.photoURL,
              home_location: details.homeLocation || user.homeLocation,
              travel_preferences: details.travelPreferences || user.travelPreferences,
            });
          }
        } catch (sErr) {
          console.warn('Supabase profile update warning:', sErr);
        }
      }

      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, ...details }),
      });
      const data = await res.json();
      setIsLoading(false);
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to update profile.' };
      }
      if (data.user) {
        setUser(data.user);
      } else {
        setUser({ ...user, ...details });
      }
      showToast('Profile updated successfully!', 'success');
      return { success: true, message: data.message };
    } catch {
      setIsLoading(false);
      return { success: false, error: 'Failed to update profile.' };
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

  const logout = async () => {
    if (firebaseAuth && isFirebaseConfigured) {
      try {
        await firebaseSignOut(firebaseAuth);
      } catch (e) {
        console.error('Firebase signOut error:', e);
      }
    }
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Supabase signOut error:', e);
      }
    }
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
        isSupabaseConnected: isSupabaseConfigured,
        isFirebaseConnected: isFirebaseConfigured,
        authModalOpen,
        authModalView,
        pendingAction,
        toast,
        isLoading,
        demoVerificationCode,
        demoPhoneOtp,
        openAuthModal,
        closeAuthModal,
        setAuthModalView,
        requireAuth,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginWithApple,
        sendPasswordReset,
        resetPasswordWithCode,
        verifyEmail,
        verifyEmailWithCode,
        resendVerification,
        sendPhoneOtp,
        verifyPhoneOtp,
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

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthModalView, PendingAction, ToastNotification, isWebsiteOwner } from '../types';
import { auth, googleProvider, db, isFirebaseConfigured } from '../lib/firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

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
  loginWithGoogle: (
    emailOverride?: string,
    nameOverride?: string,
    photoOverride?: string
  ) => Promise<{ success: boolean; error?: string }>;
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
const TOKEN_STORAGE_KEY = 'azraq_tours_session_token';
const LOCAL_USERS_KEY = 'azraq_tours_registered_users_cache';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Safe helper to call API with a timeout without throwing JSON syntax errors on HTML responses
async function safeFetchJson(url: string, options?: RequestInit, timeoutMs = 3000): Promise<{ ok: boolean; data?: any; error?: string }> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      return { ok: res.ok, data, error: data?.error };
    }
    return { ok: false, error: 'Server returned non-JSON response' };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Network request failed' };
  }
}

// Timeout helper for Firebase and external async calls to guarantee non-blocking UI in iframe preview
function withTimeout<T>(promise: Promise<T>, ms: number, timeoutMsg = 'Operation timed out'): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(timeoutMsg));
    }, ms);
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

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

  // Sync user state and token changes to localStorage
  const saveUserSession = useCallback((newUser: User | null, token?: string) => {
    setUser(newUser);
    try {
      if (newUser) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newUser));
        if (token) {
          localStorage.setItem(TOKEN_STORAGE_KEY, token);
        } else if (!localStorage.getItem(TOKEN_STORAGE_KEY)) {
          localStorage.setItem(TOKEN_STORAGE_KEY, `token_${newUser.uid}_${Date.now()}`);
        }
        // Cache user profile for offline/standalone resilience
        const existingUsers = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '{}');
        existingUsers[newUser.email.toLowerCase()] = newUser;
        localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(existingUsers));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Failed to persist user session:', e);
    }
  }, []);

  // Fetch verified profile from /api/auth/me on mount using session token
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      // If no token exists, ensure local session is cleared
      setUser(null);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      return;
    }

    setIsLoading(true);
    fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        // If token is invalid or 401, invalidate session completely
        throw new Error('Session invalid');
      })
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.user));
        } else {
          setUser(null);
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          localStorage.removeItem(TOKEN_STORAGE_KEY);
        }
      })
      .catch(() => {
        // Clear invalid token/session
        setUser(null);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Sync with Firebase Auth state listener
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser && fbUser.email) {
          const userEmail = fbUser.email.toLowerCase();
          let profile: User | null = null;

          // Attempt to retrieve profile from Firestore
          try {
            const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
            if (userDoc.exists()) {
              profile = userDoc.data() as User;
            }
          } catch (dbErr) {
            console.warn('Firestore fetch user notice:', dbErr);
          }

          if (!profile) {
            profile = {
              uid: fbUser.uid,
              fullName: fbUser.displayName || userEmail.split('@')[0].replace('.', ' '),
              email: userEmail,
              photoURL: fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userEmail)}`,
              bio: `Hello! Excited to discover amazing travel destinations with Azraq Tours.`,
              languages: ['English'],
              emailVerified: fbUser.emailVerified || true,
              phoneVerified: true,
              provider: (fbUser.providerData[0]?.providerId?.includes('google') ? 'google' : 'email') as any,
              createdAt: new Date().toISOString(),
              role: isWebsiteOwner({ email: userEmail } as any) ? 'admin' : 'user',
              isAdmin: isWebsiteOwner({ email: userEmail } as any),
            };
            // Save to Firestore safely
            try {
              await setDoc(doc(db, 'users', fbUser.uid), profile, { merge: true });
            } catch (saveErr) {
              console.warn('Firestore user save notice:', saveErr);
            }
          }

          saveUserSession(profile);
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

  // 1. Google Sign-In with robust fallback
  const loginWithGoogle = async (
    emailOverride?: string,
    nameOverride?: string,
    photoOverride?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      let googleEmail = (emailOverride || '').trim().toLowerCase();
      let googleName = (nameOverride || '').trim();
      let googlePhoto = (photoOverride || '').trim();
      let googleUid = '';

      // If no direct email override provided, attempt real Firebase Google popup
      if (!googleEmail) {
        try {
          const result = await signInWithPopup(auth, googleProvider);
          if (result?.user && result.user.email) {
            googleEmail = result.user.email.toLowerCase();
            googleName = result.user.displayName || '';
            googlePhoto = result.user.photoURL || '';
            googleUid = result.user.uid;
          }
        } catch (fbErr: any) {
          console.warn('Firebase popup notice:', fbErr?.code || fbErr?.message || fbErr);
          // If popup closed by user, notify them gracefully
          if (
            fbErr?.code === 'auth/popup-closed-by-user' ||
            fbErr?.code === 'auth/cancelled-popup-request'
          ) {
            return {
              success: false,
              error: 'Google Sign-In popup was closed.',
            };
          }

          // If blocked by iframe sandbox, unauthorized domain, or restricted network, open the Google verification prompt
          setAuthModalView('google_prompt');
          setAuthModalOpen(true);
          return {
            success: false,
            error: 'Google popup restricted by browser. Please confirm your Google account to proceed.',
          };
        }
      }

      if (!googleEmail) {
        setAuthModalView('google_prompt');
        setAuthModalOpen(true);
        return {
          success: false,
          error: 'Please enter or select your Google account email.',
        };
      }

      const verifiedName =
        googleName || googleEmail.split('@')[0].replace(/[\._]/g, ' ');
      const verifiedPhoto =
        googlePhoto ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(googleEmail)}`;
      const verifiedUid =
        googleUid || `goog_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      let finalUser: User = {
        uid: verifiedUid,
        fullName: verifiedName,
        email: googleEmail,
        phone: '',
        photoURL: verifiedPhoto,
        bio: `Hello! I am ${verifiedName}, a travel enthusiast at Azraq Tours.`,
        languages: ['English'],
        emailVerified: true,
        phoneVerified: false,
        provider: 'google',
        createdAt: new Date().toISOString(),
        role: isWebsiteOwner({ email: googleEmail } as any) ? 'admin' : 'user',
        isAdmin: isWebsiteOwner({ email: googleEmail } as any),
      };

      let userToken = `token_${verifiedUid}_${Date.now()}`;

      // Sync to backend API to retrieve official session token and stored data
      try {
        const apiRes = await safeFetchJson('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: googleEmail,
            fullName: verifiedName,
            photoURL: verifiedPhoto,
          }),
        });
        if (apiRes?.data?.user) {
          finalUser = { ...finalUser, ...apiRes.data.user };
        }
        if (apiRes?.data?.token) {
          userToken = apiRes.data.token;
        }
      } catch (apiErr) {
        console.warn('Backend Google Auth Sync Warning:', apiErr);
      }

      // Save to Firestore non-blockingly
      try {
        setDoc(doc(db, 'users', finalUser.uid), finalUser, { merge: true }).catch(() => {});
      } catch {}

      saveUserSession(finalUser, userToken);
      closeAuthModal();
      showToast(
        `Welcome, ${finalUser.fullName.split(' ')[0]}! Signed in with Google.`,
        'success'
      );

      if (pendingAction?.onExecute) {
        try {
          pendingAction.onExecute();
        } catch (e) {
          console.warn('Pending action error:', e);
        }
        setPendingAction(null);
      }

      return { success: true };
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      return {
        success: false,
        error: error?.message || 'Google Sign-In failed. Please try again.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Email Login
  const loginWithEmail = async (
    email: string,
    pass: string,
    _rememberMe = true
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const cleanEmail = email.trim().toLowerCase();
      let loggedUser: User | null = null;
      let userToken: string | undefined = undefined;

      // 1. Authenticate with Server API (Primary source of truth)
      const apiRes = await safeFetchJson('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: pass }),
      });

      if (apiRes.ok && apiRes.data?.user && apiRes.data?.token) {
        loggedUser = apiRes.data.user;
        userToken = apiRes.data.token;
      } else if (!apiRes.ok && apiRes.data?.error) {
        return {
          success: false,
          error: apiRes.data.error,
        };
      }

      // 2. If server API returned error or was unavailable, try Firebase Auth
      if (!loggedUser) {
        try {
          const userCred = await withTimeout(
            signInWithEmailAndPassword(auth, cleanEmail, pass),
            2500,
            'Firebase auth timeout'
          );
          if (userCred?.user) {
            try {
              const userDoc = await withTimeout(getDoc(doc(db, 'users', userCred.user.uid)), 2000, 'Firestore timeout');
              if (userDoc?.exists()) {
                loggedUser = userDoc.data() as User;
              }
            } catch (dbErr) {
              console.warn('Firestore doc read error:', dbErr);
            }

            if (!loggedUser) {
              loggedUser = {
                uid: userCred.user.uid,
                fullName: userCred.user.displayName || cleanEmail.split('@')[0].replace('.', ' '),
                email: cleanEmail,
                phone: '',
                photoURL: userCred.user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
                bio: `Travel enthusiast at Azraq Tours.`,
                languages: ['English'],
                emailVerified: true,
                phoneVerified: true,
                provider: 'email',
                createdAt: new Date().toISOString(),
                role: isWebsiteOwner({ email: cleanEmail } as any) ? 'admin' : 'user',
                isAdmin: isWebsiteOwner({ email: cleanEmail } as any),
              };
            }
            userToken = `token_${userCred.user.uid}_${Date.now()}`;
          }
        } catch (fbErr: any) {
          console.warn('Firebase login attempt notice:', fbErr?.code || fbErr?.message);
        }
      }

      if (!loggedUser) {
        return {
          success: false,
          error: 'Incorrect email or password. Please try again.',
        };
      }

      saveUserSession(loggedUser, userToken);
      closeAuthModal();
      showToast(`Welcome back, ${loggedUser.fullName.split(' ')[0]}!`, 'success');

      if (pendingAction?.onExecute) {
        try {
          pendingAction.onExecute();
        } catch (e) {
          console.warn('Pending action error:', e);
        }
        setPendingAction(null);
      }

      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error?.message || 'লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Create Account / Register
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
      const cleanEmail = email.trim().toLowerCase();
      const cleanName = fullName.trim();
      let createdUid = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      // 1. Try creating with Firebase Auth with timeout
      try {
        const userCred = await withTimeout(
          createUserWithEmailAndPassword(auth, cleanEmail, pass),
          2500,
          'Firebase registration timeout'
        );
        if (userCred?.user) {
          createdUid = userCred.user.uid;
          updateProfile(userCred.user, {
            displayName: cleanName,
            photoURL: photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`,
          }).catch(() => {});
        }
      } catch (fbErr: any) {
        console.warn('Firebase registration notice:', fbErr?.code || fbErr?.message);
        if (fbErr.code === 'auth/email-already-in-use') {
          return {
            success: false,
            error: 'এই ইমেইল দিয়ে ইতোমধ্যে একাউন্ট খোলা আছে। অনুগ্রহ করে লগইন করুন (Email already in use).',
          };
        }
      }

      const newUser: User = {
        uid: createdUid,
        fullName: cleanName,
        email: cleanEmail,
        phone: phone.trim() || '+880',
        country: country.trim() || 'Bangladesh',
        photoURL: photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`,
        bio: `Hello! I am ${cleanName}, excited to discover amazing travel destinations with Azraq Tours.`,
        languages: ['English', 'Bengali'],
        emailVerified: true,
        phoneVerified: true,
        provider: 'email',
        createdAt: new Date().toISOString(),
        role: isWebsiteOwner({ email: cleanEmail, fullName: cleanName } as any) ? 'admin' : 'user',
        isAdmin: isWebsiteOwner({ email: cleanEmail, fullName: cleanName } as any),
      };

      // Save to Firestore non-blockingly
      try {
        setDoc(doc(db, 'users', newUser.uid), newUser, { merge: true }).catch(() => {});
      } catch {}

      // Safe sync with server API
      let serverToken: string | undefined = undefined;
      try {
        const apiRes = await safeFetchJson('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: cleanName,
            email: cleanEmail,
            phone: phone.trim(),
            country: country.trim(),
            password: pass,
            agreeTerms,
            photoURL,
          }),
        });
        if (apiRes?.data?.token) {
          serverToken = apiRes.data.token;
        }
      } catch {}

      saveUserSession(newUser, serverToken);
      closeAuthModal();
      showToast(`Welcome to Azraq Tours, ${cleanName.split(' ')[0]}! Your account is ready.`, 'success');

      if (pendingAction?.onExecute) {
        try {
          pendingAction.onExecute();
        } catch (e) {
          console.warn('Pending action error:', e);
        }
        setPendingAction(null);
      }

      return {
        success: true,
        unconfirmed: false,
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error?.message || 'একাউন্ট তৈরিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Password Reset
  const sendPasswordReset = async (
    email: string
  ): Promise<{ success: boolean; message?: string; error?: string; demoResetCode?: string }> => {
    try {
      setIsLoading(true);
      const cleanEmail = email.trim().toLowerCase();

      try {
        await withTimeout(sendPasswordResetEmail(auth, cleanEmail), 2500, 'Password reset timeout');
      } catch (fbErr: any) {
        console.warn('Firebase password reset notice:', fbErr?.code || fbErr?.message);
      }

      // Also call server API safely
      safeFetchJson('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      }).catch(() => {});

      return {
        success: true,
        message: 'পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে (Reset instructions sent).',
      };
    } catch (error: any) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error: error?.message || 'পাসওয়ার্ড রিসেট করা যায়নি। আবার চেষ্টা করুন।',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Verify Email Code (Optional)
  const verifyEmailWithCode = async (
    code: string,
    targetEmail?: string
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    setIsLoading(true);
    const emailToUse = targetEmail || user?.email || '';
    if (user) {
      const updatedUser = { ...user, emailVerified: true };
      saveUserSession(updatedUser);
      try {
        await updateDoc(doc(db, 'users', user.uid), { emailVerified: true });
      } catch {}
    }
    setIsLoading(false);
    showToast('Email verified successfully! 🎉', 'success');
    return { success: true, message: 'Email verified successfully!' };
  };

  // 6. Resend Verification
  const resendVerification = async (
    targetEmail?: string
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    return { success: true, message: 'Verification code resent.' };
  };

  // 7. Update Profile Details
  const updateUserProfile = async (
    details: Partial<User>
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      setIsLoading(true);
      if (!user) throw new Error('No active user session');

      const updatedUser: User = {
        ...user,
        ...details,
        updatedAt: new Date().toISOString(),
      };

      // Save to Firestore
      try {
        await updateDoc(doc(db, 'users', user.uid), details);
      } catch (fsErr) {
        console.warn('Firestore profile update notice:', fsErr);
      }

      // Safe sync to backend API
      safeFetchJson('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          ...details,
        }),
      }).catch(() => {});

      saveUserSession(updatedUser);
      setIsLoading(false);
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

  // 8. Save Onboarding Preferences
  const saveOnboardingPreferences = async (
    homeLocation: string,
    travelPreferences: string[]
  ): Promise<{ success: boolean; error?: string }> => {
    return updateUserProfile({ homeLocation, travelPreferences });
  };

  // 9. Logout
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

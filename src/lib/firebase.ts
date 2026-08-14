import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Configure safe local persistence
try {
  setPersistence(auth, browserLocalPersistence).catch(() => {
    // Ignore in restrictive iframe environments
  });
} catch {
  // Safe fallback
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.addScope('openid');

export const oAuthClientId = firebaseConfig.oAuthClientId || '';

// Initialize Firestore directly as specified in the Firebase integration skill
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const isFirebaseConfigured = Boolean(
  firebaseConfig &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey
);


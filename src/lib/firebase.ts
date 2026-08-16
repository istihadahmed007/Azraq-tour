import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { initializeFirestore, getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';
import firebaseConfig from '../../firebase-applet-config.json';

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

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

// Initialize Firestore safely with reliable transport configuration
const targetDbId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? firebaseConfig.firestoreDatabaseId
  : undefined;

function createFirestoreInstance() {
  try {
    if (targetDbId) {
      return initializeFirestore(app, {
        experimentalForceLongPolling: true,
      }, targetDbId);
    }
    return initializeFirestore(app, {
      experimentalForceLongPolling: true,
    });
  } catch {
    try {
      return targetDbId ? getFirestore(app, targetDbId) : getFirestore(app);
    } catch {
      return getFirestore(app);
    }
  }
}

export const db = createFirestoreInstance();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): FirestoreErrorInfo {
  const errMsg = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };

  // Log in development if not an expected offline transition
  if (!errMsg.includes('offline') && !errMsg.includes('unavailable') && !errMsg.includes('could not be completed')) {
    console.warn('Firestore Operation Info:', JSON.stringify(errInfo));
  }
  return errInfo;
}

// Validate Connection to Firestore safely without throwing unhandled exceptions
async function testConnection() {
  if (!isFirebaseConfigured) return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.info('Firestore initialized in offline mode.');
    }
  }
}

if (typeof window !== 'undefined') {
  // Test connection after bootstrap
  setTimeout(() => {
    testConnection().catch(() => {});
  }, 1500);
}

// Initialize Firebase Analytics safely (supported in browser environments)
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Analytics not supported in this environment
    });
}

export const isFirebaseConfigured = Boolean(
  firebaseConfig &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey
);



import { initializeApp, getApps, getApp, type FirebaseOptions, type FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore
} from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

let app: FirebaseApp | null = null;
let firestore: Firestore | null = null;
let firebaseAuth: Auth | null = null;

if (isFirebaseConfigured) {
  try {
    const isNew = getApps().length === 0;
    app = isNew ? initializeApp(firebaseConfig) : getApp();
    if (isNew) {
      try {
        firestore = initializeFirestore(app, {
          localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager()
          })
        });
      } catch {
        firestore = getFirestore(app);
      }
    } else {
      firestore = getFirestore(app);
    }
    firebaseAuth = getAuth(app);
  } catch (error) {
    console.warn('Firebase no pudo inicializarse:', error);
  }
} else {
  console.info('Firebase no está configurado. Completa las variables VITE_FIREBASE_* del entorno.');
}

export const firestoreDb: Firestore | null = firestore;
export const auth: Auth | null = firebaseAuth;


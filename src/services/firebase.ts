import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const requiredFirebaseKeys = ['projectId', 'databaseURL'] as const;
const missingFirebaseConfig = requiredFirebaseKeys.filter((key) => !firebaseConfig[key]);

if (import.meta.env.PROD && missingFirebaseConfig.length > 0) {
  throw new Error(`Configuración Firebase incompleta: ${missingFirebaseConfig.join(', ')}`);
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const rtdb = getDatabase(app);

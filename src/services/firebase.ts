import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  projectId: 'restaurant-4e0ee',
  databaseURL: 'https://restaurant-4e0ee-default-rtdb.firebaseio.com/'
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const rtdb = getDatabase(app);

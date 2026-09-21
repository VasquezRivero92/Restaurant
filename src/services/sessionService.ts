import { AppRole, ScreenType, AdminUser } from '../types';

export interface UserSessionData {
  isAuthenticated: boolean;
  currentRole: AppRole;
  staffUser: {
    name: string;
    role: 'mesero' | 'admin';
  };
  currentScreen: ScreenType;
  activeChainId: string;
  activeBranchId: string;
  selectedTableId?: string;
  cartaInitialTab?: 'carta' | 'sedes' | 'equipo';
  adminProfile?: AdminUser;
  lastUpdated?: number;
}

const STORAGE_KEY = 'ordena_session_v1';

export function saveSession(data: Partial<UserSessionData>): void {
  try {
    const existing = loadSession() || ({} as UserSessionData);
    const updated: UserSessionData = {
      ...existing,
      ...data,
      lastUpdated: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.warn('Error saving session to localStorage:', error);
  }
}

export function loadSession(): UserSessionData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserSessionData;
    // Validate that it has the essential fields
    if (typeof parsed.isAuthenticated === 'boolean') {
      return parsed;
    }
    return null;
  } catch (error) {
    console.warn('Error reading session from localStorage:', error);
    return null;
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Error clearing session from localStorage:', error);
  }
}

export function savePersistedData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`ordena_cache_${key}`, JSON.stringify(data));
  } catch (err) {
    console.warn(`Error persisting ${key} to localStorage:`, err);
  }
}

export function loadPersistedData<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`ordena_cache_${key}`);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (parsed !== null && parsed !== undefined) {
      return parsed as T;
    }
    return fallback;
  } catch (err) {
    console.warn(`Error loading ${key} from localStorage:`, err);
    return fallback;
  }
}

export function clearAllPersistedData(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('ordena_cache_')) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (err) {
    console.warn('Error clearing persisted cache:', err);
  }
}

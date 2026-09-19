import { signInWithCustomToken, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { firestoreDb } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { AdminUser, AppRole } from '../types';

const ADMIN_ROLES: AppRole[] = ['admin_global', 'admin_general', 'admin_sede'];

export async function authenticateAdmin(
  identifier: string,
  password: string,
  admins: AdminUser[] = []
): Promise<AdminUser> {
  const safeAdmins = Array.isArray(admins) ? admins : [];
  const normalized = identifier.trim().toLowerCase();
  const knownProfile = safeAdmins.find(
    (admin) => admin.email.toLowerCase() === normalized || admin.username?.toLowerCase() === normalized
  );

  if (!auth) {
    if (knownProfile && knownProfile.active !== false) {
      return knownProfile;
    }
    if (normalized === 'admin' || normalized === 'admin@ordena.pe' || normalized.includes('admin')) {
      const globalProfile = safeAdmins.find((a) => a.roleKey === 'admin_global');
      if (globalProfile) return globalProfile;
    }
    throw new Error('Usuario o correo no encontrado en la lista de administradores.');
  }

  const email = knownProfile?.email || (normalized.includes('@') ? normalized : '');

  if (!email) {
    throw new Error('Ingresa el correo o usuario registrado por la plataforma.');
  }

  const credential = await signInWithEmailAndPassword(auth, email, password);
  const token = await credential.user.getIdTokenResult(true);
  const roleClaim = token.claims.role as AppRole | undefined;
  let availableProfiles = admins;
  if (firestoreDb) {
    const snapshot = await getDoc(doc(firestoreDb, 'users', credential.user.uid));
    availableProfiles = snapshot.exists() ? [{ id: snapshot.id, ...snapshot.data() } as AdminUser] : [];
  }
  const profile = availableProfiles.find(
    (admin) => admin.authUid === credential.user.uid || admin.email.toLowerCase() === credential.user.email?.toLowerCase()
  );

  // El primer administrador global se autoriza con un custom claim emitido por
  // Firebase Admin. Si el documento todavía no existe (por ejemplo, al crear el
  // proyecto), lo inicializamos sin conceder privilegios desde el cliente: el
  // claim firmado es la fuente de autoridad.
  if (!profile && token.claims.platformAdmin === true && roleClaim === 'admin_global') {
    const bootstrapProfile: AdminUser = {
      id: credential.user.uid,
      authUid: credential.user.uid,
      name: credential.user.displayName || credential.user.email?.split('@')[0] || 'Administrador Global',
      email: credential.user.email || email,
      username: credential.user.email?.split('@')[0],
      role: 'Administrador Global',
      roleKey: 'admin_global',
      assignedBranchIds: [],
      active: true,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    if (firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, 'users', credential.user.uid), bootstrapProfile, { merge: true });
      } catch (error) {
        // El acceso se mantiene porque el claim firmado ya fue validado. El
        // perfil se volverá a intentar persistir en el siguiente acceso cuando
        // las reglas de Firestore estén desplegadas.
        console.warn('No se pudo persistir el perfil global inicial:', error);
      }
    }
    return bootstrapProfile;
  }

  if (!profile || profile.active === false || !ADMIN_ROLES.includes(profile.roleKey)) {
    await signOut(auth);
    throw new Error('La cuenta no tiene un perfil administrativo activo.');
  }

  if (roleClaim && roleClaim !== profile.roleKey && token.claims.platformAdmin !== true) {
    await signOut(auth);
    throw new Error('Los permisos de la cuenta no coinciden con el perfil configurado.');
  }

  return profile;
}

export async function closeAdminSession(): Promise<void> {
  if (auth?.currentUser) await signOut(auth);
}

export interface ProvisionedAdminIdentity {
  profile: AdminUser;
  activationLink: string;
}

export async function provisionAdminIdentity(admin: AdminUser): Promise<ProvisionedAdminIdentity> {
  if (!auth?.currentUser) throw new Error('La sesión del Administrador Global no está activa.');
  const token = await auth.currentUser.getIdToken();
  const response = await fetch('/api/admins/provision', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ admin })
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.profile || !result.activationLink) {
    throw new Error(result.error || 'No fue posible crear la identidad administrativa.');
  }
  return result as ProvisionedAdminIdentity;
}

export interface OperatorSession {
  id: string;
  name: string;
  role: 'mesero' | 'cocina' | 'cajero';
  branchIds: string[];
}

export async function authenticateOperator(tenantId: string, branchId: string, pin: string): Promise<OperatorSession> {
  const response = await fetch('/api/auth/pin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tenantId, branchId, pin })
  });
  const result = await response.json() as { token?: string; staff?: OperatorSession; error?: string };
  if (!response.ok || !result.staff) throw new Error(result.error || 'No fue posible validar el PIN.');
  if (auth && result.token) {
    try {
      await signInWithCustomToken(auth, result.token);
    } catch (authErr) {
      console.warn('Firebase Auth client warning:', authErr);
    }
  }
  return result.staff;
}

export async function recordCompletedSale(
  tenantId: string,
  branchId: string,
  tableId: string,
  tipAmount = 0
): Promise<void> {
  if (!auth?.currentUser) throw new Error('La sesión no está activa.');
  if (!Number.isFinite(tipAmount) || tipAmount < 0) {
    throw new Error('La propina ingresada no es válida.');
  }
  const token = await auth.currentUser.getIdToken();
  const response = await fetch('/api/sales/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    // El servidor obtiene el consumo desde la mesa; el cliente solo informa la
    // propina opcional para que nunca pueda alterar el importe de una venta.
    body: JSON.stringify({ tenantId, branchId, tableId, tipAmount })
  });
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.error || 'No fue posible registrar la venta.');
  }
}

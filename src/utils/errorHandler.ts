/**
 * Utilidad para normalizar y traducir todos los errores de Firebase,
 * Firestore, red y del sistema al español (Perú).
 */

export function getErrorMessage(error: unknown, fallbackMessage = 'No fue posible completar la operación.'): string {
  if (!error) return fallbackMessage;

  const errObj = error as { code?: string; message?: string };
  const code = typeof errObj.code === 'string' ? errObj.code.toLowerCase() : '';
  const rawMessage = typeof errObj.message === 'string'
    ? errObj.message
    : error instanceof Error
      ? error.message
      : String(error);
  const lowerMessage = rawMessage.toLowerCase();

  // 1. Errores de Firebase Authentication
  if (
    code.includes('invalid-credential') ||
    code.includes('wrong-password') ||
    code.includes('user-not-found') ||
    lowerMessage.includes('invalid-credential') ||
    lowerMessage.includes('wrong-password') ||
    lowerMessage.includes('user-not-found')
  ) {
    return 'Usuario o contraseña incorrectos. Por favor, verifica tus credenciales.';
  }

  if (code.includes('invalid-email') || lowerMessage.includes('invalid-email')) {
    return 'El formato del correo electrónico no es válido.';
  }

  if (code.includes('user-disabled') || lowerMessage.includes('user-disabled')) {
    return 'Esta cuenta de usuario ha sido inhabilitada. Comunícate con la administración.';
  }

  if (code.includes('too-many-requests') || lowerMessage.includes('too-many-requests')) {
    return 'Demasiados intentos fallidos. Por seguridad, el acceso ha sido bloqueado temporalmente. Espera unos minutos e inténtalo nuevamente.';
  }

  if (code.includes('network-request-failed') || lowerMessage.includes('network-request-failed')) {
    return 'Error de conexión con los servidores de autenticación. Verifica tu conexión a internet.';
  }

  if (code.includes('requires-recent-login') || lowerMessage.includes('requires-recent-login')) {
    return 'Esta operación es sensible y requiere que vuelvas a iniciar sesión.';
  }

  if (code.includes('email-already-in-use') || lowerMessage.includes('email-already-in-use')) {
    return 'Este correo electrónico ya está registrado en la plataforma.';
  }

  if (code.includes('weak-password') || lowerMessage.includes('weak-password')) {
    return 'La contraseña es muy débil. Debe tener al menos 6 caracteres.';
  }

  if (code.includes('popup-closed-by-user') || lowerMessage.includes('popup-closed-by-user')) {
    return 'Se cerró la ventana de autenticación antes de terminar.';
  }

  // 2. Errores de Cloud Firestore y Reglas de Seguridad
  if (
    code.includes('permission-denied') ||
    lowerMessage.includes('missing or insufficient permissions') ||
    lowerMessage.includes('insufficient permissions') ||
    lowerMessage.includes('permission_denied')
  ) {
    return 'No tienes los permisos necesarios para acceder a esta información o realizar esta acción.';
  }

  if (code.includes('unavailable') || lowerMessage.includes('service is currently unavailable') || lowerMessage.includes('unavailable')) {
    return 'El servicio no está disponible en este momento. Por favor, intenta de nuevo en unos minutos.';
  }

  if (code.includes('not-found') || lowerMessage.includes('not found') || lowerMessage.includes('document not found')) {
    return 'El registro solicitado no fue encontrado.';
  }

  if (code.includes('already-exists') || lowerMessage.includes('already exists')) {
    return 'El registro ya existe en el sistema.';
  }

  if (code.includes('deadline-exceeded') || lowerMessage.includes('deadline exceeded') || lowerMessage.includes('timeout')) {
    return 'Se agotó el tiempo de espera de la solicitud. Verifica tu conexión a internet.';
  }

  if (code.includes('resource-exhausted') || lowerMessage.includes('resource exhausted')) {
    return 'Se ha alcanzado el límite de solicitudes. Por favor, espera un momento.';
  }

  if (code.includes('unauthenticated') || lowerMessage.includes('unauthenticated')) {
    return 'Tu sesión ha vencido o no estás autenticado. Por favor, inicia sesión nuevamente.';
  }

  // 3. Errores de red del navegador (Fetch / CORS / Desconexión)
  if (
    lowerMessage.includes('failed to fetch') ||
    lowerMessage.includes('networkerror') ||
    lowerMessage.includes('network request failed') ||
    lowerMessage.includes('connect timeouterror') ||
    lowerMessage.includes('und_err_connect_timeout')
  ) {
    return 'No se pudo establecer conexión con el servidor. Revisa tu conexión a internet.';
  }

  // 4. Limpieza de mensajes técnicos en inglés tipo "Firebase: Error (...)"
  if (rawMessage.startsWith('Firebase:')) {
    return 'Error en la comunicación con los servicios en la nube. Intenta nuevamente.';
  }

  // 5. Si el mensaje es una excepción limpia y legible en español, devolverla
  if (
    rawMessage &&
    !rawMessage.includes('Error (') &&
    !rawMessage.toLowerCase().includes('firebase') &&
    !rawMessage.toLowerCase().includes('firestore') &&
    !/^[a-zA-Z\s]+$/.test(rawMessage) // si contiene palabras comunes en inglés puro
  ) {
    return rawMessage;
  }

  return rawMessage && !/^[a-zA-Z\s,.]+$/.test(rawMessage) ? rawMessage : fallbackMessage;
}

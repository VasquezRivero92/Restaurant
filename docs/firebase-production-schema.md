# Cloud Firestore: modelo de producción

Proyecto de destino: `restaurant-4e0ee`, base `(default)`.

## Colecciones

```text
restaurants/{restaurantId}             perfil y sedes de la empresa
admins/{firebaseAuthUid}                perfil, rol y sedes permitidas
masterCartas/{cartaId}                  catálogo maestro
branchMenus/{branchId}/items/{itemId}   carta publicada por sede
staff/{staffId}                         personal y hash del PIN
tables/{tableId}                        mesa con branchId
kdsTickets/{ticketId}                   comanda con branchId
```

Los administradores se autentican con correo y contraseña en Firebase
Authentication. El identificador del documento `admins` debe ser el mismo UID
de Authentication. Sus custom claims son `role`, `tenantId`, `branchIds` y,
solo para plataforma, `platformAdmin: true`.

El personal de salón y cocina entrega su PIN únicamente a `POST /api/auth/pin`.
El servidor compara bcrypt contra `staff.pinHash` y devuelve un custom token de
alcance limitado. Firestore nunca expone el PIN ni su hash al cliente operativo.

## Migración

El script `scripts/migrate-rtdb-to-firestore.mjs` copia el árbol histórico
`restaurant/*` de Realtime Database, separa cada registro en documentos,
incorpora `branchId` y convierte los PIN a bcrypt.

Variables requeridas para ejecutarlo:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS='C:\ruta\service-account.json'
$env:FIREBASE_PROJECT_ID='restaurant-4e0ee'
$env:FIREBASE_DATABASE_URL='https://ORIGEN.firebaseio.com'
node scripts/migrate-rtdb-to-firestore.mjs
```

Después de validar conteos y accesos, despliegue `firestore.rules` e índices con
Firebase CLI. Mantenga `VITE_ENABLE_DEMO_DATA=false` y `ENABLE_DEMO_DATA=false`
en producción.

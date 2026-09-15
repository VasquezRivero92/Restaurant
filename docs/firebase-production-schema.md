# Firebase Realtime Database: modelo de producción

El árbol actual `restaurant/*` mezcla todas las sedes, usa arreglos y permite que
cada cambio reemplace una colección completa. No es apto para varias sedes ni
para concurrencia de mozos, caja y cocina. La estructura de destino es:

```text
tenants/{tenantId}/
  profile/{name, ruc, plan, status, createdAt, updatedAt}
  branches/{branchId}/
    profile/{name, timezone, active, ...}
    catalog/items/{itemId}
    staff/{staffId}
    operational/
      tables/{tableId}
      orders/{orderId}
      kdsTickets/{ticketId}
      payments/{paymentId}
      shifts/{shiftId}
      audit/{eventId}
```

## Decisiones obligatorias

- Los nodos se guardan como mapas por ID, nunca como arreglos. Así una mesa u
  orden se actualiza sin sobrescribir a las demás.
- `orders`, `payments` y `audit` son inmutables o append-only. Una anulación se
  registra como evento; no se borra una venta.
- Todas las entidades llevan `id`, `createdAt`, `updatedAt`, `createdBy` y,
  cuando corresponda, `updatedBy`. Los tiempos se generan en servidor con
  `ServerValue.TIMESTAMP`.
- La lectura operativa se limita a la sede activa. No se escucha el tenant ni
  todas las mesas de la cadena.
- El token de Firebase Auth debe contener `tenantId`, `role` y, solo para la
  plataforma, `platformAdmin`. Los custom claims se asignan exclusivamente
  desde un entorno administrativo con Firebase Admin SDK.

## Despliegue seguro

1. Cree Firebase Auth y asigne custom claims a administradores y mozos.
2. Configure las variables `VITE_FIREBASE_*` por ambiente y mantenga
   `VITE_ENABLE_DEMO_DATA=false` fuera del emulador.
3. Migre `restaurant/*` a `tenants/{tenantId}/branches/{branchId}` mediante un
   proceso backend con Admin SDK; no ejecute `set()` desde un navegador.
4. Adapte la app para actualizar rutas individuales con `update()` o
   transacciones, y cree pagos/auditoría en Cloud Functions.
5. Pruebe `database.rules.json` con Emulator Suite para mozo, administrador de
   sede, administrador general y plataforma.
6. Despliegue con `firebase deploy --only database` solo después de migrar la
   app a `tenants/*`; las reglas bloquean a propósito el árbol demo actual.

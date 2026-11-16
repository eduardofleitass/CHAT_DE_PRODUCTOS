# Chat de productos - prueba técnica

Chat de producto entre una **app cliente** y una **app comercio**, sincronizado con Firebase Realtime
Database. El comercio puede mandar una oferta con un producto en cualquier momento; el cliente la aprueba o
la rechaza. Al aprobarla, el pedido queda guardado en la API.

| Pieza | Stack | Qué hace |
|---|---|---|
| `api` | NestJS 12 + TypeScript | `POST /orders` y `GET /orders/:id`. Sin Firebase. |
| `app-comercio` | React 19 + Vite + TypeScript | Chat + envío de ofertas. Solo ve el estado. |
| `app-cliente` | React Native (Expo) + TypeScript | Chat + responde ofertas. Al aprobar llama a la API. |

**Chat de la demostración: `demo-1`** (configurable por variable de entorno en las tres piezas).

---

## Requisitos

- Node 20 o superior (probado con Node 22).
- Un proyecto de Firebase con **Realtime Database** (plan Spark, gratis, alcanza).
- Para correr el cliente en el teléfono: [Expo Go](https://expo.dev/go). Sin Android Studio.
  También corre en el navegador con `npm run web`.

---

## 1. Firebase (una sola vez)

1. Consola de Firebase → **Agregar proyecto** → sin Analytics.
2. **Bases de datos y almacenamiento → Realtime Database** (no Firestore) → Crear base de datos →
   modo de prueba. Anotá la URL: termina en `https://<proyecto>-default-rtdb.firebaseio.com`.
3. ⚙️ **Configuración del proyecto → Tus apps → Agregar app → Web** → copiá el objeto `firebaseConfig`.
   > La consola **no siempre incluye `databaseURL`** en ese bloque: agregala a mano con la URL del paso 2.
4. Copiá `.env.example` a `.env` en las dos apps y completá:

```bash
cd app-comercio && cp .env.example .env
cd ../app-cliente && cp .env.example .env
```

| `firebaseConfig` | `app-comercio/.env` | `app-cliente/.env` |
|---|---|---|
| `apiKey` | `VITE_FIREBASE_API_KEY` | `EXPO_PUBLIC_FIREBASE_API_KEY` |
| `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` | `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` |
| `databaseURL` | `VITE_FIREBASE_DATABASE_URL` | `EXPO_PUBLIC_FIREBASE_DATABASE_URL` |
| `projectId` | `VITE_FIREBASE_PROJECT_ID` | `EXPO_PUBLIC_FIREBASE_PROJECT_ID` |
| `storageBucket` | `VITE_FIREBASE_STORAGE_BUCKET` | `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` | `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` |
| `appId` | `VITE_FIREBASE_APP_ID` | `EXPO_PUBLIC_FIREBASE_APP_ID` |
| - | `VITE_CHAT_ID=demo-1` | `EXPO_PUBLIC_CHAT_ID=demo-1` |
| - | - | `EXPO_PUBLIC_API_BASE=http://<IP-LAN-de-la-PC>:3000` |

Los `.env` están en `.gitignore`: **no se commitean**. Solo se versionan los `.env.example`.

En la app cliente, `EXPO_PUBLIC_API_BASE` **no puede ser `localhost`** si corrés en un teléfono: para el
teléfono, `localhost` es el teléfono. Poné la IP LAN de la PC (`ipconfig`).

### Reglas de Realtime Database usadas

```json
{
  "rules": {
    "chats": {
      "$chatId": {
        "messages": { ".read": true, ".write": true }
      }
    }
  }
}
```

Abiertas a propósito: es una prueba técnica sin autenticación. En producción irían cerradas por usuario.

---

## 2. API

```bash
cd api
npm install
npm run start:dev        # http://127.0.0.1:3000
npm test                 # tests de OrdersService (vitest)
```

Endpoints:

```bash
# crear pedido -> 201 { id, status: "created", createdAt, chatId, messageId, product }
curl -X POST http://127.0.0.1:3000/orders -H "Content-Type: application/json" \
  -d '{"chatId":"demo-1","messageId":"-Omsg1","product":{"id":"p-101","name":"Bandeja paisa","price":32000,"currency":"COP"}}'

# buscar pedido -> 200, o 404 si no existe
curl http://127.0.0.1:3000/orders/<id>
```

Devuelve **400** si falta `chatId`, falta `product.id`, `product.price` no es numérico o no es mayor que
cero. La validación la hace `ValidationPipe` con los decoradores de `create-order.dto.ts`; sin el pipe en
`main.ts` esos decoradores no hacen nada.

CORS está habilitado: el comercio (5173) y el cliente llaman desde otro origen.

Los pedidos se guardan en `api/orders.json` (ignorado por git).

---

## 3. Comercio web

```bash
cd app-comercio
npm install
npm run dev              # http://localhost:5173
npm test                 # tests de chat.service (vitest)
```

Escucha `chats/demo-1/messages` en tiempo real, manda texto como `sender: "comercio"` y el botón
**Enviar oferta** publica un `product_offer` en `status: "pending"`. No tiene botones de respuesta: solo
muestra el estado de su oferta (`PENDIENTE` / `ACEPTADA` / `RECHAZADA`), que se actualiza sin recargar.

---

## 4. Cliente móvil

```bash
cd app-cliente
npm install
npm start                # QR para Expo Go (misma WiFi que la PC)
npm run web              # alternativa sin teléfono
```

Muestra el chat con `FlatList`, responde ofertas pendientes con **Aprobar / Rechazar** y, al aprobar:

1. `POST /orders` a la API (**primero**, si falla la oferta queda pendiente y se puede reintentar),
2. `update` del mensaje a `status: "accepted"` en Firebase,
3. publica un mensaje `order_accepted` de confirmación.

Al rechazar solo actualiza Firebase a `rejected`, sin llamar a la API.

---

## Ejemplo del pedido guardado (`api/orders.json`)

```json
[
  {
    "id": "48e659b9-ff0c-4f98-8145-da0b78f22076",
    "status": "created",
    "createdAt": "2026-11-16T01:50:23.250Z",
    "chatId": "demo-1",
    "messageId": "-P6X20bJMeXPfhu6_oQs",
    "product": {
      "id": "p-101",
      "name": "Bandeja paisa",
      "price": 32000,
      "currency": "COP",
      "imageUrl": "https://placehold.co/96x96/e5e7eb/111?text=BP"
    }
  }
]
```

---

## Forma de los mensajes en Firebase

Ruta: `/chats/{chatId}/messages/{messageId}`.

```json
{ "sender": "cliente", "type": "text", "text": "Hola, ¿sigue disponible?", "createdAt": 1731023940000 }
```

```json
{
  "sender": "comercio",
  "type": "product_offer",
  "status": "pending",
  "product": { "id": "p-101", "name": "Bandeja paisa", "price": 32000, "currency": "COP", "imageUrl": "..." },
  "createdAt": 1731024000000
}
```

El campo `id` **no se guarda**: la key que genera `push()` es el id, y el listener la inyecta al leer
(`Object.entries(snapshot.val()).map(([id, m]) => ({ ...m, id }))`). Una sola fuente de verdad, sin
duplicar el dato.

---

## Estructura

```
api/src/orders/{orders.module.ts, controllers/, services/, dto/, interfaces/}
app-comercio/src/chat/{pages/, components/, services/, interfaces/}
app-cliente/src/chat/{screens/, components/, services/, interfaces/}
app-cliente/src/orders/services/       (POST /orders desde el cliente)
```

Patrón `src/[entidad]/[componentes]` en las tres piezas: la entidad de la API es `orders`, la de las apps
es `chat`.

---

## Extras implementados

- Mismo `chatId` configurable por variable de entorno en las tres piezas.
- Anti doble respuesta: los botones se deshabilitan mientras la petición está en vuelo y se ignora
  cualquier oferta que ya no esté `pending`.
- Mensaje `order_accepted` como confirmación en el chat.
- `product.price > 0` validado en la API.
- Tests de `orders.service.ts` y `chat.service.ts`.
- Reglas de Firebase documentadas arriba.

---

## Notas de implementación

- En `app-cliente`, `ProductOfferCard` recibe `onAnswer` y `answering`: el componente no sabe llamar a la
  API, solo avisa. La lógica vive en `ChatScreen`.
- `listenMessages` devuelve la función de desuscripción que entrega `onValue`. Sin ese `return` en el
  `useEffect`, React StrictMode monta dos listeners en desarrollo y cada mensaje aparece duplicado.
- La API guarda en archivo, no en base de datos: cada `POST` reescribe `orders.json` completo. Alcanza para
  la prueba; con escrituras concurrentes haría falta una DB o una cola.

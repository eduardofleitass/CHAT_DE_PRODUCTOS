# Prueba técnica — Chat de producto (NestJS + Firebase + React / React Native)

Esta guía es nuestra hoja de ruta. Yo dejo el andamiaje y reviso; **vos escribís la lógica**,
que es lo que te van a preguntar en la entrevista. Si en algún momento querés que avance yo,
decímelo y lo hago — pero perdés la parte que se evalúa.

---

## 1. Qué quedó hecho

```
Prueba tecnica/           <- repo git ya inicializado en main
├── api/                  <- API Nest 12 (vitest + oxlint)
├── app-comercio/         <- React + Vite + TS  (npm run dev)
├── app-cliente/          <- Expo + React Native + TS  (npm start)
├── .gitignore
└── GUIA.md
```

Verificado de verdad, no de palabra:
- `npx tsc -b` en app-comercio: sin errores. `npx tsc --noEmit` en app-cliente: sin errores.
- `npm run dev` en app-comercio responde HTTP 200 y sirve `src/App.tsx`.
- Ambas apps ya tienen `firebase` instalado y el árbol `src/chat/{pages|screens,components,services,interfaces}` creado con
  las firmas tipadas y un `throw new Error('pendiente')` en cada cuerpo. Compila, pero todavía no hace nada: eso es tuyo.

### Decisión tomada: Expo en vez de React Native CLI

El PDF pide `npm run android`. Eso necesita Java + Android Studio + emulador. **En esta PC no hay
`java` ni `ANDROID_HOME`**, así que React Native "bare" no arranca. Las opciones eran:

| Opción | Costo | Resultado |
|---|---|---|
| Expo Go en el celular | 0, sin instalar nada | `npm start` + QR, corre en tu teléfono real **(elegida)** |
| `npm run web` | ya instalado | la app móvil en el navegador, plan B si el WiFi/firewall molesta |
| Instalar Android Studio | ~4 GB, 1 h de setup | `npm run android` literal, pero no agrega nada a la nota |
| `expo run:android` | necesita igual Android SDK | descartada |

Expo **es React Native** (misma API, mismos `View`/`Text`/`FlatList`). Si el evaluador exige el
comando exacto, se agrega `"android": "expo run:android"` al final; el código no cambia.

---

## 2. Regla de oro (vale 20 % de la nota)

`src/[entidad]/[componentes]` en las tres piezas. Entidad = `orders` en la API, `chat` en las dos apps.
Si un archivo nuevo no entra en ese patrón, no lo crees.

---

## 3. Fase 0 — Firebase (30 min, sin esto nada arranca)

1. https://console.firebase.google.com → **Agregar proyecto** → nombre `prueba-chat` → sin Analytics.
2. **Realtime Database** → Crear base de datos → ubicación cualquiera → **modo de prueba**.
   Anotá la URL, termina en `https://prueba-chat-default-rtdb.firebaseio.com`.
3. ⚙️ **Configuración del proyecto** → Tus apps → `</>` (Web) → registrá `chat-producto` → copiá el objeto `firebaseConfig`.
   **Un solo registro alcanza para las dos apps**: las dos usan el SDK Web. No registres una app "Android"
   aparte — no la usamos y no aporta nada.
   Ojo: `databaseURL` **no aparece** en ese objeto hasta que exista la Realtime Database (paso 2).
4. Los `.env` ya están creados (vacíos) en las dos apps. Solo pegá los valores:

```bash
notepad app-comercio/.env
notepad app-cliente/.env
```

- `app-comercio/.env` usa prefijo **VITE_**  ·  `app-cliente/.env` usa **EXPO_PUBLIC_**
- `DATABASE_URL` = la del paso 2. `CHAT_ID` = el mismo texto en los dos (ej. `demo-1`).
- El `.env` ya está en los `.gitignore`. **No se commitea** (lo pide el enunciado y se nota).

Reglas de la Realtime Database (pestaña **Reglas**) — copialas también en el README, es punto extra:

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

**Checkpoint:** hoy la web tira `FIREBASE FATAL ERROR: Can't determine Firebase Database URL`
(lo probé, es lo esperado sin credenciales). Cuando pongas el `.env` y reinicies `npm run dev`,
tiene que mostrar `Comercio — chat demo-1` y `0 mensajes`.

---

## 4. Fase 1 — API (`api`) — HECHA Y VERIFICADA

> El módulo `OrdersModule` ya está escrito, probado con curl real y commiteado (`77452ad`).
> Leelo entero antes de seguir: es la referencia de cómo se arma un módulo Nest, y en la entrevista
> te van a preguntar por qué existe el `ValidationPipe`.

Archivos (respetando el patrón):

```
src/orders/orders.module.ts
src/orders/controllers/orders.controller.ts
src/orders/services/orders.service.ts
src/orders/dto/create-order.dto.ts
src/orders/interfaces/order.interface.ts
```

```bash
cd api
npm i class-validator class-transformer   # DTOs: es el camino estándar de Nest
```

**Contrato:**
- `POST /orders` recibe `chatId`, `messageId`, `product` (el objeto completo).
- Devuelve `{ id, status: 'created', createdAt, chatId, messageId, product }`.
- 400 si falta `chatId` o `product.id`, o si `product.price <= 0`.
- `GET /orders/:id` → 404 si no existe.
- Persistencia: `orders.json` con `node:fs/promises`. Sin base de datos, sin Firebase.

**Piezas que tenés que entender, no copiar:**
- `dto/create-order.dto.ts`: `@IsString() @IsNotEmpty() chatId`, `@ValidateNested() @Type(() => ProductDto) product`,
  y en `ProductDto` el `@IsPositive() price`. Los mensajes de error salen solos.
- `main.ts`: `app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))`.
  Sin esto el DTO es decoración y `chatId` faltante entra igual → perdés el 400.
- `orders.service.ts`: lee el archivo si existe, `push` el pedido con `randomUUID()` y `createdAt: new Date().toISOString()`,
  escribe. Ojo ESM: el `package.json` de `back` tiene `"type": "module"`.
- `orders.controller.ts`: solo orquesta y traduce `NotFoundException`.

**Checkpoints (copiá y pegá):**

```bash
npm run start:dev
curl -X POST http://127.0.0.1:3000/orders -H "Content-Type: application/json" \
  -d '{"chatId":"demo-1","messageId":"-Omsg1","product":{"id":"p-101","name":"Bandeja paisa","price":32000,"currency":"COP"}}'
# 201 + el pedido con id y status created
curl -i -X POST http://127.0.0.1:3000/orders -H "Content-Type: application/json" \
  -d '{"chatId":"demo-1","product":{"name":"x","price":32000}}'
# 400 (falta product.id)
curl -i -X POST http://127.0.0.1:3000/orders -H "Content-Type: application/json" \
  -d '{"chatId":"","product":{"id":"p-1","name":"x","price":0}}'
# 400
```

---

## 5. Fase 2 — app-comercio (web) — HECHA Y VERIFICADA

> `chat.service.ts` (4 funciones), `ChatPage`, `MessageBubble` y `ProductOfferCard` ya están escritos y
> probados en dos pestañas reales: el texto que entra por un lado aparece en el otro sin recargar, y la
> oferta sale por el botón con estado `Pendiente`. Leé `chat.service.ts` con atención — es el mismo que
> vas a repetir en la app cliente.

`src/chat/services/chat.service.ts` — cuatro funciones, y la clave es una sola:

```ts
onValue(ref(db, `chats/${chatId}/messages`), (snap) => {
  const val = snap.val() ?? {};                       // null la primera vez
  const messages = Object.entries(val)
    .map(([id, m]) => ({ ...(m as Omit<ChatMessage, 'id'>), id }))
    .sort((a, b) => a.createdAt - b.createdAt);
  onMessages(messages);
});
```

- `push()` genera la key → **el `id` del mensaje es esa key**, no un campo que se guarde. Por eso el listener lo inyecta.
- `listenMessages` **devuelve la función que desuscribe** (`onValue` ya la retorna).
- `sendProductOffer` guarda `sender: 'comercio'`, `type: 'product_offer'`, `status: 'pending'`, `product`, `createdAt: Date.now()`.
- `updateOfferStatus` es un `update(ref(db, 'chats/{id}/messages/{messageId}'), { status })`.

`src/chat/pages/ChatPage.tsx`:
```ts
useEffect(() => listenMessages(CHAT_ID, setMessages), []);   // el return desuscribe
```
⚠️ En dev, React StrictMode monta/desmonta dos veces. Si no devolvés el unsubscribe vas a ver cada
mensaje duplicado y jurar que Firebase está roto. No lo está.

`MessageBubble`: alineado a la derecha si `sender === 'comercio'`.
`ProductOfferCard`: imagen, nombre, precio y el estado. **Sin botones** — el comercio solo mira.
Para probar ofertas, un `<button>` temporal en `ChatPage` que mande un producto hardcodeado (después lo sacás).

**Checkpoint:** abrí dos pestañas del navegador en `localhost:5173`, mandá texto en una → aparece en la otra
sin recargar (mismo chatId = mismo chat, obvio, pero confirma el listener y de paso ya tenés el "chat normal").

---

## 6. Fase 3 — app-cliente (móvil)

```bash
cd app-cliente
npm start          # QR → Expo Go en tu celular (misma WiFi)
npm run web        # plan B: la misma pantalla en el navegador, sin teléfono
```

Detalle que te va a morder: en el teléfono `localhost` es **el teléfono**. `EXPO_PUBLIC_API_BASE` tiene que ser
la IP LAN de la PC (`ipconfig` → IPv4, ej. `http://192.168.1.20:3000`) y el firewall de Windows tiene que dejar pasar el 3000.

Orden de trabajo:
1. `chat.service.ts`: mismo listener que el comercio, `sender: 'cliente'` al enviar, `updateOfferStatus` al responder.
2. `ChatScreen.tsx`: `FlatList` + input + botón en enviar. `keyExtractor={(m) => m.id}`.
3. `ProductOfferCard.tsx`: si `status === 'pending'` → botones **Aprobar** / **Rechazar**; si no, solo el estado.
4. Flujo de aprobación — **el orden importa**:
   ```
   guardar en la API  →  si falla, no toques Firebase y mostrá el error
   si la API dice OK  →  update a 'accepted' (Firebase, sin recargar)
   ```
   Al revés quedaría un mensaje "accepted" con el pedido perdido: dato inconsistente, y no se puede deshacer.
5. Rechazar: `update` a `'rejected'` y nada más, sin API.

**Anti-doble-respuesta (punto extra):** antes de actuar, `if (message.status !== 'pending') return;`
y deshabilitá el botón mientras la promesa está en vuelo. Con `runTransaction` sería a prueba de balas, pero
para esta prueba el guard + botón deshabilitado alcanza y se lee en dos líneas.

**Checkpoint:** mandás oferta desde el comercio → en el teléfono aparece con botones → Aprobar →
`orders.json` en `back` tiene el pedido **y** la tarjeta pasa a "accepted" en el teléfono y en la web, sin recargar ninguno.

---

## 7. Fase 4 — Puntos extra y entrega

- `order_accepted`: después de aprobar, el cliente escribe en el chat `{ type: 'order_accepted', text: 'Pedido confirmado' }`.
- Tests: `orders.service.spec.ts` (crea, persiste, 400 con price 0) y `chat.service.spec.ts`
  (mockeás `firebase/database` con `vi.mock`, verificás que `push` recibe el shape correcto y que el listener
  inyecta el `id`). En `back` ya tenés vitest configurado — no instales nada.
- `README.md` en la raíz: los 3 `npm install`, las variables, los 3 comandos, el `chatId` usado,
  un ejemplo de `orders.json` y las reglas de Firebase.
- El repo ya está inicializado y con las tres carpetas donde el enunciado las pide.
  Remote: `https://github.com/eduardofleitass/CHAT_DE_PRODUCTOS` (rama `main`).

---

## 8. Trampas ya señaladas (para que no las descubras peleando)

1. `.env` sin commitear — y el `.env.example` sí va.
2. Mismo `CHAT_ID` en las tres piezas, leído de variable de entorno.
3. `onValue` sin desuscribir = listeners duplicados en StrictMode.
4. `localhost` no existe desde el celular.
5. Aprobación: primero la API, después Firebase.
6. `product.price > 0` se valida en la API, no en el cliente (el cliente no es confiable).
7. `orders.json` escribilo con `JSON.stringify(..., null, 2)`; si lo abrís en el repo, que se lea.

---

## 9. Cómo seguimos

Empezá por la Fase 0. Cuando la web muestre `0 mensajes`, escribime **"fase 0 lista"** y arrancamos con la API:
yo te reviso el DTO y el `ValidationPipe` antes de que sigas, que es donde más gente pierde el 15 % de
"tipado y manejo de errores".

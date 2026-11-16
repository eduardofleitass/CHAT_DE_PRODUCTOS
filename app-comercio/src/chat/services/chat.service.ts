import { onValue, push, ref, update } from 'firebase/database';
import { db } from '../../config/firebase';
import type { ChatMessage, Product } from '../interfaces/chat-message.interface';

// chats/{chatId}/messages/{messageId}
const messagesRef = (chatId: string) => ref(db, `chats/${chatId}/messages`);

// Devuelve la desuscripción: si el componente no la usa, StrictMode deja dos listeners.
export function listenMessages(
  chatId: string,
  onMessages: (messages: ChatMessage[]) => void,
): () => void {
  return onValue(
    messagesRef(chatId),
    (snapshot) => {
      const value = (snapshot.val() ?? {}) as Record<string, Omit<ChatMessage, 'id'>>;

      // el id del mensaje es la key que generó push(), no un campo guardado
      onMessages(
        Object.entries(value)
          .map(([id, message]) => ({ ...message, id }))
          .sort((a, b) => a.createdAt - b.createdAt),
      );
    },
    (error) => console.error('listenMessages:', error.message),
  );
}

export async function sendTextMessage(chatId: string, text: string): Promise<void> {
  await push(messagesRef(chatId), {
    sender: 'comercio',
    type: 'text',
    text: text.trim(),
    createdAt: Date.now(),
  });
}

// Devuelve el messageId para poder corregir o cancelar la oferta después.
export async function sendProductOffer(chatId: string, product: Product): Promise<string> {
  const created = await push(messagesRef(chatId), {
    sender: 'comercio',
    type: 'product_offer',
    status: 'pending',
    product,
    createdAt: Date.now(),
  });

  return created.key!;
}

export async function updateOfferStatus(
  chatId: string,
  messageId: string,
  status: 'accepted' | 'rejected',
): Promise<void> {
  await update(ref(db, `chats/${chatId}/messages/${messageId}`), { status });
}

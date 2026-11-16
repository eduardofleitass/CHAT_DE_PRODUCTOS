import { onValue, push, ref, update } from 'firebase/database';
import { db } from '../../config/firebase';
import type { ChatMessage } from '../interfaces/chat-message.interface';

// chats/{chatId}/messages/{messageId}
const messagesRef = (chatId: string) => ref(db, `chats/${chatId}/messages`);

// Devuelve la desuscripción: sin eso, StrictMode deja dos listeners pegados.
export function listenMessages(
  chatId: string,
  onMessages: (messages: ChatMessage[]) => void,
): () => void {
  return onValue(
    messagesRef(chatId),
    (snapshot) => {
      const value = (snapshot.val() ?? {}) as Record<string, Omit<ChatMessage, 'id'>>;

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
    sender: 'cliente',
    type: 'text',
    text: text.trim(),
    createdAt: Date.now(),
  });
}

// Solo el cliente cambia el estado de una oferta.
export async function updateOfferStatus(
  chatId: string,
  messageId: string,
  status: 'accepted' | 'rejected',
): Promise<void> {
  await update(ref(db, `chats/${chatId}/messages/${messageId}`), { status });
}

// Mensaje de confirmación que ve el comercio al aprobar (punto extra).
export async function sendOrderAccepted(chatId: string, text: string): Promise<void> {
  await push(messagesRef(chatId), {
    sender: 'cliente',
    type: 'order_accepted',
    text,
    createdAt: Date.now(),
  });
}

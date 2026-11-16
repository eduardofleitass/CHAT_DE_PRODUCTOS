import type { ChatMessage, Product } from '../interfaces/chat-message.interface';

// FASE 3. Ruta en Firebase: chats/{chatId}/messages/{messageId}
// Necesitás: onValue, push, ref, update de 'firebase/database' y { db } de '../../config/firebase'.

export function listenMessages(
  _chatId: string,
  _onMessages: (messages: ChatMessage[]) => void,
): () => void {
  throw new Error('listenMessages: pendiente (fase 3)');
}

// El cliente siempre manda sender: 'cliente'.
export async function sendTextMessage(_chatId: string, _text: string): Promise<void> {
  throw new Error('sendTextMessage: pendiente (fase 3)');
}

// Solo el cliente cambia el status de una oferta.
export async function updateOfferStatus(
  _chatId: string,
  _messageId: string,
  _status: 'accepted' | 'rejected',
): Promise<void> {
  throw new Error('updateOfferStatus: pendiente (fase 3)');
}

// Extra: mensaje order_accepted de confirmación tras aprobar.
export async function sendOrderAccepted(_chatId: string, _text: string): Promise<void> {
  throw new Error('sendOrderAccepted: pendiente (fase 4)');
}

export type { ChatMessage, Product };

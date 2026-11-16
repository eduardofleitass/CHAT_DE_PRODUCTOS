import type { ChatMessage, Product } from '../interfaces/chat-message.interface';

// FASE 2. Ruta en Firebase: chats/{chatId}/messages/{messageId}
// Necesitás: onValue, push, ref, update de 'firebase/database' y { db } de '../../config/firebase'.

// Devuelve la función de desuscripción (onValue la retorna).
export function listenMessages(
  _chatId: string,
  _onMessages: (messages: ChatMessage[]) => void,
): () => void {
  throw new Error('listenMessages: pendiente (fase 2)');
}

// El comercio siempre manda sender: 'comercio'.
export async function sendTextMessage(_chatId: string, _text: string): Promise<void> {
  throw new Error('sendTextMessage: pendiente (fase 2)');
}

// Devuelve el messageId que generó push().
export async function sendProductOffer(_chatId: string, _product: Product): Promise<string> {
  throw new Error('sendProductOffer: pendiente (fase 2)');
}

// Solo para corregir o cancelar una oferta pending desde el comercio.
export async function updateOfferStatus(
  _chatId: string,
  _messageId: string,
  _status: 'accepted' | 'rejected',
): Promise<void> {
  throw new Error('updateOfferStatus: pendiente (fase 2)');
}

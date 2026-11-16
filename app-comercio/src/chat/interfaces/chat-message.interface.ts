import type { Product } from '../../products/interfaces/product.interface';

export type { Product };

export type Sender = 'cliente' | 'comercio';
export type MessageType = 'text' | 'product_offer' | 'order_accepted';
export type OfferStatus = 'pending' | 'accepted' | 'rejected';

// Forma de /chats/{chatId}/messages/{messageId}. El id no se guarda: es la key de push().
export interface ChatMessage {
  id: string;
  sender: Sender;
  type: MessageType;
  text?: string;
  status?: OfferStatus;
  product?: Product;
  createdAt: number;
}

// Body de POST /orders
export interface CreateOrderPayload {
  chatId: string;
  messageId: string;
  product: Product;
}

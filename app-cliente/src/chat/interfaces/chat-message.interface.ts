export type Sender = 'cliente' | 'comercio';
export type MessageType = 'text' | 'product_offer' | 'order_accepted';
export type OfferStatus = 'pending' | 'accepted' | 'rejected';

// Servicio que ofrece el comercio. Acá no hay catálogo: solo llega el objeto dentro del mensaje.
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  unit?: string;
  imageUrl?: string;
}

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

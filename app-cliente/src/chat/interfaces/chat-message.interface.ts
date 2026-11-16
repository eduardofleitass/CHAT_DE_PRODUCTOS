export type Sender = 'cliente' | 'comercio';
export type MessageType = 'text' | 'product_offer' | 'order_accepted';
export type OfferStatus = 'pending' | 'accepted' | 'rejected';

export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  imageUrl?: string;
}

// Lo que vive en /chats/{chatId}/messages/{messageId}
export interface ChatMessage {
  id: string; // key que genera push(); el listener la inyecta al leer
  sender: Sender;
  type: MessageType;
  text?: string; // solo type 'text'
  status?: OfferStatus; // solo type 'product_offer'
  product?: Product; // solo type 'product_offer'
  createdAt: number;
}

// Body de POST /orders (lo arma la app cliente al aprobar)
export interface CreateOrderPayload {
  chatId: string;
  messageId: string;
  product: Product;
}

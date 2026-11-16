import type { Product } from '../../products/interfaces/product.interface'; // el producto sale de su propia entidad

export type { Product }; // se reexporta para no cambiar los imports que ya lo piden desde acá

export type Sender = 'cliente' | 'comercio'; // quién escribe el mensaje
export type MessageType = 'text' | 'product_offer' | 'order_accepted'; // los tres tipos del enunciado
export type OfferStatus = 'pending' | 'accepted' | 'rejected'; // estados de una oferta

// Lo que vive en /chats/{chatId}/messages/{messageId}
export interface ChatMessage {
  id: string; // key que genera push(); el listener la inyecta al leer
  sender: Sender; // autor del mensaje
  type: MessageType; // texto, oferta o confirmación
  text?: string; // solo en type 'text'
  status?: OfferStatus; // solo en type 'product_offer'
  product?: Product; // solo en type 'product_offer'
  createdAt: number; // epoch en milisegundos, para ordenar
}

// Body de POST /orders (lo arma la app cliente al aprobar)
export interface CreateOrderPayload {
  chatId: string; // chat donde se hizo la oferta
  messageId: string; // mensaje de la oferta que se aprobó
  product: Product; // servicio aprobado, con su precio
}

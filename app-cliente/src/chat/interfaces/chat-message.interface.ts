export type Sender = 'cliente' | 'comercio'; // quién escribe el mensaje
export type MessageType = 'text' | 'product_offer' | 'order_accepted'; // los tres tipos del enunciado
export type OfferStatus = 'pending' | 'accepted' | 'rejected'; // estados de una oferta

// Servicio que ofrece el comercio. Acá no hay catálogo: el cliente solo recibe el objeto.
export interface Product {
  id: string; // identificador que viaja al pedido
  name: string; // nombre del servicio
  description?: string; // detalle corto, opcional
  price: number; // precio unitario, la API exige > 0
  currency: string; // USD, PYG, COP
  unit?: string; // mes, campaña: a qué corresponde el precio
  imageUrl?: string; // logo opcional; sin esto se dibuja un monograma
}

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

// Body de POST /orders (lo arma esta app al aprobar)
export interface CreateOrderPayload {
  chatId: string; // chat donde se hizo la oferta
  messageId: string; // mensaje de la oferta aprobada
  product: Product; // servicio aprobado, con su precio
}

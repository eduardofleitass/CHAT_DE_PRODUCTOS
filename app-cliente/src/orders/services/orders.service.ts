import type { CreateOrderPayload, Product } from '../../chat/interfaces/chat-message.interface';

// FASE 3: POST {API_BASE}/orders. Lanza si la respuesta no es ok.
export async function createOrder(_payload: CreateOrderPayload): Promise<unknown> {
  throw new Error('createOrder: pendiente (fase 3)');
}

export type { CreateOrderPayload, Product };

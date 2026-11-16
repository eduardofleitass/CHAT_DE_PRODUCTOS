import { API_BASE } from '../../config/firebase';
import type { CreateOrderPayload } from '../../chat/interfaces/chat-message.interface';

export interface SavedOrder {
  id: string;
  status: 'created';
  createdAt: string;
}

export async function createOrder(payload: CreateOrderPayload): Promise<SavedOrder> {
  const response = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    // la API devuelve { message: string | string[] } cuando rechaza
    const body = (await response.json().catch(() => ({}))) as { message?: string | string[] };
    const detail = Array.isArray(body.message) ? body.message.join(', ') : body.message;
    throw new Error(detail ?? `La API respondió ${response.status}`);
  }

  return (await response.json()) as SavedOrder;
}

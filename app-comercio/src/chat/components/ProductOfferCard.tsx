import type { ChatMessage } from '../interfaces/chat-message.interface';

// FASE 2: imagen, nombre, precio + estado de la oferta. El comercio NO muestra botones.
export default function ProductOfferCard({ message }: { message: ChatMessage }) {
  const p = message.product;
  return (
    <div>
      <strong>{p?.name}</strong> — {p?.price} {p?.currency} — {message.status}
    </div>
  );
}

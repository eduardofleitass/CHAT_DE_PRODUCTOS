import type { ChatMessage } from '../interfaces/chat-message.interface';
import { formatTime } from '../format';

const STATUS_LABEL: Record<string, string> = {
  pending: 'pendiente',
  accepted: 'aceptada',
  rejected: 'rechazada',
};

// El comercio solo mira el estado: los botones son de la app cliente.
export default function ProductOfferCard({ message }: { message: ChatMessage }) {
  const product = message.product;
  const status = message.status ?? 'pending';

  return (
    <article className="offer">
      {product?.imageUrl && (
        <img className="offer__img" src={product.imageUrl} alt={product.name} />
      )}

      <div className="offer__body">
        <div className="offer__name">{product?.name}</div>

        <div className="offer__price">
          {product?.price} <span className="offer__currency">{product?.currency}</span>
        </div>

        <div className="offer__foot">
          <span className={`pill pill--${status}`}>{STATUS_LABEL[status]}</span>
          <span className="offer__time">{formatTime(message.createdAt)}</span>
        </div>
      </div>
    </article>
  );
}

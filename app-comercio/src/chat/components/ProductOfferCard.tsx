import type { ChatMessage } from '../interfaces/chat-message.interface'; // forma del mensaje completo
import { formatTime, initials } from '../format'; // hora del mensaje y monograma del servicio

const STATUS_LABEL: Record<string, string> = {
  pending: 'pendiente', // oferta esperando respuesta del cliente
  accepted: 'aceptada', // el cliente aprobó y el pedido se guardó en la API
  rejected: 'rechazada', // el cliente dijo que no, sin llamar a la API
};

// El comercio solo mira el estado: los botones de respuesta son de la app cliente.
export default function ProductOfferCard({ message }: { message: ChatMessage }) {
  const product = message.product; // servicio que viaja dentro del mensaje
  const status = message.status ?? 'pending'; // sin status explícito se asume pendiente

  return (
    <article className="offer">
      {product?.imageUrl ? (
        <img className="offer__img" src={product.imageUrl} alt={product.name} /> // logo del servicio
      ) : (
        <div className="offer__mono">{initials(product?.name ?? '')}</div> // sin logo: iniciales
      )}

      <div className="offer__body">
        <div className="offer__name">{product?.name}</div>

        {product?.description && <p className="offer__desc">{product.description}</p>} {/* detalle corto */}

        <div className="offer__price">
          {product?.price} <span className="offer__currency">{product?.currency}</span>{' '}
          {product?.unit && <span className="offer__unit">/ {product.unit}</span>} {/* precio y periodicidad */}
        </div>

        <div className="offer__foot">
          <span className={`pill pill--${status}`}>{STATUS_LABEL[status]}</span> {/* color según estado */}
          <span className="offer__time">{formatTime(message.createdAt)}</span> {/* hora de la oferta */}
        </div>
      </div>
    </article>
  );
}

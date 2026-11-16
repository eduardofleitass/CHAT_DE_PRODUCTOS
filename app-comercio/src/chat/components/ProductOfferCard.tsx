import type { CSSProperties } from 'react';
import type { ChatMessage } from '../interfaces/chat-message.interface';

const STATUS_COLOR: Record<string, string> = {
  pending: '#b45309',
  accepted: '#15803d',
  rejected: '#b91c1c',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pendiente',
  accepted: 'Aceptada',
  rejected: 'Rechazada',
};

// El comercio solo mira el estado: no hay botones de respuesta acá.
export default function ProductOfferCard({ message }: { message: ChatMessage }) {
  const product = message.product;
  const status = message.status ?? 'pending';

  return (
    <div style={card}>
      <div style={head}>
        {product?.imageUrl && <img src={product.imageUrl} alt={product.name} style={img} />}
        <div>
          <div style={name}>{product?.name}</div>
          <div style={price}>
            {product?.price} {product?.currency}
          </div>
        </div>
      </div>
      <div style={{ ...statusStyle, color: STATUS_COLOR[status] }}>
        Oferta {STATUS_LABEL[status]}
      </div>
    </div>
  );
}

const card: CSSProperties = {
  border: '1px solid #d1d5db',
  borderRadius: 12,
  padding: 12,
  margin: '8px 0 8px auto',
  maxWidth: '70%',
  background: '#fff',
};
const head: CSSProperties = { display: 'flex', gap: 12, alignItems: 'center' };
const img: CSSProperties = { width: 56, height: 56, objectFit: 'cover', borderRadius: 8 };
const name: CSSProperties = { fontWeight: 600 };
const price: CSSProperties = { color: '#374151' };
const statusStyle: CSSProperties = {
  marginTop: 8,
  fontSize: 12,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
};

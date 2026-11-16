import type { CSSProperties } from 'react';
import type { ChatMessage } from '../interfaces/chat-message.interface';

const SENDER_LABEL: Record<ChatMessage['sender'], string> = {
  cliente: 'Cliente',
  comercio: 'Comercio',
};

const TYPE_LABEL: Record<ChatMessage['type'], string> = {
  text: '',
  product_offer: 'Oferta de producto',
  order_accepted: 'Pedido confirmado',
};

export default function MessageBubble({ message }: { message: ChatMessage }) {
  const mine = message.sender === 'comercio';

  return (
    <div style={{ ...row, justifyContent: mine ? 'flex-end' : 'flex-start' }}>
      <div style={{ ...bubble, ...(mine ? bubbleMine : bubbleTheirs) }}>
        <span style={meta}>{SENDER_LABEL[message.sender]}</span>
        <div>{message.text ?? TYPE_LABEL[message.type]}</div>
      </div>
    </div>
  );
}

const row: CSSProperties = { display: 'flex', marginBottom: 8 };
const bubble: CSSProperties = { maxWidth: '70%', padding: '8px 12px', borderRadius: 12, fontSize: 15 };
const bubbleMine: CSSProperties = { background: '#2563eb', color: '#fff' };
const bubbleTheirs: CSSProperties = { background: '#e5e7eb', color: '#111' };
const meta: CSSProperties = { display: 'block', fontSize: 11, opacity: 0.7, marginBottom: 2 };

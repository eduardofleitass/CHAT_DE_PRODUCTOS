import type { ChatMessage } from '../interfaces/chat-message.interface';
import { formatTime } from '../format';

export default function MessageBubble({ message }: { message: ChatMessage }) {
  const mine = message.sender === 'comercio';
  const notice = message.type === 'order_accepted';

  const clases = [
    'bubble',
    mine ? 'bubble--mine' : 'bubble--theirs',
    notice ? 'bubble--notice' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={clases}>
      {!mine && <span className="bubble__author">{message.sender}</span>}

      <div className="bubble__text">
        {message.text ?? (notice ? 'Pedido confirmado' : message.type)}
      </div>

      <span className="bubble__time">{formatTime(message.createdAt)}</span>
    </div>
  );
}

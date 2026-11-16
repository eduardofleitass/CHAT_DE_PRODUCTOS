import type { ChatMessage } from '../interfaces/chat-message.interface';

// FASE 2: alinear a la derecha cuando sender === 'comercio'.
export default function MessageBubble({ message }: { message: ChatMessage }) {
  return <p>{message.text ?? message.type}</p>;
}

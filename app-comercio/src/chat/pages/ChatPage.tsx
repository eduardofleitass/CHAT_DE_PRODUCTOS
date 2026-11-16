import { CHAT_ID } from '../../config/firebase';
import type { ChatMessage } from '../interfaces/chat-message.interface';

// FASE 2: useState(messages) + useEffect(listenMessages, return unsubscribe) + input de envío.
export default function ChatPage() {
  const messages: ChatMessage[] = [];
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 16 }}>
      <h1>Comercio — chat {CHAT_ID}</h1>
      <p>{messages.length} mensajes. Listener pendiente (fase 2).</p>
    </main>
  );
}
